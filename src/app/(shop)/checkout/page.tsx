'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/use-cart'
import { Button, Input } from '@/components/ui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutSchema, CheckoutInput } from '@/lib/validations/order'
import { useHasMounted } from '@/lib/hooks/use-has-mounted'
import { formatPrice } from '@/lib/utils/formatters'
import { Loader2 } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Simple Address Form Component
function AddressForm({ register, errors, prefix = 'shippingAddress' }: { register: any, errors: any, prefix?: string }) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
                <label className="text-sm font-medium text-gray-700">Prénom</label>
                <Input {...register(`${prefix}.firstName`)} className="mt-1" />
                {errors[prefix]?.firstName && <p className="text-xs text-red-500">{errors[prefix].firstName.message}</p>}
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700">Nom</label>
                <Input {...register(`${prefix}.lastName`)} className="mt-1" />
                {errors[prefix]?.lastName && <p className="text-xs text-red-500">{errors[prefix].lastName.message}</p>}
            </div>
            <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Adresse</label>
                <Input {...register(`${prefix}.address1`)} className="mt-1" placeholder="123 Rue de Exemple" />
                {errors[prefix]?.address1 && <p className="text-xs text-red-500">{errors[prefix].address1.message}</p>}
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700">Ville</label>
                <Input {...register(`${prefix}.city`)} className="mt-1" />
                {errors[prefix]?.city && <p className="text-xs text-red-500">{errors[prefix].city.message}</p>}
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700">Code Postal</label>
                <Input {...register(`${prefix}.postalCode`)} className="mt-1" />
                {errors[prefix]?.postalCode && <p className="text-xs text-red-500">{errors[prefix].postalCode.message}</p>}
            </div>
            <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Pays</label>
                <Input {...register(`${prefix}.country`)} defaultValue="France" className="mt-1" />
                {errors[prefix]?.country && <p className="text-xs text-red-500">{errors[prefix].country.message}</p>}
            </div>
        </div>
    )
}

function CheckoutForm({ total, onSuccess }: { total: number, onSuccess: (paymentIntentId: string) => void }) {
    const stripe = useStripe()
    const elements = useElements()
    const [message, setMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!stripe || !elements) {
            return
        }

        setIsLoading(true)

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
        })

        if (error) {
            setMessage(error.message ?? 'Une erreur est survenue.')
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            onSuccess(paymentIntent.id)
        } else {
            setMessage('Statut de paiement inattendu.')
        }

        setIsLoading(false)
    }

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            {message && <div className="mt-4 text-sm text-red-600">{message}</div>}
            <Button
                disabled={isLoading || !stripe || !elements}
                className="mt-6 w-full py-6 text-lg"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Traitement...
                    </>
                ) : (
                    `Payer ${formatPrice(total)}`
                )}
            </Button>
        </form>
    )
}

