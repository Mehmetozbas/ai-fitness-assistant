'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ArrowLeft, Edit2, LogOut } from 'lucide-react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface UserProfile {
  name: string
  email: string
  age?: number
  height?: number
  weight?: number
  fitnessGoal?: string
  experienceLevel?: string
  availableDays?: number
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<UserProfile>>({})

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status])

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/user/profile-details')
      setProfile(response.data)
      setFormData(response.data)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      await axios.put('/api/user/profile', formData)
      setProfile(formData as UserProfile)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save profile:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading profile...</p>
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
        <h1 className="text-3xl font-bold">My Profile 👤</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {profile && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="card">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
                  <p className="text-gray-600">{profile.email}</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn btn-outline flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
              </div>
            </div>

            {/* Profile Details */}
            <div className="card space-y-4">
              <h3 className="text-xl font-bold mb-4">Personal Information</h3>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Age</label>
                      <input
                        type="number"
                        value={formData.age || ''}
                        onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Height (cm)</label>
                      <input
                        type="number"
                        value={formData.height || ''}
                        onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
                        className="input"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.weight || ''}
                        onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Fitness Goal</label>
                      <select
                        value={formData.fitnessGoal || ''}
                        onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
                        className="input"
                      >
                        <option value="general">General Fitness</option>
                        <option value="muscle_building">Muscle Building</option>
                        <option value="strength">Getting Stronger</option>
                        <option value="endurance">Improving Endurance</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Experience Level</label>
                      <select
                        value={formData.experienceLevel || ''}
                        onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                        className="input"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Available Days</label>
                      <select
                        value={formData.availableDays || ''}
                        onChange={(e) => setFormData({ ...formData, availableDays: parseInt(e.target.value) })}
                        className="input"
                      >
                        {[3, 4, 5, 6, 7].map((day) => (
                          <option key={day} value={day}>
                            {day} days/week
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button onClick={handleSaveProfile} className="btn btn-primary flex-1">
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn btn-outline flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Age</p>
                    <p className="text-lg font-semibold">{profile.age || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Height</p>
                    <p className="text-lg font-semibold">{profile.height ? `${profile.height} cm` : 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Weight</p>
                    <p className="text-lg font-semibold">{profile.weight ? `${profile.weight} kg` : 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Fitness Goal</p>
                    <p className="text-lg font-semibold">{profile.fitnessGoal || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Experience Level</p>
                    <p className="text-lg font-semibold">{profile.experienceLevel || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Available Days</p>
                    <p className="text-lg font-semibold">{profile.availableDays ? `${profile.availableDays} days/week` : 'Not set'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Danger Zone */}
            <div className="card border-2 border-red-200 bg-red-50">
              <h3 className="text-xl font-bold mb-4 text-red-800">Account Settings</h3>
              <button
                onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
                className="btn bg-red-600 text-white hover:bg-red-700 w-full flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
