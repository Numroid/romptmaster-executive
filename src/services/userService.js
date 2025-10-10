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