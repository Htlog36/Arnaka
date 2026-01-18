import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Card container component
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'bordered' | 'elevated'
    padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
        const variants = {
            default: 'bg-white border border-gray-200',
            bordered: 'bg-white border-2 border-gray-300',
            elevated: 'bg-white shadow-lg border-0',
        }

        const paddings = {
            none: '',
            sm: 'p-4',
            md: 'p-6',
            lg: 'p-8',
        }

        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-xl',
                    variants[variant],
                    paddings[padding],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)

Card.displayName = 'Card'

/**
 * Card header component
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string
    description?: string
    action?: React.ReactNode
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, title, description, action, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn('flex items-start justify-between gap-4', className)}
                {...props}
            >
                <div className="space-y-1">
                    {title && (
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    )}
                    {description && (
                        <p className="text-sm text-gray-500">{description}</p>
                    )}
                    {children}
                </div>
                {action && <div className="shrink-0">{action}</div>}
            </div>
        )
    }
)

CardHeader.displayName = 'CardHeader'

/**
 * Card content component
 */
export const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('mt-4', className)} {...props} />
})

CardContent.displayName = 'CardContent'

/**
 * Card footer component
 */
export const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                'mt-6 flex items-center gap-3 border-t border-gray-100 pt-4',
                className
            )}
            {...props}
        />
    )
})

CardFooter.displayName = 'CardFooter'

export default Card
