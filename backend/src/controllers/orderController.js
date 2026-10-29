import {
  CreateOrderSchema,
  UpdateOrderStatusSchema,
} from '../validators/schemas.js';
import {
  supabase,
  isSupabaseConfigured,
  localStore,
  generateUuid,
} from '../config/supabase.js';

/**
 * Helper to enrich local store orders with customer profiles and order items + menu details
 */
const enrichLocalOrder = (order) => {
  const customer = localStore.profiles.find((p) => p.id === order.user_id) || {
    id: order.user_id,
    email: order.user_email || 'customer@artisanbrew.ai',
    full_name: order.user_name || 'Valued Customer',
  };

  const items = localStore.order_items
    .filter((oi) => oi.order_id === order.id)
    .map((oi) => {
      const menuItem = localStore.menu_items.find((m) => m.id === oi.menu_item_id);
      return {
        ...oi,
        menu_item: menuItem || {
          id: oi.menu_item_id,
          name: 'Artisanal Selection',
          category: 'ESPRESSO_COFFEE',
          image_url:
            'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80',
        },
      };
    });

  return {
    ...order,
    total_amount: Number(order.total_amount),
    profiles: customer,
    order_items: items,
  };
};

/**
 * POST /api/orders
 * Create new order and associated order items
 */
export const createOrder = async (req, res) => {
  try {
    const parsed = CreateOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Invalid order payload.',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { items, specialInstructions } = parsed.data;
    const userId = req.user.id;

    if (isSupabaseConfigured) {
      const itemIds = items.map((i) => i.menuItemId);
      const { data: menuRecords, error: menuErr } = await supabase
        .from('menu_items')
        .select('id, name, price, is_available')
        .in('id', itemIds);

      if (!menuErr && menuRecords && menuRecords.length > 0) {
        const menuMap = new Map(menuRecords.map((m) => [m.id, m]));
        let totalAmount = 0;

        for (const reqItem of items) {
          const dbItem = menuMap.get(reqItem.menuItemId);
          if (!dbItem) {
            return res.status(400).json({
              error: `Menu item ${reqItem.menuItemId} does not exist.`,
            });
          }
          if (!dbItem.is_available) {
            return res.status(400).json({
              error: `${dbItem.name} is currently sold out.`,
            });
          }
          totalAmount += Number(dbItem.price) * reqItem.quantity;
        }

        const { data: createdOrder, error: orderErr } = await supabase
          .from('orders')
          .insert({
            user_id: userId,
            status: 'PENDING',
            total_amount: Number(totalAmount.toFixed(2)),
            special_instructions: specialInstructions || null,
          })
          .select('*')
          .single();

        if (!orderErr && createdOrder) {
          const orderItemsPayload = items.map((reqItem) => {
            const dbItem = menuMap.get(reqItem.menuItemId);
            return {
              order_id: createdOrder.id,
              menu_item_id: reqItem.menuItemId,
              quantity: reqItem.quantity,
              unit_price: Number(dbItem.price),
              customizations: reqItem.customizations || {},
            };
          });

          await supabase.from('order_items').insert(orderItemsPayload);

          const { data: fullOrder } = await supabase
            .from('orders')
            .select(
              `
              *,
              profiles (id, email, full_name),
              order_items (
                id,
                menu_item_id,
                quantity,
                unit_price,
                customizations,
                menu_item:menu_items (id, name, category, image_url, price)
              )
            `
            )
            .eq('id', createdOrder.id)
            .single();

          return res.status(201).json(fullOrder || createdOrder);
        }
      }
    }

    // Local store execution (also acts as fallback if Supabase tables are not initialized yet)
    const menuMap = new Map(localStore.menu_items.map((m) => [m.id, m]));
    let totalAmount = 0;

    for (const reqItem of items) {
      const dbItem = menuMap.get(reqItem.menuItemId);
      if (!dbItem) {
        return res.status(400).json({
          error: `Menu item ${reqItem.menuItemId} does not exist.`,
        });
      }
      if (!dbItem.is_available) {
        return res.status(400).json({
          error: `${dbItem.name} is currently unavailable.`,
        });
      }
      totalAmount += Number(dbItem.price) * reqItem.quantity;
    }

    const newOrder = {
      id: generateUuid(),
      user_id: userId,
      user_email: req.user.email,
      user_name:
        req.user.full_name || req.user.user_metadata?.full_name || 'Valued Customer',
      status: 'PENDING',
      total_amount: Number(totalAmount.toFixed(2)),
      special_instructions: specialInstructions || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStore.orders.unshift(newOrder);

    for (const reqItem of items) {
      const dbItem = menuMap.get(reqItem.menuItemId);
      localStore.order_items.push({
        id: generateUuid(),
        order_id: newOrder.id,
        menu_item_id: reqItem.menuItemId,
        quantity: reqItem.quantity,
        unit_price: Number(dbItem.price),
        customizations: reqItem.customizations || {},
      });
    }

    return res.status(201).json(enrichLocalOrder(newOrder));
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ error: 'Failed to create order.' });
  }
};

/**
 * GET /api/orders/my-orders
 * Retrieve logged-in user's order history
 */
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('orders')
        .select(
          `
          *,
          profiles (id, email, full_name),
          order_items (
            id,
            menu_item_id,
            quantity,
            unit_price,
            customizations,
            menu_item:menu_items (id, name, category, image_url, price)
          )
        `
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return res.status(200).json(data);
      }
    }

    const userOrders = localStore.orders
      .filter((o) => o.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map(enrichLocalOrder);

    return res.status(200).json(userOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return res.status(500).json({ error: 'Failed to fetch order history.' });
  }
};

/**
 * GET /api/orders/admin/all
 * Retrieve all customer orders (Admin only)
 */
export const getAllOrdersAdmin = async (_req, res) => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('orders')
        .select(
          `
          *,
          profiles (id, email, full_name),
          order_items (
            id,
            menu_item_id,
            quantity,
            unit_price,
            customizations,
            menu_item:menu_items (id, name, category, image_url, price)
          )
        `
        )
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return res.status(200).json(data);
      }
    }

    const allOrders = [...localStore.orders]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map(enrichLocalOrder);

    return res.status(200).json(allOrders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return res.status(500).json({ error: 'Failed to fetch all orders.' });
  }
};

/**
 * PATCH /api/orders/:id/status
 * Update order status (PENDING -> PREPARING -> READY -> COMPLETED -> CANCELLED) (Admin only)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const parsed = UpdateOrderStatusSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: 'Invalid order status value.',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { status } = parsed.data;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select(
          `
          *,
          profiles (id, email, full_name),
          order_items (
            id,
            menu_item_id,
            quantity,
            unit_price,
            customizations,
            menu_item:menu_items (id, name, category, image_url, price)
          )
        `
        )
        .single();

      if (!error && data) {
        return res.status(200).json(data);
      }
    }

    const orderIndex = localStore.orders.findIndex((o) => o.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    localStore.orders[orderIndex] = {
      ...localStore.orders[orderIndex],
      status,
      updated_at: new Date().toISOString(),
    };

    return res.status(200).json(enrichLocalOrder(localStore.orders[orderIndex]));
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ error: 'Failed to update order status.' });
  }
};
