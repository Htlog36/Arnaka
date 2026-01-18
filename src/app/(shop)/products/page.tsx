'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui'
import { formatPrice } from '@/lib/utils/formatters'
import type { ProductWithRelations, Category } from '@/types'

import Image from 'next/image'

// Product Grid Item Component
function ProductCard({ product }: { product: ProductWithRelations }) {
    return (
        <Link
            href={`/products/${product.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg"
        >
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                    src={product.images[0]?.url || '/placeholder.jpg'}
                    alt={product.images[0]?.alt || product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {product.comparePrice && product.comparePrice > product.price && (
                    <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
                        Solde
                    </span>
                )}
            </div>
            <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                    {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{product.seller?.companyName}</p>
                <div className="mt-auto flex items-end justify-between pt-4">
                    <div className="flex flex-col">
                        {product.comparePrice && (
                            <span className="text-xs text-gray-500 line-through">
                                {formatPrice(product.comparePrice)}
                            </span>
                        )}
                        <span className="text-lg font-bold text-gray-900">
                            {formatPrice(product.price)}
                        </span>
                    </div>
                    <Button size="sm" variant="ghost">
                        Voir
                    </Button>
                </div>
            </div>
        </Link>
    )
}

function FilterSection({
    title,
    children
}: {
    title: string
    children: React.ReactNode
}) {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <div className="border-b border-gray-200 py-6">
            <button
                className="flex w-full items-center justify-between py-2 text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-medium text-gray-900">{title}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="mt-4 space-y-2">
                    {children}
                </div>
            )}
        </div>
    )
}

export default function ProductsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Params state
    const query = searchParams.get('query') || ''
    const category = searchParams.get('category') || ''
    const sort = searchParams.get('sort') || 'createdAt.desc'
    const minPrice = searchParams.get('minPrice') || ''
    const maxPrice = searchParams.get('maxPrice') || ''

    const [showMobileFilters, setShowMobileFilters] = useState(false)

    // Fetch products
    const { data, isLoading } = useQuery({
        queryKey: ['products', { query, category, sort, minPrice, maxPrice }],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (query) params.set('query', query)
            if (category) params.set('category', category)
            if (sort) params.set('sort', sort)
            if (minPrice) params.set('minPrice', minPrice)
            if (maxPrice) params.set('maxPrice', maxPrice)

            const res = await fetch(`/api/products?${params.toString()}`)
            if (!res.ok) throw new Error('Failed to fetch products')
            return res.json()
        },
    })

    // Fetch categories for filter
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await fetch('/api/categories')
            if (!res.ok) throw new Error('Failed to fetch categories')
            return res.json()
        }
    })

    const updateFilters = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        // content replaced with router.push
        router.push(`/products?${params.toString()}`)
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-8">
            <div className="container-page">
                <div className="flex items-baseline justify-between border-b border-gray-200 pb-6">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        {category
                            ? categories?.find((c: Category) => c.slug === category)?.name || 'Catégorie'
                            : query ? `Résultats pour "${query}"` : 'Tous les produits'}
                    </h1>

                    <div className="flex items-center">
                        <div className="relative inline-block text-left">
                            <select
                                value={sort}
                                onChange={(e) => updateFilters('sort', e.target.value)}
                                className="cursor-pointer border-none bg-transparent py-2 pl-3 pr-8 text-sm font-medium text-gray-700 hover:text-gray-900 focus:ring-0"
                            >
                                <option value="createdAt.desc">Nouveautés</option>
                                <option value="price.asc">Prix croissant</option>
                                <option value="price.desc">Prix décroissant</option>
                                <option value="name.asc">Nom (A-Z)</option>
                            </select>
                        </div>

                        <button
                            className="ml-4 p-2 text-gray-400 hover:text-gray-500 lg:hidden"
                            onClick={() => setShowMobileFilters(true)}
                        >
                            <Filter className="h-5 w-5" />
                        </button>
                    </div>
                </div>


                {/* Mobile Filter Drawer */}
                {showMobileFilters && (
                    <div className="fixed inset-0 z-40 flex lg:hidden">
                        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowMobileFilters(false)} />
                        <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                            <div className="flex items-center justify-between px-4">
                                <h2 className="text-lg font-medium text-gray-900">Filtres</h2>
                                <button
                                    type="button"
                                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                                    onClick={() => setShowMobileFilters(false)}
                                >
                                    <span className="sr-only">Fermer</span>
                                    {/* X Icon */}
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Mobile Filters Form */}
                            <form className="mt-4 border-t border-gray-200 px-4">
                                <FilterSection title="Catégories">
                                    <div className="space-y-6"> {/* existing filters simplified reuse or duplicate content logic? reusing components but need state copy or just same handler */}
                                        {/* We will duplicate the logic visually here for simplicity using same handler */}
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <input
                                                    id="mobile-cat-all"
                                                    name="category-mobile"
                                                    type="radio"
                                                    checked={!category}
                                                    onChange={() => updateFilters('category', null)}
                                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <label htmlFor="mobile-cat-all" className="ml-3 text-sm text-gray-600">
                                                    Toutes
                                                </label>
                                            </div>
                                            {categories?.map((c: Category) => (
                                                <div key={c.id} className="flex items-center">
                                                    <input
                                                        id={`mobile-cat-${c.id}`}
                                                        name="category-mobile"
                                                        type="radio"
                                                        checked={category === c.slug}
                                                        onChange={() => updateFilters('category', c.slug)}
                                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <label htmlFor={`mobile-cat-${c.id}`} className="ml-3 text-sm text-gray-600">
                                                        {c.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </FilterSection>
                                {/* Reuse price filter */}
                                <FilterSection title="Prix">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between gap-2">
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                value={minPrice}
                                                onChange={(e) => updateFilters('minPrice', e.target.value)}
                                                className="block w-full rounded-md border-gray-300 py-2 pl-3 text-sm" // simplified styles
                                            />
                                            <span className="text-gray-500">-</span>
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                value={maxPrice}
                                                onChange={(e) => updateFilters('maxPrice', e.target.value)}
                                                className="block w-full rounded-md border-gray-300 py-2 pl-3 text-sm"
                                            />
                                        </div>
                                    </div>
                                </FilterSection>
                            </form>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-x-8 gap-y-10 pt-6 lg:grid-cols-4">
                    {/* Filters - Desktop */}
                    <form className="hidden lg:block">
                        <FilterSection title="Catégories">
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <input
                                        id="cat-all"
                                        name="category"
                                        type="radio"
                                        checked={!category}
                                        onChange={() => updateFilters('category', null)}
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="cat-all" className="ml-3 text-sm text-gray-600">
                                        Toutes
                                    </label>
                                </div>
                                {categories?.map((c: Category) => (
                                    <div key={c.id} className="flex items-center">
                                        <input
                                            id={`cat-${c.id}`}
                                            name="category"
                                            type="radio"
                                            checked={category === c.slug}
                                            onChange={() => updateFilters('category', c.slug)}
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor={`cat-${c.id}`} className="ml-3 text-sm text-gray-600">
                                            {c.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </FilterSection>

                        <FilterSection title="Prix">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span className="text-gray-500 sm:text-sm">€</span>
                                        </div>
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={minPrice}
                                            onChange={(e) => updateFilters('minPrice', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 pl-7 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <span className="text-gray-500">-</span>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span className="text-gray-500 sm:text-sm">€</span>
                                        </div>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={maxPrice}
                                            onChange={(e) => updateFilters('maxPrice', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 pl-7 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </FilterSection>
                    </form>

                    {/* Product Grid */}
                    <div className="lg:col-span-3">
                        {isLoading ? (
                            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-3">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="aspect-square rounded-xl bg-gray-200" />
                                        <div className="mt-4 h-4 w-3/4 rounded bg-gray-200" />
                                        <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
                                    </div>
                                ))}
                            </div>
                        ) : data?.data?.length > 0 ? (
                            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-3">
                                {data.data.map((product: ProductWithRelations) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <SlidersHorizontal className="mb-4 h-12 w-12 text-gray-300" />
                                <h3 className="text-lg font-medium text-gray-900">Aucun produit trouvé</h3>
                                <p className="mt-1 text-gray-500">Essayez de modifier vos filtres ou votre recherche.</p>
                                <Button
                                    variant="outline"
                                    className="mt-6"
                                    onClick={() => router.push('/products')}
                                >
                                    Effacer les filtres
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
