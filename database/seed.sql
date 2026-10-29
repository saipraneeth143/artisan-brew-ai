-- ============================================================================
-- ARTISAN BREW AI - SEED MENU ITEMS
-- ============================================================================

INSERT INTO public.menu_items (
    id,
    name,
    description,
    price,
    category,
    flavor_notes,
    dietary_tags,
    calories,
    image_url,
    is_available
) VALUES
-- ESPRESSO_COFFEE
(
    '11111111-1111-4111-8111-111111111101',
    'Single-Origin Ethiopian Cortado',
    'Equal parts washed Yirgacheffe double-risotto espresso and velvety micro-foamed milk with bergamot and jasmine aromatics.',
    5.25,
    'ESPRESSO_COFFEE',
    ARRAY['Fruity & Floral', 'Bergamot', 'Jasmine', 'Bright Acidity'],
    ARRAY['Gluten-Free', 'Nut-Free'],
    95,
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80',
    true
),
(
    '11111111-1111-4111-8111-111111111102',
    'Velvet Oat Milk Flat White',
    'Double ristretto pulled from dark-roasted Colombian micro-lot beans layered under steamed barista-grade oat milk.',
    5.75,
    'ESPRESSO_COFFEE',
    ARRAY['Nutty & Chocolatey', 'Dark Cocoa', 'Toasted Hazelnut', 'Smooth Body'],
    ARRAY['Vegan', 'Dairy-Free', 'Gluten-Free', 'Nut-Free'],
    130,
    'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=80',
    true
),
(
    '11111111-1111-4111-8111-111111111103',
    'Madagascar Bourbon Vanilla Bean Latte',
    'House-pulled espresso infused with house-made Madagascar vanilla bean reduction and silky steamed whole milk.',
    6.25,
    'ESPRESSO_COFFEE',
    ARRAY['Creamy & Vanilla', 'Caramel', 'Silky Finish'],
    ARRAY['Gluten-Free', 'Nut-Free'],
    210,
    'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=80',
    true
),
(
    '11111111-1111-4111-8111-111111111104',
    'Keto MCT Cacao Espresso Breve',
    'Double espresso blended with organic grass-fed heavy cream, C8 MCT oil, and raw Criollo cacao dusting.',
    6.50,
    'ESPRESSO_COFFEE',
    ARRAY['Nutty & Chocolatey', 'Rich Cream', 'Dark Cacao'],
    ARRAY['Gluten-Free', 'Keto', 'Nut-Free'],
    240,
    'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=80',
    true
),

-- COLD_BREWS_NITRO
(
    '22222222-2222-4222-8222-222222222201',
    '24-Hour Kyoto Slow-Drip Cold Brew',
    'Single-estate Guatemalan Antigua steeped for 24 hours in ice-cold filtered spring water for ultra-low acidity.',
    5.50,
    'COLD_BREWS_NITRO',
    ARRAY['Nutty & Chocolatey', 'Molasses', 'Low Acidity', 'Clean Finish'],
    ARRAY['Vegan', 'Dairy-Free', 'Gluten-Free', 'Keto', 'Nut-Free'],
    15,
    'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80',
    true
),
(
    '22222222-2222-4222-8222-222222222202',
    'Vanilla Sweet Cream Nitro Draft',
    'Nitrogen-infused cold brew poured on tap with a cascading micro-foam head and oat vanilla sweet cream float.',
    6.50,
    'COLD_BREWS_NITRO',
    ARRAY['Creamy & Vanilla', 'Velvety', 'Sweet Oak'],
    ARRAY['Vegan', 'Dairy-Free', 'Gluten-Free', 'Nut-Free'],
    110,
    'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=900&q=80',
    true
),
(
    '22222222-2222-4222-8222-222222222203',
    'Sparkling Yuzu Cascara Espresso Tonic',
    'Sun-dried coffee cherry cascara infusion, botanical tonic water, Japanese yuzu zest, and a floated shot of bright espresso.',
    6.75,
    'COLD_BREWS_NITRO',
    ARRAY['Fruity & Floral', 'Citrus Zest', 'Hibiscus', 'Effervescent'],
    ARRAY['Vegan', 'Dairy-Free', 'Gluten-Free', 'Nut-Free'],
    85,
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80',
    true
),

