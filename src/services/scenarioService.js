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

// Scenario data model structure
export const ScenarioModel = {
  id: '',
  title: '',
  description: '',
  businessContext: '',
  objective: '',
  difficulty: '', // 'beginner', 'intermediate', 'advanced'
  category: '', // 'budget', 'risk', 'strategy', 'presentation', 'analysis'
  estimatedTime: 0, // minutes
  requiredLevel: '', // 'beginner', 'developing', 'proficient', 'advanced'
  isActive: true,
  createdAt: '',
  sampleDocuments: [], // Array of document objects
  hints: [], // Array of hint strings
  successCriteria: [] // Array of success criteria
}

// Mock data for 5 core business scenarios
const mockScenarios = [
  {
    id: 'scenario_budget_analysis',
    title: 'Master the Art of Budget Analysis',
    description: 'Transform complex financial data into crystal-clear insights that save your company thousands. Become the budget whisperer your CFO relies on.',
    businessContext: `You are reviewing the Q3 financial results for TechCorp, a mid-size software company. The CFO has asked you to analyze significant budget variances and prepare a summary for the executive team.

Key Context:
- Original Q3 budget projected $2.5M revenue
- Actual Q3 revenue was $2.1M (16% under budget)
- R&D expenses were $800K vs budgeted $600K (33% over budget)
- Sales & Marketing was $450K vs budgeted $500K (10% under budget)
- The company launched a new product line in Q3`,
    objective: 'Create a prompt that will help you analyze these budget variances and generate a concise executive summary with specific recommendations.',
    difficulty: 'beginner',
    category: 'budget',
    estimatedTime: 10,
    requiredLevel: 'beginner',
    isActive: true,
    createdAt: new Date().toISOString(),
    sampleDocuments: [
      {
        type: 'P&L Statement',
        title: 'Q3 2024 P&L vs Budget',
        content: 'Revenue: $2.1M (Budget: $2.5M)\nR&D: $800K (Budget: $600K)\nSales & Marketing: $450K (Budget: $500K)\nGross Margin: 68% (Budget: 72%)'
      }
    ],
    hints: [
      'Be specific about the format you want for the analysis',
      'Ask for both the "why" behind variances and specific next steps',
      'Consider requesting priority ranking of recommendations'
    ],
    successCriteria: [
      'Identifies key variance drivers',
      'Provides specific, actionable recommendations',
      'Uses appropriate business language and format'
    ]
  },
  {
    id: 'scenario_board_presentation',
    title: 'Command the Boardroom with Confidence',
    description: 'Craft compelling narratives that captivate board members and drive strategic decisions. Master the art of executive storytelling in just 15 minutes.',
    businessContext: `You are the CFO of GrowthTech preparing for the quarterly board meeting. The board expects a 15-minute presentation covering financial performance, key initiatives, and strategic outlook.

Key Context:
- Q3 revenue grew 12% YoY to $5.2M
- New customer acquisition up 25% but churn increased to 8%
- Launched AI product feature with 40% adoption rate
- Raised $10M Series B funding in Q3
- Planning international expansion in Q4`,
    objective: 'Create a prompt to help structure your board presentation with compelling narrative and key metrics.',
    difficulty: 'intermediate',
    category: 'presentation',
    estimatedTime: 15,
    requiredLevel: 'developing',
    isActive: true,
    createdAt: new Date().toISOString(),
    sampleDocuments: [
      {
        type: 'Board Deck Template',
        title: 'Q3 Board Meeting Agenda',
        content: '1. Financial Performance\n2. Key Metrics & KPIs\n3. Strategic Initiatives\n4. Market Outlook\n5. Funding & Capital'
      }
    ],
    hints: [
      'Structure your prompt to request specific slide content',
      'Ask for both quantitative metrics and qualitative insights',
      'Request talking points that address potential board questions'
    ],
    successCriteria: [
      'Creates clear, executive-level narrative',
      'Balances positive achievements with honest challenges',
      'Provides actionable strategic insights'
    ]
  },
  {
    id: 'scenario_risk_assessment',
    title: 'Become a Risk Navigation Expert',
    description: 'Turn uncertainty into opportunity by mastering risk assessment. Protect your company\'s future while identifying hidden growth potential.',
    businessContext: `As VP of Finance at ManufacturingCorp, you need to prepare a risk assessment for the monthly risk committee meeting. Recent developments require updated risk analysis.

Key Context:
- Major supplier in China facing production delays
- New competitor entered market with 30% lower pricing
- Regulatory changes in EU affecting 25% of revenue
- Cybersecurity incident at industry peer company
- Rising interest rates affecting debt refinancing`,
    objective: 'Create a prompt to generate a comprehensive risk assessment with mitigation strategies prioritized by impact and likelihood.',
    difficulty: 'intermediate',
    category: 'risk',
    estimatedTime: 12,
    requiredLevel: 'developing',
    isActive: true,
    createdAt: new Date().toISOString(),
    sampleDocuments: [
      {
        type: 'Risk Register',
        title: 'Current Risk Categories',
        content: 'Operational Risks\nMarket Risks\nRegulatory Risks\nFinancial Risks\nTechnology Risks'
      }
    ],
    hints: [
      'Ask for risks to be categorized and prioritized',
      'Request specific mitigation actions with timelines',
      'Include both quantitative impact estimates and qualitative factors'
    ],
    successCriteria: [
      'Identifies and categorizes key risks appropriately',
      'Provides realistic mitigation strategies',
      'Prioritizes risks by business impact'
    ]
  },
  {
    id: 'scenario_financial_forecast',
    title: 'Unlock the Power of Financial Forecasting',
    description: 'See the future of your business with precision. Master advanced forecasting techniques that turn data into strategic advantage.',
    businessContext: `You are the Finance Director at ServiceTech reviewing Q4 forecasts. With Q3 results in hand, you need to update projections and identify key assumptions.

Key Context:
- Q3 revenue was 8% above forecast
- Customer acquisition costs increased 15%
- New enterprise deals taking longer to close
- Seasonal patterns showing earlier Q4 uptick
- Economic uncertainty affecting customer spending`,
    objective: 'Create a prompt to help analyze current trends and generate updated Q4 financial forecasts with key assumptions clearly stated.',
    difficulty: 'advanced',
    category: 'analysis',
    estimatedTime: 18,
    requiredLevel: 'proficient',
    isActive: true,
    createdAt: new Date().toISOString(),
    sampleDocuments: [
      {
        type: 'Forecast Model',
        title: 'Q4 2024 Financial Forecast',
        content: 'Revenue Forecast: $3.2M\nGross Margin: 65%\nOpEx: $1.8M\nEBITDA: $280K'
      }
    ],
    hints: [
      'Request analysis of trends and their impact on forecasts',
      'Ask for sensitivity analysis on key assumptions',
      'Include confidence intervals or scenario planning'
    ],
    successCriteria: [
      'Updates forecasts based on actual performance data',
      'Clearly states key assumptions and risks',
      'Provides scenario analysis for decision making'
    ]
  },
  {
    id: 'scenario_competitive_analysis',
    title: 'Dominate Your Market with Strategic Intelligence',
    description: 'Outsmart the competition with razor-sharp analysis. Discover hidden opportunities and build unbeatable strategic advantages.',
    businessContext: `As Director of Strategic Finance at InnovaCorp, you need to prepare a competitive analysis for the strategic planning session. Recent market developments require updated competitive intelligence.

Key Context:
- Main competitor raised $50M Series C funding
- New startup launched with similar product at 40% lower price
- Industry leader announced acquisition of key technology company
- Market research shows customer preference shifting to integrated solutions
- Your company's market share dropped from 15% to 12% in past 6 months`,
    objective: 'Create a prompt to generate a comprehensive competitive analysis with strategic and financial implications for your business.',
    difficulty: 'advanced',
    category: 'strategy',
    estimatedTime: 20,
    requiredLevel: 'proficient',
    isActive: true,
    createdAt: new Date().toISOString(),
    sampleDocuments: [
      {
        type: 'Market Analysis',
        title: 'Competitive Landscape Overview',
        content: 'Market Leader: 35% share\nMain Competitor: 18% share\nInnovaCorp: 12% share\nNew Entrants: 10% share\nOthers: 25% share'
      }
    ],
    hints: [
      'Ask for both qualitative competitive positioning and quantitative financial impact',
      'Request specific strategic recommendations with resource requirements',
      'Include timeline for competitive response initiatives'
    ],
    successCriteria: [
      'Provides comprehensive competitive landscape analysis',
      'Quantifies financial impact of competitive threats',
      'Recommends specific strategic actions with business rationale'
    ]
  }
]

