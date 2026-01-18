import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
    LayoutDashboard,
    Package,
    Settings,
    LogOut,
    ShoppingBag
} from 'lucide-react'
import { Button } from '@/components/ui'

export default async function SellerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session?.user) {
        redirect('/login?callbackUrl=/dashboard')
    }

    if (session.user.role !== 'SELLER' && session.user.role !== 'ADMIN') {
        redirect('/')
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white transition-transform">
                <div className="flex h-full flex-col px-3 py-4">
                    <div className="mb-5 flex items-center pl-2.5">
                        <span className="self-center whitespace-nowrap text-xl font-semibold text-gray-900">
                            Arnaka Seller
                        </span>
                    </div>
                    <ul className="space-y-2 font-medium">
                        <li>
                            <Link href="/dashboard" className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100">
                                <LayoutDashboard className="h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                                <span className="ml-3">Vue d'ensemble</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/products" className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100">
                                <Package className="h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                                <span className="ml-3">Mes Produits</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/orders" className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100">
                                <ShoppingBag className="h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                                <span className="ml-3">Commandes</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/settings" className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100">
                                <Settings className="h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                                <span className="ml-3">Paramètres</span>
                            </Link>
                        </li>
                    </ul>
                    <div className="mt-auto">
                        <Link href="/" className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 mb-2">
                            <span className="ml-3 text-sm text-gray-500">Retour au site</span>
                        </Link>
                        <form action={async () => {
                            'use server'
                            // Handle logout if needed, or link to logout route
                        }}>
                            {/* Simplified logout button visual */}
                            <div className="border-t pt-4">
                                <div className="flex items-center gap-3 px-2">
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                        {session.user.name?.[0] || 'S'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {session.user.name}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {session.user.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="p-4 sm:ml-64">
                <div className="mt-4 rounded-lg border-2 border-dashed border-gray-200 p-4">
                    {children}
                </div>
            </div>
        </div>
    )
}
