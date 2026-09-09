import { BodyAnalysisResult, NutritionGuidance } from '@/types'

/**
 * AI Service for handling all AI-related operations
 * Can be swapped to use different AI providers (OpenAI, Claude, etc.)
 */

interface AIProviderConfig {
  provider: 'openai' | 'mock'
  apiKey?: string
}

class AIService {
  private provider: 'openai' | 'mock' = 'mock'
  private apiKey?: string

  constructor(config?: AIProviderConfig) {
    if (config) {
      this.provider = config.provider
      this.apiKey = config.apiKey
    } else {
      this.provider = process.env.OPENAI_API_KEY ? 'openai' : 'mock'
      this.apiKey = process.env.OPENAI_API_KEY
    }
  }

  /**
   * Analyze body photos using AI
   * Returns posture, symmetry, and training focus areas
   */
  async analyzeBodyPhotos(
    photos: {
      front: string
      back: string
      right: string
      left: string
    },
    userContext?: {
      age?: number
      weight?: number
      height?: number
      fitnessGoal?: string
    }
  ): Promise<BodyAnalysisResult> {
    if (this.provider === 'openai' && this.apiKey) {
      return this.analyzeWithOpenAI(photos, userContext)
    }
    return this.analyzeWithMock(photos, userContext)
  }

  /**
   * Generate personalized workout plan
   */
  async generateWorkoutPlan(
    userProfile: {
      goal: string
      experienceLevel: string
      availableDays: number
      equipmentAvailable: string[]
      bodyAnalysis?: BodyAnalysisResult
    }
  ): Promise<any> {
    if (this.provider === 'openai' && this.apiKey) {
      return this.generateWorkoutWithOpenAI(userProfile)
    }
    return this.generateWorkoutWithMock(userProfile)
  }

  /**
   * Get nutrition guidance
   */
  async getNutritionGuidance(
    userProfile: {
      goal: string
      age: number
      weight: number
      height: number
      activityLevel: string
    }
  ): Promise<NutritionGuidance> {
    if (this.provider === 'openai' && this.apiKey) {
      return this.getNutritionWithOpenAI(userProfile)
    }
    return this.getNutritionWithMock(userProfile)
  }

  /**
   * Chat with AI coach
   */
  async coachChat(
    message: string,
    context?: {
      recentWorkouts?: any[]
      goals?: string[]
      equipment?: string[]
    }
  ): Promise<string> {
    if (this.provider === 'openai' && this.apiKey) {
      return this.chatWithOpenAI(message, context)
    }
    return this.chatWithMock(message, context)
  }

  // ============ OpenAI Implementation ============
  private async analyzeWithOpenAI(
    photos: any,
    userContext?: any
  ): Promise<BodyAnalysisResult> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `You are a professional fitness coach analyzing body photos for a fitness app. 
                  
Please analyze these 4 photos (front, back, right side, left side) and provide:
1. Posture observations (shoulder alignment, spinal alignment, general posture)
2. Symmetry observations (left/right balance, asymmetries)
3. Areas that may benefit from training focus

IMPORTANT: This is an AI-based estimation, NOT a medical diagnosis. Do not claim to determine body fat percentage or medical conditions.

User context: ${JSON.stringify(userContext || {})}

Respond in JSON format: {
  "postureAnalysis": { "shoulderAlignment": "...", "generalPosture": "...", "confidence": 0.8 },
  "symmetryAnalysis": { "leftRightBalance": "...", "asymmetries": [], "confidence": 0.85 },
  "trainingFocusAreas": ["area1", "area2"],
  "disclaimer": "This is an AI-based assessment, not a medical diagnosis."
}`,
                },
              ],
            },
          ],
          max_tokens: 1000,
        }),
      })

      const data = await response.json()
      const content = data.choices[0].message.content
      return JSON.parse(content)
    } catch (error) {
      console.error('OpenAI analysis error:', error)
      return this.analyzeWithMock(photos, userContext)
    }
  }

  private async generateWorkoutWithOpenAI(userProfile: any): Promise<any> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: `Create a personalized ${userProfile.availableDays}-day workout plan based on:
              
Goal: ${userProfile.goal}
Experience Level: ${userProfile.experienceLevel}
Available Equipment: ${userProfile.equipmentAvailable.join(', ')}
Focus Areas: ${userProfile.bodyAnalysis?.trainingFocusAreas.join(', ') || 'general fitness'}

Return as JSON array with daily workouts. Each workout should have exercises with name, sets, reps, rest time, and instructions.`,
            },
          ],
          max_tokens: 2000,
        }),
      })

      const data = await response.json()
      const content = data.choices[0].message.content
      return JSON.parse(content)
    } catch (error) {
      console.error('OpenAI workout generation error:', error)
      return this.generateWorkoutWithMock(userProfile)
    }
  }

  private async getNutritionWithOpenAI(userProfile: any): Promise<NutritionGuidance> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: `Calculate approximate daily nutrition guidance for:
Goal: ${userProfile.goal}
Age: ${userProfile.age}
Weight: ${userProfile.weight}kg
Height: ${userProfile.height}cm
Activity Level: ${userProfile.activityLevel}

Provide as JSON: { "dailyCalories": number, "protein": number, "carbs": number, "fat": number }`,
            },
          ],
          max_tokens: 500,
        }),
      })

      const data = await response.json()
      const content = data.choices[0].message.content
      return JSON.parse(content)
    } catch (error) {
      console.error('OpenAI nutrition error:', error)
      return this.getNutritionWithMock(userProfile)
    }
  }

  private async chatWithOpenAI(message: string, context?: any): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a helpful fitness coach in a fitness app. Provide safe, beginner-friendly fitness guidance. 
