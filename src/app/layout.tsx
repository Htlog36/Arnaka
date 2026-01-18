import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "Arnaka - Marketplace B2C & B2B",
    template: "%s | Arnaka",
  },
  description:
    "Arnaka est votre marketplace de confiance pour vos achats en ligne. Des millions de produits disponibles pour particuliers et professionnels.",
  keywords: [
    "e-commerce",
    "marketplace",
    "acheter en ligne",
    "B2B",
    "B2C",
    "produits",
    "boutique en ligne",
  ],
  authors: [{ name: "Arnaka" }],
  creator: "Arnaka",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://arnaka.com",
    siteName: "Arnaka",
    title: "Arnaka - Marketplace B2C & B2B",
    description:
      "Arnaka est votre marketplace de confiance pour vos achats en ligne.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arnaka - Marketplace B2C & B2B",
    description:
      "Arnaka est votre marketplace de confiance pour vos achats en ligne.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

