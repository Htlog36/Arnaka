'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/lib/store/use-cart'
import { Button } from '@/components/ui'
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react'
import { useHasMounted } from '@/lib/hooks/use-has-mounted'
import { formatPrice } from '@/lib/utils/formatters'
import Link from 'next/link'
import Image from 'next/image'

interface CartSheetProps {
    isOpen: boolean
    onClose: () => void
}

export function CartSheet({ isOpen, onClose }: CartSheetProps) {
    const hasMounted = useHasMounted()
    const { items, removeItem, updateQuantity } = useCartStore()

    // Prevent scrolling when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen])

    // Retrieve hydration if strictly needed, but useHasMounted is safer barrier.
    // ensure useEffect calls rehydrate?
    useEffect(() => {
        useCartStore.persist.rehydrate()
    }, [])

    if (!hasMounted) return null

    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sheet */}
            <div
                className={`fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <h2 className="text-lg font-semibold text-gray-900">Mon Panier ({items.length})</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-500">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                    {items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                            <ShoppingBag className="h-16 w-16 text-gray-300" />
                            <p className="text-lg font-medium text-gray-900">Votre panier est vide</p>
                            <p className="text-sm text-gray-500">Découvrez nos produits et commencez vos achats.</p>
                            <Button onClick={onClose} variant="secondary" className="mt-4">
                                Continuer mes achats
                            </Button>
                        </div>
                    ) : (
                        <ul className="space-y-6">
                            {items.map((item) => (
                                <li key={`${item.productId}-${item.variantId || 'base'}`} className="flex py-2">
                                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                        {item.productImage ? (
                                            <Image
                                                src={item.productImage}
                                                alt={item.productName}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">No img</div>
                                        )}
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                        <div>
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <h3 className="line-clamp-1">
                                                    <Link href={`/products/${item.productSlug}`} onClick={onClose}>
                                                        {item.productName}
                                                    </Link>
                                                </h3>
                                                <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
                                            </div>
                                            {item.variantName && (
                                                <p className="mt-1 text-sm text-gray-500">{item.variantName}</p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-400">Vendu par {item.sellerName || 'Vendeur'}</p>
                                        </div>
                                        <div className="flex flex-1 items-end justify-between text-sm">
                                            <div className="flex items-center rounded border border-gray-200">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="p-1 text-gray-500 hover:text-gray-700"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                                                    className="p-1 text-gray-500 hover:text-gray-700"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="font-medium text-red-600 hover:text-red-500"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-gray-200 p-4">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                            <p>Sous-total</p>
                            <p>{formatPrice(subtotal)}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">Frais de port et taxes calculés à l&apos;étape suivante.</p>
                        <div className="mt-6">
                            <Link
                                href="/checkout"
                                onClick={onClose}
                            >
                                <Button className="w-full py-6 text-lg">
                                    Commander
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
