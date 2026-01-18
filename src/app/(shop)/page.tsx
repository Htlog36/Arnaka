import Link from 'next/link'
import {
    ArrowRight,
    Truck,
    Shield,
    CreditCard,
    Headphones,
    Star
} from 'lucide-react'
import { Button } from '@/components/ui'
import { ROUTES } from '@/lib/utils/constants'

// Placeholder data - will be fetched from API
const featuredCategories = [
    {
        id: '1',
        name: 'Électronique',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
        productCount: 1250,
        slug: 'electronics',
    },
    {
        id: '2',
        name: 'Mode',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
        productCount: 3420,
        slug: 'fashion',
    },
    {
        id: '3',
        name: 'Maison & Déco',
        image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400',
        productCount: 890,
        slug: 'home',
    },
    {
        id: '4',
        name: 'Sports & Loisirs',
        image: 'https://images.unsplash.com/photo-1461896836934- voices?w=400',
        productCount: 654,
        slug: 'sports',
    },
]

const featuredProducts = [
    {
        id: '1',
        name: 'Casque Audio Premium',
        price: 299.99,
        comparePrice: 399.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        rating: 4.8,
        reviewCount: 245,
        slug: 'casque-audio-premium',
    },
    {
        id: '2',
        name: 'Montre Connectée Pro',
        price: 449.99,
        comparePrice: null,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        rating: 4.6,
        reviewCount: 189,
        slug: 'montre-connectee-pro',
    },
    {
        id: '3',
        name: 'Sac à Dos Voyage',
        price: 89.99,
        comparePrice: 129.99,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        rating: 4.9,
        reviewCount: 412,
        slug: 'sac-a-dos-voyage',
    },
    {
        id: '4',
        name: 'Lampe Design LED',
        price: 149.99,
        comparePrice: null,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
        rating: 4.7,
        reviewCount: 98,
        slug: 'lampe-design-led',
    },
]

const benefits = [
    {
        icon: Truck,
        title: 'Livraison Gratuite',
        description: 'Dès 50€ d\'achat en France métropolitaine',
    },
    {
        icon: Shield,
        title: 'Paiement Sécurisé',
        description: 'Transactions 100% sécurisées',
    },
    {
        icon: CreditCard,
        title: 'Paiement Flexible',
        description: 'Payez en 3x ou 4x sans frais',
    },
    {
        icon: Headphones,
        title: 'Support 24/7',
        description: 'Une équipe à votre écoute',
    },
]

export default function HomePage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">
                <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10" />
                <div className="container-page relative py-16 md:py-24 lg:py-32">
                    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                                Tout ce dont vous avez{' '}
                                <span className="text-yellow-300">besoin</span>, au meilleur prix
                            </h1>
                            <p className="mt-6 text-lg text-indigo-100 md:text-xl">
                                Découvrez des millions de produits provenant de vendeurs du monde entier.
                                Particuliers ou professionnels, trouvez tout sur Arnaka.
                            </p>
                            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                                <Link href={ROUTES.products}>
                                    <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 w-full sm:w-auto">
                                        Explorer les produits
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/seller">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                                    >
                                        Devenir vendeur
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-3xl" />
                                <img
                                    src="https://images.unsplash.com/photo-1557821552-17105176677c?w=600"
                                    alt="Shopping illustration"
                                    className="relative rounded-2xl shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Bar */}
            <section className="border-b border-gray-200 bg-white py-6">
                <div className="container-page">
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        {benefits.map((benefit) => (
                            <div key={benefit.title} className="flex items-center gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                                    <benefit.icon className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                                    <p className="text-sm text-gray-500">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="section-padding bg-gray-50">
                <div className="container-page">
                    <div className="flex items-end justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                                Catégories populaires
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Explorez nos catégories les plus demandées
                            </p>
                        </div>
                        <Link
                            href={ROUTES.products}
                            className="hidden items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 sm:flex"
                        >
                            Voir tout
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                        {featuredCategories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/products?category=${category.slug}`}
                                className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-lg"
                            >
                                <div className="aspect-square overflow-hidden">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="font-semibold text-white">{category.name}</h3>
                                    <p className="text-sm text-gray-200">
                                        {category.productCount.toLocaleString()} produits
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section-padding">
                <div className="container-page">
                    <div className="flex items-end justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                                Produits vedettes
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Nos meilleures sélections pour vous
                            </p>
                        </div>
                        <Link
                            href={ROUTES.products}
                            className="hidden items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 sm:flex"
                        >
                            Voir tout
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                        {featuredProducts.map((product) => (
                            <Link
                                key={product.id}
                                href={`/products/${product.slug}`}
                                className="group rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-lg"
                            >
                                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    {product.comparePrice && (
                                        <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
                                            -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                                        </span>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-indigo-600">
                                        {product.name}
                                    </h3>
                                    <div className="mt-1 flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-medium text-gray-900">
                                            {product.rating}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            ({product.reviewCount})
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-lg font-bold text-gray-900">
                                            {product.price.toFixed(2)} €
                                        </span>
                                        {product.comparePrice && (
                                            <span className="text-sm text-gray-500 line-through">
                                                {product.comparePrice.toFixed(2)} €
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* B2B Section */}
            <section className="section-padding bg-gray-900">
                <div className="container-page">
                    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
                        <div>
                            <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-400">
                                Pour les professionnels
                            </span>
                            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
                                Arnaka Business
                            </h2>
                            <p className="mt-4 text-lg text-gray-300">
                                Accédez à des prix de gros, des conditions de paiement flexibles,
                                et un service dédié pour votre entreprise.
                            </p>
                            <ul className="mt-6 space-y-3">
                                {[
                                    'Prix dégressifs selon les volumes',
                                    'Facturation entreprise avec TVA',
                                    'Délais de paiement étendus',
                                    'Account manager dédié',
                                ].map((feature) => (
                                    <li key={feature} className="flex items-center gap-2 text-gray-300">
                                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8">
                                <Link href="/business">
                                    <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                                        En savoir plus
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-indigo-500/20 rounded-3xl blur-3xl" />
                            <img
                                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600"
                                alt="Business meeting"
                                className="relative rounded-2xl shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding bg-indigo-600">
                <div className="container-page text-center">
                    <h2 className="text-3xl font-bold text-white md:text-4xl">
                        Prêt à commencer ?
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-100">
                        Rejoignez des milliers de clients satisfaits et découvrez
                        pourquoi Arnaka est la marketplace de référence.
                    </p>
                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Link href={ROUTES.register}>
                            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 w-full sm:w-auto">
                                Créer un compte gratuit
                            </Button>
                        </Link>
                        <Link href={ROUTES.products}>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                            >
                                Parcourir les produits
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
