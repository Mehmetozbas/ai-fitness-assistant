'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/services/ai.service'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Get nutrition guidance
    const guidance = await aiService.getNutritionGuidance({
      goal: userProfile.fitnessGoal || 'general',
      age: userProfile.age || 30,
      weight: userProfile.weight || 70,
      height: userProfile.height || 170,
      activityLevel: 'moderate',
    })

    return NextResponse.json({
      ...guidance,
      recommendations: [
        'Eat protein with every meal (eggs, chicken, fish, tofu)',
        'Stay hydrated - drink at least 2-3 liters of water daily',
        'Eat vegetables and fruits for micronutrients',
        'Time your carbs around your workouts',
        'Keep healthy fats in your diet (nuts, avocado, olive oil)',
        'Avoid processed foods and sugary drinks',
      ],
    })
  } catch (error) {
    console.error('Nutrition guidance error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
