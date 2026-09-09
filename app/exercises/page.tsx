'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Exercise {
  id: string
  name: string
  muscleGroup: string
  difficulty: string
  instructions: string
  equipment: string[]
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMuscle, setSelectedMuscle] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const muscleGroups = [
    { id: 'all', label: 'All Exercises' },
    { id: 'chest', label: 'Chest' },
    { id: 'back', label: 'Back' },
    { id: 'shoulders', label: 'Shoulders' },
    { id: 'arms', label: 'Arms' },
    { id: 'legs', label: 'Legs' },
    { id: 'core', label: 'Core' },
  ]

  useEffect(() => {
    fetchExercises()
  }, [selectedMuscle])

  const fetchExercises = async () => {
    try {
      const response = await axios.get(`/api/exercises?muscleGroup=${selectedMuscle}`)
      setExercises(response.data.exercises)
    } catch (error) {
      console.error('Failed to fetch exercises:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredExercises = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const difficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-md p-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-primary mb-4 hover:opacity-80">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold">Exercise Library 💪</h1>
        <p className="text-gray-600">Browse our collection of exercises</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
          />

          <div className="flex flex-wrap gap-2">
            {muscleGroups.map((muscle) => (
              <button
                key={muscle.id}
                onClick={() => setSelectedMuscle(muscle.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedMuscle === muscle.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {muscle.label}
              </button>
            ))}
          </div>
        </div>

        {/* Exercises Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading exercises...</p>
          </div>
        ) : filteredExercises.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredExercises.map((exercise) => (
              <div key={exercise.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-800">{exercise.name}</h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${difficultyColor(exercise.difficulty)}`}>
                    {exercise.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{exercise.instructions}</p>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Muscle Group</p>
                    <p className="font-semibold text-gray-700 capitalize">{exercise.muscleGroup.replace('_', ' ')}</p>
                  </div>
                  {exercise.equipment && exercise.equipment.length > 0 && (
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Equipment</p>
                      <div className="flex flex-wrap gap-1">
                        {exercise.equipment.map((eq, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {eq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600">
            <p>No exercises found. Try a different search or filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
