import type { User, UserRole, Seller, Product, Category, Order, OrderStatus, PaymentStatus } from '@prisma/client'

// Re-export Prisma types
export type { User, UserRole, Seller, Product, Category, Order, OrderStatus, PaymentStatus }

/**
 * User with optional relations
 */
export type UserWithRelations = User & {
    seller?: Seller | null
}

/**
 * Product with all relations
 */
export type ProductWithRelations = Product & {
    seller: Seller & { user: Pick<User, 'name' | 'image'> }
    category: Category
    images: {
        id: string
        url: string
        alt: string | null
        order: number
    }[]
    variants: {
        id: string
        name: string
        sku: string
        price: number | null
        stock: number
        attributes: Record<string, string> | null
    }[]
    reviews?: {
        id: string
        rating: number
        comment: string | null
    }[]
    _count?: {
        reviews: number
    }
    averageRating?: number
}

/**
 * Category with children
 */
export type CategoryWithChildren = Category & {
    children?: CategoryWithChildren[]
    parent?: Category | null
    _count?: {
        products: number
    }
}

/**
 * Cart item for display
 */
export interface CartItemDisplay {
    id: string
    productId: string
    productName: string
    productSlug: string
    productImage: string | null
    variantId: string | null
    variantName: string | null
    price: number
    quantity: number
    stock: number
    sellerId: string
    sellerName: string
}

/**
 * Order with items
 */
export type OrderWithItems = Order & {
    items: {
        id: string
        productId: string
        productName: string
        variantName: string | null
        price: number
        quantity: number
        sellerId: string
    }[]
    user: Pick<User, 'id' | 'name' | 'email'>
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
    data: T[]
    meta: PaginationMeta
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

/**
 * Shipping method option
 */
export interface ShippingMethod {
    id: string
    name: string
    description: string
    price: number
    estimatedDays: string
}

/**
 * Checkout session data
 */
export interface CheckoutSession {
    shippingAddress: {
        firstName: string
        lastName: string
        company?: string
        address1: string
        address2?: string
        city: string
        state?: string
        postalCode: string
        country: string
        phone?: string
    }
    billingAddress?: {
        firstName: string
        lastName: string
        company?: string
        address1: string
        address2?: string
        city: string
        state?: string
        postalCode: string
        country: string
        phone?: string
    }
    shippingMethod: ShippingMethod
    items: CartItemDisplay[]
    subtotal: number
    shippingCost: number
    taxAmount: number
    total: number
}

/**
 * Dashboard stats
 */
export interface DashboardStats {
    totalOrders: number
    totalRevenue: number
    totalProducts: number
    totalCustomers: number
    recentOrders: OrderWithItems[]
    topProducts: {
        id: string
        name: string
        totalSold: number
        revenue: number
    }[]
}

/**
 * Seller dashboard stats
 */
export interface SellerDashboardStats {
    totalOrders: number
    totalRevenue: number
    totalProducts: number
    pendingOrders: number
    rating: number | null
    recentOrders: OrderWithItems[]
}
