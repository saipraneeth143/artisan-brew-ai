import { MenuItemSchema, UpdateMenuItemSchema } from '../validators/schemas.js';
import {
  supabase,
  isSupabaseConfigured,
  localStore,
  generateUuid,
} from '../config/supabase.js';

/**
 * Normalizes DB snake_case row to consistent response format containing both snake_case and camelCase
 */
const formatMenuItem = (row) => ({
  id: row.id,
  name: row.name,
  description: row.description,
  price: Number(row.price),
  category: row.category,
  flavor_notes: row.flavor_notes || [],
  flavorNotes: row.flavor_notes || [],
  dietary_tags: row.dietary_tags || [],
  dietaryTags: row.dietary_tags || [],
  calories: row.calories ?? null,
  image_url: row.image_url,
  imageUrl: row.image_url,
  is_available: Boolean(row.is_available),
  isAvailable: Boolean(row.is_available),
  created_at: row.created_at,
  updated_at: row.updated_at,
});

const filterLocalItems = (items, { category, availableOnly, dietaryFilters, search }) => {
  let result = [...items];
  if (category && category !== 'ALL') {
    result = result.filter((i) => i.category === category);
  }
  if (availableOnly === 'true') {
    result = result.filter((i) => i.is_available);
  }
  if (dietaryFilters.length > 0) {
    result = result.filter((i) =>
      dietaryFilters.every((tag) => (i.dietary_tags || []).includes(tag))
    );
  }
  if (search && String(search).trim() !== '') {
    const q = String(search).trim().toLowerCase();
    result = result.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        (i.flavor_notes || []).some((note) => note.toLowerCase().includes(q))
    );
  }
  return result;
};

/**
 * GET /api/menu
 * Fetch all menu items (Supports query filters: category, dietaryTag, search, availableOnly)
 */
export const getAllMenuItems = async (req, res) => {
  try {
    const { category, dietaryTag, search, availableOnly } = req.query;
    const dietaryFilters = dietaryTag
      ? String(dietaryTag)
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    if (isSupabaseConfigured) {
      let query = supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (category && category !== 'ALL') {
        query = query.eq('category', String(category));
      }
      if (availableOnly === 'true') {
        query = query.eq('is_available', true);
      }
      if (dietaryFilters.length > 0) {
        query = query.contains('dietary_tags', dietaryFilters);
      }
      if (search && String(search).trim() !== '') {
        const term = `%${String(search).trim()}%`;
        query = query.or(`name.ilike.${term},description.ilike.${term}`);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return res.status(200).json(data.map(formatMenuItem));
      }
      // If Supabase table is empty or not migrated yet, serve localStore items seamlessly
      if (!error && data && data.length === 0 && !category && !search && dietaryFilters.length === 0) {
        return res.status(200).json(localStore.menu_items.map(formatMenuItem));
      }
      if (!error && data) {
        // Check if base table has any rows at all
        const { count } = await supabase
          .from('menu_items')
          .select('*', { count: 'exact', head: true });
        if (count && count > 0) {
          return res.status(200).json(data.map(formatMenuItem));
        }
      }
    }

    const filtered = filterLocalItems(localStore.menu_items, {
      category,
      availableOnly,
      dietaryFilters,
      search,
    });
    return res.status(200).json(filtered.map(formatMenuItem));
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return res.status(500).json({ error: 'Failed to fetch menu items.' });
  }
};

/**
 * POST /api/menu (Admin Only)
 * Add a new menu item
 */
