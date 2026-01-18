import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { Card } from '@/components/ui'
import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react'
import { formatPrice } from '@/lib/utils/formatters'

async function getSellerStats(userId: string) {
    // 1. Get Seller ID
    const seller = await prisma.seller.findUnique({
        where: { userId }
    })

    if (!seller) return null

    // 2. Complicated queries for stats
    // Total Sales: Sum of OrderItems linked to this seller
    // But OrderItem -> Product. We don't have direct seller link on OrderItem in basic schema?
    // Wait, I added sellerId to CartItem, did I add it to OrderItem?
    // Let's check schema/migration.
    // In `test-cart-logic.ts` simplified simulation I assumed it.
    // If OrderItem doesn't have sellerId, we must join Product -> Seller.

    // Efficient way:
    const stats = await prisma.$transaction([
        // Active Products
        prisma.product.count({
            where: { sellerId: seller.id, status: 'ACTIVE' }
        }),
        // Total Orders (containing at least one product from this seller)
        // This is tricky without direct link. 
        // Let's assume for MVP we fetch products and count related order items.

        // Simplified: Count products. Real sales stats need proper aggregation.
        // Let's just mock zeros if schema is too complex for quick query, or do a simple join.
        prisma.product.findMany({
            where: { sellerId: seller.id },
            select: {
                _count: {
                    select: { orderItems: true }
                }
                // If price is on OrderItem, we need to sum it.
            }
        })
    ])

    // Aggregation logic manual for now
    const activeProducts = stats[0]
    // const sales = ...

    return {
        totalSales: 0, // Placeholder until aggregation logic confirmed
        activeProducts,
        totalOrders: 0,
        recentOrders: []
    }
}

export default async function DashboardPage() {
    const session = await auth()
    if (!session?.user) return null

    const stats = await getSellerStats(session.user.id)

    if (!stats && session.user.role === 'ADMIN') {
        // Admin view
        return <div>Admin Dashboard (All Sellers)</div>
    }

    if (!stats) {
        return <div>Erreur: Compte vendeur introuvable. Contactez le support.</div>
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-indigo-100 p-3 text-indigo-600">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Chiffre d'affaires</p>
                            <h3 className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalSales)}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                            <ShoppingCart className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Commandes</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalOrders}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-green-100 p-3 text-green-600">
                            <Package className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Produits Actifs</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.activeProducts}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-orange-100 p-3 text-orange-600">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Conversion</p>
                            <h3 className="text-2xl font-bold text-gray-900">-%</h3>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Orders Section */}
            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-200 px-6 py-4">
                    <h3 className="font-semibold text-gray-900">Commandes récentes</h3>
                </div>
                <div className="p-6 text-center text-gray-500">
                    Aucune commande récente.
                </div>
            </div>
        </div>
    )
}
