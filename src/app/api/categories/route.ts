import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                children: true, // Fetch immediate subcategories
            },
            orderBy: {
                name: 'asc',
            },
        })

        // Filter to get only root categories (those without parentId)
        // and include their children structure
        const rootCategories = categories.filter((c) => !c.parentId)

        // Helper to build tree (if needed deeper, but schema is usually flat or 1-level)
        // For now, simple parent-child relation

        return NextResponse.json(rootCategories)
    } catch (error) {
        console.error('Error fetching categories:', error)
        return NextResponse.json(
            { error: 'Error fetching categories' },
            { status: 500 }
        )
    }
}
