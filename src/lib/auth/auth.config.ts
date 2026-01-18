import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db/prisma'
import { loginSchema } from '@/lib/validations/auth'
import type { NextAuthConfig } from 'next-auth'
// UserRole type matching Prisma schema
type UserRole = 'BUYER' | 'SELLER' | 'ADMIN'

export const authConfig: NextAuthConfig = {
    // Cast to any to resolve version mismatch between @auth/prisma-adapter and next-auth
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adapter: PrismaAdapter(prisma) as any,

    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID ?? '',
            clientSecret: process.env.AUTH_GOOGLE_SECRET ?? '',
        }),

        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials) {
                // Validate input
                const validated = loginSchema.safeParse(credentials)
                if (!validated.success) {
                    return null
                }

                const { email, password } = validated.data

                // Find user
                const user = await prisma.user.findUnique({
                    where: { email: email.toLowerCase() },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        image: true,
                        role: true,
                        passwordHash: true,
                    },
                })

                if (!user || !user.passwordHash) {
                    return null
                }

                // Verify password
                const passwordMatch = await bcrypt.compare(password, user.passwordHash)
                if (!passwordMatch) {
                    return null
                }

                // Return user without password
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // Initial sign in
            if (user) {
                token.id = user.id
                token.role = user.role
            }

            // Handle session update
            if (trigger === 'update' && session) {
                token.name = session.name
            }

            return token
        },

        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as UserRole
            }
            return session
        },

        async signIn({ user, account }) {
            // For OAuth providers, ensure role is set
            if (account?.provider !== 'credentials' && user) {
                const existingUser = await prisma.user.findUnique({
                    where: { id: user.id },
                    select: { role: true },
                })

                if (existingUser && !existingUser.role) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { role: 'BUYER' },
                    })
                }
            }
            return true
        },
    },

    pages: {
        signIn: '/login',
        error: '/login',
        newUser: '/register',
    },

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    events: {
        async signIn({ user, isNewUser }) {
            if (isNewUser) {
                console.log(`New user signed up: ${user.email}`)
            }
        },
    },

    debug: process.env.NODE_ENV === 'development',
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
