// User and Auth types
export interface User {
  id: string
  email: string
  name?: string
  image?: string
  createdAt: Date
}

// Fitness Goal types
export type FitnessGoal = 'general' | 'muscle_building' | 'strength' | 'endurance'
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced'
export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' | 'full_body'

// Body Analysis types
export interface PostureAnalysis {
  shoulderAlignment: string
  generalPosture: string
  confidence: number
}

export interface SymmetryAnalysis {
  leftRightBalance: string
  asymmetries: string[]
  confidence: number
}

export interface BodyAnalysisResult {
  postureAnalysis: PostureAnalysis
  symmetryAnalysis: SymmetryAnalysis
  trainingFocusAreas: string[]
  disclaimer: string
}

// Workout types
export interface Exercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
  equipmentRequired: string[]
  difficulty: string
  instructions: string
  sets: number
  reps?: number
  duration?: number
  imageUrl?: string
}

export interface WorkoutSession {
  id: string
  name: string
  exercises: Exercise[]
  duration?: number
}

export interface CompletedExercise {
  exerciseId: string
  completed: boolean
  actualSets?: number
  actualReps?: number
  notes?: string
}

// Nutrition types
export interface NutritionGuidance {
  dailyCalories: number
  protein: number
  carbs: number
  fat: number
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
