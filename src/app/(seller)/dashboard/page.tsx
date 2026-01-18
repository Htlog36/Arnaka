import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { Card } from '@/components/ui'
import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react'
import { formatPrice } from '@/lib/utils/formatters'

async function getSellerStats(userId: string) {
    const seller = await prisma.seller.findUnique({
        where: { userId }
    })

    if (!seller) return null

    const [activeProducts, orderItems] = await prisma.$transaction([
        prisma.product.count({
            where: { sellerId: seller.id, status: 'ACTIVE' }
        }),
        prisma.orderItem.findMany({
            where: { sellerId: seller.id },
            select: {
                price: true,
                quantity: true,
                commissionAmount: true
            }
        })
    ])

    const totalSales = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const totalCommission = orderItems.reduce((acc, item) => acc + (item.commissionAmount || 0), 0)
    const netRevenue = totalSales - totalCommission

    // Count unique orders
    // Since we queried orderItems, we can't easily count unique orderIds without fetching them. 
    // Let's do a separate count or distinct query if needed, or just count items for MVP.
    // Better:
    const uniqueOrderCount = await prisma.order.count({
        where: {
            items: {
                some: { sellerId: seller.id }
            }
        }
    })

    return {
        totalSales, // Gross
        netRevenue,
        activeProducts,
        totalOrders: uniqueOrderCount,
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
                            <p className="text-sm font-medium text-gray-500">Revenu Net</p>
                            <h3 className="text-2xl font-bold text-gray-900">{formatPrice(stats.netRevenue)}</h3>
                            <p className="text-xs text-gray-400">Brut: {formatPrice(stats.totalSales)}</p>
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
