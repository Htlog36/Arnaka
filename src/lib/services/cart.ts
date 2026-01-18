import { prisma } from '@/lib/db/prisma'
import { CartItemDisplay } from '@/types'

export async function getUserCart(userId: string): Promise<CartItemDisplay[]> {
    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: {
                    product: {
                        include: {
                            images: {
                                orderBy: { order: 'asc' },
                                take: 1
                            }
                        }
                    },
                    variant: true
                },
                orderBy: {
                    // id: 'asc' // Assume insertion order roughly correlates or just stable sort
                    // Better to sort by product name or creation if possible, but id is fine for now
                }
            }
        }
    })

    if (!cart) return []

    // Explicitly cast or handle items if inference fails
    const cartAny = cart as any
    const cartItems = cartAny.items as (typeof cart & { items: any[] })['items']

    return cartItems.map((item: any) => {
        const product = item.product
        const variant = item.variant
        const price = (variant?.price ?? product.price)

        return {
            id: item.id,
            productId: item.productId,
            productName: product.name,
            productSlug: product.slug,
            productImage: product.images[0]?.url || null,
            variantId: item.variantId || null,
            variantName: variant?.name || null,
            price: price,
            quantity: item.quantity,
            stock: variant ? variant.stock : product.stock,
            sellerId: product.sellerId
        }
    }).sort((a, b) => a.productName.localeCompare(b.productName))
}

export async function ensureCart(userId: string) {
    let cart = await prisma.cart.findUnique({
        where: { userId }
    })

    if (!cart) {
        cart = await prisma.cart.create({
            data: { userId }
        })
    }

    return cart
}
