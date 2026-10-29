import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseServiceRoleKey &&
  !supabaseUrl.includes('your-supabase-project') &&
  !supabaseServiceRoleKey.includes('your-supabase-service-role-key')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

/**
 * Seeded fallback datastore used when Supabase environment credentials
 * are set to placeholder values in local development, ensuring zero-downtime
 * evaluation while preserving identical PostgreSQL table schemas.
 */
export const localStore = {
  profiles: [
    {
      id: '00000000-0000-4000-8000-000000000001',
      email: 'admin@artisanbrew.ai',
      full_name: 'Antoine Laurent (Head Roaster & Admin)',
      role: 'ADMIN',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '00000000-0000-4000-8000-000000000002',
      email: 'claire@artisanbrew.ai',
      full_name: 'Claire Moreau',
      role: 'CUSTOMER',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  menu_items: [
    {
      id: '11111111-1111-4111-8111-111111111101',
      name: 'Single-Origin Ethiopian Cortado',
      description:
        'Equal parts washed Yirgacheffe double-ristretto espresso and velvety micro-foamed milk with bergamot and jasmine aromatics.',
      price: 5.25,
      category: 'ESPRESSO_COFFEE',
      flavor_notes: ['Fruity & Floral', 'Bergamot', 'Jasmine', 'Bright Acidity'],
      dietary_tags: ['Gluten-Free', 'Nut-Free'],
      calories: 95,
      image_url:
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '11111111-1111-4111-8111-111111111102',
      name: 'Velvet Oat Milk Flat White',
      description:
        'Double ristretto pulled from dark-roasted Colombian micro-lot beans layered under steamed barista-grade oat milk.',
      price: 5.75,
      category: 'ESPRESSO_COFFEE',
      flavor_notes: ['Nutty & Chocolatey', 'Dark Cocoa', 'Toasted Hazelnut', 'Smooth Body'],
      dietary_tags: ['Vegan', 'Dairy-Free', 'Gluten-Free', 'Nut-Free'],
      calories: 130,
      image_url:
        'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=80',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '11111111-1111-4111-8111-111111111103',
      name: 'Madagascar Bourbon Vanilla Bean Latte',
      description:
        'House-pulled espresso infused with house-made Madagascar vanilla bean reduction and silky steamed whole milk.',
      price: 6.25,
      category: 'ESPRESSO_COFFEE',
      flavor_notes: ['Creamy & Vanilla', 'Caramel', 'Silky Finish'],
      dietary_tags: ['Gluten-Free', 'Nut-Free'],
      calories: 210,
      image_url:
        'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=80',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '11111111-1111-4111-8111-111111111104',
      name: 'Keto MCT Cacao Espresso Breve',
      description:
        'Double espresso blended with organic grass-fed heavy cream, C8 MCT oil, and raw Criollo cacao dusting.',
      price: 6.5,
      category: 'ESPRESSO_COFFEE',
      flavor_notes: ['Nutty & Chocolatey', 'Rich Cream', 'Dark Cacao'],
      dietary_tags: ['Gluten-Free', 'Keto', 'Nut-Free'],
      calories: 240,
      image_url:
        'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=80',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '22222222-2222-4222-8222-222222222201',
      name: '24-Hour Kyoto Slow-Drip Cold Brew',
      description:
        'Single-estate Guatemalan Antigua steeped for 24 hours in ice-cold filtered spring water for ultra-low acidity.',
      price: 5.5,
      category: 'COLD_BREWS_NITRO',
      flavor_notes: ['Nutty & Chocolatey', 'Molasses', 'Low Acidity', 'Clean Finish'],
      dietary_tags: ['Vegan', 'Dairy-Free', 'Gluten-Free', 'Keto', 'Nut-Free'],
      calories: 15,
      image_url:
        'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '22222222-2222-4222-8222-222222222202',
      name: 'Vanilla Sweet Cream Nitro Draft',
      description:
        'Nitrogen-infused cold brew poured on tap with a cascading micro-foam head and oat vanilla sweet cream float.',
      price: 6.5,
      category: 'COLD_BREWS_NITRO',
      flavor_notes: ['Creamy & Vanilla', 'Velvety', 'Sweet Oak'],
      dietary_tags: ['Vegan', 'Dairy-Free', 'Gluten-Free', 'Nut-Free'],
      calories: 110,
      image_url:
        'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=900&q=80',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '22222222-2222-4222-8222-222222222203',
      name: 'Sparkling Yuzu Cascara Espresso Tonic',
      description:
        'Sun-dried coffee cherry cascara infusion, botanical tonic water, Japanese yuzu zest, and a floated shot of bright espresso.',
      price: 6.75,
      category: 'COLD_BREWS_NITRO',
      flavor_notes: ['Fruity & Floral', 'Citrus Zest', 'Hibiscus', 'Effervescent'],
      dietary_tags: ['Vegan', 'Dairy-Free', 'Gluten-Free', 'Nut-Free'],
      calories: 85,
      image_url:
        'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '33333333-3333-4333-8333-333333333301',
      name: 'Uji First-Harvest Ceremonial Matcha Latte',
      description:
        'Stone-ground shade-grown Uji matcha whisked to order with bamboo chasen and poured over steamed almond-coconut milk.',
      price: 6.5,
      category: 'ARTISANAL_TEAS',
      flavor_notes: ['Creamy & Vanilla', 'Umami', 'Earthy Sweet'],
      dietary_tags: ['Vegan', 'Dairy-Free', 'Gluten-Free', 'Keto'],
      calories: 90,
      image_url:
        'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=900&q=80',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '33333333-3333-4333-8333-333333333302',
      name: 'Golden Heirloom Turmeric & Cardamom Chai',
      description:
        'Small-batch Masala chai simmered with fresh-grated organic turmeric, crushed green cardamom pods, Tellicherry pepper, and oat milk.',
      price: 6.0,
      category: 'ARTISANAL_TEAS',
      flavor_notes: ['Spiced & Warm', 'Cardamom', 'Ginger', 'Cinnamon'],
      dietary_tags: ['Vegan', 'Dairy-Free', 'Gluten-Free', 'Nut-Free'],
      calories: 145,
      image_url:
        'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '33333333-3333-4333-8333-333333333303',
      name: 'Provence Lavender Earl Grey London Fog',
      description:
        'Organic Calabrian bergamot black tea steeped with culinary French lavender blossoms, vanilla bean, and steamed milk.',
      price: 5.75,
      category: 'ARTISANAL_TEAS',
      flavor_notes: ['Fruity & Floral', 'Lavender', 'Bergamot', 'Honeyed'],
      dietary_tags: ['Gluten-Free', 'Nut-Free'],
      calories: 150,
      image_url:
        'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '44444444-4444-4444-8444-444444444401',
      name: 'Isigny Sainte-Mère Butter Croissant',
      description:
        '72-hour cold-fermented laminated viennoiserie crafted with AOP Normandy cultured butter, featuring a shatteringly crisp honeycomb crumb.',
      price: 4.95,
      category: 'BAKERY_PASTRIES',
      flavor_notes: ['Creamy & Vanilla', 'Cultured Butter', 'Toasted Wheat', 'Flaky'],
      dietary_tags: ['Nut-Free'],
      calories: 310,
      image_url:
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '44444444-4444-4444-8444-444444444402',
      name: 'Twice-Baked Marcona Almond Frangipane Danish',
      description:
        'Flaky pastry filled with roasted Spanish Marcona almond cream, orange blossom syrup, and toasted flaked almonds.',
      price: 5.95,
      category: 'BAKERY_PASTRIES',
      flavor_notes: ['Nutty & Chocolatey', 'Roasted Almond', 'Orange Blossom'],
      dietary_tags: [],
      calories: 420,
      image_url:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '44444444-4444-4444-8444-444444444403',
      name: 'Wild Maine Blueberry & Lemon Thyme Scone',
      description:
        'Tender plant-based oat and almond-flour scone studded with wild blueberries, Meyer lemon glaze, and fresh thyme.',
      price: 5.25,
      category: 'BAKERY_PASTRIES',
      flavor_notes: ['Fruity & Floral', 'Wild Berry', 'Meyer Lemon', 'Herbal'],
      dietary_tags: ['Vegan', 'Dairy-Free', 'Gluten-Free'],
      calories: 280,
      image_url:
        'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=900&q=80',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '44444444-4444-4444-8444-444444444404',
      name: 'Ceylon Cinnamon & Brown Butter Brioche Roll',
      description:
        'Warm swirled brioche bun layered with Ceylon cinnamon, dark muscovado sugar, and whipped Madagascar vanilla bean frosting.',
      price: 6.25,
      category: 'BAKERY_PASTRIES',
      flavor_notes: ['Spiced & Warm', 'Cinnamon', 'Brown Butter', 'Caramel'],
      dietary_tags: ['Nut-Free'],
      calories: 460,
      image_url:
        'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=900&q=80',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '55555555-5555-4555-8555-555555555501',
      name: 'Heirloom Avocado & Yuzu Kosho Country Tartine',
      description:
        'Charred naturally leavened sourdough topped with smashed Hass avocado, pickled watermelon radish, toasted sesame, and yuzu kosho drizzle.',
      price: 13.5,
      category: 'SAVORY_BRUNCH',
      flavor_notes: ['Fruity & Floral', 'Bright Citrus', 'Toasted Sourdough', 'Umami'],
      dietary_tags: ['Vegan', 'Dairy-Free', 'Nut-Free'],
      calories: 380,
      image_url:
        'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=900&q=80',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '55555555-5555-4555-8555-555555555502',
      name: 'Black Truffle Soft-Scrambled Egg Brioche',
      description:
        'Pasture-raised soft-folded organic eggs, aged Gruyère, black Perigord truffle butter, and chives on toasted house brioche.',
      price: 14.95,
      category: 'SAVORY_BRUNCH',
      flavor_notes: ['Creamy & Vanilla', 'Earthy Truffle', 'Aged Gruyere', 'Rich'],
      dietary_tags: ['Nut-Free'],
      calories: 540,
      image_url:
        'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '55555555-5555-4555-8555-555555555503',
      name: 'Nordic Cold-Smoked Salmon Keto Plate',
      description:
        'Wild-caught Norwegian smoked salmon served over whipped herb mascarpone, crisp cucumber ribbons, caper berries, dill, and soft-boiled egg.',
      price: 16.5,
      category: 'SAVORY_BRUNCH',
      flavor_notes: ['Spiced & Warm', 'Smoky Cedar', 'Fresh Dill', 'Briny Capers'],
      dietary_tags: ['Gluten-Free', 'Keto', 'Nut-Free'],
      calories: 410,
      image_url:
        'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  orders: [
    {
      id: '99999999-9999-4999-8999-999999999901',
      user_id: '00000000-0000-4000-8000-000000000002',
      status: 'PREPARING',
      total_amount: 11.0,
      special_instructions: 'Extra hot oat milk, light dusting of cinnamon.',
      created_at: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
    },
  ],
  order_items: [
    {
      id: '88888888-8888-4888-8888-888888888801',
      order_id: '99999999-9999-4999-8999-999999999901',
      menu_item_id: '11111111-1111-4111-8111-111111111102',
      quantity: 1,
      unit_price: 5.75,
      customizations: { milk: 'Oat Milk', sweetness: 'Unsweetened', temperature: 'Hot' },
    },
    {
      id: '88888888-8888-4888-8888-888888888802',
      order_id: '99999999-9999-4999-8999-999999999901',
      menu_item_id: '44444444-4444-4444-8444-444444444403',
      quantity: 1,
      unit_price: 5.25,
      customizations: { warmed: true },
    },
  ],
  ai_recommendations: [],
};

export const generateUuid = () => crypto.randomUUID();
