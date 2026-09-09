'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const CompleteSchema = z.object({
  workoutId: z.string(),
  exercisesCompleted: z.number(),
  totalExercises: z.number(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { workoutId, exercisesCompleted, totalExercises } = CompleteSchema.parse(body)

    const completed = await prisma.completedWorkout.create({
      data: {
        userId: session.user.id,
        workoutId,
        completedAt: new Date(),
        exercisesCompleted,
        totalExercises,
      },
    })

    return NextResponse.json({
      success: true,
      completed,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Complete workout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