export default function CheckoutPage() {
    const hasMounted = useHasMounted()
    const { items, clearCart } = useCartStore()
    const router = useRouter()
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [orderData, setOrderData] = useState<CheckoutInput | null>(null)
    const [isAddressValid, setIsAddressValid] = useState(false)

    const form = useForm<CheckoutInput>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            useSameAddress: true,
            shippingMethod: 'standard',
            shippingAddress: { country: 'France' }
        }
    })

    const { register, handleSubmit, formState: { errors } } = form

    // Fetch PaymentIntent when cart is ready
    useEffect(() => {
        if (items.length > 0) {
            fetch('/api/create-payment-intent', {
                method: 'POST',
            })
                .then(res => res.json())
                .then(data => {
                    if (data.clientSecret) {
                        setClientSecret(data.clientSecret)
                    } else {
                        console.error('Failed to init payment', data.error)
                    }
                })
                .catch(err => console.error(err))
        }
    }, [items.length])

    const onAddressSubmit = (data: CheckoutInput) => {
        setOrderData(data)
        setIsAddressValid(true)
    }

    const handlePaymentSuccess = async (paymentIntentId: string) => {
        if (!orderData) return

        try {
            // Create Order in DB
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...orderData,
                    paymentIntentId // Pass this if schema allows, currently ignored but good for logging if expanded
                })
            })

            if (!res.ok) throw new Error('Failed to create order')
            const result = await res.json()

            clearCart()
            router.push(`/checkout/success?orderId=${result.data.id}`)

        } catch (err) {
            console.error(err)
            alert('Paiement réussi mais échec création commande. Contactez le support.')
        }
    }

    if (!hasMounted) return null

    if (items.length === 0) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16 text-center">
                <h1 className="text-2xl font-bold">Votre panier est vide</h1>
                <Button className="mt-4" onClick={() => router.push('/products')}>
                    Retour aux produits
                </Button>
            </div>
        )
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal >= 50 ? 0 : 5.90
    const total = subtotal + shipping

    const appearance = {
        theme: 'stripe',
    } as const;
    const options = {
        clientSecret: clientSecret || undefined,
        appearance,
    };

    return (
        <div className="bg-gray-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="mb-8 text-3xl font-bold text-gray-900">Commander</h1>

                <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-2">
                    {/* Form */}
                    <div className="space-y-6">
                        {/* Address Section */}
                        <div className={`rounded-lg bg-white p-6 shadow-sm border border-gray-200 transition-opacity ${isAddressValid ? 'opacity-50 pointer-events-none' : ''}`}>
                            <h2 className="mb-4 text-xl font-semibold">1. Adresse de livraison</h2>
                            <form id="address-form" onSubmit={handleSubmit(onAddressSubmit)} className="space-y-6">
                                <AddressForm register={register} errors={errors} />
                                <div>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            {...register('useSameAddress')}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700">L&apos;adresse de facturation est identique</span>
                                    </label>
                                </div>
                                <input type="hidden" {...register('shippingMethod')} value="standard" />

                                {!isAddressValid && (
                                    <Button type="submit" className="w-full py-4 text-lg">
                                        Continuer vers le paiement
                                    </Button>
                                )}
                            </form>
                        </div>

                        {/* Payment Section */}
                        {isAddressValid && (
                            <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 animate-in fade-in slide-in-from-bottom-4">
                                <h2 className="mb-4 text-xl font-semibold">2. Paiement</h2>
                                {clientSecret ? (
                                    <Elements options={options} stripe={stripePromise}>
                                        <CheckoutForm total={total} onSuccess={handlePaymentSuccess} />
                                    </Elements>
                                ) : (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                    </div>
                                )}
                                <Button variant="link" className="mt-4 w-full text-sm text-gray-500" onClick={() => setIsAddressValid(false)}>
                                    Modifier l&apos;adresse
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Summary */}
                    <div>
                        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 sticky top-24">
                            <h2 className="mb-4 text-xl font-semibold">Récapitulatif</h2>
                            <ul className="divide-y divide-gray-200">
                                {items.map(item => (
                                    <li key={item.id} className="flex py-4">
                                        <div className="flex-1">
                                            <h3 className="font-medium">{item.productName}</h3>
                                            <p className="text-sm text-gray-500">{item.variantName}</p>
                                            <p className="text-sm text-gray-500">Qté: {item.quantity}</p>
                                        </div>
                                        <div className="font-medium">
                                            {formatPrice(item.price * item.quantity)}
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <dl className="mt-6 space-y-4 border-t border-gray-200 pt-6 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Sous-total</dt>
                                    <dd className="font-medium text-gray-900">{formatPrice(subtotal)}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Livraison</dt>
                                    <dd className="font-medium text-gray-900">{shipping === 0 ? 'Gratuite' : formatPrice(shipping)}</dd>
                                </div>
                                <div className="flex justify-between border-t border-gray-200 pt-4 text-base font-bold">
                                    <dt className="text-gray-900">Total</dt>
                                    <dd className="text-indigo-600">{formatPrice(total)}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
