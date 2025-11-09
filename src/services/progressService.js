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
 * Get user progress and statistics
 * @param {number} userId - User ID
 * @param {string} token - Auth token
 * @returns {Promise<Object>} User progress data
 */
export const getUserProgress = async (userId, token) => {
  setAuthToken(token)

  try {
    const response = await api.get(`/progress/${userId}`)
    return {
      success: true,
      ...response.data
    }
  } catch (error) {
    console.error('Error fetching user progress:', error)

    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch progress'
    }
  }
}

/**
 * Get user achievements
 * @param {number} userId - User ID
 * @param {string} token - Auth token
 * @returns {Promise<Array>} User achievements
 */
export const getUserAchievements = async (userId, token) => {
  setAuthToken(token)

  try {
    const response = await api.get(`/achievements/${userId}`)
    return {
      success: true,
      achievements: response.data.achievements || []
    }
  } catch (error) {
    console.error('Error fetching achievements:', error)

    return {
      success: false,
      achievements: [],
      error: error.response?.data?.error || 'Failed to fetch achievements'
    }
  }
}

/**
 * Update streak (called on daily login)
 * @param {number} userId - User ID
 * @param {string} token - Auth token
 * @returns {Promise<Object>} Updated streak data
 */
export const updateStreak = async (userId, token) => {
  setAuthToken(token)

  try {
    const response = await api.post('/progress/streak', { userId })
    return {
      success: true,
      ...response.data
    }
  } catch (error) {
    console.error('Error updating streak:', error)

    return {
      success: false,
      error: error.response?.data?.error || 'Failed to update streak'
    }
  }
}

/**
 * Mock progress data for development
 */
export const mockGetUserProgress = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate realistic progress data
      const scenariosCompleted = Math.floor(Math.random() * 15) + 5
      const totalPoints = scenariosCompleted * 125 + Math.floor(Math.random() * 500)
      const level = Math.floor(totalPoints / 500) + 1
      const currentStreak = Math.floor(Math.random() * 14) + 1

      resolve({
        success: true,
        user: {
          id: userId,
          totalPoints,
          currentLevel: level,
          currentStreak,
          longestStreak: Math.max(currentStreak, Math.floor(Math.random() * 20) + 5),
          lastLoginDate: new Date().toISOString()
        },
        progress: {
          scenariosCompleted,
          totalScenarios: 50,
          completionRate: Math.round((scenariosCompleted / 50) * 100),
          averageScore: 75 + Math.floor(Math.random() * 20),
          totalTimeSpent: scenariosCompleted * 15 * 60, // seconds
          moduleProgress: [
            {
              moduleId: 1,
              moduleName: 'Foundation',
              scenariosCompleted: Math.min(scenariosCompleted, 12),
              totalScenarios: 12,
              averageScore: 80 + Math.floor(Math.random() * 15),
              isLocked: false
            },
            {
              moduleId: 2,
              moduleName: 'Intermediate',
              scenariosCompleted: Math.max(0, scenariosCompleted - 12),
              totalScenarios: 15,
              averageScore: scenariosCompleted > 12 ? 75 + Math.floor(Math.random() * 15) : 0,
              isLocked: scenariosCompleted < 10
            },
            {
              moduleId: 3,
              moduleName: 'Advanced',
              scenariosCompleted: Math.max(0, scenariosCompleted - 27),
              totalScenarios: 13,
              averageScore: scenariosCompleted > 27 ? 70 + Math.floor(Math.random() * 15) : 0,
              isLocked: scenariosCompleted < 25
            },
            {
              moduleId: 4,
              moduleName: 'Expert',
              scenariosCompleted: 0,
              totalScenarios: 10,
              averageScore: 0,
              isLocked: scenariosCompleted < 40
            }
          ],
          skillScores: {
            clarity: 75 + Math.floor(Math.random() * 20),
            context: 70 + Math.floor(Math.random() * 20),
            specificity: 80 + Math.floor(Math.random() * 15),
            format: 65 + Math.floor(Math.random() * 25),
            businessValue: 70 + Math.floor(Math.random() * 20),
            innovation: 60 + Math.floor(Math.random() * 25)
          },
          recentActivity: generateRecentActivity(scenariosCompleted)
        }
      })
    }, 400)
  })
}

/**
 * Mock achievements data
 */
