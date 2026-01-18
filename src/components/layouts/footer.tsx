import Link from 'next/link'
import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Mail,
    Phone,
    MapPin
} from 'lucide-react'
import { ROUTES } from '@/lib/utils/constants'

export function Footer() {
    const currentYear = new Date().getFullYear()

    const footerLinks = {
        shop: [
            { name: 'Nouveautés', href: '/products?sort=newest' },
            { name: 'Meilleures ventes', href: '/products?sort=bestsellers' },
            { name: 'Promotions', href: '/products?sale=true' },
            { name: 'Toutes les catégories', href: ROUTES.products },
        ],
        company: [
            { name: 'À propos', href: '/about' },
            { name: 'Carrières', href: '/careers' },
            { name: 'Presse', href: '/press' },
            { name: 'Blog', href: '/blog' },
        ],
        support: [
            { name: 'Centre d\'aide', href: '/help' },
            { name: 'Suivi de commande', href: '/track-order' },
            { name: 'Retours & remboursements', href: '/returns' },
            { name: 'Nous contacter', href: '/contact' },
        ],
        legal: [
            { name: 'Conditions générales', href: '/terms' },
            { name: 'Politique de confidentialité', href: '/privacy' },
            { name: 'Politique de cookies', href: '/cookies' },
            { name: 'Mentions légales', href: '/legal' },
        ],
    }

    const socialLinks = [
        { name: 'Facebook', href: 'https://facebook.com', icon: Facebook },
        { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
        { name: 'Instagram', href: 'https://instagram.com', icon: Instagram },
        { name: 'Youtube', href: 'https://youtube.com', icon: Youtube },
    ]

    return (
        <footer className="border-t border-gray-200 bg-gray-50">
            {/* Newsletter section */}
            <div className="border-b border-gray-200 bg-indigo-600">
                <div className="mx-auto max-w-7xl px-4 py-8">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="text-center md:text-left">
                            <h3 className="text-lg font-semibold text-white">
                                Inscrivez-vous à notre newsletter
                            </h3>
                            <p className="mt-1 text-sm text-indigo-100">
                                Recevez nos dernières offres et nouveautés en exclusivité
                            </p>
                        </div>
                        <form className="flex w-full max-w-md gap-2">
                            <input
                                type="email"
                                placeholder="Votre adresse email"
                                className="flex-1 rounded-lg border-0 px-4 py-2.5 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-white"
                                required
                            />
                            <button
                                type="submit"
                                className="rounded-lg bg-white px-6 py-2.5 font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                            >
                                S&apos;inscrire
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main footer */}
            <div className="mx-auto max-w-7xl px-4 py-12">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
                    {/* Brand column */}
                    <div className="col-span-2 md:col-span-4 lg:col-span-1">
                        <Link href={ROUTES.home} className="text-2xl font-bold text-indigo-600">
                            Arnaka
                        </Link>
                        <p className="mt-4 text-sm text-gray-600">
                            Votre marketplace de confiance pour tous vos achats.
                            Des millions de produits à portée de main.
                        </p>
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="h-4 w-4" />
                                <a href="mailto:contact@arnaka.com" className="hover:text-indigo-600">
                                    contact@arnaka.com
                                </a>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="h-4 w-4" />
                                <a href="tel:+33123456789" className="hover:text-indigo-600">
                                    +33 1 23 45 67 89
                                </a>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4" />
                                <span>Paris, France</span>
                            </div>
                        </div>
                    </div>

                    {/* Shop links */}
                    <div>
                        <h4 className="font-semibold text-gray-900">Boutique</h4>
                        <ul className="mt-4 space-y-2">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 hover:text-indigo-600"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company links */}
                    <div>
                        <h4 className="font-semibold text-gray-900">Entreprise</h4>
                        <ul className="mt-4 space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 hover:text-indigo-600"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support links */}
                    <div>
                        <h4 className="font-semibold text-gray-900">Support</h4>
                        <ul className="mt-4 space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 hover:text-indigo-600"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal links */}
                    <div>
                        <h4 className="font-semibold text-gray-900">Légal</h4>
                        <ul className="mt-4 space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 hover:text-indigo-600"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-200">
                <div className="mx-auto max-w-7xl px-4 py-6">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-sm text-gray-500">
                            © {currentYear} Arnaka. Tous droits réservés.
                        </p>
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                                    aria-label={social.name}
                                >
                                    <social.icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                        <div className="flex items-center gap-4">
                            <img src="/images/payment/visa.svg" alt="Visa" className="h-6" />
                            <img src="/images/payment/mastercard.svg" alt="Mastercard" className="h-6" />
                            <img src="/images/payment/paypal.svg" alt="PayPal" className="h-6" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
