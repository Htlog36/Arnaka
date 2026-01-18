import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { redirect } from 'next/navigation'
import { Card, Button } from '@/components/ui'
import { formatPrice, formatDate } from '@/lib/utils/formatters'
import Link from 'next/link'
import { Eye, Package } from 'lucide-react'

// Fetch orders containing items from this seller
async function getSellerOrders(sellerId: string) {
    const orders = await prisma.order.findMany({
        where: {
            items: {
                some: {
                    sellerId: sellerId
                }
            }
        },
        include: {
            user: {
                select: { name: true, email: true }
            },
            items: {
                where: {
                    sellerId: sellerId // Only fetch items belonging to this seller
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return orders
}

export default async function SellerOrdersPage() {
    const session = await auth()
    if (!session?.user) redirect('/login')

    const seller = await prisma.seller.findUnique({
        where: { userId: session.user.id }
    })

    if (!seller && session.user.role !== 'ADMIN') redirect('/')

    // Admin fallback or real seller check
    if (!seller) return <div>Accès refusé. Créer un profil vendeur.</div>

    const orders = await getSellerOrders(seller.id)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Commandes</h1>
                <Button variant="outline">Exporter CSV (Bientôt)</Button>
            </div>

            {orders.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
                    <Package className="h-10 w-10 text-gray-400" />
                    <h3 className="mt-4 text-lg font-semibold">Aucune commande</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Vos produits n'ont pas encore été commandés.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <Card key={order.id} className="p-6">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-lg">#{order.orderNumber.slice(-6)}</span>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.status === 'PENDING' ? 'En attente' : order.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {formatDate(order.createdAt)} • Client: {order.user.name || order.user.email}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">
                                        {/* Calculate total for ONLY this seller's items */}
                                        {formatPrice(order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0))}
                                    </p>
                                    <p className="text-xs text-gray-400">{order.items.length} produit(s)</p>
                                </div>
                            </div>

                            <div className="mt-4 border-t pt-4">
                                <h4 className="mb-2 text-sm font-medium text-gray-500">Produits commandés :</h4>
                                <ul className="space-y-2">
                                    {order.items.map(item => (
                                        <li key={item.id} className="flex justify-between text-sm">
                                            <span>
                                                {item.quantity}x {item.productName}
                                                {item.variantName && <span className="text-gray-400"> ({item.variantName})</span>}
                                            </span>
                                            <span>{formatPrice(item.price * item.quantity)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                                {/* Only View for now, update status comes later */}
                                <Button size="sm" variant="outline" asChild>
                                    <Link href={`/dashboard/orders/${order.id}`}>
                                        <Eye className="mr-2 h-4 w-4" /> Détails
                                    </Link>
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
