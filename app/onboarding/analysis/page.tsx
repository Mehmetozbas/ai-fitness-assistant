'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { BodyAnalysisResult } from '@/types'
import { AlertCircle } from 'lucide-react'

export default function AnalysisPage() {
  const router = useRouter()
  const [analysis, setAnalysis] = useState<BodyAnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await axios.get('/api/body-analysis/result')
        setAnalysis(response.data)
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load analysis')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalysis()
  }, [])

  const handleContinue = async () => {
    try {
      // Generate workout plan based on analysis
      await axios.post('/api/workouts/generate')
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate workout plan')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Analyzing your photos with AI...</p>
        </div>
      </div>
    )
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="flex items-center gap-2 text-danger mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-bold">Error</h2>
          </div>
          <p className="text-gray-600 mb-6">{error || 'Failed to analyze photos'}</p>
          <button onClick={() => router.push('/onboarding/photos')} className="btn btn-primary w-full">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Body Analysis 📊</h1>
            <p className="text-gray-600 mb-4">{analysis.disclaimer}</p>
          </div>

          <div className="space-y-8">
            {/* Posture Analysis */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4 text-primary">Posture Analysis</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Shoulder Alignment</h3>
                  <p className="text-gray-600">{analysis.postureAnalysis.shoulderAlignment}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">General Posture</h3>
                  <p className="text-gray-600">{analysis.postureAnalysis.generalPosture}</p>
                </div>
                <div className="text-sm text-gray-500">
                  Confidence: {(analysis.postureAnalysis.confidence * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Symmetry Analysis */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4 text-primary">Symmetry Analysis</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Left/Right Balance</h3>
                  <p className="text-gray-600">{analysis.symmetryAnalysis.leftRightBalance}</p>
                </div>
                {analysis.symmetryAnalysis.asymmetries.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Noted Asymmetries</h3>
                    <ul className="space-y-1">
                      {analysis.symmetryAnalysis.asymmetries.map((asym, idx) => (
                        <li key={idx} className="text-gray-600 flex items-center gap-2">
                          <span className="text-primary">•</span> {asym}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  Confidence: {(analysis.symmetryAnalysis.confidence * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Training Focus Areas */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4 text-primary">Recommended Training Focus</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {analysis.trainingFocusAreas.map((area, idx) => (
                  <div key={idx} className="bg-primary bg-opacity-10 border border-primary rounded-lg p-4">
                    <p className="font-semibold text-primary">{area}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> This AI analysis provides general fitness observations only. It is NOT a medical diagnosis. For health concerns, please consult a healthcare professional.
              </p>
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="btn btn-primary w-full mt-8"
          >
            Create My Personalized Workout Plan
          </button>
        </div>
      </div>
    </div>
  )
}
