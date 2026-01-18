'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations/auth'
import { Button, Input } from '@/components/ui'
import { ROUTES } from '@/lib/utils/constants'

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    })

    const onSubmit = async (data: ForgotPasswordInput) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error('Une erreur est survenue')
            }

            setIsSuccess(true)
        } catch {
            setError('Impossible d\'envoyer l\'email. Veuillez réessayer.')
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="text-center">
                <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Email envoyé !</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Si un compte existe avec cette adresse email, vous recevrez un lien pour réinitialiser votre mot de passe.
                </p>
                <div className="mt-8">
                    <Link href={ROUTES.login}>
                        <Button variant="outline" className="w-full">
                            Retour à la connexion
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <>
            <div>
                <Link
                    href={ROUTES.login}
                    className="mb-6 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour à la connexion
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Mot de passe oublié ?</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
            </div>

            {error && (
                <div className="mt-6 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                <Input
                    label="Adresse email"
                    type="email"
                    autoComplete="email"
                    placeholder="vous@exemple.com"
                    leftIcon={<Mail className="h-5 w-5" />}
                    error={errors.email?.message}
                    {...register('email')}
                />

                <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    isLoading={isLoading}
                >
                    Envoyer le lien
                </Button>
            </form>
        </>
    )
}
