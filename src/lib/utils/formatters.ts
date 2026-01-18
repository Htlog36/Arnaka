/**
 * Format a number as currency
 */
export function formatCurrency(
    amount: number,
    currency: string = 'EUR',
    locale: string = 'fr-FR'
): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(amount)
}

export const formatPrice = formatCurrency


/**
 * Format a date to a readable string
 */
export function formatDate(
    date: Date | string,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    },
    locale: string = 'fr-FR'
): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat(locale, options).format(d)
}

/**
 * Format a date with time
 */
export function formatDateTime(
    date: Date | string,
    locale: string = 'fr-FR'
): string {
    return formatDate(
        date,
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        },
        locale
    )
}

/**
 * Format a relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

    const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' })

    if (diffInSeconds < 60) {
        return rtf.format(-diffInSeconds, 'second')
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
        return rtf.format(-diffInMinutes, 'minute')
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
        return rtf.format(-diffInHours, 'hour')
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) {
        return rtf.format(-diffInDays, 'day')
    }

    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) {
        return rtf.format(-diffInMonths, 'month')
    }

    const diffInYears = Math.floor(diffInMonths / 12)
    return rtf.format(-diffInYears, 'year')
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
    if (text.length <= length) return text
    return text.slice(0, length).trim() + '...'
}

/**
 * Generate a random order number
 */
export function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `ARN-${timestamp}-${random}`
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(
    originalPrice: number,
    salePrice: number
): number {
    if (originalPrice <= 0) return 0
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

/**
 * Convert cents to currency amount
 */
export function centsToAmount(cents: number): number {
    return cents / 100
}

/**
 * Convert currency amount to cents
 */
export function amountToCents(amount: number): number {
    return Math.round(amount * 100)
}
