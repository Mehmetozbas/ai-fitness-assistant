'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface NutritionData {
  dailyCalories: number
  protein: number
  carbs: number
  fat: number
  recommendations: string[]
}

export default function NutritionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [nutrition, setNutrition] = useState<NutritionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      fetchNutrition()
    }
  }, [status])

  const fetchNutrition = async () => {
    try {
      const response = await axios.get('/api/nutrition/guidance')
      setNutrition(response.data)
    } catch (error) {
      console.error('Failed to fetch nutrition:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading nutrition data...</p>
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
        <h1 className="text-3xl font-bold">Nutrition Guidance 🍎</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {nutrition && (
          <>
            {/* Daily Macros */}
            <div className="card mb-8">
              <h2 className="text-2xl font-bold mb-6">Daily Nutrition Goals</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Calories */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                  <p className="text-gray-600 text-sm mb-2">Daily Calories</p>
                  <p className="text-4xl font-bold text-primary mb-2">{Math.round(nutrition.dailyCalories)}</p>
                  <p className="text-sm text-gray-600">kcal/day</p>
                </div>

                {/* Macros */}
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                    <p className="text-gray-600 text-sm mb-1">Protein</p>
                    <p className="text-2xl font-bold text-red-600">{Math.round(nutrition.protein)}g</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <p className="text-gray-600 text-sm mb-1">Carbs</p>
                    <p className="text-2xl font-bold text-blue-600">{Math.round(nutrition.carbs)}g</p>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                    <p className="text-gray-600 text-sm mb-1">Fat</p>
                    <p className="text-2xl font-bold text-yellow-600">{Math.round(nutrition.fat)}g</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Macro Breakdown */}
            <div className="card mb-8">
              <h3 className="text-xl font-bold mb-4">Macro Breakdown</h3>
              <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden flex">
                <div
                  className="bg-red-500 h-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ width: `${(nutrition.protein * 4 / nutrition.dailyCalories) * 100}%` }}
                >
                  {nutrition.protein > 20 && 'Protein'}
                </div>
                <div
                  className="bg-blue-500 h-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ width: `${(nutrition.carbs * 4 / nutrition.dailyCalories) * 100}%` }}
                >
                  {nutrition.carbs > 20 && 'Carbs'}
                </div>
                <div
                  className="bg-yellow-500 h-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ width: `${(nutrition.fat * 9 / nutrition.dailyCalories) * 100}%` }}
                >
                  {nutrition.fat > 10 && 'Fat'}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {nutrition.recommendations && nutrition.recommendations.length > 0 && (
              <div className="card">
                <h3 className="text-xl font-bold mb-4">Nutrition Tips</h3>
                <ul className="space-y-3">
                  {nutrition.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-primary font-bold text-lg mt-1">✓</span>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
