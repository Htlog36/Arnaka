import Link from 'next/link'
import { ROUTES } from '@/lib/utils/constants'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen">
            {/* Left side - Form */}
            <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm">
                    <Link
                        href={ROUTES.home}
                        className="mb-8 block text-2xl font-bold text-indigo-600"
                    >
                        Arnaka
                    </Link>
                    {children}
                </div>
            </div>

            {/* Right side - Image */}
            <div className="relative hidden w-1/2 lg:block">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700">
                    <div className="absolute inset-0 bg-[url('/images/auth-pattern.svg')] opacity-10" />
                </div>
                <div className="relative flex h-full flex-col items-center justify-center px-12 text-center">
                    <h2 className="text-3xl font-bold text-white">
                        Bienvenue sur Arnaka
                    </h2>
                    <p className="mt-4 max-w-md text-lg text-indigo-100">
                        Rejoignez des millions d&apos;utilisateurs et découvrez
                        la marketplace qui révolutionne le commerce en ligne.
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-indigo-400 to-purple-400"
                                />
                            ))}
                        </div>
                        <p className="text-sm text-indigo-100">
                            <span className="font-semibold text-white">+50 000</span> vendeurs actifs
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
