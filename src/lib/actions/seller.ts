'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const sellerSchema = z.object({
    storeName: z.string().min(3, "Le nom de la boutique doit faire au moins 3 caractères"),
    description: z.string().optional(),
})

export type SellerInput = z.infer<typeof sellerSchema>

export async function registerSeller(data: SellerInput) {
    const session = await auth()
    if (!session?.user) {
        throw new Error("Vous devez être connecté pour devenir vendeur")
    }

    const validated = sellerSchema.parse(data)

    // Check if store name is taken
    const existing = await prisma.seller.findUnique({
        where: { slug: validated.storeName.toLowerCase().replace(/\s+/g, '-') } // Simplified slug check
    })

    // Actually simpler: just check unique constraint if it exists, or just try catch.
    // Let's do a manual check for cleaner error.
    const slug = validated.storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const slugTaken = await prisma.seller.findUnique({ where: { slug } })
    if (slugTaken) {
        throw new Error("Ce nom de boutique est déjà pris")
    }

    // Transaction: Create Seller profile AND update User role
    await prisma.$transaction([
        prisma.seller.create({
            data: {
                userId: session.user.id,
                storeName: validated.storeName,
                slug,
                description: validated.description
            }
        }),
        prisma.user.update({
            where: { id: session.user.id },
            data: { role: 'SELLER' }
        })
    ])

    // Revalidate relevant paths
    revalidatePath('/')

    // Note: Session update requires client-side handling or re-login.
    // We will redirect to dashboard, but middleware/layout might block if session is stale.
    // NextAuth v5 automatically refreshes session on next request often, but let's see.
    // If not, we might need to tell user to log out/in, or use `update()` on client.
}
