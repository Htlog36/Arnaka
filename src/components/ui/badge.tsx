import * as React from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant
    size?: 'sm' | 'md'
}

const badgeVariants: Record<BadgeVariant, string> = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    outline: 'bg-transparent border border-gray-300 text-gray-700',
}

const badgeSizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', size = 'sm', ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={cn(
                    'inline-flex items-center font-medium rounded-full whitespace-nowrap',
                    badgeVariants[variant],
                    badgeSizes[size],
                    className
                )}
                {...props}
            />
        )
    }
)

Badge.displayName = 'Badge'

/**
 * Order status badge with automatic coloring
 */
export function OrderStatusBadge({
    status
}: {
    status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
}) {
    const statusConfig: Record<string, { variant: BadgeVariant; label: string }> = {
        PENDING: { variant: 'warning', label: 'En attente' },
        CONFIRMED: { variant: 'info', label: 'Confirmée' },
        PROCESSING: { variant: 'info', label: 'En préparation' },
        SHIPPED: { variant: 'info', label: 'Expédiée' },
        DELIVERED: { variant: 'success', label: 'Livrée' },
        CANCELLED: { variant: 'danger', label: 'Annulée' },
        REFUNDED: { variant: 'default', label: 'Remboursée' },
    }

    const config = statusConfig[status] || { variant: 'default' as BadgeVariant, label: status }

    return <Badge variant={config.variant}>{config.label}</Badge>
}

/**
 * Payment status badge with automatic coloring
 */
export function PaymentStatusBadge({
    status,
}: {
    status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED'
}) {
    const statusConfig: Record<string, { variant: BadgeVariant; label: string }> = {
        PENDING: { variant: 'warning', label: 'En attente' },
        PAID: { variant: 'success', label: 'Payé' },
        FAILED: { variant: 'danger', label: 'Échoué' },
        REFUNDED: { variant: 'default', label: 'Remboursé' },
        PARTIALLY_REFUNDED: { variant: 'warning', label: 'Part. remboursé' },
    }

    const config = statusConfig[status] || { variant: 'default' as BadgeVariant, label: status }

    return <Badge variant={config.variant}>{config.label}</Badge>
}

export default Badge
