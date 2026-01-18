import { Header } from '@/components/layouts/header'
import { Footer } from '@/components/layouts/footer'

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // TODO: Get cart items count and user from session
    const cartItemsCount = 0
    const user = null

    return (
        <div className="flex min-h-screen flex-col">
            <Header cartItemsCount={cartItemsCount} user={user} />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    )
}
