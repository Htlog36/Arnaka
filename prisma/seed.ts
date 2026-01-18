import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

// Simple slugify function if import fails or for simplicity
function makeSlug(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-')     // Replace multiple - with single -
}

async function main() {
    console.log('🌱 Starting seed...')

    // Cleanup existing data
    await prisma.review.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.cartItem.deleteMany()
    await prisma.cart.deleteMany()
    await prisma.productVariant.deleteMany()
    await prisma.productImage.deleteMany()
    await prisma.product.deleteMany()
    await prisma.seller.deleteMany()
    await prisma.category.deleteMany()
    await prisma.verificationToken.deleteMany()
    await prisma.account.deleteMany()
    await prisma.session.deleteMany()
    await prisma.user.deleteMany()

    console.log('🧹 Database cleaned')

    // Create Users
    const passwordHash = await bcrypt.hash('password123', 10)

    const admin = await prisma.user.create({
        data: {
            email: 'admin@arnaka.com',
            name: 'Admin User',
            passwordHash,
            role: 'ADMIN',
        },
    })

    const buyer = await prisma.user.create({
        data: {
            email: 'buyer@arnaka.com',
            name: 'John Buyer',
            passwordHash,
            role: 'BUYER',
        },
    })

    const seller1User = await prisma.user.create({
        data: {
            email: 'tech@store.com',
            name: 'Tech Store Owner',
            passwordHash,
            role: 'SELLER',
        },
    })

    const seller2User = await prisma.user.create({
        data: {
            email: 'fashion@boutique.com',
            name: 'Fashion Boutique Owner',
            passwordHash,
            role: 'SELLER',
        },
    })

    // Create Sellers
    const techSeller = await prisma.seller.create({
        data: {
            userId: seller1User.id,
            companyName: 'Tech Giants',
            description: 'The best electronics at the best prices.',
            verified: true,
            rating: 4.8,
        },
    })

    const fashionSeller = await prisma.seller.create({
        data: {
            userId: seller2User.id,
            companyName: 'Chic Boutique',
            description: 'Latest fashion trends for everyone.',
            verified: true,
            rating: 4.5,
        },
    })

    console.log('👥 Users and Sellers created')

    // Create Categories
    const electronics = await prisma.category.create({
        data: {
            name: 'Électronique',
            slug: 'electronics',
            description: 'Gadgets et appareils électroniques',
            image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
        },
    })

    const computers = await prisma.category.create({
        data: {
            name: 'Ordinateurs',
            slug: 'computers',
            parentId: electronics.id,
        },
    })

    const audio = await prisma.category.create({
        data: {
            name: 'Audio',
            slug: 'audio',
            parentId: electronics.id,
        },
    })

    const fashion = await prisma.category.create({
        data: {
            name: 'Mode',
            slug: 'fashion',
            description: 'Vêtements et accessoires',
            image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
        },
    })

    const navigation = await prisma.category.create({
        data: {
            name: 'Maison',
            slug: 'home',
            description: 'Tout pour la maison',
        },
    })

    console.log('📂 Categories created')

    // Create Products
    const products = [
        {
            name: 'MacBook Pro 16"',
            description: 'Le plus puissant des MacBook Pro est là. Avec la puce M3 Max ultra-rapide.',
            price: 2499.00,
            stock: 50,
            sellerId: techSeller.id,
            categoryId: computers.id,
            images: [
                'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800',
                'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800'
            ],
        },
        {
            name: 'Casque Sony WH-1000XM5',
            description: 'Le meilleur casque à réduction de bruit du marché.',
            price: 349.00,
            comparePrice: 399.00,
            stock: 100,
            sellerId: techSeller.id,
            categoryId: audio.id,
            images: [
                'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800',
            ],
        },
        {
            name: 'T-shirt Coton Bio',
            description: '100% coton biologique, doux et durable.',
            price: 29.90,
            stock: 200,
            sellerId: fashionSeller.id,
            categoryId: fashion.id,
            images: [
                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
            ],
            variants: [
                { name: 'Taille: S / Couleur: Blanc', sku: 'TSHIRT-S-W', stock: 50, attributes: { size: 'S', color: 'White' } },
                { name: 'Taille: M / Couleur: Blanc', sku: 'TSHIRT-M-W', stock: 50, attributes: { size: 'M', color: 'White' } },
                { name: 'Taille: L / Couleur: Noir', sku: 'TSHIRT-L-B', stock: 50, attributes: { size: 'L', color: 'Black' } },
            ]
        }
    ]

    for (const p of products) {
        const product = await prisma.product.create({
            data: {
                name: p.name,
                slug: makeSlug(p.name),
                description: p.description,
                price: p.price,
                comparePrice: p.comparePrice,
                stock: p.stock,
                sellerId: p.sellerId,
                categoryId: p.categoryId,
                status: 'ACTIVE',
                images: {
                    create: p.images.map((url, index) => ({
                        url,
                        order: index,
                        alt: p.name,
                    })),
                },
                variants: {
                    create: p.variants,
                },
            },
        })
        console.log(`Created product: ${product.name}`)
    }

    console.log('📦 Products created')
    console.log('✅ Seed completed')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