-- ARTISANAL_TEAS
(
    '33333333-3333-4333-8333-333333333301',
    'Uji First-Harvest Ceremonial Matcha Latte',
    'Stone-ground shade-grown Uji matcha whisked to order with bamboo chasen and poured over steamed almond-coconut milk.',
    6.50,
    'ARTISANAL_TEAS',
    ARRAY['Creamy & Vanilla', 'Umami', 'Earthy Sweet'],
    ARRAY['Vegan', 'Dairy-Free', 'Gluten-Free', 'Keto'],
    90,
    'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=900&q=80',
    true
),
(
    '33333333-3333-4333-8333-333333333302',
    'Golden Heirloom Turmeric & Cardamom Chai',
    'Small-batch Masala chai simmered with fresh-grated organic turmeric, crushed green cardamom pods, Tellicherry pepper, and oat milk.',
    6.00,
    'ARTISANAL_TEAS',
    ARRAY['Spiced & Warm', 'Cardamom', 'Ginger', 'Cinnamon'],
    ARRAY['Vegan', 'Dairy-Free', 'Gluten-Free', 'Nut-Free'],
    145,
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80',
    true
),
(
    '33333333-3333-4333-8333-333333333303',
    'Provence Lavender Earl Grey London Fog',
    'Organic Calabrian bergamot black tea steeped with culinary French lavender blossoms, vanilla bean, and steamed milk.',
    5.75,
    'ARTISANAL_TEAS',
    ARRAY['Fruity & Floral', 'Lavender', 'Bergamot', 'Honeyed'],
    ARRAY['Gluten-Free', 'Nut-Free'],
    150,
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80',
    true
),

-- BAKERY_PASTRIES
(
    '44444444-4444-4444-8444-444444444401',
    'Isigny Sainte-Mère Butter Croissant',
    '72-hour cold-fermented laminated viennoiserie crafted with AOP Normandy cultured butter, featuring a shatteringly crisp honeycomb crumb.',
    4.95,
    'BAKERY_PASTRIES',
    ARRAY['Creamy & Vanilla', 'Cultured Butter', 'Toasted Wheat', 'Flaky'],
    ARRAY['Nut-Free'],
    310,
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80',
    true
),
(
    '44444444-4444-4444-8444-444444444402',
    'Twice-Baked Marcona Almond Frangipane Danish',
    'Flaky pastry filled with roasted Spanish Marcona almond cream, orange blossom syrup, and toasted flaked almonds.',
    5.95,
    'BAKERY_PASTRIES',
    ARRAY['Nutty & Chocolatey', 'Roasted Almond', 'Orange Blossom'],
    ARRAY[]::TEXT[],
    420,
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
    true
),
(
    '44444444-4444-4444-8444-444444444403',
    'Wild Maine Blueberry & Lemon Thyme Scone',
    'Tender plant-based oat and almond-flour scone studded with wild blueberries, Meyer lemon glaze, and fresh thyme.',
    5.25,
    'BAKERY_PASTRIES',
    ARRAY['Fruity & Floral', 'Wild Berry', 'Meyer Lemon', 'Herbal'],
    ARRAY['Vegan', 'Dairy-Free', 'Gluten-Free'],
    280,
    'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=900&q=80',
    true
),
(
    '44444444-4444-4444-8444-444444444404',
    'Ceylon Cinnamon & Brown Butter Brioche Roll',
    'Warm swirled brioche bun layered with Ceylon cinnamon, dark muscovado sugar, and whipped Madagascar vanilla bean frosting.',
    6.25,
    'BAKERY_PASTRIES',
    ARRAY['Spiced & Warm', 'Cinnamon', 'Brown Butter', 'Caramel'],
    ARRAY['Nut-Free'],
    460,
    'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=900&q=80',
    true
),

-- SAVORY_BRUNCH
(
    '55555555-5555-4555-8555-555555555501',
    'Heirloom Avocado & Yuzu Kosho Country Tartine',
    'Charred naturally leavened sourdough topped with smashed Hass avocado, pickled watermelon radish, toasted sesame, and yuzu kosho drizzle.',
    13.50,
    'SAVORY_BRUNCH',
    ARRAY['Fruity & Floral', 'Bright Citrus', 'Toasted Sourdough', 'Umami'],
    ARRAY['Vegan', 'Dairy-Free', 'Nut-Free'],
    380,
    'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=900&q=80',
    true
),
(
    '55555555-5555-4555-8555-555555555502',
    'Black Truffle Soft-Scrambled Egg Brioche',
    'Pasture-raised soft-folded organic eggs, aged Gruyère, black Perigord truffle butter, and chives on toasted house brioche.',
    14.95,
    'SAVORY_BRUNCH',
    ARRAY['Creamy & Vanilla', 'Earthy Truffle', 'Aged Gruyere', 'Rich'],
    ARRAY['Nut-Free'],
    540,
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80',
    true
),
(
    '55555555-5555-4555-8555-555555555503',
    'Nordic Cold-Smoked Salmon Keto Plate',
    'Wild-caught Norwegian smoked salmon served over whipped herb mascarpone, crisp cucumber ribbons, caper berries, dill, and soft-boiled egg.',
    16.50,
    'SAVORY_BRUNCH',
    ARRAY['Spiced & Warm', 'Smoky Cedar', 'Fresh Dill', 'Briny Capers'],
    ARRAY['Gluten-Free', 'Keto', 'Nut-Free'],
    410,
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80',
    true
)
ON CONFLICT (id) DO NOTHING;
