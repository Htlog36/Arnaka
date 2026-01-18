import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    error?: string
    helperText?: string
    containerClassName?: string
    options: { value: string; label: string; disabled?: boolean }[]
    placeholder?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            className,
            containerClassName,
            label,
            error,
            helperText,
            options,
            placeholder,
            id,
            ...props
        },
        ref
    ) => {
        const selectId = id || React.useId()

        return (
            <div className={cn('w-full', containerClassName)}>
                {label && (
                    <label
                        htmlFor={selectId}
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                        {label}
                    </label>
                )}
                <select
                    id={selectId}
                    ref={ref}
                    className={cn(
                        'block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5',
                        'text-gray-900',
                        'transition-colors duration-200',
                        'focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
                        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                        className
                    )}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={
                        error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
                    }
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p id={`${selectId}-error`} className="mt-1.5 text-sm text-red-600">
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p id={`${selectId}-helper`} className="mt-1.5 text-sm text-gray-500">
                        {helperText}
                    </p>
                )}
            </div>
        )
    }
)

Select.displayName = 'Select'

export default Select
