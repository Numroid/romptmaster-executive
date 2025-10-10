// Advanced Prompt Engineering Techniques Library
// Comprehensive catalog of 15+ advanced prompting techniques with business use cases

export const PromptTechniques = {
  // Basic Techniques (Beginner Level)
  BASIC_INSTRUCTION: {
    id: 'basic_instruction',
    name: 'Basic Instruction',
    level: 'beginner',
    description: 'Clear, direct instructions for simple tasks',
    businessUseCase: 'Simple data analysis, basic reporting',
    example: 'Analyze the sales data and provide a summary.',
    effectiveness: {
      budget: 8,
      risk: 6,
      strategy: 5,
      presentation: 7,
      analysis: 7
    }
  },
  
  OUTPUT_FORMAT: {
    id: 'output_format',
    name: 'Output Format Specification',
    level: 'beginner',
    description: 'Specify exactly how you want the response formatted',
    businessUseCase: 'Executive summaries, structured reports',
    example: 'Provide results in bullet points with specific dollar amounts.',
    effectiveness: {
      budget: 9,
      risk: 8,
      strategy: 7,
      presentation: 9,
      analysis: 8
    }
  },

  CONTEXT_SETTING: {
    id: 'context_setting',
    name: 'Context Setting',
    level: 'beginner',
    description: 'Provide relevant background information',
    businessUseCase: 'Industry-specific analysis, company context',
    example: 'This analysis is for a SaaS company with $10M ARR.',
    effectiveness: {
      budget: 8,
      risk: 9,
      strategy: 9,
      presentation: 8,
      analysis: 8
    }
  },

  // Intermediate Techniques
  ROLE_PLAYING: {
    id: 'role_playing',
    name: 'Role Playing & Persona Adoption',
    level: 'intermediate',
    description: 'Assign specific expertise and perspective to the AI',
    businessUseCase: 'Expert analysis, specialized knowledge application',
    example: 'You are a senior financial analyst with 15 years of experience in SaaS companies.',
    effectiveness: {
      budget: 9,
      risk: 9,
      strategy: 8,
      presentation: 8,
      analysis: 9
    }
  },

  FEW_SHOT: {
    id: 'few_shot',
    name: 'Few-Shot Learning',
    level: 'intermediate',
    description: 'Provide multiple examples of desired output',
    businessUseCase: 'Consistent formatting, style matching',
    example: 'Format like: "Revenue variance: +$200K (8% above budget) due to..."',
    effectiveness: {
      budget: 9,
      risk: 8,
      strategy: 7,
      presentation: 9,
      analysis: 8
    }
  },

  ZERO_SHOT: {
    id: 'zero_shot',
    name: 'Zero-Shot Learning',
    level: 'intermediate',
    description: 'Clear instructions without examples',
    businessUseCase: 'Novel analysis, creative problem solving',
    example: 'Analyze this new market opportunity using standard frameworks.',
    effectiveness: {
      budget: 7,
      risk: 8,
      strategy: 9,
      presentation: 7,
      analysis: 8
    }
  },

  CHAIN_OF_THOUGHT: {
    id: 'chain_of_thought',
    name: 'Chain-of-Thought Reasoning',
    level: 'intermediate',
    description: 'Request step-by-step reasoning process',
    businessUseCase: 'Complex analysis, decision making',
    example: 'Think through this step by step: 1) Analyze trends, 2) Identify causes, 3) Recommend actions.',
    effectiveness: {
      budget: 8,
      risk: 9,
      strategy: 9,
      presentation: 7,
      analysis: 9
    }
  },

  CONSTRAINT_SPECIFICATION: {
    id: 'constraint_specification',
    name: 'Constraint Specification',
    level: 'intermediate',
    description: 'Define boundaries and limitations',
    businessUseCase: 'Focused analysis, resource constraints',
    example: 'Focus only on the top 3 risks, exclude operational risks.',
    effectiveness: {
      budget: 8,
      risk: 9,
      strategy: 8,
      presentation: 8,
      analysis: 8
    }
  },

  // Advanced Techniques
  TREE_OF_THOUGHTS: {
    id: 'tree_of_thoughts',
    name: 'Tree of Thoughts (ToT)',
    level: 'advanced',
    description: 'Explore multiple reasoning paths simultaneously',
    businessUseCase: 'Strategic planning, complex decision making',
    example: 'Consider 3 different approaches: cost reduction, revenue growth, and market expansion. Evaluate each path.',
    effectiveness: {
      budget: 7,
      risk: 8,
      strategy: 10,
      presentation: 6,
      analysis: 9
    }
  },

  SELF_CONSISTENCY: {
    id: 'self_consistency',
    name: 'Self-Consistency Prompting',
    level: 'advanced',
    description: 'Generate multiple solutions and find consensus',
    businessUseCase: 'Critical decisions, validation of analysis',
    example: 'Provide 3 different analyses of this data, then identify the most consistent findings.',
    effectiveness: {
      budget: 8,
      risk: 9,
      strategy: 9,
      presentation: 7,
      analysis: 9
    }
  },

  CONSTITUTIONAL_AI: {
    id: 'constitutional_ai',
    name: 'Constitutional AI Principles',
    level: 'advanced',
    description: 'Embed ethical and quality principles',
    businessUseCase: 'Ethical decision making, compliance',
    example: 'Ensure recommendations are ethical, legal, and consider stakeholder impact.',
    effectiveness: {
      budget: 7,
      risk: 10,
      strategy: 9,
      presentation: 8,
      analysis: 8
    }
  },

  PROMPT_CHAINING: {
    id: 'prompt_chaining',
    name: 'Prompt Chaining & Decomposition',
    level: 'advanced',
    description: 'Break complex tasks into sequential steps',
    businessUseCase: 'Multi-step analysis, complex workflows',
    example: 'First analyze the data, then identify trends, finally provide recommendations based on those trends.',
    effectiveness: {
      budget: 9,
      risk: 9,
      strategy: 9,
      presentation: 8,
      analysis: 10
    }
  },

  META_PROMPTING: {
    id: 'meta_prompting',
    name: 'Meta-Prompting & Recursive Prompting',
    level: 'advanced',
    description: 'Prompts that generate or improve other prompts',
    businessUseCase: 'Prompt optimization, template creation',
    example: 'Create a better prompt for analyzing budget variances than this one: [original prompt]',
    effectiveness: {
      budget: 6,
      risk: 6,
      strategy: 7,
      presentation: 7,
      analysis: 7
    }
  },

  RAG_CONCEPTS: {
    id: 'rag_concepts',
    name: 'Retrieval-Augmented Generation (RAG) Concepts',
    level: 'advanced',
    description: 'Reference specific documents or data sources',
    businessUseCase: 'Document analysis, knowledge base queries',
    example: 'Based on the attached financial statements and industry benchmarks, analyze performance.',
    effectiveness: {
      budget: 9,
      risk: 8,
      strategy: 8,
      presentation: 9,
      analysis: 10
    }
  },

  INSTRUCTION_OPTIMIZATION: {
    id: 'instruction_optimization',
    name: 'Instruction Following Optimization',
    level: 'advanced',
    description: 'Optimize instructions for better AI compliance',
    businessUseCase: 'Precise outputs, quality control',
    example: 'Follow these instructions exactly: 1) Use only data from Q3, 2) Include confidence levels, 3) Highlight assumptions.',
    effectiveness: {
      budget: 8,
      risk: 8,
      strategy: 7,
      presentation: 9,
      analysis: 9
    }
  },

  NEGATIVE_PROMPTING: {
    id: 'negative_prompting',
    name: 'Negative Prompting & Constraint Specification',
    level: 'advanced',
    description: 'Specify what NOT to include or do',
    businessUseCase: 'Avoiding unwanted content, focus control',
    example: 'Do not include speculation, avoid technical jargon, exclude historical data older than 2 years.',
    effectiveness: {
      budget: 7,
      risk: 8,
      strategy: 8,
      presentation: 9,
      analysis: 8
    }
  },

  PARAMETER_GUIDANCE: {
    id: 'parameter_guidance',
    name: 'Temperature & Parameter Guidance',
    level: 'advanced',
    description: 'Control creativity vs consistency in responses',
    businessUseCase: 'Creative brainstorming vs precise analysis',
    example: 'Be creative in generating solutions but precise in financial calculations.',
    effectiveness: {
      budget: 6,
      risk: 7,
      strategy: 8,
      presentation: 7,
      analysis: 7
    }
  },

  CONTEXT_OPTIMIZATION: {
    id: 'context_optimization',
    name: 'Context Window Optimization',
    level: 'advanced',
    description: 'Efficiently use available context space',
    businessUseCase: 'Large document analysis, comprehensive reports',
    example: 'Prioritize the most recent data and key metrics in your analysis.',
    effectiveness: {
      budget: 8,
      risk: 8,
      strategy: 8,
      presentation: 8,
      analysis: 9
    }
  },

  MULTIMODAL_CONCEPTS: {
    id: 'multimodal_concepts',
    name: 'Multi-Modal Prompting Concepts',
    level: 'advanced',
    description: 'Combine text, data, and visual elements',
    businessUseCase: 'Chart analysis, visual data interpretation',
    example: 'Analyze both the numerical data and the trend chart to identify patterns.',
    effectiveness: {
      budget: 8,
      risk: 7,
      strategy: 8,
      presentation: 9,
      analysis: 9
    }
  },

  EVALUATION_FRAMEWORK: {
    id: 'evaluation_framework',
    name: 'Evaluation & Iteration Frameworks',
    level: 'advanced',
    description: 'Built-in quality assessment and improvement',
    businessUseCase: 'Quality assurance, continuous improvement',
    example: 'Rate the confidence of your analysis from 1-10 and explain any uncertainties.',
    effectiveness: {
      budget: 7,
      risk: 9,
      strategy: 8,
      presentation: 7,
      analysis: 8
    }
  }
}

