import {
  RecommendationRequestSchema,
  CartAnalysisRequestSchema,
} from '../validators/schemas.js';
import {
  generateBaristaRecommendation,
  analyzeCartDietary,
} from '../services/groqService.js';
import {
  supabase,
  isSupabaseConfigured,
  localStore,
  generateUuid,
} from '../config/supabase.js';

/**
 * POST /api/ai/recommend
 * Accepts user survey preferences, queries available menu items, calls Groq SDK,
 * logs recommendation in ai_recommendations table, and returns structured recommendation
 * enriched with matched menu items.
 */
export const recommend = async (req, res) => {
  try {
    const parsedInput = RecommendationRequestSchema.safeParse(req.body);
    if (!parsedInput.success) {
      return res.status(400).json({
        error: 'Invalid recommendation preferences payload.',
        details: parsedInput.error.flatten().fieldErrors,
      });
    }

    const userPreferences = parsedInput.data;
    let availableMenuItems = [];

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true);
      if (!error && data && data.length > 0) {
        availableMenuItems = data;
      } else {
        availableMenuItems = localStore.menu_items.filter((item) => item.is_available);
      }
    } else {
      availableMenuItems = localStore.menu_items.filter((item) => item.is_available);
    }

    if (availableMenuItems.length === 0) {
      return res.status(404).json({
        error: 'No available menu items found to generate recommendations.',
      });
    }

    const aiResult = await generateBaristaRecommendation(
      userPreferences,
      availableMenuItems
    );

    const itemMap = new Map(availableMenuItems.map((item) => [item.id, item]));

    const enrichedPairings = (aiResult.pairings || []).map((pairing) => ({
      ...pairing,
      beverageItem: itemMap.get(pairing.beverageItemId) || null,
      foodItem: pairing.foodItemId ? itemMap.get(pairing.foodItemId) || null : null,
    }));

    const recommendedIds = Array.from(
      new Set(
        enrichedPairings
          .flatMap((p) => [p.beverageItemId, p.foodItemId])
          .filter(Boolean)
      )
    );

    const combinedRationale = enrichedPairings
      .map((p) => p.pairingRationale)
      .join(' | ');

    if (req.user?.id && recommendedIds.length > 0) {
      if (isSupabaseConfigured) {
        const { error: logErr } = await supabase.from('ai_recommendations').insert({
          user_id: req.user.id,
          prompt_context: userPreferences,
          recommended_item_ids: recommendedIds,
          ai_rationale: combinedRationale || aiResult.headline,
        });
        if (logErr) {
          localStore.ai_recommendations.unshift({
            id: generateUuid(),
            user_id: req.user.id,
            prompt_context: userPreferences,
            recommended_item_ids: recommendedIds,
            ai_rationale: combinedRationale || aiResult.headline,
            created_at: new Date().toISOString(),
          });
        }
      } else {
        localStore.ai_recommendations.unshift({
          id: generateUuid(),
          user_id: req.user.id,
          prompt_context: userPreferences,
          recommended_item_ids: recommendedIds,
          ai_rationale: combinedRationale || aiResult.headline,
          created_at: new Date().toISOString(),
        });
      }
    }

    return res.status(200).json({
      headline: aiResult.headline,
      pairings: enrichedPairings,
      tastingNotes: aiResult.tastingNotes || [],
    });
  } catch (error) {
    console.error('Error in recommend controller:', error);
    return res.status(500).json({
      error: 'Failed to generate AI Barista recommendation.',
    });
  }
};

/**
 * POST /api/ai/analyze-cart
 * Accepts list of cart items and dietary restrictions, calls Groq SDK,
 * returns nutritional breakdown, allergen warnings, and flavor harmony score.
 */
export const analyzeCart = async (req, res) => {
  try {
    const parsedInput = CartAnalysisRequestSchema.safeParse(req.body);
    if (!parsedInput.success) {
      return res.status(400).json({
        error: 'Invalid cart analysis request payload.',
        details: parsedInput.error.flatten().fieldErrors,
      });
    }

    const { cartItems, dietaryRestrictions } = parsedInput.data;
    const analysis = await analyzeCartDietary(cartItems, dietaryRestrictions);

    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Error in analyzeCart controller:', error);
    return res.status(500).json({
      error: 'Failed to analyze cart items with AI.',
    });
  }
};
