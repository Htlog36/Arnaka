import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Testing DB connection...')

    try {
        const count = await prisma.product.count()
        console.log(`Product count: ${count}`)

        if (count > 0) {
            const product = await prisma.product.findFirst({
                include: {
                    category: true,
                    seller: true,
                    images: true,
                    variants: true
                }
            })
            console.log('Sample product:', JSON.stringify(product, null, 2))
        }

        const categories = await prisma.category.findMany()
        console.log(`Category count: ${categories.length}`)

    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
