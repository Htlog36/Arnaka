'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store/use-cart'
import { CartItemDisplay, ProductWithRelations } from '@/types'
// Actually usage of toast is good for feedback. I'll mock simple alert or use console for now if sonner not here.
// Or better: Implement a simple toast context later. For now, just console or built-in alert? 
// The user approved "Foundations", usually implies a toast system. 
// I'll skip toast for this file to match existing style, or assume a Toaster provider exists?
// Step 484 lint said "Cannot find module sonner". So I shouldn't import it.

interface AddToCartProps {
    product: ProductWithRelations
    selectedVariantId?: string | null
    disabled?: boolean
}

export function AddToCart({ product, selectedVariantId, disabled }: AddToCartProps) {
    const [quantity, setQuantity] = useState(1)
    const addItem = useCartStore((state) => state.addItem)
    const [isPending, startTransition] = useTransition()
    const [isSuccess, setIsSuccess] = useState(false)

    // Find selected variant for checking stock and price
    const selectedVariant = selectedVariantId
        ? product.variants.find(v => v.id === selectedVariantId)
        : null

    const stock = selectedVariant ? selectedVariant.stock : product.stock
    const price = selectedVariant && selectedVariant.price ? selectedVariant.price : product.price
    const maxQuantity = stock

    const handleAddToCart = () => {
        if (!stock || quantity > stock) return

        const item: CartItemDisplay = {
            id: `temp-${Date.now()}`, // Temporary ID for collision check in store
            productId: product.id,
            productName: product.name,
            productSlug: product.slug,
            productImage: product.images[0]?.url || null,
            variantId: selectedVariantId || null,
            variantName: selectedVariant?.name || null,
            price: price,
            quantity: quantity,
            stock: stock
        }

        startTransition(async () => {
            await addItem(item)
            setIsSuccess(true)
            setTimeout(() => setIsSuccess(false), 2000)
            // Open cart sheet? (Global state for sheet open/close?)
            // Usually nice to open cart.
        })
    }

    if (stock === 0) {
        return (
            <Button disabled variant="outline" className="w-full">
                Rupture de stock
            </Button>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-4">
                <div className="flex items-center rounded-md border border-gray-200">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1 || disabled}
                        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                    <button
                        onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                        disabled={quantity >= maxQuantity || disabled}
                        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <Button
                onClick={handleAddToCart}
                disabled={disabled || isPending || stock === 0}
                className="w-full py-6 text-lg"
            >
                {isSuccess ? (
                    'Ajouté !'
                ) : (
                    <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Ajouter au panier
                    </>
                )}
            </Button>

            {stock < 10 && stock > 0 && (
                <p className="text-sm text-red-600">Plus que {stock} en stock !</p>
            )}
        </div>
    )
}
