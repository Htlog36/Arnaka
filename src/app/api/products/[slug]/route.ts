import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(
    request: Request,
    props: { params: Promise<{ slug: string }> }
) {
    const params = await props.params;
    try {
        const product = await prisma.product.findUnique({
            where: {
                slug: params.slug,
                status: 'ACTIVE',
            },
            include: {
                images: { orderBy: { order: 'asc' } },
                variants: true,
                category: true,
                seller: {
                    select: {
                        id: true,
                        companyName: true,
                        rating: true,
                        logo: true,
                    },
                },
                _count: {
                    select: { reviews: true },
                },
            },
        })

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(product)
    } catch (error) {
        console.error('Error fetching product:', error)
        return NextResponse.json(
            { error: 'Error fetching product' },
            { status: 500 }
        )
    }
}
