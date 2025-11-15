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
 * Sync user from Auth0 to database
 * @param {Object} auth0User - Auth0 user object
 * @param {string} token - Auth token
 * @returns {Promise<Object>} Database user data with integer ID
 */
export const syncUser = async (auth0User, token) => {
  setAuthToken(token)

  try {
    const response = await api.post('/users/sync', {
      auth0_id: auth0User.sub,
      email: auth0User.email,
      name: auth0User.name,
      picture: auth0User.picture
    })

    if (response.data.success) {
      // Store user ID in localStorage for quick access
      localStorage.setItem('userId', response.data.user.id)
      localStorage.setItem('userEmail', response.data.user.email)

      return {
        success: true,
        user: response.data.user
      }
    }

    return {
      success: false,
      error: 'Failed to sync user'
    }
  } catch (error) {
    console.error('Error syncing user:', error)
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to sync user'
    }
  }
}

/**
 * Get user by Auth0 ID
 * @param {string} auth0Id - Auth0 ID
 * @param {string} token - Auth token
 * @returns {Promise<Object>} User data
 */
export const getUserByAuth0Id = async (auth0Id, token) => {
  setAuthToken(token)

  try {
    const response = await api.get(`/users/by-auth0/${encodeURIComponent(auth0Id)}`)

    if (response.data.success) {
      localStorage.setItem('userId', response.data.user.id)
      return {
        success: true,
        user: response.data.user
      }
    }

    return {
      success: false,
      error: 'User not found'
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch user'
    }
  }
}

// User Profile Operations
export const createUserProfile = async (profileData, token) => {
  setAuthToken(token)
  try {
    const response = await api.post('/users/profile', profileData)
    return response.data
  } catch (error) {
    console.error('Error creating user profile:', error)
    throw error
  }
}

export const getUserProfile = async (auth0Id, token) => {
  setAuthToken(token)
  try {
    const response = await api.get(`/users/profile/${auth0Id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
}

export const updateUserProfile = async (auth0Id, updates, token) => {
  setAuthToken(token)
  try {
    const response = await api.put(`/users/profile/${auth0Id}`, updates)
    return response.data
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

// User Progress Operations
export const getUserProgress = async (userId, token) => {
  setAuthToken(token)
  try {
    const response = await api.get(`/users/${userId}/progress`)
    return response.data
  } catch (error) {
    console.error('Error fetching user progress:', error)
    throw error
  }
}

export const updateUserProgress = async (userId, progressData, token) => {
  setAuthToken(token)
  try {
    const response = await api.put(`/users/${userId}/progress`, progressData)
    return response.data
  } catch (error) {
    console.error('Error updating user progress:', error)
    throw error
  }
}

// For development/testing - mock data storage
const mockStorage = {
  users: new Map(),
  progress: new Map()
}

// Mock implementation for development (when no backend is available)
export const mockCreateUserProfile = (profileData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userId = `user_${Date.now()}`
      const userProfile = {
        id: userId,
        ...profileData,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      }
      
      mockStorage.users.set(profileData.auth0Id, userProfile)
      
      // Initialize progress
      const initialProgress = {
        userId: userId,
        currentLevel: 'beginner',
        totalPoints: 0,
        scenariosCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityAt: new Date().toISOString(),
        skillScores: {
          clarity: 0,
          specificity: 0,
          businessContext: 0,
          efficiency: 0
        }
      }
      
      mockStorage.progress.set(userId, initialProgress)
      
      resolve(userProfile)
    }, 500) // Simulate network delay
  })
}

export const mockGetUserProfile = (auth0Id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockStorage.users.get(auth0Id)
      if (user) {
        resolve(user)
      } else {
        reject(new Error('User not found'))
      }
    }, 300)
  })
}