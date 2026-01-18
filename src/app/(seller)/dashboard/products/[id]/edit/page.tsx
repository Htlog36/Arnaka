import { ProductForm } from '@/components/dashboard/product-form'
import { prisma } from '@/lib/db/prisma'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const session = await auth()
    const product = await prisma.product.findUnique({
        where: { id: params.id },
        include: {
            images: true,
            variants: true
        }
    })

    if (!product) notFound()

    // Authorization check
    // We fetch seller to verify? Logic is in server action too, but good to hide UI if not allowed.
    // For MVP rely on action failure or basic check if user is seller.

    const categories = await prisma.category.findMany({
        select: { id: true, name: true }
    })

    // Transform DB data to Form data structure
    const initialData = {
        ...product,
        images: product.images.map(i => ({ url: i.url, alt: i.alt || undefined })),
        variants: product.variants.map(v => ({
            name: v.name,
            stock: v.stock,
            price: v.price
        })),
        categoryId: product.categoryId! // Assuming require
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Modifier le produit</h1>
            {/* 
                // @ts-ignore: Mismatch in types for date or strict nulls? 
                // ProductInput doesn't have id but we pass id in & { id: string }
            */}
            <ProductForm categories={categories} initialData={initialData} />
        </div>
    )
}
