import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db/prisma'
import { resetPasswordSchema } from '@/lib/validations/auth'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const validation = resetPasswordSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Données invalides' },
                { status: 400 }
            )
        }

        const { token, password } = validation.data

        // Verify token
        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                token,
                expires: { gt: new Date() },
            },
        })

        if (!verificationToken) {
            return NextResponse.json(
                { error: 'Jeton invalide ou expiré' },
                { status: 400 }
            )
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(password, 12)

        // Update user password
        await prisma.user.update({
            where: { email: verificationToken.identifier },
            data: { passwordHash },
        })

        // Delete used token
        await prisma.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier: verificationToken.identifier,
                    token: verificationToken.token,
                }
            },
        })

        return NextResponse.json(
            { message: 'Mot de passe modifié avec succès' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Reset password error:', error)
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        )
    }
}
