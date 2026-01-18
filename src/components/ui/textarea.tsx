import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
    helperText?: string
    containerClassName?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            className,
            containerClassName,
            label,
            error,
            helperText,
            id,
            ...props
        },
        ref
    ) => {
        const textareaId = id || React.useId()

        return (
            <div className={cn('w-full', containerClassName)}>
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    id={textareaId}
                    ref={ref}
                    className={cn(
                        'block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5',
                        'text-gray-900 placeholder:text-gray-400',
                        'transition-colors duration-200',
                        'focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
                        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
                        'resize-none',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                        className
                    )}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={
                        error
                            ? `${textareaId}-error`
                            : helperText
                                ? `${textareaId}-helper`
                                : undefined
                    }
                    {...props}
                />
                {error && (
                    <p id={`${textareaId}-error`} className="mt-1.5 text-sm text-red-600">
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p
                        id={`${textareaId}-helper`}
                        className="mt-1.5 text-sm text-gray-500"
                    >
                        {helperText}
                    </p>
                )}
            </div>
        )
    }
)

Textarea.displayName = 'Textarea'

export default Textarea
