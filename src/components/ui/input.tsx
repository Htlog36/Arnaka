import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    containerClassName?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            containerClassName,
            type = 'text',
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || React.useId()

        return (
            <div className={cn('w-full', containerClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        id={inputId}
                        type={type}
                        ref={ref}
                        className={cn(
                            'block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5',
                            'text-gray-900 placeholder:text-gray-400',
                            'transition-colors duration-200',
                            'focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
                            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
                            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                            leftIcon && 'pl-10',
                            rightIcon && 'pr-10',
                            className
                        )}
                        aria-invalid={error ? 'true' : 'false'}
                        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && (
                    <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600">
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-gray-500">
                        {helperText}
                    </p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export default Input
