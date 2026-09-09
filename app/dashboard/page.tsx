'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { LogOut, Menu, Home, Dumbbell, TrendingUp, MessageSquare, User } from 'lucide-react'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    currentStreak: 0,
    thisWeekWorkouts: 0,
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      fetchDashboardData()
    }
  }, [status])

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard/stats')
      setUserData(response.data.user)
      setStats(response.data.stats)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-primary">
            💪 FitAI
          </Link>
          <div className="hidden md:flex gap-4 items-center">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-primary">
              <Home className="w-4 h-4" /> Dashboard
            </Link>
            <Link href="/workout" className="flex items-center gap-2 text-gray-700 hover:text-primary">
              <Dumbbell className="w-4 h-4" /> Workout
            </Link>
            <Link href="/progress" className="flex items-center gap-2 text-gray-700 hover:text-primary">
              <TrendingUp className="w-4 h-4" /> Progress
            </Link>
            <Link href="/coach" className="flex items-center gap-2 text-gray-700 hover:text-primary">
              <MessageSquare className="w-4 h-4" /> Coach
            </Link>
            <Link href="/profile" className="flex items-center gap-2 text-gray-700 hover:text-primary">
              <User className="w-4 h-4" /> Profile
            </Link>
            <button
              onClick={() => router.push('/api/auth/signout')}
              className="flex items-center gap-2 text-danger hover:text-red-700"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>

          {/* Mobile Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-50 border-t p-4 space-y-2">
            <Link href="/dashboard" className="block py-2 text-gray-700 hover:text-primary">
              📊 Dashboard
            </Link>
            <Link href="/workout" className="block py-2 text-gray-700 hover:text-primary">
              💪 Workout
            </Link>
            <Link href="/progress" className="block py-2 text-gray-700 hover:text-primary">
              📈 Progress
            </Link>
            <Link href="/coach" className="block py-2 text-gray-700 hover:text-primary">
              🤖 Coach
            </Link>
            <Link href="/profile" className="block py-2 text-gray-700 hover:text-primary">
              👤 Profile
            </Link>
            <button
              onClick={() => router.push('/api/auth/signout')}
              className="w-full text-left py-2 text-danger hover:text-red-700"
            >
              🚪 Sign Out
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {session?.user?.name}! 👋</h1>
          <p className="text-gray-600">Here's your fitness overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <div className="text-gray-500 text-sm font-medium mb-2">Total Workouts</div>
            <div className="text-4xl font-bold text-primary mb-2">{stats.totalWorkouts}</div>
            <p className="text-gray-600 text-sm">All time completions</p>
          </div>
          <div className="card">
            <div className="text-gray-500 text-sm font-medium mb-2">Current Streak</div>
            <div className="text-4xl font-bold text-success mb-2">{stats.currentStreak}</div>
            <p className="text-gray-600 text-sm">Days in a row</p>
          </div>
          <div className="card">
            <div className="text-gray-500 text-sm font-medium mb-2">This Week</div>
            <div className="text-4xl font-bold text-secondary mb-2">{stats.thisWeekWorkouts}</div>
            <p className="text-gray-600 text-sm">Workouts completed</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/workout/today" className="card-hover">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Today's Workout</h3>
                <p className="text-gray-600">3 exercises • 45 minutes</p>
              </div>
              <div className="text-4xl">🏋️</div>
            </div>
          </Link>

          <Link href="/progress" className="card-hover">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Your Progress</h3>
                <p className="text-gray-600">View photos & stats</p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
          </Link>

          <Link href="/coach" className="card-hover">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">AI Coach</h3>
                <p className="text-gray-600">Ask for exercise tips</p>
              </div>
              <div className="text-4xl">🤖</div>
            </div>
          </Link>

          <Link href="/nutrition" className="card-hover">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Nutrition</h3>
                <p className="text-gray-600">Daily guidance</p>
              </div>
              <div className="text-4xl">🍎</div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
