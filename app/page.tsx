'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Home() {
  const { data: session } = useSession()

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary to-secondary">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">💪 FitAI</div>
          <div className="flex gap-4">
            {session ? (
              <>
                <Link href="/dashboard" className="btn btn-primary">
                  Dashboard
                </Link>
                <Link href="/api/auth/signout" className="btn btn-outline">
                  Sign Out
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn btn-primary">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn btn-outline">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-white text-center">
        <h1 className="text-5xl font-bold mb-4">Your AI Fitness Coach</h1>
        <p className="text-xl mb-8 opacity-90">
          Get personalized workouts, AI body analysis, and track your progress
        </p>
        {!session && (
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup" className="btn btn-primary bg-white text-primary hover:bg-gray-100">
              Get Started Free
            </Link>
            <Link href="/auth/login" className="btn btn-outline border-white text-white hover:bg-white hover:bg-opacity-10">
              Sign In
            </Link>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-xl font-bold mb-2">AI Body Analysis</h3>
              <p>Upload 4 photos and get AI-powered posture and symmetry insights</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🏋️</div>
              <h3 className="text-xl font-bold mb-2">Custom Workouts</h3>
              <p>Get personalized workout plans based on your goals and equipment</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
              <p>Track your workouts, photos, and progress over time</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
