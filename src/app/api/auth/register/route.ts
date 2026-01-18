import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db/prisma'
import { registerSchema } from '@/lib/validations/auth'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validate input (only the fields we need for registration)
        const validation = registerSchema.safeParse({
            ...body,
            confirmPassword: body.password, // API doesn't need confirm, just validate password format
        })

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Données invalides', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        const { name, email, password } = validation.data

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Un compte existe déjà avec cette adresse email' },
                { status: 409 }
            )
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12)

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                passwordHash,
                role: 'BUYER',
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        })

        return NextResponse.json(
            {
                message: 'Compte créé avec succès',
                user,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la création du compte' },
            { status: 500 }
        )
    }
}
