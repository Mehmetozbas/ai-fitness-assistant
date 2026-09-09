'use server'

import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const muscleGroup = searchParams.get('muscleGroup')

    const where = muscleGroup && muscleGroup !== 'all' ? { muscleGroup } : {}

    const exercises = await prisma.exercise.findMany({
      where,
      select: {
        id: true,
        name: true,
        muscleGroup: true,
        difficulty: true,
        instructions: true,
        equipmentRequired: true,
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      success: true,
      exercises,
    })
  } catch (error) {
    console.error('Get exercises error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
