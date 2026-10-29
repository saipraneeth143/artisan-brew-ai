import { z } from 'zod';

// AI Recommendation Request Validation
export const RecommendationRequestSchema = z.object({
  mood: z.string().min(1, 'Mood is required'),
  flavorPreference: z.string().min(1, 'Flavor preference is required'),
  dietaryTags: z.array(z.string()).default([]),
  temperature: z.enum(['Hot', 'Iced', 'Blended', 'No Preference']),
  wantsFoodPairing: z.boolean().default(false),
  foodPairingType: z
    .enum(['Yes - Sweet Pastry', 'Yes - Savory Dish', 'Beverage Only'])
    .optional(),
  roastProfile: z.string().optional(),
  acidityLevel: z.string().optional(),
  sweetnessPreference: z.string().optional(),
  milkOption: z.string().optional(),
  freeformNotes: z.string().max(400).optional(),
});

// Cart Dietary Analysis Request Validation
export const CartAnalysisRequestSchema = z.object({
  cartItems: z
    .array(
      z.object({
        id: z.string().optional(),
        menuItemId: z.string().optional(),
        name: z.string().min(1),
        category: z.string().optional(),
        price: z.number().nonnegative(),
        quantity: z.number().int().positive(),
        calories: z.number().nullable().optional(),
        dietaryTags: z.array(z.string()).default([]),
        flavorNotes: z.array(z.string()).default([]),
        customizations: z.record(z.any()).optional().default({}),
      })
    )
    .min(1, 'Cart must contain at least one item to analyze'),
  dietaryRestrictions: z.array(z.string()).default([]),
});

// Menu Item CRUD Schema
export const MenuItemSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be greater than 0'),
  category: z.enum([
    'ESPRESSO_COFFEE',
    'COLD_BREWS_NITRO',
    'ARTISANAL_TEAS',
    'BAKERY_PASTRIES',
    'SAVORY_BRUNCH',
  ]),
  flavorNotes: z.array(z.string()).default([]),
  dietaryTags: z.array(z.string()).default([]),
  calories: z.number().int().positive().optional().nullable(),
  imageUrl: z.string().url('Invalid image URL'),
  isAvailable: z.boolean().default(true),
});

export const UpdateMenuItemSchema = MenuItemSchema.partial();

// Order Creation Schema
export const CreateOrderSchema = z.object({
  items: z
    .array(
      z.object({
        menuItemId: z.string().uuid('Invalid Menu Item ID'),
        quantity: z.number().int().positive('Quantity must be at least 1'),
        customizations: z.record(z.any()).optional().default({}),
      })
    )
    .min(1, 'Order must contain at least one item'),
  specialInstructions: z.string().max(300).optional(),
});

// Order Status Update Schema
export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED']),
});
