import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { updateCartItemSchema } from '@/lib/validations/order'

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // Next 15 specific
) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const resolvedParams = await params
        const { id } = resolvedParams

        const body = await req.json()
        const result = updateCartItemSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
        }

        // Verify ownership
        const item = await prisma.cartItem.findUnique({
            where: { id },
            include: { cart: true }
        })

        if (!item || item.cart.userId !== session.user.id) {
            return NextResponse.json({ error: 'Not found or forbidden' }, { status: 403 })
        }

        await prisma.cartItem.update({
            where: { id },
            data: { quantity: result.data.quantity }
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('[CART_UPDATE]', error)
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const resolvedParams = await params
        const { id } = resolvedParams

        const item = await prisma.cartItem.findUnique({
            where: { id },
            include: { cart: true }
        })

        if (!item || item.cart.userId !== session.user.id) {
            return NextResponse.json({ error: 'Not found or forbidden' }, { status: 403 })
        }

        await prisma.cartItem.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('[CART_DELETE]', error)
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
    }
}
