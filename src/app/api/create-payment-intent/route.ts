import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getUserCart } from '@/lib/services/cart'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia', // Latest API version or fallback
    typescript: true,
})

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const items = await getUserCart(session.user.id)
        if (items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
        }

        // Calculate amount on server to prevent manipulation
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const shippingCost = subtotal >= 50 ? 0 : 5.90
        const amount = Math.round((subtotal + shippingCost) * 100) // Amount in cents

        // Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'eur',
            metadata: {
                userId: session.user.id,
                cartId: items[0]?.id ? 'cart-ref' : 'ref' // Ideally pass cart ID if tracking
            },
            automatic_payment_methods: {
                enabled: true,
            },
        })

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        })
    } catch (error) {
        console.error('[STRIPE_PAYMENT_INTENT]', error)
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
    }
}
