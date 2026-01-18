import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { ensureCart } from '@/lib/services/cart'
import { cartItemSchema } from '@/lib/validations/order'

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const result = cartItemSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error }, { status: 400 })
        }

        const { productId, variantId, quantity } = result.data

        const cart = await ensureCart(session.user.id)

        // Check availability? (Optional but good UX)
        // Check existing item in cart
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId_variantId: {
                    cartId: cart.id,
                    productId,
                    variantId: variantId || '' // Prisma unique constraint handles null? 
                    // Prisma Schema: @@unique([cartId, productId, variantId])
                    // SQLite handles NULL in unique constraints as distinct (usually).
                    // BUT Prisma `variantId String?`.
                    // If variantId is null, we pass 'null' or undefined?
                    // In `where` clause for unique, we probably need exact match.
                    // If SQLite treats NULL != NULL, unique constraint might not work well on nullable fields without workaround.
                    // BUT Prisma Client handles this abstraction usually.
                }
            }
        })

        // Actually, let's use check with findFirst to be safe with Nullable unique in SQLite
        const match = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId,
                variantId: variantId || null // Explicit null
            }
        })

        if (match) {
            await prisma.cartItem.update({
                where: { id: match.id },
                data: { quantity: match.quantity + quantity }
            })
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    variantId: variantId || null,
                    quantity
                }
            })
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('[CART_ADD]', error)
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
    }
}
