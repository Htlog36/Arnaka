import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { forgotPasswordSchema } from '@/lib/validations/auth'
import crypto from 'crypto'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const validation = forgotPasswordSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Email invalide' },
                { status: 400 }
            )
        }

        const { email } = validation.data

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        })

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json(
                { message: 'Si un compte existe, un email a été envoyé' },
                { status: 200 }
            )
        }

        // Generate reset token
        const token = crypto.randomBytes(32).toString('hex')
        const expires = new Date(Date.now() + 3600 * 1000) // 1 hour

        await prisma.verificationToken.create({
            data: {
                identifier: email.toLowerCase(),
                token,
                expires,
            },
        })

        // In a real app, send email here
        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
        console.log('------------------------------------------')
        console.log('🔐 RESET PASSWORD LINK:', resetUrl)
        console.log('------------------------------------------')

        return NextResponse.json(
            { message: 'Si un compte existe, un email a été envoyé' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Forgot password error:', error)
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        )
    }
}
