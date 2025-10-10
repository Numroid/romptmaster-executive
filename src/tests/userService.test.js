import { describe, it, expect, vi } from 'vitest'
import { mockCreateUserProfile, mockGetUserProfile } from '../services/userService'

describe('User Service', () => {
  describe('mockCreateUserProfile', () => {
    it('creates a user profile with correct structure', async () => {
      const profileData = {
        auth0Id: 'auth0|123456',
        email: 'test@example.com',
        name: 'Test User',
        role: 'CFO',
        companySize: '1000-10000',
        industry: 'Technology',
        aiExperience: 'Beginner',
        onboardingCompleted: true
      }

      const result = await mockCreateUserProfile(profileData)

      expect(result).toMatchObject({
        ...profileData,
        id: expect.any(String),
        createdAt: expect.any(String),
        lastLoginAt: expect.any(String)
      })
      expect(result.id).toMatch(/^user_\d+$/)
    })

    it('handles profile creation with minimal data', async () => {
      const profileData = {
        auth0Id: 'auth0|minimal',
        email: 'minimal@example.com',
        name: 'Minimal User'
      }

      const result = await mockCreateUserProfile(profileData)

      expect(result).toMatchObject(profileData)
      expect(result.id).toBeDefined()
      expect(result.createdAt).toBeDefined()
    })
  })

  describe('mockGetUserProfile', () => {
    it('retrieves existing user profile', async () => {
      const profileData = {
        auth0Id: 'auth0|existing',
        email: 'existing@example.com',
        name: 'Existing User',
        role: 'Finance Director'
      }

      // First create the user
      await mockCreateUserProfile(profileData)

      // Then retrieve it
      const result = await mockGetUserProfile('auth0|existing')

      expect(result).toMatchObject(profileData)
    })

    it('throws error for non-existent user', async () => {
      await expect(mockGetUserProfile('auth0|nonexistent')).rejects.toThrow('User not found')
    })
  })
})