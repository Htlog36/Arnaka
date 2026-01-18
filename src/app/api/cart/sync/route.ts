import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { getUserCart, ensureCart } from '@/lib/services/cart'
import { CartItemDisplay } from '@/types'

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { items } = (await req.json()) as { items: CartItemDisplay[] }

        if (!Array.isArray(items)) {
            return NextResponse.json({ error: 'Invalid items' }, { status: 400 })
        }

        const cart = await ensureCart(session.user.id)

        // Find existing server cart items
        const existingItems = await prisma.cartItem.findMany({
            where: { cartId: cart.id }
        })

        // Process each local item
        for (const item of items) {
            const match = existingItems.find(
                (e) => e.productId === item.productId && e.variantId === (item.variantId || null)
            )

            if (match) {
                // Update (Merge)
                await prisma.cartItem.update({
                    where: { id: match.id },
                    data: { quantity: match.quantity + item.quantity }
                })
            } else {
                // Create
                await prisma.cartItem.create({
                    data: {
                        cartId: cart.id,
                        productId: item.productId,
                        variantId: item.variantId || null,
                        quantity: item.quantity
                    }
                })
            }
        }

        const updatedCart = await getUserCart(session.user.id)
        return NextResponse.json({ data: updatedCart })

    } catch (error) {
        console.error('[CART_SYNC]', error)
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
    }
}