// Technique combinations for complex scenarios
export const TechniqueCombinations = {
  EXECUTIVE_ANALYSIS: {
    name: 'Executive Analysis',
    techniques: ['role_playing', 'context_setting', 'output_format', 'chain_of_thought'],
    description: 'Comprehensive analysis for executive decision making',
    bestFor: ['strategy', 'risk', 'presentation']
  },
  
  FINANCIAL_DEEP_DIVE: {
    name: 'Financial Deep Dive',
    techniques: ['role_playing', 'few_shot', 'chain_of_thought', 'constraint_specification'],
    description: 'Detailed financial analysis with specific formatting',
    bestFor: ['budget', 'analysis']
  },
  
  STRATEGIC_PLANNING: {
    name: 'Strategic Planning',
    techniques: ['tree_of_thoughts', 'self_consistency', 'constitutional_ai', 'evaluation_framework'],
    description: 'Multi-perspective strategic analysis with quality checks',
    bestFor: ['strategy', 'risk']
  },
  
  BOARD_PRESENTATION: {
    name: 'Board Presentation',
    techniques: ['role_playing', 'output_format', 'constraint_specification', 'negative_prompting'],
    description: 'Executive-level presentation content with clear boundaries',
    bestFor: ['presentation', 'strategy']
  }
}

