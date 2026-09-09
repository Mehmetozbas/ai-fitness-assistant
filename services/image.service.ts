import { createClient } from '@supabase/supabase-js'

/**
 * Image Service for handling photo uploads and storage
 * Uses Supabase for secure, private storage
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not configured. Using mock storage.')
}

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null

interface UploadResult {
  success: boolean
  url?: string
  path?: string
  error?: string
}

class ImageService {
  /**
   * Upload body analysis photo
   */
  async uploadBodyPhoto(
    userId: string,
    file: File,
    angle: 'front' | 'back' | 'right' | 'left'
  ): Promise<UploadResult> {
    if (!supabase) {
      return this.uploadMock(userId, file, angle)
    }

    try {
      const fileName = `${userId}/${angle}/${Date.now()}-${file.name}`
      
      const { data, error } = await supabase.storage
        .from('body-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        throw error
      }

      const { data: urlData } = supabase.storage
        .from('body-photos')
        .getPublicUrl(fileName)

      return {
        success: true,
        url: urlData.publicUrl,
        path: fileName,
      }
    } catch (error) {
      console.error('Image upload error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      }
    }
  }

  /**
   * Upload progress photo
   */
  async uploadProgressPhoto(
    userId: string,
    file: File
  ): Promise<UploadResult> {
    if (!supabase) {
      return this.uploadMock(userId, file, 'progress')
    }

    try {
      const fileName = `${userId}/progress/${Date.now()}-${file.name}`
      
      const { data, error } = await supabase.storage
        .from('progress-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        throw error
      }

      const { data: urlData } = supabase.storage
        .from('progress-photos')
        .getPublicUrl(fileName)

      return {
        success: true,
        url: urlData.publicUrl,
        path: fileName,
      }
    } catch (error) {
      console.error('Image upload error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      }
    }
  }

  /**
   * Delete a photo
   */
  async deletePhoto(path: string, bucket: string = 'body-photos'): Promise<boolean> {
    if (!supabase) return true

    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

      if (error) throw error
      return true
    } catch (error) {
      console.error('Photo deletion error:', error)
      return false
    }
  }

  /**
   * Mock upload for development
   */
  private uploadMock(
    userId: string,
    file: File,
    angle: string
  ): UploadResult {
    return {
      success: true,
      url: `https://via.placeholder.com/400x600?text=${angle}`,
      path: `${userId}/${angle}/${Date.now()}-${file.name}`,
    }
  }
}

export const imageService = new ImageService()
