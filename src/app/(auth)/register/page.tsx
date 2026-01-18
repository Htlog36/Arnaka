'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, Check } from 'lucide-react'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import { Button, Input } from '@/components/ui'
import { ROUTES } from '@/lib/utils/constants'

export default function RegisterPage() {
    const router = useRouter()

    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const password = watch('password')

    // Password strength indicators
    const passwordChecks = [
        {
            label: 'Au moins 8 caractères',
            valid: password?.length >= 8,
        },
        {
            label: 'Une lettre majuscule',
            valid: /[A-Z]/.test(password || ''),
        },
        {
            label: 'Une lettre minuscule',
            valid: /[a-z]/.test(password || ''),
        },
        {
            label: 'Un chiffre',
            valid: /\d/.test(password || ''),
        },
    ]

    const onSubmit = async (data: RegisterInput) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                setError(result.error || 'Erreur lors de l\'inscription')
                return
            }

            // Auto sign in after registration
            const signInResult = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            })

            if (signInResult?.error) {
                router.push(ROUTES.login)
            } else {
                router.push(ROUTES.home)
                router.refresh()
            }
        } catch {
            setError('Une erreur est survenue. Veuillez réessayer.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setIsLoading(true)
        try {
            await signIn('google', { callbackUrl: ROUTES.home })
        } catch {
            setError('Erreur lors de la connexion avec Google')
            setIsLoading(false)
        }
    }

    return (
        <>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Vous avez déjà un compte ?{' '}
                    <Link
                        href={ROUTES.login}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Se connecter
                    </Link>
                </p>
            </div>

            {error && (
                <div className="mt-6 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                <Input
                    label="Nom complet"
                    type="text"
                    autoComplete="name"
                    placeholder="Jean Dupont"
                    leftIcon={<User className="h-5 w-5" />}
                    error={errors.name?.message}
                    {...register('name')}
                />

                <Input
                    label="Adresse email"
                    type="email"
                    autoComplete="email"
                    placeholder="vous@exemple.com"
                    leftIcon={<Mail className="h-5 w-5" />}
                    error={errors.email?.message}
                    {...register('email')}
                />

                <div>
                    <Input
                        label="Mot de passe"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
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

                    {/* Password strength indicators */}
                    <div className="mt-3 space-y-2">
                        {passwordChecks.map((check) => (
                            <div
                                key={check.label}
                                className={`flex items-center gap-2 text-sm ${check.valid ? 'text-green-600' : 'text-gray-400'
                                    }`}
                            >
                                {check.valid ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <div className="h-4 w-4 rounded-full border-2 border-current" />
                                )}
                                {check.label}
                            </div>
                        ))}
                    </div>
                </div>

                <Input
                    label="Confirmer le mot de passe"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    leftIcon={<Lock className="h-5 w-5" />}
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                />

                <div className="pt-2">
                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        isLoading={isLoading}
                    >
                        Créer mon compte
                    </Button>
                </div>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-4 text-gray-500">
                            Ou continuer avec
                        </span>
                    </div>
                </div>

                <div className="mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        size="lg"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                    >
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continuer avec Google
                    </Button>
                </div>

                <p className="mt-6 text-center text-xs text-gray-500">
                    En créant un compte, vous acceptez nos{' '}
                    <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
                        Conditions d&apos;utilisation
                    </Link>{' '}
                    et notre{' '}
                    <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
                        Politique de confidentialité
                    </Link>
                </p>
            </div>
        </>
    )
}
