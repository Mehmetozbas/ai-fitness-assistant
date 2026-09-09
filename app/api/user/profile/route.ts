'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const ProfileSchema = z.object({
  age: z.number().min(15).max(100),
  height: z.number().min(100).max(250),
  weight: z.number().min(30).max(300),
  fitnessGoal: z.enum(['general', 'muscle_building', 'strength', 'endurance']),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  availableDays: z.number().min(1).max(7),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = ProfileSchema.parse(body)

    // Create or update user profile
    const profile = await prisma.userProfile.upsert({
      where: { userId: session.user.id },
      update: validatedData,
      create: {
        userId: session.user.id,
        ...validatedData,
      },
    })

    return NextResponse.json({
      success: true,
      profile,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