// Get techniques by difficulty level
export const getTechniquesByLevel = (level) => {
  return Object.values(PromptTechniques).filter(technique => technique.level === level)
}

// Get techniques by effectiveness for scenario category
export const getTechniquesForCategory = (category, minEffectiveness = 7) => {
  return Object.values(PromptTechniques)
    .filter(technique => technique.effectiveness[category] >= minEffectiveness)
    .sort((a, b) => b.effectiveness[category] - a.effectiveness[category])
}

// Get recommended techniques based on user input
export const getRecommendedTechniques = (userInput, category, userLevel = 'beginner') => {
  const recommendations = []
  const input = userInput.toLowerCase()
  
  // Analyze user input for technique suggestions
  if (input.includes('step') || input.includes('process') || input.includes('analyze')) {
    recommendations.push(PromptTechniques.CHAIN_OF_THOUGHT)
  }
  
  if (input.includes('format') || input.includes('structure') || input.includes('bullet')) {
    recommendations.push(PromptTechniques.OUTPUT_FORMAT)
  }
  
  if (input.includes('expert') || input.includes('analyst') || input.includes('you are')) {
    recommendations.push(PromptTechniques.ROLE_PLAYING)
  }
  
  if (input.includes('example') || input.includes('like this') || input.includes('similar to')) {
    recommendations.push(PromptTechniques.FEW_SHOT)
  }
  
  if (input.includes('don\'t') || input.includes('avoid') || input.includes('exclude')) {
    recommendations.push(PromptTechniques.NEGATIVE_PROMPTING)
  }
  
  // Add category-specific high-effectiveness techniques
  const categoryTechniques = getTechniquesForCategory(category, 8)
    .filter(technique => {
      const levelOrder = { beginner: 1, intermediate: 2, advanced: 3 }
      const userLevelNum = levelOrder[userLevel] || 1
      const techniqueLevel = levelOrder[technique.level] || 1
      return techniqueLevel <= userLevelNum + 1 // Allow one level above user
    })
    .slice(0, 3)
  
  recommendations.push(...categoryTechniques)
  
  // Remove duplicates and return top 5
  const uniqueRecommendations = recommendations.filter((technique, index, self) => 
    index === self.findIndex(t => t.id === technique.id)
  )
  
  return uniqueRecommendations.slice(0, 5)
}

