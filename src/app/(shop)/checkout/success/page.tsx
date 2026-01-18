'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { CheckCircle } from 'lucide-react'

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
            <div className="mb-6 rounded-full bg-green-100 p-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Commande confirmée !</h1>
            <p className="mt-4 text-lg text-gray-600">
                Merci pour votre achat. Votre commande #{orderId ? orderId.slice(-6) : ''} a bien été enregistrée.
            </p>
            <p className="mt-2 text-gray-500">
                Vous recevrez bientôt un email de confirmation.
            </p>
            <div className="mt-8 flex gap-4">
                <Link href="/products">
                    <Button variant="outline">Continuer mes achats</Button>
                </Link>
                <Link href="/account/orders">
                    <Button>Mes commandes</Button>
                </Link>
            </div>
        </div>
    )
}
