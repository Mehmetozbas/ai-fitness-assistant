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

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        bodyAnalysis: true,
      },
    })

    if (!userProfile?.bodyAnalysis) {
      return NextResponse.json(
        { error: 'No analysis found' },
        { status: 404 }
      )
    }

    const analysis = userProfile.bodyAnalysis
    return NextResponse.json({
      postureAnalysis: JSON.parse(analysis.postureAnalysis || '{}'),
      symmetryAnalysis: JSON.parse(analysis.symmetryAnalysis || '{}'),
      trainingFocusAreas: analysis.trainingFocusAreas,
      disclaimer: 'This is an AI-based assessment for general fitness guidance only, not a medical diagnosis.',
    })
  } catch (error) {
    console.error('Get analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