Do not give medical advice. Context: ${JSON.stringify(context || {})}`,
            },
            {
              role: 'user',
              content: message,
            },
          ],
          max_tokens: 1000,
        }),
      })

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('OpenAI chat error:', error)
      return this.chatWithMock(message, context)
    }
  }

  // ============ Mock Implementation (for development) ============
  private analyzeWithMock(
    photos: any,
    userContext?: any
  ): BodyAnalysisResult {
    return {
      postureAnalysis: {
        shoulderAlignment: 'Good shoulder alignment. Shoulders appear relatively level.',
        generalPosture: 'Neutral standing posture with minimal forward head position.',
        confidence: 0.75,
      },
      symmetryAnalysis: {
        leftRightBalance: 'Good overall left-right symmetry.',
        asymmetries: ['Slight right side dominance', 'Left shoulder marginally higher'],
        confidence: 0.72,
      },
      trainingFocusAreas: [
        'Core stability',
        'Shoulder stability',
        'Posture awareness',
      ],
      disclaimer: 'This is an AI-based assessment for general fitness guidance only, not a medical diagnosis.',
    }
  }

  private generateWorkoutWithMock(userProfile: any): any {
    const baseExercises = [
      {
        name: 'Push-ups',
        sets: 3,
        reps: 10,
        restTime: 60,
        instructions: 'Standard push-ups with proper form',
      },
      {
        name: 'Squats',
        sets: 3,
        reps: 15,
        restTime: 60,
        instructions: 'Body weight squats with proper depth',
      },
      {
        name: 'Plank',
        sets: 3,
        duration: 30,
        restTime: 45,
        instructions: 'Hold a straight plank position',
      },
    ]

    return {
      plan: 'Beginner Full Body Workout',
      daysPerWeek: userProfile.availableDays,
      exercises: baseExercises,
    }
  }

  private getNutritionWithMock(userProfile: any): NutritionGuidance {
    // Simple calculation based on weight
    const baseCals = userProfile.weight * 30
    return {
      dailyCalories: Math.round(baseCals),
      protein: Math.round(userProfile.weight * 1.6),
      carbs: Math.round(baseCals * 0.45 / 4),
      fat: Math.round(baseCals * 0.3 / 9),
    }
  }

  private chatWithMock(message: string, context?: any): string {
    const responses: Record<string, string> = {
      'how do i perform push-ups':
        'Great question! For push-ups: 1. Start in plank position 2. Lower your body until chest nearly touches floor 3. Push back up to starting position. Keep your body straight throughout.',
      'what exercises can i do with dumbbells':
        'With dumbbells you can do: Dumbbell curls, shoulder presses, dumbbell rows, squats, deadlifts, and many more! What muscle group interests you?',
      'default':
        'I\'d be happy to help with your fitness question! Ask me about exercises, workout structure, or training advice.',
    }

    const lowerMessage = message.toLowerCase()
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) return response
    }
    return responses.default
  }
}

export const aiService = new AIService()
