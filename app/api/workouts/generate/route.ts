'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/services/ai.service'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        bodyAnalysis: true,
      },
    })

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 400 }
      )
    }

    // Generate workout plan using AI
    const workoutData = await aiService.generateWorkoutPlan({
      goal: userProfile.fitnessGoal || 'general',
      experienceLevel: userProfile.experienceLevel || 'beginner',
      availableDays: userProfile.availableDays || 3,
      equipmentAvailable: userProfile.availableEquipment || [],
      bodyAnalysis: userProfile.bodyAnalysis
        ? {
            postureAnalysis: JSON.parse(userProfile.bodyAnalysis.postureAnalysis || '{}'),
            symmetryAnalysis: JSON.parse(userProfile.bodyAnalysis.symmetryAnalysis || '{}'),
            trainingFocusAreas: userProfile.bodyAnalysis.trainingFocusAreas,
            disclaimer: 'AI-based assessment',
          }
        : undefined,
    })

    // Create workout plan
    const plan = await prisma.workoutPlan.create({
      data: {
        userId: session.user.id,
        name: workoutData.plan || 'My Personalized Plan',
        description: 'AI-generated based on your goals and equipment',
        goal: userProfile.fitnessGoal || 'general',
        experienceLevel: userProfile.experienceLevel || 'beginner',
        daysPerWeek: userProfile.availableDays || 3,
        isActive: true,
      },
    })

    return NextResponse.json({
      success: true,
      plan,
    })
  } catch (error) {
    console.error('Workout generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
