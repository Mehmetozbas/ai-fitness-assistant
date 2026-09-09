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

    const completedWorkouts = await prisma.completedWorkout.findMany({
      where: { userId: session.user.id },
      orderBy: { completedAt: 'desc' },
      take: 20,
    })

    const progressPhotos = await prisma.progressPhoto.findMany({
      where: { userId: session.user.id },
      orderBy: { uploadedAt: 'desc' },
      take: 10,
    })

    // Calculate streak
    let currentStreak = 0
    if (completedWorkouts.length > 0) {
      const sortedByDate = [...completedWorkouts].sort(
        (a, b) => b.completedAt.getTime() - a.completedAt.getTime()
      )

      let currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)

      for (const workout of sortedByDate) {
        const workoutDate = new Date(workout.completedAt)
        workoutDate.setHours(0, 0, 0, 0)

        const daysDiff = Math.floor(
          (currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
        )

        if (daysDiff === 0 || daysDiff === 1) {
          currentStreak++
          currentDate = new Date(workoutDate.getTime() - 24 * 60 * 60 * 1000)
        } else {
          break
        }
      }
    }

    return NextResponse.json({
      success: true,
      completedWorkouts,
      progressPhotos,
      currentStreak,
    })
  } catch (error) {
    console.error('Get progress error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
