import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams

        // Parse query params
        const page = Number(searchParams.get('page')) || 1
        const limit = Number(searchParams.get('limit')) || 20
        const query = searchParams.get('query') || undefined
        const category = searchParams.get('category') || undefined
        const sort = searchParams.get('sort') || 'createdAt.desc'
        const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
        const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined

        // Build where clause
        const where: Prisma.ProductWhereInput = {
            status: 'ACTIVE',
            AND: [
                query ? {
                    OR: [
                        { name: { contains: query } }, // sqlite doesn't support mode: 'insensitive' natively without extension, but we'll try
                        { description: { contains: query } },
                    ]
                } : {},
                category ? {
                    category: {
                        slug: category
                    }
                } : {},
                minPrice ? { price: { gte: minPrice } } : {},
                maxPrice ? { price: { lte: maxPrice } } : {},
            ]
        }

        // Build sort
        const [sortField, sortOrder] = sort.split('.')
        const orderBy: Prisma.ProductOrderByWithRelationInput = {
            [sortField]: sortOrder as Prisma.SortOrder
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    images: { take: 1, orderBy: { order: 'asc' } },
                    category: { select: { name: true, slug: true } },
                    seller: { select: { companyName: true } },
                },
            }),
            prisma.product.count({ where }),
        ])

        return NextResponse.json({
            data: products,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('Error fetching products:', error)
        return NextResponse.json(
            { error: `Error fetching products: ${error instanceof Error ? error.message : String(error)}` },
            { status: 500 }
        )
    }
}
