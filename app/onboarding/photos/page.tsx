'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Upload, Loader2 } from 'lucide-react'

type PhotoAngle = 'front' | 'back' | 'right' | 'left'

interface PhotoState {
  front: File | null
  back: File | null
  right: File | null
  left: File | null
}

const PHOTO_STEPS: { angle: PhotoAngle; label: string; description: string }[] = [
  { angle: 'front', label: 'Front', description: 'Stand facing the camera' },
  { angle: 'back', label: 'Back', description: 'Stand with back to camera' },
  { angle: 'right', label: 'Right Side', description: 'Stand on the right side' },
  { angle: 'left', label: 'Left Side', description: 'Stand on the left side' },
]

export default function PhotoOnboarding() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [photos, setPhotos] = useState<PhotoState>({
    front: null,
    back: null,
    right: null,
    left: null,
  })
  const fileInputRefs = useRef<Record<PhotoAngle, HTMLInputElement | null>>({
    front: null,
    back: null,
    right: null,
    left: null,
  })

  const handleFileSelect = (angle: PhotoAngle, file: File | null) => {
    if (file) {
      setPhotos((prev) => ({
        ...prev,
        [angle]: file,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!photos.front || !photos.back || !photos.right || !photos.left) {
      setError('Please upload all 4 photos')
      return
    }

    setIsLoading(true)

    try {
      // Upload photos
      const formData = new FormData()
      formData.append('front', photos.front)
      formData.append('back', photos.back)
      formData.append('right', photos.right)
      formData.append('left', photos.left)

      const uploadResponse = await axios.post('/api/body-analysis/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (uploadResponse.status === 200) {
        setIsAnalyzing(true)
        // Trigger AI analysis
        const analysisResponse = await axios.post('/api/body-analysis/analyze', {
          photoUrls: uploadResponse.data.photoUrls,
        })

        if (analysisResponse.status === 200) {
          router.push('/onboarding/analysis')
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload photos')
    } finally {
      setIsLoading(false)
      setIsAnalyzing(false)
    }
  }

  const allPhotosUploaded = photos.front && photos.back && photos.right && photos.left

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Upload Body Photos 📸</h1>
            <p className="text-gray-600">
              Upload 4 photos from different angles for AI analysis. This helps us understand your posture and body proportions.
            </p>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Privacy Note:</strong> Your photos are stored securely and only visible to you. We'll use AI to provide general fitness observations, not medical diagnoses.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {PHOTO_STEPS.map(({ angle, label, description }) => (
                <div key={angle} className="space-y-3">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{label} View</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>

                  <div
                    className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => fileInputRefs.current[angle]?.click()}
                  >
                    <input
                      ref={(el) => {
                        if (el) fileInputRefs.current[angle] = el
                      }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileSelect(angle, e.target.files?.[0] || null)}
                    />

                    {photos[angle] ? (
                      <div className="space-y-2">
                        <div className="text-4xl">✅</div>
                        <p className="text-sm font-medium text-success">{photos[angle]!.name}</p>
                        <p className="text-xs text-gray-600">
                          {(photos[angle]!.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-600">Click to upload photo</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || isAnalyzing || !allPhotosUploaded}
              className="btn btn-primary w-full mt-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing with AI...
                </>
              ) : isLoading ? (
                <>Uploading...</>
              ) : (
                <>Analyze My Photos</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
