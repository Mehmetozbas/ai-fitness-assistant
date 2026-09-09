'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { ChevronRight, Check } from 'lucide-react'

const EQUIPMENT_OPTIONS = [
  { id: 'dumbbells', label: 'Dumbbells', icon: '🏋️' },
  { id: 'barbell', label: 'Barbell', icon: '⚖️' },
  { id: 'kettlebell', label: 'Kettlebell', icon: '🔔' },
  { id: 'pull_up_bar', label: 'Pull-up Bar', icon: '🤸' },
  { id: 'resistance_bands', label: 'Resistance Bands', icon: '🔶' },
  { id: 'yoga_mat', label: 'Yoga Mat', icon: '🧘' },
  { id: 'bench', label: 'Weight Bench', icon: '🪑' },
  { id: 'treadmill', label: 'Treadmill', icon: '🏃' },
  { id: 'bike', label: 'Stationary Bike', icon: '🚴' },
  { id: 'bodyweight', label: 'Bodyweight Only', icon: '💪' },
]

export default function EquipmentOnboarding() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([])

  const toggleEquipment = (equipmentId: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(equipmentId)
        ? prev.filter((id) => id !== equipmentId)
        : [...prev, equipmentId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (selectedEquipment.length === 0) {
      setError('Please select at least one equipment option')
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post('/api/user/equipment', {
        equipment: selectedEquipment,
      })

      if (response.status === 200) {
        router.push('/onboarding/photos')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save equipment')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">What Equipment Do You Have? 🏋️</h1>
            <p className="text-gray-600">We'll customize your workouts based on your available equipment</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {EQUIPMENT_OPTIONS.map((equipment) => (
                <button
                  key={equipment.id}
                  type="button"
                  onClick={() => toggleEquipment(equipment.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedEquipment.includes(equipment.id)
                      ? 'border-primary bg-orange-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{equipment.icon}</span>
                      <span className="font-medium text-gray-800">{equipment.label}</span>
                    </div>
                    {selectedEquipment.includes(equipment.id) && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || selectedEquipment.length === 0}
              className="btn btn-primary w-full mt-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? 'Saving...' : 'Continue to Photos'}
              {!isLoading && <ChevronRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
