import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AdaptivePromptBuilder from '../components/AdaptivePromptBuilder'

// Mock the technique service
vi.mock('../services/promptTechniqueService', () => ({
  PromptTechniques: {
    BASIC_INSTRUCTION: {
      id: 'basic_instruction',
      name: 'Basic Instruction',
      level: 'beginner',
      description: 'Clear, direct instructions',
      effectiveness: { budget: 8, risk: 6, strategy: 5, presentation: 7, analysis: 7 }
    },
    ROLE_PLAYING: {
      id: 'role_playing',
      name: 'Role Playing',
      level: 'intermediate',
      description: 'Assign specific expertise',
      effectiveness: { budget: 9, risk: 9, strategy: 8, presentation: 8, analysis: 9 }
    }
  },
  TechniqueCombinations: {
    EXECUTIVE_ANALYSIS: {
      name: 'Executive Analysis',
      techniques: ['role_playing', 'context_setting', 'output_format'],
      description: 'Comprehensive analysis for executives',
      bestFor: ['strategy', 'risk', 'presentation']
    }
  },
  getTechniquesByLevel: vi.fn(() => []),
  getTechniquesForCategory: vi.fn(() => []),
  getRecommendedTechniques: vi.fn(() => []),
  assessPromptQuality: vi.fn(() => ({
    score: 75,
    techniques: ['basic_instruction'],
    suggestions: ['Add more specific instructions'],
    quality: 'good'
  })),
  generateLearningPath: vi.fn(() => [])
}))

describe('AdaptivePromptBuilder', () => {
  const defaultProps = {
    onPromptChange: vi.fn(),
    initialPrompt: '',
    difficulty: 'beginner',
    category: 'budget',
    userLevel: 'beginner'
  }

  it('renders with beginner difficulty showing 3 sections', () => {
    render(<AdaptivePromptBuilder {...defaultProps} />)
    
    expect(screen.getByText('Beginner Builder')).toBeInTheDocument()
    expect(screen.getByText('3 sections available')).toBeInTheDocument()
    
    // Should show task, context, format sections for beginner
    expect(screen.getByText('Specify the Task')).toBeInTheDocument()
    expect(screen.getByText('Provide Context')).toBeInTheDocument()
    expect(screen.getByText('Output Format')).toBeInTheDocument()
    
    // Should not show advanced sections
    expect(screen.queryByText('Define Your Role')).not.toBeInTheDocument()
    expect(screen.queryByText('Reasoning Process')).not.toBeInTheDocument()
  })

  it('renders with intermediate difficulty showing 5 sections', () => {
    render(<AdaptivePromptBuilder {...defaultProps} difficulty="intermediate" />)
    
    expect(screen.getByText('Intermediate Builder')).toBeInTheDocument()
    expect(screen.getByText('5 sections available')).toBeInTheDocument()
    
    // Should show role and examples sections for intermediate
    expect(screen.getByText('Define Your Role')).toBeInTheDocument()
    expect(screen.getByText('Examples')).toBeInTheDocument()
  })

  it('renders with advanced difficulty showing 7 sections', () => {
    render(<AdaptivePromptBuilder {...defaultProps} difficulty="advanced" />)
    
    expect(screen.getByText('Advanced Builder')).toBeInTheDocument()
    expect(screen.getByText('7 sections available')).toBeInTheDocument()
    
    // Should show all sections for advanced
    expect(screen.getByText('Define Your Role')).toBeInTheDocument()
    expect(screen.getByText('Constraints & Limitations')).toBeInTheDocument()
    expect(screen.getByText('Reasoning Process')).toBeInTheDocument()
  })

  it('shows technique combinations for advanced users', () => {
    render(<AdaptivePromptBuilder {...defaultProps} difficulty="advanced" category="strategy" />)
    
    expect(screen.getByText('Quick Start Templates')).toBeInTheDocument()
    expect(screen.getByText('Executive Analysis')).toBeInTheDocument()
  })

  it('calls onPromptChange when sections are updated', async () => {
    const onPromptChange = vi.fn()
    render(<AdaptivePromptBuilder {...defaultProps} onPromptChange={onPromptChange} />)
    
    const taskTextarea = screen.getByPlaceholderText(/Analyze the budget variance data/i)
    fireEvent.change(taskTextarea, { target: { value: 'Test task input' } })
    
    await waitFor(() => {
      expect(onPromptChange).toHaveBeenCalled()
    })
  })

  it('shows quality feedback based on prompt assessment', () => {
    render(<AdaptivePromptBuilder {...defaultProps} />)
    
    // Should show initial state
    expect(screen.getByText('Start building your prompt')).toBeInTheDocument()
    
    // Add some content to trigger assessment
    const taskTextarea = screen.getByPlaceholderText(/Analyze the budget variance data/i)
    fireEvent.change(taskTextarea, { target: { value: 'Analyze the budget data thoroughly' } })
    
    // Should show quality feedback
    expect(screen.getByText(/Score:/)).toBeInTheDocument()
  })

  it('shows technique suggestions when available', () => {
    const mockRecommendations = [
      {
        id: 'role_playing',
        name: 'Role Playing',
        description: 'Assign specific expertise',
        example: 'You are a senior analyst...',
        effectiveness: { budget: 9 }
      }
    ]
    
    const { getTechniquesForCategory, getRecommendedTechniques } = require('../services/promptTechniqueService')
    getRecommendedTechniques.mockReturnValue(mockRecommendations)
    
    render(<AdaptivePromptBuilder {...defaultProps} />)
    
    // Add content to trigger suggestions
    const taskTextarea = screen.getByPlaceholderText(/Analyze the budget variance data/i)
    fireEvent.change(taskTextarea, { target: { value: 'Analyze the budget' } })
    
    expect(screen.getByText('💡 Suggested Improvements')).toBeInTheDocument()
  })

  it('opens technique guide when button is clicked', () => {
    render(<AdaptivePromptBuilder {...defaultProps} />)
    
    const guideButton = screen.getByText('📚 Technique Guide')
    fireEvent.click(guideButton)
    
    expect(screen.getByText('Prompt Engineering Technique Guide')).toBeInTheDocument()
  })

  it('shows advanced tips when toggled', () => {
    render(<AdaptivePromptBuilder {...defaultProps} />)
    
    const advancedButton = screen.getByText('Show Advanced Tips')
    fireEvent.click(advancedButton)
    
    expect(screen.getByText('📊 Category-Specific Techniques')).toBeInTheDocument()
    expect(screen.getByText('📈 Your Learning Path')).toBeInTheDocument()
  })

  it('applies technique combination when selected', () => {
    render(<AdaptivePromptBuilder {...defaultProps} difficulty="advanced" category="strategy" />)
    
    const combinationCard = screen.getByText('Executive Analysis')
    fireEvent.click(combinationCard)
    
    // Should auto-fill some sections
    const roleTextarea = screen.getByPlaceholderText(/You are a senior financial analyst/i)
    expect(roleTextarea.value).toContain('senior strategy expert')
  })

  it('shows prompt preview when content is added', () => {
    render(<AdaptivePromptBuilder {...defaultProps} />)
    
    const taskTextarea = screen.getByPlaceholderText(/Analyze the budget variance data/i)
    fireEvent.change(taskTextarea, { target: { value: 'Test task' } })
    
    expect(screen.getByText('Your Complete Prompt')).toBeInTheDocument()
    expect(screen.getByText('Prompt Analysis')).toBeInTheDocument()
  })

  it('highlights active technique sections', () => {
    const mockAssessment = {
      score: 80,
      techniques: ['basic_instruction'],
      suggestions: [],
      quality: 'good'
    }
    
    const { assessPromptQuality } = require('../services/promptTechniqueService')
    assessPromptQuality.mockReturnValue(mockAssessment)
    
    render(<AdaptivePromptBuilder {...defaultProps} />)
    
    const taskTextarea = screen.getByPlaceholderText(/Analyze the budget variance data/i)
    fireEvent.change(taskTextarea, { target: { value: 'Test task' } })
    
    // Should highlight the active technique section
    const taskSection = screen.getByText('Specify the Task').closest('.prompt-section')
    expect(taskSection).toHaveClass('technique-active')
  })

  it('adapts interface based on user level', () => {
    render(<AdaptivePromptBuilder {...defaultProps} userLevel="advanced" />)
    
    // Should show technique names for advanced users
    expect(screen.getByText('Basic Instruction')).toBeInTheDocument()
  })

  it('filters techniques by category effectiveness', () => {
    const mockCategoryTechniques = [
      {
        id: 'role_playing',
        name: 'Role Playing',
        effectiveness: { budget: 9 }
      }
    ]
    
    const { getTechniquesForCategory } = require('../services/promptTechniqueService')
    getTechniquesForCategory.mockReturnValue(mockCategoryTechniques)
    
    render(<AdaptivePromptBuilder {...defaultProps} />)
    
    const advancedButton = screen.getByText('Show Advanced Tips')
    fireEvent.click(advancedButton)
    
    expect(screen.getByText('📊 Category-Specific Techniques')).toBeInTheDocument()
  })
})

