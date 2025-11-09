import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

/**
 * Submit and evaluate a user's prompt
 * @param {number} userId - User ID
 * @param {string} scenarioId - Scenario ID
 * @param {string} userPrompt - User's submitted prompt
 * @param {number} timeSpent - Time spent in seconds
 * @param {string} token - Auth token
 * @returns {Promise<Object>} Evaluation result
 */
export const submitPromptForEvaluation = async (userId, scenarioId, userPrompt, timeSpent, token) => {
  setAuthToken(token)

  try {
    const response = await api.post('/evaluate', {
      userId,
      scenarioId,
      userPrompt,
      timeSpent
    })

    return {
      success: true,
      ...response.data
    }
  } catch (error) {
    console.error('Error evaluating prompt:', error)

    // Return structured error
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to evaluate prompt',
      message: error.response?.data?.message || error.message
    }
  }
}

/**
 * Get evaluation history for a specific scenario
 * @param {number} userId - User ID
 * @param {string} scenarioId - Scenario ID
 * @param {string} token - Auth token
 * @returns {Promise<Array>} Array of previous attempts
 */
export const getEvaluationHistory = async (userId, scenarioId, token) => {
  setAuthToken(token)

  try {
    const response = await api.get(`/evaluate/history/${userId}/${scenarioId}`)
    return {
      success: true,
      attempts: response.data.attempts || []
    }
  } catch (error) {
    console.error('Error fetching evaluation history:', error)

    return {
      success: false,
      attempts: [],
      error: error.response?.data?.error || 'Failed to fetch evaluation history'
    }
  }
}

/**
 * Mock evaluation for development/testing
 * Simulates API delay and returns realistic feedback
 */
export const mockEvaluatePrompt = async (scenarioId, userPrompt, timeSpent = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate realistic scoring based on prompt length and content
      const promptLength = userPrompt.trim().length
      const hasSpecifics = userPrompt.toLowerCase().includes('specific') ||
                          userPrompt.toLowerCase().includes('detailed')
      const hasFormat = userPrompt.toLowerCase().includes('format') ||
                       userPrompt.toLowerCase().includes('structure')
      const hasContext = userPrompt.toLowerCase().includes('context') ||
                        userPrompt.toLowerCase().includes('background')

      // Calculate base score
      let baseScore = 60
      if (promptLength > 200) baseScore += 10
      if (promptLength > 400) baseScore += 10
      if (hasSpecifics) baseScore += 5
      if (hasFormat) baseScore += 5
      if (hasContext) baseScore += 5

      const overallScore = Math.min(95, baseScore)

      // Calculate criteria scores
      const criteriaScores = [
        { name: 'Clarity & Specificity', score: overallScore + Math.floor(Math.random() * 10) - 5 },
        { name: 'Context Provided', score: hasContext ? overallScore : overallScore - 15 },
        { name: 'Output Format Defined', score: hasFormat ? overallScore + 5 : overallScore - 10 },
        { name: 'Actionable Instructions', score: overallScore + Math.floor(Math.random() * 10) - 5 },
        { name: 'Professional Tone', score: overallScore + Math.floor(Math.random() * 5) }
      ].map(criteria => ({
        ...criteria,
        score: Math.max(0, Math.min(100, criteria.score))
      }))

      resolve({
        success: true,
        attempt: {
          id: Math.floor(Math.random() * 10000),
          score: overallScore,
          criteria_scores: criteriaScores,
          strengths: [
            'Your prompt clearly states the main objective',
            'You provided relevant business context',
            promptLength > 300 ? 'Good level of detail in your requirements' : 'You kept your prompt concise'
          ].filter((_, i) => i < 2 + Math.floor(Math.random() * 2)),
          improvements: [
            !hasFormat && 'Specify the desired output format (e.g., bullet points, table, paragraphs)',
            !hasContext && 'Include more business context to help the AI understand priorities',
            promptLength < 200 && 'Add more specific details about what you need',
            'Consider adding examples to clarify expectations'
          ].filter(Boolean).slice(0, 2 + Math.floor(Math.random() * 2)),
          rewrite_example: `${userPrompt.substring(0, 100)}...\n\nEnhanced version:\n\nPlease analyze the Q3 budget variance and create an executive summary that includes:\n1. Key variance drivers with specific percentages\n2. Root cause analysis for each major variance\n3. Actionable recommendations prioritized by impact\n4. Format the output as a professional memo with clear sections`,
          key_takeaway: 'Great prompts balance specificity with context—you\'re on the right track!',
          attempt_number: 1,
          is_first_completion: overallScore >= 70
        },
        points: overallScore >= 70 ? {
          base: 100,
          quality: overallScore >= 90 ? 50 : overallScore >= 80 ? 25 : 0,
          speed: timeSpent < 300 ? 25 : 0,
          streak: 0,
          total: 100 + (overallScore >= 90 ? 50 : overallScore >= 80 ? 25 : 0) + (timeSpent < 300 ? 25 : 0)
        } : null,
        newLevel: null,
        newAchievements: overallScore >= 90 ? [
          {
            badge_type: 'quality_master',
            badge_name: 'Quality Master',
            badge_description: 'Scored 90% or higher on a scenario'
          }
        ] : []
      })
    }, 2000) // Simulate 2 second API delay
  })
}

export default {
  submitPromptForEvaluation,
  getEvaluationHistory,
  mockEvaluatePrompt
}
