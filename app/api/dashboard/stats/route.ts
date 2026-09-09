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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
      },
    })

    // Get workout stats
    const completedWorkouts = await prisma.completedWorkout.findMany({
      where: { userId: session.user.id },
      orderBy: { completedAt: 'desc' },
    })

    const totalWorkouts = completedWorkouts.length
    const thisWeekWorkouts = completedWorkouts.filter((w) => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return w.completedAt > weekAgo
    }).length

    // Calculate streak
    let currentStreak = 0
    if (completedWorkouts.length > 0) {
      const sortedByDate = [...completedWorkouts].sort(
        (a, b) => b.completedAt.getTime() - a.completedAt.getTime()
      )

      let currentDate = new Date()
      for (const workout of sortedByDate) {
        const workoutDate = new Date(workout.completedAt)
        if (
          workoutDate.getDate() === currentDate.getDate() &&
          workoutDate.getMonth() === currentDate.getMonth() &&
          workoutDate.getFullYear() === currentDate.getFullYear()
        ) {
          currentStreak++
          currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000)
        } else {
          break
        }
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
      },
      stats: {
        totalWorkouts,
        currentStreak,
        thisWeekWorkouts,
      },
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
