'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations/auth'
import { Button, Input } from '@/components/ui'

export default function ResetPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(
        !token ? 'Lien de réinitialisation invalide ou manquant' : null
    )

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            token: token || '',
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (data: ResetPasswordInput) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error('Une erreur est survenue')
            }

            router.push('/login?reset=success')
        } catch {
            setError('Impossible de réinitialiser le mot de passe. Le lien est peut-être expiré.')
        } finally {
            setIsLoading(false)
        }
    }

    if (!token) {
        return (
            <div className="text-center">
                <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Lien invalide</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Le lien de réinitialisation est invalide ou a expiré.
                </p>
                <div className="mt-8">
                    <Link href="/forgot-password">
                        <Button variant="primary" className="w-full">
                            Demander un nouveau lien
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Réinitialiser le mot de passe</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Entrez votre nouveau mot de passe ci-dessous.
                </p>
            </div>

            {error && (
                <div className="mt-6 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                <input type="hidden" {...register('token')} />

                <Input
                    label="Nouveau mot de passe"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    leftIcon={<Lock className="h-5 w-5" />}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-gray-600"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    }
                    error={errors.password?.message}
                    {...register('password')}
                />

                <Input
                    label="Confirmer le mot de passe"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    leftIcon={<Lock className="h-5 w-5" />}
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                />

                <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    isLoading={isLoading}
                >
                    Modifier le mot de passe
                </Button>
            </form>
        </>
    )
}
