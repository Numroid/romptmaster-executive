import { describe, it, expect, beforeEach } from 'vitest'
import { 
  mockGetAllScenarios, 
  mockGetScenarioById, 
  mockGetScenariosByCategory, 
  mockGetScenariosByDifficulty,
  getDifficultyColor,
  getCategoryIcon,
  formatEstimatedTime
} from '../services/scenarioService'

describe('Scenario Service', () => {
  describe('Mock Data Operations', () => {
    it('should fetch all scenarios', async () => {
      const scenarios = await mockGetAllScenarios()
      
      expect(scenarios).toBeDefined()
      expect(Array.isArray(scenarios)).toBe(true)
      expect(scenarios.length).toBe(5)
      
      // Verify all scenarios have required properties
      scenarios.forEach(scenario => {
        expect(scenario).toHaveProperty('id')
        expect(scenario).toHaveProperty('title')
        expect(scenario).toHaveProperty('description')
        expect(scenario).toHaveProperty('businessContext')
        expect(scenario).toHaveProperty('objective')
        expect(scenario).toHaveProperty('difficulty')
        expect(scenario).toHaveProperty('category')
        expect(scenario).toHaveProperty('estimatedTime')
        expect(scenario).toHaveProperty('isActive')
        expect(scenario.isActive).toBe(true)
      })
    })

    it('should fetch scenario by ID', async () => {
      const scenarioId = 'scenario_budget_analysis'
      const scenario = await mockGetScenarioById(scenarioId)
      
      expect(scenario).toBeDefined()
      expect(scenario.id).toBe(scenarioId)
      expect(scenario.title).toBe('Master the Art of Budget Analysis')
      expect(scenario.category).toBe('budget')
      expect(scenario.difficulty).toBe('beginner')
    })

    it('should throw error for non-existent scenario', async () => {
      const invalidId = 'non_existent_scenario'
      
      await expect(mockGetScenarioById(invalidId)).rejects.toThrow('Scenario not found')
    })

    it('should filter scenarios by category', async () => {
      const budgetScenarios = await mockGetScenariosByCategory('budget')
      
      expect(budgetScenarios).toBeDefined()
      expect(Array.isArray(budgetScenarios)).toBe(true)
      expect(budgetScenarios.length).toBeGreaterThan(0)
      
      budgetScenarios.forEach(scenario => {
        expect(scenario.category).toBe('budget')
      })
    })

    it('should filter scenarios by difficulty', async () => {
      const beginnerScenarios = await mockGetScenariosByDifficulty('beginner')
      
      expect(beginnerScenarios).toBeDefined()
      expect(Array.isArray(beginnerScenarios)).toBe(true)
      expect(beginnerScenarios.length).toBeGreaterThan(0)
      
      beginnerScenarios.forEach(scenario => {
        expect(scenario.difficulty).toBe('beginner')
      })
    })

    it('should return empty array for non-existent category', async () => {
      const scenarios = await mockGetScenariosByCategory('non_existent_category')
      
      expect(scenarios).toBeDefined()
      expect(Array.isArray(scenarios)).toBe(true)
      expect(scenarios.length).toBe(0)
    })
  })

  describe('Utility Functions', () => {
    it('should return correct difficulty colors', () => {
      expect(getDifficultyColor('beginner')).toBe('#10b981')
      expect(getDifficultyColor('intermediate')).toBe('#f59e0b')
      expect(getDifficultyColor('advanced')).toBe('#ef4444')
      expect(getDifficultyColor('unknown')).toBe('#6b7280')
    })

    it('should return correct category icons', () => {
      expect(getCategoryIcon('budget')).toBe('💰')
      expect(getCategoryIcon('risk')).toBe('⚠️')
      expect(getCategoryIcon('strategy')).toBe('🎯')
      expect(getCategoryIcon('presentation')).toBe('📊')
      expect(getCategoryIcon('analysis')).toBe('📈')
      expect(getCategoryIcon('unknown')).toBe('📋')
    })

    it('should format estimated time correctly', () => {
      expect(formatEstimatedTime(30)).toBe('30 min')
      expect(formatEstimatedTime(60)).toBe('1h')
      expect(formatEstimatedTime(90)).toBe('1h 30m')
      expect(formatEstimatedTime(120)).toBe('2h')
      expect(formatEstimatedTime(150)).toBe('2h 30m')
    })
  })

  describe('Data Integrity', () => {
    it('should have all 5 core business scenarios', async () => {
      const scenarios = await mockGetAllScenarios()
      const expectedScenarios = [
        'scenario_budget_analysis',
        'scenario_board_presentation', 
        'scenario_risk_assessment',
        'scenario_financial_forecast',
        'scenario_competitive_analysis'
      ]
      
      const scenarioIds = scenarios.map(s => s.id)
      expectedScenarios.forEach(expectedId => {
        expect(scenarioIds).toContain(expectedId)
      })
    })

    it('should have proper difficulty progression', async () => {
      const scenarios = await mockGetAllScenarios()
      const difficulties = scenarios.map(s => s.difficulty)
      
      expect(difficulties).toContain('beginner')
      expect(difficulties).toContain('intermediate')
      expect(difficulties).toContain('advanced')
    })

    it('should have all required business categories', async () => {
      const scenarios = await mockGetAllScenarios()
      const categories = [...new Set(scenarios.map(s => s.category))]
      
      const expectedCategories = ['budget', 'presentation', 'risk', 'analysis', 'strategy']
      expectedCategories.forEach(category => {
        expect(categories).toContain(category)
      })
    })

    it('should have realistic time estimates', async () => {
      const scenarios = await mockGetAllScenarios()
      
      scenarios.forEach(scenario => {
        expect(scenario.estimatedTime).toBeGreaterThan(0)
        expect(scenario.estimatedTime).toBeLessThan(60) // Less than 1 hour for MVP
      })
    })

    it('should have proper business context and objectives', async () => {
      const scenarios = await mockGetAllScenarios()
      
      scenarios.forEach(scenario => {
        expect(scenario.businessContext.length).toBeGreaterThan(100)
        expect(scenario.objective.length).toBeGreaterThan(50)
        expect(scenario.hints).toBeDefined()
        expect(Array.isArray(scenario.hints)).toBe(true)
        expect(scenario.hints.length).toBeGreaterThan(0)
        expect(scenario.successCriteria).toBeDefined()
        expect(Array.isArray(scenario.successCriteria)).toBe(true)
        expect(scenario.successCriteria.length).toBeGreaterThan(0)
      })
    })
  })
})