import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getUserCart } from '@/lib/services/cart'

export async function GET() {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const items = await getUserCart(session.user.id)
        return NextResponse.json({ data: items })

    } catch (error) {
        console.error('[CART_GET]', error)
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
    }
}
