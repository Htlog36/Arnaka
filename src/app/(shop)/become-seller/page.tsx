'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button, Input, Textarea, Card } from '@/components/ui'
import { registerSeller } from '@/lib/actions/seller'
import { Loader2, Store } from 'lucide-react'

export default function BecomeSellerPage() {
    const { data: session, update } = useSession()
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setError(null)
        const storeName = formData.get('storeName') as string
        const description = formData.get('description') as string

        if (!storeName || storeName.length < 3) {
            setError("Le nom de la boutique doit faire au moins 3 caractères.")
            return
        }

        startTransition(async () => {
            try {
                await registerSeller({ storeName, description })

                // Compel session update
                await update({ role: 'SELLER' })

                router.push('/dashboard')
                router.refresh()
            } catch (err: any) {
                console.error(err)
                setError(err.message || "Une erreur est survenue.")
            }
        })
    }

    if (!session) {
        return (
            <div className="container mx-auto max-w-md py-20 text-center">
                <h1 className="mb-4 text-2xl font-bold">Connexion requise</h1>
                <p className="mb-6 text-gray-600">Vous devez avoir un compte Arnaka pour devenir vendeur.</p>
                <Button onClick={() => router.push('/login?callbackUrl=/become-seller')}>
                    Se connecter
                </Button>
            </div>
        )
    }

    if (session.user.role === 'SELLER' || session.user.role === 'ADMIN') {
        return (
            <div className="container mx-auto max-w-md py-20 text-center">
                <Store className="mx-auto mb-4 h-16 w-16 text-indigo-600" />
                <h1 className="mb-4 text-2xl font-bold">Vous êtes déjà vendeur !</h1>
                <Button onClick={() => router.push('/dashboard')}>
                    Accéder au Tableau de bord
                </Button>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto max-w-2xl px-4">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Devenir Vendeur sur Arnaka</h1>
                    <p className="mt-2 text-gray-600">Créez votre boutique et commencez à vendre vos produits dès aujourd'hui.</p>
                </div>

                <Card className="p-8">
                    <form action={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                                Nom de la boutique
                            </label>
                            <Input
                                name="storeName"
                                id="storeName"
                                placeholder="Ma Super Boutique"
                                className="mt-1"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description (Optionnel)
                            </label>
                            <Textarea
                                name="description"
                                id="description"
                                placeholder="Dites-nous en plus sur ce que vous vendez..."
                                className="mt-1"
                                rows={4}
                            />
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full py-6 text-lg" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Création de la boutique...
                                </>
                            ) : (
                                "Créer ma boutique"
                            )}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    )
}