// Mock storage for scenarios
const mockStorage = {
  scenarios: new Map(),
  completions: new Map()
}

// Initialize mock storage with scenarios
mockScenarios.forEach(scenario => {
  mockStorage.scenarios.set(scenario.id, scenario)
})

// Scenario CRUD Operations (API-ready)
export const getAllScenarios = async (token) => {
  setAuthToken(token)
  try {
    const response = await api.get('/scenarios')
    return response.data
  } catch (error) {
    console.error('Error fetching scenarios:', error)
    throw error
  }
}

export const getScenarioById = async (scenarioId, token) => {
  setAuthToken(token)
  try {
    const response = await api.get(`/scenarios/${scenarioId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching scenario:', error)
    throw error
  }
}

export const getScenariosByCategory = async (category, token) => {
  setAuthToken(token)
  try {
    const response = await api.get(`/scenarios?category=${category}`)
    return response.data
  } catch (error) {
    console.error('Error fetching scenarios by category:', error)
    throw error
  }
}

export const getScenariosByDifficulty = async (difficulty, token) => {
  setAuthToken(token)
  try {
    const response = await api.get(`/scenarios?difficulty=${difficulty}`)
    return response.data
  } catch (error) {
    console.error('Error fetching scenarios by difficulty:', error)
    throw error
  }
}

// Mock implementations for development
export const mockGetAllScenarios = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const scenarios = Array.from(mockStorage.scenarios.values())
        .filter(scenario => scenario.isActive)
        .sort((a, b) => {
          const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        })
      resolve(scenarios)
    }, 300)
  })
}

export const mockGetScenarioById = (scenarioId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const scenario = mockStorage.scenarios.get(scenarioId)
      if (scenario && scenario.isActive) {
        resolve(scenario)
      } else {
        reject(new Error('Scenario not found'))
      }
    }, 200)
  })
}

export const mockGetScenariosByCategory = (category) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const scenarios = Array.from(mockStorage.scenarios.values())
        .filter(scenario => scenario.isActive && scenario.category === category)
        .sort((a, b) => {
          const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        })
      resolve(scenarios)
    }, 300)
  })
}

export const mockGetScenariosByDifficulty = (difficulty) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const scenarios = Array.from(mockStorage.scenarios.values())
        .filter(scenario => scenario.isActive && scenario.difficulty === difficulty)
      resolve(scenarios)
    }, 300)
  })
}

// Utility functions
export const getDifficultyColor = (difficulty) => {
  const colors = {
    'beginner': '#10b981', // green
    'intermediate': '#f59e0b', // amber
    'advanced': '#ef4444' // red
  }
  return colors[difficulty] || '#6b7280'
}

export const getCategoryIcon = (category) => {
  const icons = {
    'budget': '💰',
    'risk': '⚠️',
    'strategy': '🎯',
    'presentation': '📊',
    'analysis': '📈'
  }
  return icons[category] || '📋'
}

export const formatEstimatedTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}