// Assess prompt quality based on techniques used
export const assessPromptQuality = (prompt, category) => {
  const assessment = {
    score: 0,
    techniques: [],
    suggestions: [],
    quality: 'needs-work'
  }
  
  const input = prompt.toLowerCase()
  
  // Check for basic elements
  if (input.length > 50) assessment.score += 10
  if (input.includes('analyze') || input.includes('evaluate')) assessment.score += 15
  if (input.includes('specific') || input.includes('detailed')) assessment.score += 10
  
  // Check for technique usage
  Object.values(PromptTechniques).forEach(technique => {
    const example = technique.example.toLowerCase()
    const keywords = example.split(' ').slice(0, 3) // First 3 words as keywords
    
    if (keywords.some(keyword => input.includes(keyword))) {
      assessment.techniques.push(technique.id)
      assessment.score += technique.effectiveness[category] || 5
    }
  })
  
  // Generate suggestions
  if (assessment.score < 30) {
    assessment.suggestions.push('Add more specific instructions')
    assessment.suggestions.push('Specify the output format you want')
  }
  
  if (!assessment.techniques.includes('role_playing')) {
    assessment.suggestions.push('Consider defining the AI\'s role or expertise')
  }
  
  if (!assessment.techniques.includes('output_format')) {
    assessment.suggestions.push('Specify exactly how you want the response formatted')
  }
  
  // Determine quality level
  if (assessment.score >= 80) {
    assessment.quality = 'excellent'
  } else if (assessment.score >= 50) {
    assessment.quality = 'good'
  } else {
    assessment.quality = 'needs-work'
  }
  
  return assessment
}

// Generate technique learning path
export const generateLearningPath = (currentLevel, targetCategory) => {
  const levelOrder = { beginner: 1, intermediate: 2, advanced: 3 }
  const currentLevelNum = levelOrder[currentLevel] || 1
  
  const path = []
  
  // Add current level techniques
  const currentTechniques = getTechniquesForCategory(targetCategory, 7)
    .filter(technique => technique.level === currentLevel)
    .slice(0, 3)
  
  path.push({
    level: currentLevel,
    techniques: currentTechniques,
    description: `Master ${currentLevel} level techniques`
  })
  
  // Add next level if not at advanced
  if (currentLevelNum < 3) {
    const nextLevel = Object.keys(levelOrder)[currentLevelNum] // Next level
    const nextTechniques = getTechniquesForCategory(targetCategory, 7)
      .filter(technique => technique.level === nextLevel)
      .slice(0, 3)
    
    path.push({
      level: nextLevel,
      techniques: nextTechniques,
      description: `Progress to ${nextLevel} level techniques`
    })
  }
  
  return path
}

export default {
  PromptTechniques,
  TechniqueCombinations,
  getTechniquesByLevel,
  getTechniquesForCategory,
  getRecommendedTechniques,
  assessPromptQuality,
  generateLearningPath
}