export const createMenuItem = async (req, res) => {
  try {
    const normalizedBody = {
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      flavorNotes: req.body.flavorNotes ?? req.body.flavor_notes ?? [],
      dietaryTags: req.body.dietaryTags ?? req.body.dietary_tags ?? [],
      calories:
        req.body.calories !== undefined && req.body.calories !== '' && req.body.calories !== null
          ? Number(req.body.calories)
          : undefined,
      imageUrl: req.body.imageUrl ?? req.body.image_url,
      isAvailable: req.body.isAvailable ?? req.body.is_available ?? true,
    };

    const parsed = MenuItemSchema.safeParse(normalizedBody);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed for new menu item.',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const validData = parsed.data;
    const dbPayload = {
      name: validData.name,
      description: validData.description,
      price: validData.price,
      category: validData.category,
      flavor_notes: validData.flavorNotes,
      dietary_tags: validData.dietaryTags,
      calories: validData.calories ?? null,
      image_url: validData.imageUrl,
      is_available: validData.isAvailable,
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('menu_items')
        .insert(dbPayload)
        .select('*')
        .single();

      if (!error && data) {
        return res.status(201).json(formatMenuItem(data));
      }
    }

    const newItem = {
      id: generateUuid(),
      ...dbPayload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    localStore.menu_items.push(newItem);
    return res.status(201).json(formatMenuItem(newItem));
  } catch (error) {
    console.error('Error creating menu item:', error);
    return res.status(500).json({ error: 'Failed to create menu item.' });
  }
};

/**
 * PUT /api/menu/:id (Admin Only)
 * Update existing menu item details or availability
 */
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const rawUpdate = {};
    if (req.body.name !== undefined) rawUpdate.name = req.body.name;
    if (req.body.description !== undefined) rawUpdate.description = req.body.description;
    if (req.body.price !== undefined) rawUpdate.price = Number(req.body.price);
    if (req.body.category !== undefined) rawUpdate.category = req.body.category;
    if (req.body.flavorNotes !== undefined || req.body.flavor_notes !== undefined) {
      rawUpdate.flavorNotes = req.body.flavorNotes ?? req.body.flavor_notes;
    }
    if (req.body.dietaryTags !== undefined || req.body.dietary_tags !== undefined) {
      rawUpdate.dietaryTags = req.body.dietaryTags ?? req.body.dietary_tags;
    }
    if (req.body.calories !== undefined) {
      rawUpdate.calories =
        req.body.calories === null || req.body.calories === ''
          ? null
          : Number(req.body.calories);
    }
    if (req.body.imageUrl !== undefined || req.body.image_url !== undefined) {
      rawUpdate.imageUrl = req.body.imageUrl ?? req.body.image_url;
    }
    if (req.body.isAvailable !== undefined || req.body.is_available !== undefined) {
      rawUpdate.isAvailable = Boolean(
        req.body.isAvailable ?? req.body.is_available
      );
    }

    const parsed = UpdateMenuItemSchema.safeParse(rawUpdate);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Invalid menu item update data.',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const v = parsed.data;
    const dbUpdate = {};
    if (v.name !== undefined) dbUpdate.name = v.name;
    if (v.description !== undefined) dbUpdate.description = v.description;
    if (v.price !== undefined) dbUpdate.price = v.price;
    if (v.category !== undefined) dbUpdate.category = v.category;
    if (v.flavorNotes !== undefined) dbUpdate.flavor_notes = v.flavorNotes;
    if (v.dietaryTags !== undefined) dbUpdate.dietary_tags = v.dietaryTags;
    if (v.calories !== undefined) dbUpdate.calories = v.calories;
    if (v.imageUrl !== undefined) dbUpdate.image_url = v.imageUrl;
    if (v.isAvailable !== undefined) dbUpdate.is_available = v.isAvailable;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('menu_items')
        .update(dbUpdate)
        .eq('id', id)
        .select('*')
        .single();

      if (!error && data) {
        return res.status(200).json(formatMenuItem(data));
      }
    }

    const index = localStore.menu_items.findIndex((i) => i.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }

    localStore.menu_items[index] = {
      ...localStore.menu_items[index],
      ...dbUpdate,
      updated_at: new Date().toISOString(),
    };

    return res.status(200).json(formatMenuItem(localStore.menu_items[index]));
  } catch (error) {
    console.error('Error updating menu item:', error);
    return res.status(500).json({ error: 'Failed to update menu item.' });
  }
};

/**
 * DELETE /api/menu/:id (Admin Only)
 * Remove a menu item
 */
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (!error) {
        const localIdx = localStore.menu_items.findIndex((i) => i.id === id);
        if (localIdx !== -1) localStore.menu_items.splice(localIdx, 1);
        return res.status(200).json({ message: 'Menu item deleted successfully.', id });
      }
    }

    const index = localStore.menu_items.findIndex((i) => i.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }

    localStore.menu_items.splice(index, 1);
    return res.status(200).json({ message: 'Menu item deleted successfully.', id });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return res.status(500).json({ error: 'Failed to delete menu item.' });
  }
};
