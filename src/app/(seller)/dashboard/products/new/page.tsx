import { ProductForm } from '@/components/dashboard/product-form'
import { prisma } from '@/lib/db/prisma'

export default async function NewProductPage() {
    const categories = await prisma.category.findMany({
        select: { id: true, name: true }
    })

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Nouveau Produit</h1>
            <ProductForm categories={categories} />
        </div>
    )
}
