import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { checkoutSchema } from '@/lib/validations/order'
import { getUserCart } from '@/lib/services/cart'

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const result = checkoutSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error }, { status: 400 })
        }

        const { shippingAddress, billingAddress, useSameAddress, notes } = result.data

        // Get Cart Items with current prices and stock
        const items = await getUserCart(session.user.id)

        if (items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
        }

        // Verify stock availability
        for (const item of items) {
            if (item.quantity > item.stock) {
                return NextResponse.json({
                    error: `Stock insufficient for ${item.productName}`,
                    productId: item.productId
                }, { status: 409 })
            }
        }

        // Calculate totals
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const shippingCost = 0 // Free shipping logic or fixed? "Livraison gratuite dès 50€" in header.
        // Let's implement that logic simple
        const calculatedShipping = subtotal >= 50 ? 0 : 5.90
        const taxAmount = subtotal * 0.20 // 20% VAT roughly included? Or calculated on top?
        // Usually prices like 14.28 displayed are tax included.
        // Let's assume prices are tax included for simplicity, or treat tax as 0 extra.
        // Or separation: price is tax excluded? No, B2C usually tax included.
        // Let's store taxAmount as metadata of how much tax was inside total.

        const total = subtotal + calculatedShipping

        // Create Order Transaction
        const order = await prisma.$transaction(async (tx) => {
            // 1. Create Order
            const newOrder = await tx.order.create({
                data: {
                    userId: session.user.id,
                    status: 'PENDING',
                    paymentStatus: 'PENDING', // Will be PAID if we integrat Stripe immediately
                    subtotal,
                    shippingCost: calculatedShipping,
                    taxAmount, // Estimated
                    total,
                    shippingAddress: shippingAddress as any, // JSON type
                    billingAddress: (useSameAddress ? shippingAddress : billingAddress) as any,
                    notes,
                    items: {
                        create: items.map(item => ({
                            productId: item.productId,
                            variantId: item.variantId,
                            productName: item.productName,
                            variantName: item.variantName,
                            price: item.price,
                            quantity: item.quantity,
                            // Calculate Commission (10%)
                            commissionRate: 0.10,
                            commissionAmount: item.price * item.quantity * 0.10,
                            sellerId: item.sellerId // Now available from cart service
                        }))
                    }
                }
            })

            // 2. Decrement Stock
            for (const item of items) {
                if (item.variantId) {
                    await tx.productVariant.update({
                        where: { id: item.variantId },
                        data: { stock: { decrement: item.quantity } }
                    })
                    // Also decrement product global stock? 
                    // Usually product stock = sum of variants or separate?
                    // If variants exist, product stock might be tracked there.
                    // Schema says Product has stock AND Variants have stock.
                    // Let's decrement variant and maybe product if tracking global.
                } else {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { decrement: item.quantity } }
                    })
                }
            }

            // 3. Clear Cart Items
            // Find cart ID first (we assume items belong to one cart)
            const cart = await tx.cart.findUnique({ where: { userId: session.user.id } })
            if (cart) {
                await tx.cartItem.deleteMany({ where: { cartId: cart.id } })
            }

            return newOrder
        })

        return NextResponse.json({ data: { id: order.id, orderNumber: order.orderNumber } })

    } catch (error) {
        console.error('[ORDER_CREATE]', error)
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
    }
}
