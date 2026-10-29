import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

export const MASTER_BARISTA_SYSTEM_PROMPT = `You are "Master Barista Antoine", the chief flavor architect and culinary AI at "Artisan Brew AI".
Your tone is sophisticated, welcoming, articulate, and deeply knowledgeable about specialty coffee roasting, micro-lot beans, tea origins, french pastry technique, and modern dietary science.

STRICT OPERATIONAL RULES:
1. DOMAIN RESTRICTION: You ONLY discuss coffee, tea, pastries, cafe beverages, brunch food, flavor science, and dietary pairings. If a user asks non-cafe questions (e.g., coding, politics, math), politely decline and steer back to the menu.
2. ACCURACY: ONLY recommend menu item IDs that are explicitly provided in the active menu context array. Never invent or hallucinate non-existent menu items or IDs.
3. DIETARY SAFETY: Honor user allergen and dietary restriction flags with 100% precision. If an item contains dairy and user is Vegan, exclude it or explicitly advise a milk alternative customization.
4. JSON STRICTION: Always return strictly valid JSON conforming exactly to the requested output JSON Schema.`;

const getGroqClient = () => {
  const apiKey = (process.env.GROQ_API_KEY || '').trim();
  if (!apiKey || apiKey.includes('your-groq-api-key-here')) {
    return null;
  }
  return new Groq({ apiKey });
};

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const BEVERAGE_CATEGORIES = ['ESPRESSO_COFFEE', 'COLD_BREWS_NITRO', 'ARTISANAL_TEAS'];
const FOOD_CATEGORIES = ['BAKERY_PASTRIES', 'SAVORY_BRUNCH'];

/**
 * Deterministic culinary fallback engine when GROQ_API_KEY is a placeholder,
 * ensuring the API still returns 100% valid UUIDs and schema-compliant responses.
 */
const buildDeterministicRecommendation = (userPreferences, availableMenuItems) => {
  const dietaryTags = userPreferences.dietaryTags || [];
  const flavorPref = (userPreferences.flavorPreference || '').toLowerCase();
  const mood = userPreferences.mood || 'Relaxed Morning';
  const wantsFood = Boolean(userPreferences.wantsFoodPairing);
  const foodType = userPreferences.foodPairingType || '';

  const filterByDiet = (items) => {
    if (!dietaryTags.length) return items;
    const strictMatches = items.filter((item) =>
      dietaryTags.every((tag) => (item.dietary_tags || item.dietaryTags || []).includes(tag))
    );
    return strictMatches.length > 0 ? strictMatches : items;
  };

  const scoreItem = (item) => {
    let score = 84;
    const notes = (item.flavor_notes || item.flavorNotes || []).join(' ').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    if (flavorPref && (notes.includes(flavorPref) || desc.includes(flavorPref.split(' ')[0]))) {
      score += 11;
    }
    if (
      userPreferences.temperature === 'Iced' &&
      item.category === 'COLD_BREWS_NITRO'
    ) {
      score += 4;
    }
    if (
      userPreferences.temperature === 'Hot' &&
      (item.category === 'ESPRESSO_COFFEE' || item.category === 'ARTISANAL_TEAS')
    ) {
      score += 4;
    }
    return Math.min(99, score);
  };

  const allBeverages = availableMenuItems.filter((i) =>
    BEVERAGE_CATEGORIES.includes(i.category)
  );
  const allFoods = availableMenuItems.filter((i) => FOOD_CATEGORIES.includes(i.category));

  const eligibleBeverages = filterByDiet(allBeverages)
    .map((item) => ({ item, score: scoreItem(item) }))
    .sort((a, b) => b.score - a.score);

  let targetFoods = filterByDiet(allFoods);
  if (foodType === 'Yes - Sweet Pastry') {
    const sweet = targetFoods.filter((f) => f.category === 'BAKERY_PASTRIES');
    if (sweet.length > 0) targetFoods = sweet;
  } else if (foodType === 'Yes - Savory Dish') {
    const savory = targetFoods.filter((f) => f.category === 'SAVORY_BRUNCH');
    if (savory.length > 0) targetFoods = savory;
  }
  const rankedFoods = targetFoods
    .map((item) => ({ item, score: scoreItem(item) }))
    .sort((a, b) => b.score - a.score);

  const selectedBeverages = eligibleBeverages.slice(0, 3);
  const pairings = selectedBeverages.map((entry, idx) => {
    const foodMatch =
      wantsFood && rankedFoods.length > 0
        ? rankedFoods[idx % rankedFoods.length].item
        : null;
    const bevNotes = (entry.item.flavor_notes || entry.item.flavorNotes || []).slice(0, 2).join(' and ');

    return {
      beverageItemId: entry.item.id,
      foodItemId: foodMatch ? foodMatch.id : null,
      matchScore: entry.score,
      pairingRationale: foodMatch
        ? `Bonjour! For your "${mood}" mood, the ${entry.item.name} delivers ${bevNotes.toLowerCase()} aromatics that harmonize effortlessly with the ${foodMatch.name}, creating a balanced palate experience.`
        : `Bonjour! Crafted for your "${mood}" state of mind, the ${entry.item.name} highlights ${bevNotes.toLowerCase()} notes while honoring your ${dietaryTags.length ? dietaryTags.join(', ') : 'artisanal'} profile.`,
    };
  });

  const collectedNotes = Array.from(
    new Set(
      selectedBeverages.flatMap(
        (b) => b.item.flavor_notes || b.item.flavorNotes || []
      )
    )
  ).slice(0, 5);

  return {
    headline: `Bonjour! Master Barista Antoine has curated ${pairings.length} bespoke ${
      wantsFood ? 'beverage & culinary pairings' : 'signature pours'
    } tailored to your "${mood}" vibe.`,
    pairings,
    tastingNotes:
      collectedNotes.length > 0
        ? collectedNotes
        : ['Velvety Body', 'Single-Origin Aromatics', 'Balanced Finish'],
  };
};

