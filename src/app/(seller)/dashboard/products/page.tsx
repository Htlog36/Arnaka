import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { Button } from '@/components/ui'
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils/formatters'
import { redirect } from 'next/navigation'

export default async function SellerProductsPage() {
    const session = await auth()
    if (!session?.user) return null

    const seller = await prisma.seller.findUnique({
        where: { userId: session.user.id }
    })

    if (!seller && session.user.role !== 'ADMIN') {
        return <div>Accès refusé. Compte vendeur requis.</div>
    }

    // Identify effective seller ID (Admin sees all?)
    // For now, strict seller view.
    const products = await prisma.product.findMany({
        where: seller ? { sellerId: seller.id } : {}, // Admin sees all if no seller ID linked? Or just restrict to seller.
        include: {
            category: true,
            _count: { select: { variants: true } }
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Mes Produits</h1>
                <Link href="/dashboard/products/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nouveau Produit
                    </Button>
                </Link>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="px-6 py-3">Produit</th>
                                <th className="px-6 py-3">Catégorie</th>
                                <th className="px-6 py-3">Prix</th>
                                <th className="px-6 py-3">Stock</th>
                                <th className="px-6 py-3">Statut</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <p className="mb-2 text-lg font-medium text-gray-900">Aucun produit</p>
                                        <p className="text-gray-500">Commencez par ajouter votre premier produit.</p>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="border-b bg-white hover:bg-gray-50">
                                        <td className="w-1/3 px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{product.name}</span>
                                                <span className="text-xs text-gray-400">Variantes: {product._count.variants}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{product.category.name}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{formatPrice(product.price)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${product.stock > 10 ? 'bg-green-100 text-green-800' :
                                                    product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {product.stock} en stock
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {product.status === 'ACTIVE' ? 'Actif' : 'Brouillon'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/products/${product.slug}`} target="_blank">
                                                    <Button variant="ghost" size="icon" title="Voir sur le site">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/dashboard/products/${product.id}/edit`}>
                                                    <Button variant="ghost" size="icon" title="Modifier">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50" title="Supprimer">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
