'use client'

import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function WorkoutSuccess() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-success to-emerald-600 flex items-center justify-center p-4">
      <div className="text-center text-white max-w-md">
        <div className="animate-bounce mb-8">
          <CheckCircle className="w-24 h-24 mx-auto" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Awesome! 🔥</h1>
        <p className="text-lg mb-2">You've completed your workout!</p>
        <p className="text-emerald-100 mb-8">Great job staying consistent with your fitness goals.</p>

        <div className="space-y-3">
          <Link href="/dashboard" className="btn bg-white text-success hover:bg-gray-100 w-full">
            Back to Dashboard
          </Link>
          <Link href="/progress" className="btn btn-outline border-white text-white hover:bg-white hover:bg-opacity-20 w-full">
            View Progress
          </Link>
        </div>
      </div>
    </div>
  )
}
