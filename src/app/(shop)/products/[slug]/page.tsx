'use client'

import {
    useState
} from 'react'
import { useQuery } from '@tanstack/react-query'
import {
    Star,
    Heart,
    Share2,
    Truck,
    ShieldCheck,
    RotateCcw
} from 'lucide-react'
import { Button } from '@/components/ui'
import { formatPrice } from '@/lib/utils/formatters'
import type { ProductWithRelations } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { AddToCart } from '@/components/product/add-to-cart'

export default function ProductDetailPage({
    params: paramsPromise
}: {
    params: Promise<{ slug: string }>
}) {
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null)

    // Unwrap params using React.use() or async handling in client component?
    // In Next.js client component, we receive promise.
    // Actually, standard way in client component is to just use use() hook or unwrap.
    // BUT: for simplicity in client component, we can use a wrapper or just useQuery dependent on it.
    // Let's use standard handling.

    // Note: Client components receive params as Promise in Next 15.
    // We can use `use` hook from React.
    // ensure we handle the loading state.

    const [slug, setSlug] = useState<string | null>(null)

    // Use an effect to unwrap params
    useState(() => {
        paramsPromise.then(p => setSlug(p.slug))
    })

    // Fetch product
    const { data: product, isLoading, isError } = useQuery({
        queryKey: ['product', slug],
        queryFn: async () => {
            if (!slug) return null
            const res = await fetch(`/api/products/${slug}`)
            if (!res.ok) throw new Error('Failed to fetch product')
            return res.json() as Promise<ProductWithRelations>
        },
        enabled: !!slug,
    })

    if (isLoading || !slug) {
        return (
            <div className="container-page py-12">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    <div className="aspect-square animate-pulse rounded-xl bg-gray-200" />
                    <div className="space-y-4">
                        <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
                        <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
                        <div className="h-32 w-full animate-pulse rounded bg-gray-200" />
                    </div>
                </div>
            </div>
        )
    }

    if (isError || !product) {
        return (
            <div className="container-page flex flex-col items-center justify-center py-20 text-center">
                <h1 className="text-2xl font-bold text-gray-900">Produit introuvable</h1>
                <p className="mt-2 text-gray-500">Le produit que vous cherchez n&apos;existe pas ou a été supprimé.</p>
                <Link href="/products" className="mt-6">
                    <Button>Retour aux produits</Button>
                </Link>
            </div>
        )
    }

    const currentPrice = selectedVariant
        ? product.variants.find((v: { id: string, price: number | null }) => v.id === selectedVariant)?.price || product.price
        : product.price

    const hasVariants = product.variants.length > 0

    // Group variants by attributes if possible, simplified here to flat list for MVP
    // Ideally: Size -> [S, M, L], Color -> [Red, Blue]
    // Current seed data has flat variants strings in name.

    return (
        <div className="bg-white pb-20 pt-8">
            {/* Breadcrumb */}
            <div className="container-page mb-8">
                <nav className="flex items-center text-sm text-gray-500">
                    <Link href="/products" className="hover:text-indigo-600">Produits</Link>
                    <span className="mx-2">/</span>
                    <Link href={`/products?category=${product.category.slug}`} className="hover:text-indigo-600">
                        {product.category.name}
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="truncate font-medium text-gray-900">{product.name}</span>
                </nav>
            </div>

            <div className="container-page">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative overflow-hidden rounded-2xl bg-gray-100">
                            <div className="aspect-square relative">
                                <Image
                                    src={product.images[selectedImage]?.url || '/placeholder.jpg'}
                                    alt={product.images[selectedImage]?.alt || product.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((img: { id: string, url: string, alt: string | null }, idx: number) => (
                                <button
                                    key={img.id}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`relative aspect-square overflow-hidden rounded-lg bg-gray-100 ring-2 ring-offset-2 transition-all ${idx === selectedImage ? 'ring-indigo-600' : 'ring-transparent hover:ring-gray-300'
                                        }`}
                                >
                                    <Image
                                        src={img.url}
                                        alt={img.alt || ''}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div>
                        <div className="mb-6 border-b border-gray-200 pb-6">
                            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                            <div className="mt-2 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Link href={`/seller/${product.seller.slug || product.seller.id}`} className="text-sm font-medium text-indigo-600 hover:underline">
                                        Vendu par {product.seller.storeName || "Vendeur Certifié"}
                                    </Link>
                                    {product.averageRating && (
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-medium text-gray-900">
                                                {product.averageRating.toFixed(1)}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                ({product._count?.reviews || 0} avis)
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-gray-900">
                                    {formatPrice(currentPrice)}
                                </span>
                                {product.comparePrice && (
                                    <span className="text-lg text-gray-500 line-through">
                                        {formatPrice(product.comparePrice)}
                                    </span>
                                )}
                            </div>
                            {/* Variant Selector - Simplified for MVP */}
                            {hasVariants && (
                                <div className="mt-6">
                                    <label className="text-sm font-medium text-gray-900">Variantes</label>
                                    <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                        {product.variants.map((variant: { id: string, name: string }) => (
                                            <button
                                                key={variant.id}
                                                onClick={() => setSelectedVariant(variant.id)}
                                                className={`flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-all ${selectedVariant === variant.id
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600 ring-1 ring-indigo-600'
                                                    : 'border-gray-200 text-gray-900 hover:border-gray-300'
                                                    }`}
                                            >
                                                {variant.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8">
                            <AddToCart
                                product={product}
                                selectedVariantId={selectedVariant}
                                disabled={product.stock === 0}
                            />
                        </div>

                        <div className="mt-8 border-t border-gray-200 pt-8">
                            <div className="flex gap-4">
                                <Button size="lg" variant="outline" className="px-3">
                                    <Heart className="h-5 w-5" />
                                </Button>
                                <Button size="lg" variant="outline" className="px-3">
                                    <Share2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Features / Benefits */}
                        <div className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <Truck className="h-6 w-6 text-indigo-600" />
                                <div>
                                    <h4 className="font-medium text-gray-900">Livraison Rapide</h4>
                                    <p className="text-sm text-gray-500">Expédié sous 24/48h</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="h-6 w-6 text-indigo-600" />
                                <div>
                                    <h4 className="font-medium text-gray-900">Garantie 2 ans</h4>
                                    <p className="text-sm text-gray-500">Protection acheteur incluse</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <RotateCcw className="h-6 w-6 text-indigo-600" />
                                <div>
                                    <h4 className="font-medium text-gray-900">Retours Gratuits</h4>
                                    <p className="text-sm text-gray-500">30 jours pour changer d&apos;avis</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="pt-6">
                            <h3 className="text-lg font-bold text-gray-900">Description</h3>
                            <div className="mt-4 prose prose-sm text-gray-600">
                                <p>{product.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
