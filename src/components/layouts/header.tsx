'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
    Search,
    ShoppingCart,
    User,
    Menu,
    X,
    ChevronDown,
    Heart,
    Package,
    LayoutDashboard
} from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { ROUTES } from '@/lib/utils/constants'

interface HeaderProps {
    cartItemsCount?: number
    user?: {
        name?: string | null
        email?: string | null
        image?: string | null
    } | null
}

import { useCartStore } from '@/lib/store/use-cart'
import { CartSheet } from '@/components/cart/cart-sheet'
import { useHasMounted } from '@/lib/hooks/use-has-mounted'

export function Header({ user }: HeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isCartOpen, setIsCartOpen] = useState(false)

    const cartItemsCount = useCartStore((state) => state.items.length)
    const hasMounted = useHasMounted()

    const categories = [
        { name: 'Électronique', href: '/products?category=electronics' },
        { name: 'Mode', href: '/products?category=fashion' },
        { name: 'Maison', href: '/products?category=home' },
        { name: 'Sports', href: '/products?category=sports' },
        { name: 'Beauté', href: '/products?category=beauty' },
    ]

    return (
        <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            {/* Top bar */}
            <div className="border-b border-gray-100 bg-gray-50">
                <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 text-xs text-gray-600">
                    <p>Livraison gratuite dès 50€ d&apos;achat</p>
                    <div className="flex items-center gap-4">
                        <Link href="/seller" className="hover:text-indigo-600">
                            Devenir vendeur
                        </Link>
                        <Link href="/help" className="hover:text-indigo-600">
                            Aide
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main header */}
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex h-16 items-center justify-between gap-4">
                    {/* Logo */}
                    <Link
                        href={ROUTES.home}
                        className="flex-shrink-0 text-2xl font-bold text-indigo-600"
                    >
                        Arnaka
                    </Link>

                    {/* Search bar - Desktop */}
                    <div className="hidden flex-1 max-w-xl lg:block">
                        <form action="/products" method="GET" className="relative">
                            <Input
                                type="search"
                                name="search"
                                placeholder="Rechercher des produits..."
                                className="pr-12"
                                leftIcon={<Search className="h-4 w-4" />}
                            />
                            <Button
                                type="submit"
                                size="sm"
                                className="absolute right-1 top-1/2 -translate-y-1/2"
                            >
                                <Search className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Mobile search toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            aria-label="Rechercher"
                        >
                            <Search className="h-5 w-5" />
                        </Button>

                        {/* Wishlist */}
                        <Link href="/wishlist">
                            <Button variant="ghost" size="icon" aria-label="Favoris">
                                <Heart className="h-5 w-5" />
                            </Button>
                        </Link>

                        {/* Cart */}
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Panier"
                                onClick={() => setIsCartOpen(true)}
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {hasMounted && cartItemsCount > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-medium text-white">
                                        {cartItemsCount > 99 ? '99+' : cartItemsCount}
                                    </span>
                                )}
                            </Button>
                        </div>
                        <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

                        {/* User menu */}
                        {user ? (
                            <div className="relative group">
                                <Button variant="ghost" size="icon" aria-label="Mon compte">
                                    {user.image ? (
                                        <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                            <img
                                                src={user.image}
                                                alt={user.name || 'Avatar'}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <User className="h-5 w-5" />
                                    )}
                                </Button>
                                {/* Dropdown */}
                                <div className="invisible absolute right-0 top-full pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                                    <div className="w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                                        <div className="border-b border-gray-100 px-4 pb-2">
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                        <nav className="py-2">
                                            {(user.role === 'SELLER' || user.role === 'ADMIN') && (
                                                <Link
                                                    href="/dashboard"
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                >
                                                    <LayoutDashboard className="h-4 w-4" />
                                                    Tableau de bord
                                                </Link>
                                            )}
                                            <Link
                                                href={ROUTES.account}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                <User className="h-4 w-4" />
                                                Mon profil
                                            </Link>
                                            <Link
                                                href={ROUTES.orders}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                <Package className="h-4 w-4" />
                                                Mes commandes
                                            </Link>
                                            <Link
                                                href="/wishlist"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                <Heart className="h-4 w-4" />
                                                Ma liste d&apos;envies
                                            </Link>
                                        </nav>
                                        <div className="border-t border-gray-100 pt-2">
                                            <form action="/api/auth/signout" method="POST">
                                                <button
                                                    type="submit"
                                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                                >
                                                    Déconnexion
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link href={ROUTES.login}>
                                <Button variant="primary" size="sm">
                                    Connexion
                                </Button>
                            </Link>
                        )}

                        {/* Mobile menu toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile search */}
                {isSearchOpen && (
                    <div className="pb-4 lg:hidden">
                        <form action="/products" method="GET">
                            <Input
                                type="search"
                                name="search"
                                placeholder="Rechercher des produits..."
                                leftIcon={<Search className="h-4 w-4" />}
                            />
                        </form>
                    </div>
                )}
            </div>

            {/* Categories bar - Desktop */}
            <nav className="hidden border-t border-gray-100 lg:block">
                <div className="mx-auto max-w-7xl px-4">
                    <ul className="flex items-center gap-8">
                        {categories.map((category) => (
                            <li key={category.name}>
                                <Link
                                    href={category.href}
                                    className="flex h-10 items-center text-sm font-medium text-gray-700 hover:text-indigo-600"
                                >
                                    {category.name}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link
                                href={ROUTES.products}
                                className="flex h-10 items-center gap-1 text-sm font-medium text-gray-700 hover:text-indigo-600"
                            >
                                Toutes les catégories
                                <ChevronDown className="h-4 w-4" />
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="border-t border-gray-200 bg-white lg:hidden">
                    <nav className="mx-auto max-w-7xl px-4 py-4">
                        <ul className="space-y-2">
                            {categories.map((category) => (
                                <li key={category.name}>
                                    <Link
                                        href={category.href}
                                        className="block py-2 text-gray-700 hover:text-indigo-600"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link
                                    href={ROUTES.products}
                                    className="block py-2 font-medium text-indigo-600"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Voir toutes les catégories
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </header>
    )
}

export default Header
