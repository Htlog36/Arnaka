/**
 * Application-wide constants
 */

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 12
export const MAX_PAGE_SIZE = 100

// Image dimensions
export const PRODUCT_IMAGE_SIZES = {
    thumbnail: { width: 150, height: 150 },
    small: { width: 300, height: 300 },
    medium: { width: 600, height: 600 },
    large: { width: 1200, height: 1200 },
} as const

// Order statuses with labels
export const ORDER_STATUS_LABELS = {
    PENDING: 'En attente',
    CONFIRMED: 'Confirmée',
    PROCESSING: 'En préparation',
    SHIPPED: 'Expédiée',
    DELIVERED: 'Livrée',
    CANCELLED: 'Annulée',
    REFUNDED: 'Remboursée',
} as const

export const PAYMENT_STATUS_LABELS = {
    PENDING: 'En attente',
    PAID: 'Payé',
    FAILED: 'Échoué',
    REFUNDED: 'Remboursé',
    PARTIALLY_REFUNDED: 'Partiellement remboursé',
} as const

// User roles
export const USER_ROLE_LABELS = {
    BUYER: 'Acheteur',
    SELLER: 'Vendeur',
    ADMIN: 'Administrateur',
} as const

// Rating range
export const MIN_RATING = 1
export const MAX_RATING = 5

// Free shipping threshold (in euros)
export const FREE_SHIPPING_THRESHOLD = 50

// Tax rate
export const TAX_RATE = 0.20 // 20% TVA

// Session duration in days
export const SESSION_MAX_AGE = 30

// Minimum password length
export const MIN_PASSWORD_LENGTH = 8

// Maximum file upload size (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024

// Allowed image types
export const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
] as const

// Route paths
export const ROUTES = {
    home: '/',
    products: '/products',
    product: (slug: string) => `/products/${slug}`,
    cart: '/cart',
    checkout: '/checkout',
    orders: '/orders',
    order: (id: string) => `/orders/${id}`,
    account: '/account',
    login: '/login',
    register: '/register',
    seller: {
        dashboard: '/seller/dashboard',
        products: '/seller/products',
        orders: '/seller/orders',
        settings: '/seller/settings',
    },
    admin: {
        dashboard: '/admin/dashboard',
        users: '/admin/users',
        products: '/admin/products',
        orders: '/admin/orders',
        categories: '/admin/categories',
        settings: '/admin/settings',
    },
} as const

// API routes
export const API_ROUTES = {
    products: '/api/products',
    categories: '/api/categories',
    cart: '/api/cart',
    orders: '/api/orders',
    checkout: '/api/checkout',
    auth: '/api/auth',
} as const