export const mockGetUserAchievements = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allAchievements = [
        {
          id: 'first_steps',
          badge_type: 'first_steps',
          badge_name: 'First Steps',
          badge_description: 'Completed your first scenario',
          icon: '🎯',
          earned: true,
          earnedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'week_warrior',
          badge_type: 'week_warrior',
          badge_name: 'Week Warrior',
          badge_description: 'Maintained a 7-day streak',
          icon: '🔥',
          earned: Math.random() > 0.5,
          earnedDate: Math.random() > 0.5 ? new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() : null
        },
        {
          id: 'quality_master',
          badge_type: 'quality_master',
          badge_name: 'Quality Master',
          badge_description: 'Scored 90%+ on 10 scenarios',
          icon: '💎',
          earned: Math.random() > 0.7,
          earnedDate: Math.random() > 0.7 ? new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() : null
        },
        {
          id: 'speed_demon',
          badge_type: 'speed_demon',
          badge_name: 'Speed Demon',
          badge_description: 'Completed 5 scenarios in one session',
          icon: '🚀',
          earned: false,
          earnedDate: null
        },
        {
          id: 'module_champion',
          badge_type: 'module_champion',
          badge_name: 'Module Champion',
          badge_description: 'Completed an entire module',
          icon: '📚',
          earned: Math.random() > 0.6,
          earnedDate: Math.random() > 0.6 ? new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() : null
        },
        {
          id: 'perfectionist',
          badge_type: 'perfectionist',
          badge_name: 'Perfectionist',
          badge_description: 'Scored a perfect 100%',
          icon: '🏆',
          earned: false,
          earnedDate: null
        },
        {
          id: 'lightning_round',
          badge_type: 'lightning_round',
          badge_name: 'Lightning Round',
          badge_description: 'Completed a scenario in under 5 minutes',
          icon: '⚡',
          earned: Math.random() > 0.8,
          earnedDate: Math.random() > 0.8 ? new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() : null
        },
        {
          id: 'graduate',
          badge_type: 'graduate',
          badge_name: 'Graduate',
          badge_description: 'Completed all 50 scenarios',
          icon: '🎓',
          earned: false,
          earnedDate: null
        },
        {
          id: 'innovator',
          badge_type: 'innovator',
          badge_name: 'Innovator',
          badge_description: 'Created a custom prompt template',
          icon: '💡',
          earned: false,
          earnedDate: null
        },
        {
          id: 'promptmaster',
          badge_type: 'promptmaster',
          badge_name: 'PromptMaster',
          badge_description: 'Achieved 90%+ average score',
          icon: '👑',
          earned: false,
          earnedDate: null
        }
      ]

      resolve({
        success: true,
        achievements: allAchievements,
        earnedCount: allAchievements.filter(a => a.earned).length,
        totalCount: allAchievements.length
      })
    }, 300)
  })
}

/**
 * Generate realistic recent activity
 */
function generateRecentActivity(scenariosCompleted) {
  const activities = []
  const activityTypes = [
    { type: 'completion', icon: '✅', verb: 'Completed' },
    { type: 'achievement', icon: '🏆', verb: 'Earned' },
    { type: 'level_up', icon: '⬆️', verb: 'Leveled up to' }
  ]

  const scenarios = [
    'Budget Analysis Mastery',
    'Board Presentation Excellence',
    'Risk Assessment Pro',
    'Financial Forecasting Expert',
    'Competitive Analysis Guru'
  ]

  for (let i = 0; i < Math.min(scenariosCompleted, 5); i++) {
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)]
    const daysAgo = i + Math.floor(Math.random() * 3)

    if (type.type === 'completion') {
      activities.push({
        id: `activity_${i}`,
        type: type.type,
        icon: type.icon,
        message: `${type.verb} "${scenarios[Math.floor(Math.random() * scenarios.length)]}"`,
        score: 75 + Math.floor(Math.random() * 20),
        timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString()
      })
    } else if (type.type === 'achievement') {
      activities.push({
        id: `activity_${i}`,
        type: type.type,
        icon: type.icon,
        message: `${type.verb} "Quality Master" badge`,
        timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString()
      })
    } else {
      activities.push({
        id: `activity_${i}`,
        type: type.type,
        icon: type.icon,
        message: `${type.verb} Level ${Math.floor(Math.random() * 10) + 1}`,
        timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString()
      })
    }
  }

  return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

/**
 * Calculate level name based on level number
 */
export const getLevelName = (level) => {
  if (level <= 3) return 'Beginner'
  if (level <= 6) return 'Developing'
  if (level <= 10) return 'Proficient'
  if (level <= 15) return 'Advanced'
  return 'Expert'
}

/**
 * Calculate points needed for next level
 */
export const getPointsForNextLevel = (currentPoints) => {
  const currentLevel = Math.floor(currentPoints / 500)
  const nextLevelPoints = (currentLevel + 1) * 500
  return nextLevelPoints - currentPoints
}

/**
 * Format time duration
 */
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

/**
 * Format date relative to now
 */
export const formatRelativeTime = (timestamp) => {
  const now = new Date()
  const date = new Date(timestamp)
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return date.toLocaleDateString()
}

export default {
  getUserProgress,
  getUserAchievements,
  updateStreak,
  mockGetUserProgress,
  mockGetUserAchievements,
  getLevelName,
  getPointsForNextLevel,
  formatDuration,
  formatRelativeTime
}
