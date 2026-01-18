import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Testing Route Logic...')

    try {
        // Mock params
        const query = undefined
        const category = undefined
        const minPrice = undefined
        const maxPrice = undefined
        const sort = 'createdAt.desc'
        const page = 1
        const limit = 20

        // Build where clause (copied from route.ts)
        const where: Prisma.ProductWhereInput = {
            status: 'ACTIVE',
            AND: [
                query ? {
                    OR: [
                        { name: { contains: query } },
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

        console.log('Where:', JSON.stringify(where, null, 2))
        console.log('OrderBy:', JSON.stringify(orderBy, null, 2))

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

        console.log(`Success! Found ${products.length} products. Total: ${total}`)
        if (products.length > 0) {
            console.log('Sample:', products[0].name)
        }

    } catch (error) {
        console.error('Error during execution:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
