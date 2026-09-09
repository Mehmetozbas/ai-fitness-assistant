'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dayOfWeek = new Date().getDay()

    const workout = await prisma.workout.findFirst({
      where: {
        userId: session.user.id,
        workoutPlan: {
          isActive: true,
        },
        OR: [{ dayOfWeek }, { dayOfWeek: null }],
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!workout) {
      return NextResponse.json({
        success: true,
        workout: null,
      })
    }

    return NextResponse.json({
      success: true,
      workout: {
        id: workout.id,
        name: workout.name,
        duration: workout.duration,
        exercises: workout.exercises.map((we) => ({
          id: we.id,
          name: we.exercise.name,
          sets: we.sets,
          reps: we.reps,
          duration: we.duration,
          restTime: we.restTime,
          instructions: we.exercise.instructions,
          completed: false,
        })),
      },
    })
  } catch (error) {
    console.error('Get today workout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