describe('AdaptivePromptBuilder Integration', () => {
  it('provides complete workflow from beginner to advanced', async () => {
    const onPromptChange = vi.fn()
    const { rerender } = render(
      <AdaptivePromptBuilder 
        {...{ onPromptChange, difficulty: 'beginner', category: 'budget', userLevel: 'beginner' }}
      />
    )
    
    // Start with beginner - should have 3 sections
    expect(screen.getByText('3 sections available')).toBeInTheDocument()
    
    // Progress to intermediate
    rerender(
      <AdaptivePromptBuilder 
        {...{ onPromptChange, difficulty: 'intermediate', category: 'budget', userLevel: 'developing' }}
      />
    )
    
    expect(screen.getByText('5 sections available')).toBeInTheDocument()
    expect(screen.getByText('Define Your Role')).toBeInTheDocument()
    
    // Progress to advanced
    rerender(
      <AdaptivePromptBuilder 
        {...{ onPromptChange, difficulty: 'advanced', category: 'budget', userLevel: 'proficient' }}
      />
    )
    
    expect(screen.getByText('7 sections available')).toBeInTheDocument()
    expect(screen.getByText('Quick Start Templates')).toBeInTheDocument()
    expect(screen.getByText('Constraints & Limitations')).toBeInTheDocument()
  })

  it('maintains prompt content across difficulty changes', () => {
    const onPromptChange = vi.fn()
    const { rerender } = render(
      <AdaptivePromptBuilder 
        {...{ onPromptChange, difficulty: 'beginner', category: 'budget', userLevel: 'beginner' }}
      />
    )
    
    // Add content
    const taskTextarea = screen.getByPlaceholderText(/Analyze the budget variance data/i)
    fireEvent.change(taskTextarea, { target: { value: 'Test task content' } })
    
    // Change difficulty
    rerender(
      <AdaptivePromptBuilder 
        {...{ onPromptChange, difficulty: 'intermediate', category: 'budget', userLevel: 'developing' }}
      />
    )
    
    // Content should be preserved
    const updatedTaskTextarea = screen.getByPlaceholderText(/Analyze the budget variance data/i)
    expect(updatedTaskTextarea.value).toBe('Test task content')
  })
})