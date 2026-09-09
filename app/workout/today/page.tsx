'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { CheckCircle2, Circle, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Exercise {
  id: string
  name: string
  sets: number
  reps?: number
  duration?: number
  restTime: number
  completed: boolean
  instructions: string
}

interface Workout {
  id: string
  name: string
  exercises: Exercise[]
  duration?: number
}

export default function TodayWorkout() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [completedCount, setCompletedCount] = useState(0)
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      fetchTodayWorkout()
    }
  }, [status])

  const fetchTodayWorkout = async () => {
    try {
      const response = await axios.get('/api/workout/today')
      setWorkout(response.data.workout)
      setCompletedCount(response.data.workout.exercises.filter((e: Exercise) => e.completed).length)
    } catch (error) {
      console.error('Failed to fetch workout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleExerciseComplete = async (exerciseId: string) => {
    if (!workout) return

    try {
      const updatedExercises = workout.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
      )

      const newCompletedCount = updatedExercises.filter((e) => e.completed).length
      setCompletedCount(newCompletedCount)

      setWorkout({
        ...workout,
        exercises: updatedExercises,
      })

      // Save to backend
      await axios.post('/api/workout/update-exercise', {
        exerciseId,
        completed: !workout.exercises.find((e) => e.id === exerciseId)?.completed,
      })
    } catch (error) {
      console.error('Failed to update exercise:', error)
    }
  }

  const completeWorkout = async () => {
    if (!workout) return

    try {
      await axios.post('/api/workout/complete', {
        workoutId: workout.id,
        exercisesCompleted: completedCount,
        totalExercises: workout.exercises.length,
      })

      router.push('/workout/success')
    } catch (error) {
      console.error('Failed to complete workout:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading today's workout...</p>
        </div>
      </div>
    )
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="card text-center">
            <div className="text-6xl mb-4">🏋️</div>
            <h2 className="text-2xl font-bold mb-2">No Workout Scheduled</h2>
            <p className="text-gray-600">Rest day or create a workout plan first</p>
          </div>
        </div>
      </div>
    )
  }

  const completionPercentage = Math.round((completedCount / workout.exercises.length) * 100)

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-orange-600 text-white p-6">
        <Link href="/dashboard" className="flex items-center gap-2 mb-4 hover:opacity-80">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-3xl font-bold mb-2">{workout.name}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{workout.duration || 45} minutes</span>
          </div>
          <div>
            {completedCount} / {workout.exercises.length} exercises
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-2 flex justify-between">
          <span className="font-medium">Workout Progress</span>
          <span className="font-bold text-primary">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary to-orange-600 h-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Exercises */}
      <div className="max-w-2xl mx-auto px-4 space-y-4">
        {workout.exercises.map((exercise, index) => (
          <div
            key={exercise.id}
            className="card cursor-pointer transition-all hover:shadow-lg"
            onClick={() => setSelectedExerciseId(selectedExerciseId === exercise.id ? null : exercise.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleExerciseComplete(exercise.id)
                  }}
                  className="mt-1 flex-shrink-0"
                >
                  {exercise.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300" />
                  )}
                </button>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg ${
                    exercise.completed ? 'line-through text-gray-400' : 'text-gray-800'
                  }`}>
                    {index + 1}. {exercise.name}
                  </h3>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span>{exercise.sets} sets</span>
                    {exercise.reps && <span>{exercise.reps} reps</span>}
                    {exercise.duration && <span>{exercise.duration}s</span>}
                    <span>Rest: {exercise.restTime}s</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise Details */}
            {selectedExerciseId === exercise.id && (
              <div className="mt-4 pt-4 border-t">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{exercise.instructions}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Complete Workout Button */}
      <div className="max-w-2xl mx-auto px-4 mt-12">
        <button
          onClick={completeWorkout}
          disabled={completedCount < workout.exercises.length}
          className="btn btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {completedCount === workout.exercises.length
            ? '✅ Complete Workout'
            : `Complete Workout (${completedCount}/${workout.exercises.length})`}
        </button>
      </div>
    </div>
  )
}
