import { z } from 'zod'

export const productSchema = z.object({
    name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
    description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
    price: z.coerce.number().min(0.01, 'Le prix doit être supérieur à 0'),
    stock: z.coerce.number().int().min(0, 'Le stock ne peut pas être négatif'),
    categoryId: z.string().min(1, 'La catégorie est requise'),
    status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']),
    images: z.array(z.object({
        url: z.string().url('URL invalide'),
        alt: z.string().optional()
    })).min(1, 'Au moins une image est requise'),
    // Simplified variants for now: just a string or JSON? 
    // Let's try to map to the DB structure if possible, or use a simplified input representation.
    // For MVP, maybe no variants creation in the basic form? 
    // Let's add optional variants array.
    variants: z.array(z.object({
        name: z.string(),
        price: z.coerce.number().min(0.01).optional().nullable(),
        stock: z.coerce.number().int().min(0)
    })).optional()
})

export type ProductInput = z.infer<typeof productSchema>
