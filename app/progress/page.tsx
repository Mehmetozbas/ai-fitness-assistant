'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ArrowLeft, TrendingUp, Calendar } from 'lucide-react'
import Link from 'next/link'

interface ProgressData {
  completedWorkouts: any[]
  progressPhotos: any[]
  currentStreak: number
  weight?: number
}

export default function ProgressPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      fetchProgress()
    }
  }, [status])

  const fetchProgress = async () => {
    try {
      const response = await axios.get('/api/progress')
      setProgress(response.data)
    } catch (error) {
      console.error('Failed to fetch progress:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading progress...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-md p-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-primary mb-4 hover:opacity-80">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold">Your Progress 📊</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🔥</div>
              <div>
                <p className="text-gray-500 text-sm">Current Streak</p>
                <p className="text-3xl font-bold text-primary">{progress?.currentStreak || 0}</p>
                <p className="text-xs text-gray-600">days</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="text-4xl">💪</div>
              <div>
                <p className="text-gray-500 text-sm">Total Workouts</p>
                <p className="text-3xl font-bold text-success">{progress?.completedWorkouts.length || 0}</p>
                <p className="text-xs text-gray-600">completed</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="text-4xl">📸</div>
              <div>
                <p className="text-gray-500 text-sm">Progress Photos</p>
                <p className="text-3xl font-bold text-secondary">{progress?.progressPhotos.length || 0}</p>
                <p className="text-xs text-gray-600">uploaded</p>
              </div>
            </div>
          </div>
        </div>

        {/* Workout History */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Workout History
          </h2>
          {progress?.completedWorkouts && progress.completedWorkouts.length > 0 ? (
            <div className="space-y-3">
              {progress.completedWorkouts.slice(0, 10).map((workout, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800">{workout.name || 'Workout'}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(workout.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success">{workout.exercisesCompleted}/{workout.totalExercises}</p>
                    <p className="text-sm text-gray-600">exercises</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No completed workouts yet. Start your first workout!</p>
          )}
        </div>

        {/* Progress Photos */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <div className="text-2xl">📷</div>
            Progress Photos
          </h2>
          {progress?.progressPhotos && progress.progressPhotos.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {progress.progressPhotos.map((photo, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center text-gray-500">
                    📷 {photo.angle || 'Progress'} Photo
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(photo.uploadedAt).toLocaleDateString()}
                  </p>
                  {photo.notes && <p className="text-sm text-gray-700">{photo.notes}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600">
              <p className="mb-4">No progress photos yet</p>
              <Link href="/progress/upload" className="btn btn-primary inline-block">
                Upload Your First Photo
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
