import { z } from 'zod'
import { MIN_PASSWORD_LENGTH } from '@/lib/utils/constants'

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'L\'email est requis')
        .email('Adresse email invalide'),
    password: z
        .string()
        .min(1, 'Le mot de passe est requis'),
})

export type LoginInput = z.infer<typeof loginSchema>

/**
 * Registration form validation schema
 */
export const registerSchema = z
    .object({
        name: z
            .string()
            .min(2, 'Le nom doit contenir au moins 2 caractères')
            .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
        email: z
            .string()
            .min(1, 'L\'email est requis')
            .email('Adresse email invalide'),
        password: z
            .string()
            .min(MIN_PASSWORD_LENGTH, `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères`)
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
            ),
        confirmPassword: z.string().min(1, 'Veuillez confirmer le mot de passe'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Les mots de passe ne correspondent pas',
        path: ['confirmPassword'],
    })

export type RegisterInput = z.infer<typeof registerSchema>

/**
 * Forgot password validation schema
 */
export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, 'L\'email est requis')
        .email('Adresse email invalide'),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

/**
 * Reset password validation schema
 */
export const resetPasswordSchema = z
    .object({
        token: z.string().min(1, 'Token invalide'),
        password: z
            .string()
            .min(MIN_PASSWORD_LENGTH, `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères`)
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
            ),
        confirmPassword: z.string().min(1, 'Veuillez confirmer le mot de passe'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Les mots de passe ne correspondent pas',
        path: ['confirmPassword'],
    })

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

/**
 * Update profile validation schema
 */
export const updateProfileSchema = z.object({
    name: z
        .string()
        .min(2, 'Le nom doit contenir au moins 2 caractères')
        .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
    email: z
        .string()
        .min(1, 'L\'email est requis')
        .email('Adresse email invalide'),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

/**
 * Change password validation schema
 */
export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
        newPassword: z
            .string()
            .min(MIN_PASSWORD_LENGTH, `Le nouveau mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères`)
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
            ),
        confirmNewPassword: z.string().min(1, 'Veuillez confirmer le nouveau mot de passe'),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: 'Les mots de passe ne correspondent pas',
        path: ['confirmNewPassword'],
    })

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
