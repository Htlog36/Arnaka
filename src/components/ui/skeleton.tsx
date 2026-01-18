import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'circular' | 'rectangular'
    width?: string | number
    height?: string | number
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
    ({ className, variant = 'default', width, height, style, ...props }, ref) => {
        const variants = {
            default: 'rounded-md',
            circular: 'rounded-full',
            rectangular: 'rounded-none',
        }

        return (
            <div
                ref={ref}
                className={cn(
                    'animate-pulse bg-gray-200',
                    variants[variant],
                    className
                )}
                style={{
                    width: width,
                    height: height,
                    ...style,
                }}
                {...props}
            />
        )
    }
)

Skeleton.displayName = 'Skeleton'

/**
 * Skeleton for product cards
 */
export function ProductCardSkeleton() {
    return (
        <div className="space-y-3">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-5 w-1/3" />
            </div>
        </div>
    )
}

/**
 * Skeleton for text lines
 */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className="h-4"
                    style={{ width: `${100 - i * 10}%` }}
                />
            ))}
        </div>
    )
}

/**
 * Skeleton for table rows
 */
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
    return (
        <tr>
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <Skeleton className="h-4 w-full" />
                </td>
            ))}
        </tr>
    )
}

export default Skeleton
