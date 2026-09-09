'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { imageService } from '@/services/image.service'
import { aiService } from '@/services/ai.service'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const front = formData.get('front') as File
    const back = formData.get('back') as File
    const right = formData.get('right') as File
    const left = formData.get('left') as File

    if (!front || !back || !right || !left) {
      return NextResponse.json(
        { error: 'All 4 photos are required' },
        { status: 400 }
      )
    }

    // Upload photos
    const [frontUrl, backUrl, rightUrl, leftUrl] = await Promise.all([
      imageService.uploadBodyPhoto(session.user.id, front, 'front'),
      imageService.uploadBodyPhoto(session.user.id, back, 'back'),
      imageService.uploadBodyPhoto(session.user.id, right, 'right'),
      imageService.uploadBodyPhoto(session.user.id, left, 'left'),
    ])

    if (!frontUrl.success || !backUrl.success || !rightUrl.success || !leftUrl.success) {
      return NextResponse.json(
        { error: 'Failed to upload one or more photos' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      photoUrls: {
        front: frontUrl.url,
        back: backUrl.url,
        right: rightUrl.url,
        left: leftUrl.url,
      },
      paths: {
        front: frontUrl.path,
        back: backUrl.path,
        right: rightUrl.path,
        left: leftUrl.path,
      },
    })
  } catch (error) {
    console.error('Photo upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
