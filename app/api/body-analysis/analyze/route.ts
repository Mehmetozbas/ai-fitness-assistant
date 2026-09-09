'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/services/ai.service'
import { z } from 'zod'

const AnalyzeSchema = z.object({
  photoUrls: z.object({
    front: z.string(),
    back: z.string(),
    right: z.string(),
    left: z.string(),
  }),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { photoUrls } = AnalyzeSchema.parse(body)

    // Get user profile for context
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 400 }
      )
    }

    // Analyze photos with AI
    const analysis = await aiService.analyzeBodyPhotos(photoUrls, {
      age: userProfile.age || undefined,
      weight: userProfile.weight || undefined,
      height: userProfile.height || undefined,
      fitnessGoal: userProfile.fitnessGoal || undefined,
    })

    // Store analysis in database
    const bodyAnalysis = await prisma.bodyAnalysis.upsert({
      where: { userProfileId: userProfile.id },
      update: {
        frontPhotoUrl: photoUrls.front,
        backPhotoUrl: photoUrls.back,
        rightPhotoUrl: photoUrls.right,
        leftPhotoUrl: photoUrls.left,
        postureAnalysis: JSON.stringify(analysis.postureAnalysis),
        symmetryAnalysis: JSON.stringify(analysis.symmetryAnalysis),
        trainingFocusAreas: analysis.trainingFocusAreas,
        analysisTimestamp: new Date(),
        aiProvider: 'openai',
        confidence: (analysis.postureAnalysis.confidence + analysis.symmetryAnalysis.confidence) / 2,
      },
      create: {
        userProfileId: userProfile.id,
        frontPhotoUrl: photoUrls.front,
        backPhotoUrl: photoUrls.back,
        rightPhotoUrl: photoUrls.right,
        leftPhotoUrl: photoUrls.left,
        postureAnalysis: JSON.stringify(analysis.postureAnalysis),
        symmetryAnalysis: JSON.stringify(analysis.symmetryAnalysis),
        trainingFocusAreas: analysis.trainingFocusAreas,
        analysisTimestamp: new Date(),
        aiProvider: 'openai',
        confidence: (analysis.postureAnalysis.confidence + analysis.symmetryAnalysis.confidence) / 2,
      },
    })

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
