import { z } from 'zod'

/**
 * Address validation schema
 */
export const addressSchema = z.object({
    firstName: z
        .string()
        .min(2, 'Le prénom doit contenir au moins 2 caractères')
        .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
    lastName: z
        .string()
        .min(2, 'Le nom doit contenir au moins 2 caractères')
        .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
    company: z
        .string()
        .max(100, 'Le nom de l\'entreprise ne peut pas dépasser 100 caractères')
        .optional()
        .nullable(),
    address1: z
        .string()
        .min(5, 'L\'adresse doit contenir au moins 5 caractères')
        .max(200, 'L\'adresse ne peut pas dépasser 200 caractères'),
    address2: z
        .string()
        .max(200, 'Le complément d\'adresse ne peut pas dépasser 200 caractères')
        .optional()
        .nullable(),
    city: z
        .string()
        .min(2, 'La ville doit contenir au moins 2 caractères')
        .max(100, 'La ville ne peut pas dépasser 100 caractères'),
    state: z
        .string()
        .max(100, 'La région ne peut pas dépasser 100 caractères')
        .optional()
        .nullable(),
    postalCode: z
        .string()
        .min(4, 'Le code postal doit contenir au moins 4 caractères')
        .max(20, 'Le code postal ne peut pas dépasser 20 caractères'),
    country: z
        .string()
        .min(2, 'Le pays est requis')
        .max(100, 'Le pays ne peut pas dépasser 100 caractères'),
    phone: z
        .string()
        .regex(/^[\d\s+()-]+$/, 'Numéro de téléphone invalide')
        .optional()
        .nullable(),
})

export type AddressInput = z.infer<typeof addressSchema>

/**
 * Cart item validation schema
 */
export const cartItemSchema = z.object({
    productId: z.string().min(1, 'L\'ID du produit est requis'),
    variantId: z.string().optional().nullable(),
    quantity: z
        .number()
        .int('La quantité doit être un nombre entier')
        .positive('La quantité doit être positive'),
})

export type CartItemInput = z.infer<typeof cartItemSchema>

/**
 * Add to cart validation schema
 */
export const addToCartSchema = cartItemSchema

export type AddToCartInput = z.infer<typeof addToCartSchema>

/**
 * Update cart item validation schema
 */
export const updateCartItemSchema = z.object({
    quantity: z
        .number()
        .int('La quantité doit être un nombre entier')
        .min(0, 'La quantité ne peut pas être négative'),
})

export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>

/**
 * Checkout validation schema
 */
export const checkoutSchema = z.object({
    shippingAddress: addressSchema,
    billingAddress: addressSchema.optional(),
    useSameAddress: z.boolean().default(true),
    shippingMethod: z.string().min(1, 'La méthode de livraison est requise'),
    notes: z
        .string()
        .max(500, 'Les notes ne peuvent pas dépasser 500 caractères')
        .optional()
        .nullable(),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>

/**
 * Order status update validation schema (admin/seller)
 */
export const updateOrderStatusSchema = z.object({
    status: z.enum([
        'PENDING',
        'CONFIRMED',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
        'REFUNDED',
    ]),
    trackingNumber: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
})

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>

/**
 * Order filter parameters
 */
export const orderFilterSchema = z.object({
    status: z.enum([
        'PENDING',
        'CONFIRMED',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
        'REFUNDED',
    ]).optional(),
    paymentStatus: z.enum([
        'PENDING',
        'PAID',
        'FAILED',
        'REFUNDED',
        'PARTIALLY_REFUNDED',
    ]).optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
    search: z.string().optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20),
})

export type OrderFilterInput = z.infer<typeof orderFilterSchema>