/**
 * Generate AI Recommendation based on user preferences and menu context using Groq SDK
 */
export const generateBaristaRecommendation = async (userPreferences, availableMenuItems) => {
  const groq = getGroqClient();
  if (!groq) {
    return buildDeterministicRecommendation(userPreferences, availableMenuItems);
  }

  const userPrompt = `
Customer Preferences: ${JSON.stringify(userPreferences)}

Available Menu Items (ONLY use exact UUIDs from this list):
${JSON.stringify(
  availableMenuItems.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    description: item.description,
    price: item.price,
    flavor_notes: item.flavor_notes || item.flavorNotes || [],
    dietary_tags: item.dietary_tags || item.dietaryTags || [],
    calories: item.calories,
  }))
)}

Recommend the top 1 to 3 beverage and pastry/brunch pairings that best match the customer's request.
RULES:
1. "beverageItemId" MUST be an exact UUID from Available Menu Items with category ESPRESSO_COFFEE, COLD_BREWS_NITRO, or ARTISANAL_TEAS.
2. If wantsFoodPairing is true, "foodItemId" MUST be an exact UUID from Available Menu Items with category BAKERY_PASTRIES or SAVORY_BRUNCH. If wantsFoodPairing is false, set "foodItemId" to null.
3. Return ONLY valid JSON matching this exact structure:
{
  "headline": "A catchy, warm barista greeting summary.",
  "pairings": [
    {
      "beverageItemId": "uuid-string",
      "foodItemId": "uuid-string or null",
      "matchScore": 95,
      "pairingRationale": "Detailed explanation of why this pairing works."
    }
  ],
  "tastingNotes": ["Note 1", "Note 2", "Note 3"]
}
`;

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: MASTER_BARISTA_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1200,
    });

    const rawText = completion.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(rawText);

    const validIds = new Set(availableMenuItems.map((i) => i.id));
    const sanitizedPairings = (parsed.pairings || []).filter((p) =>
      validIds.has(p.beverageItemId)
    );

    if (sanitizedPairings.length === 0) {
      return buildDeterministicRecommendation(userPreferences, availableMenuItems);
    }

    return {
      headline:
        parsed.headline ||
        'Bonjour! Here are Master Barista Antoine’s bespoke recommendations.',
      pairings: sanitizedPairings.map((p) => ({
        beverageItemId: p.beverageItemId,
        foodItemId: p.foodItemId && validIds.has(p.foodItemId) ? p.foodItemId : null,
        matchScore: Number(p.matchScore) || 92,
        pairingRationale: p.pairingRationale || 'Curated for flavor harmony and balance.',
      })),
      tastingNotes: Array.isArray(parsed.tastingNotes)
        ? parsed.tastingNotes
        : ['Balanced Body', 'Aromatic Finish'],
    };
  } catch (error) {
    console.error('Groq recommendation error, using deterministic barista fallback:', error.message);
    return buildDeterministicRecommendation(userPreferences, availableMenuItems);
  }
};

/**
 * Deterministic dietary audit fallback when GROQ_API_KEY is not configured
 */
const buildDeterministicCartAnalysis = (cartItems, dietaryRestrictions = []) => {
  const estimatedTotalCalories = cartItems.reduce(
    (sum, item) => sum + (Number(item.calories) || 160) * (Number(item.quantity) || 1),
    0
  );

  const allergenWarnings = [];
  let dietaryCompliance = true;

  for (const item of cartItems) {
    const itemTags = item.dietaryTags || item.dietary_tags || [];
    const nameLower = (item.name || '').toLowerCase();

    for (const restriction of dietaryRestrictions) {
      if (!itemTags.includes(restriction)) {
        dietaryCompliance = false;
        allergenWarnings.push(
          `${item.name} is not certified ${restriction}. Consider requesting a barista modification.`
        );
      }
    }

    if (nameLower.includes('almond') && !itemTags.includes('Nut-Free')) {
      allergenWarnings.push(`${item.name} contains tree nuts (Spanish Marcona almonds).`);
    }
    if (
      (nameLower.includes('croissant') || nameLower.includes('brioche')) &&
      !itemTags.includes('Gluten-Free')
    ) {
      allergenWarnings.push(`${item.name} contains wheat gluten and cultured dairy.`);
    }
  }

  const uniqueWarnings = Array.from(new Set(allergenWarnings));
  const hasBeverage = cartItems.some((i) => BEVERAGE_CATEGORIES.includes(i.category));
  const hasFood = cartItems.some((i) => FOOD_CATEGORIES.includes(i.category));
  const harmonyScore = hasBeverage && hasFood ? 94 : 88;

  return {
    harmonyScore,
    estimatedTotalCalories,
    allergenWarnings: uniqueWarnings,
    dietaryCompliance,
    baristaTips: dietaryCompliance
      ? 'Exquisite selection! Your beverage and culinary choices share complementary aromatic profiles and fully honor your selected dietary filters. Ask for a warmed ceramic cup or steamed oat milk foam to elevate the texture.'
      : 'To align this order with your dietary preferences, Master Barista Antoine recommends swapping dairy milk for our Barista Oat or Almond-Coconut blend and substituting wheat pastries with our Wild Maine Blueberry & Lemon Thyme Scone (Vegan & Gluten-Free).',
  };
};

/**
 * Analyze Cart for Dietary & Nutritional Insights using Groq SDK
 */
export const analyzeCartDietary = async (cartItems, dietaryRestrictions) => {
  const groq = getGroqClient();
  if (!groq) {
    return buildDeterministicCartAnalysis(cartItems, dietaryRestrictions);
  }

  const userPrompt = `
Analyze the following cafe order for nutritional value, allergen risks, and flavor harmony:
Cart Items: ${JSON.stringify(cartItems)}
User Dietary Restrictions: ${JSON.stringify(dietaryRestrictions)}

Return ONLY valid JSON conforming to this exact structure:
{
  "harmonyScore": 92,
  "estimatedTotalCalories": 450,
  "allergenWarnings": ["Warning 1 if any"],
  "dietaryCompliance": true,
  "baristaTips": "Actionable customization advice e.g., swap milk or sweetener."
}
`;

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: MASTER_BARISTA_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
      max_tokens: 900,
    });

    const rawText = completion.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(rawText);

    return {
      harmonyScore: Number(parsed.harmonyScore) || 90,
      estimatedTotalCalories: Number(parsed.estimatedTotalCalories) || 0,
      allergenWarnings: Array.isArray(parsed.allergenWarnings)
        ? parsed.allergenWarnings
        : [],
      dietaryCompliance: Boolean(parsed.dietaryCompliance),
      baristaTips:
        parsed.baristaTips ||
        'Enjoy your artisanal selection freshly prepared by our baristas.',
    };
  } catch (error) {
    console.error('Groq cart analysis error, using deterministic fallback:', error.message);
    return buildDeterministicCartAnalysis(cartItems, dietaryRestrictions);
  }
};

