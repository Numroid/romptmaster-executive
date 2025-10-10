import React, { useState, useEffect } from 'react'
import { 
  PromptTechniques, 
  TechniqueCombinations,
  getTechniquesByLevel,
  getTechniquesForCategory,
  getRecommendedTechniques,
  assessPromptQuality,
  generateLearningPath
} from '../services/promptTechniqueService'
import TechniqueGuide from './TechniqueGuide'

const AdaptivePromptBuilder = ({ 
  onPromptChange, 
  initialPrompt = '', 
  difficulty = 'beginner',
  category = 'budget',
  userLevel = 'beginner'
}) => {
  const [sections, setSections] = useState({
    role: '',
    task: '',
    context: '',
    format: '',
    examples: '',
    constraints: '',
    reasoning: ''
  })
  
  const [activeTechniques, setActiveTechniques] = useState([])
  const [promptAssessment, setPromptAssessment] = useState(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [recommendedTechniques, setRecommendedTechniques] = useState([])
  const [learningPath, setLearningPath] = useState([])
  const [selectedCombination, setSelectedCombination] = useState(null)
  const [showTechniqueGuide, setShowTechniqueGuide] = useState(false)

  // Update parent component when sections change
  useEffect(() => {
    const fullPrompt = buildFullPrompt()
    onPromptChange(fullPrompt)
    
    // Assess prompt quality and update recommendations
    const assessment = assessPromptQuality(fullPrompt, category)
    setPromptAssessment(assessment)
    
    // Get technique recommendations
    const recommendations = getRecommendedTechniques(fullPrompt, category, userLevel)
    setRecommendedTechniques(recommendations)
    
    // Update active techniques
    setActiveTechniques(assessment.techniques)
  }, [sections, category, userLevel])

  // Initialize learning path
  useEffect(() => {
    const path = generateLearningPath(userLevel, category)
    setLearningPath(path)
  }, [userLevel, category])

  const buildFullPrompt = () => {
    const parts = []
    const visibleSections = getVisibleSections()
    
    visibleSections.forEach(sectionKey => {
      const section = sections[sectionKey]
      if (section.trim()) {
        const sectionConfig = getSectionConfig(sectionKey)
        parts.push(`**${sectionConfig.title}:** ${section}`)
      }
    })
    
    return parts.join('\n\n')
  }

  const getVisibleSections = () => {
    switch (difficulty) {
      case 'beginner':
        return ['task', 'context', 'format']
      case 'intermediate':
        return ['role', 'task', 'context', 'format', 'examples']
      case 'advanced':
        return ['role', 'task', 'context', 'format', 'examples', 'constraints', 'reasoning']
      default:
        return ['task', 'context', 'format']
    }
  }

  const getSectionConfig = (sectionKey) => {
    const configs = {
      role: {
        title: 'Define Your Role',
        placeholder: 'e.g., "You are a senior financial analyst with 10 years of experience in SaaS companies..."',
        icon: '👤',
        color: 'role',
        description: 'Set the AI\'s expertise and perspective',
        technique: 'role_playing'
      },
      task: {
        title: 'Specify the Task',
        placeholder: 'e.g., "Analyze the budget variance data and identify the top 3 areas of concern..."',
        icon: '🎯',
        color: 'task',
        description: 'Clearly define what you want the AI to do',
        technique: 'basic_instruction'
      },
      context: {
        title: 'Provide Context',
        placeholder: 'e.g., "This analysis is for the CFO to present to the board next week..."',
        icon: '📋',
        color: 'context',
        description: 'Give background information and constraints',
        technique: 'context_setting'
      },
      format: {
        title: 'Output Format',
        placeholder: 'e.g., "Provide a bullet-point summary with specific dollar amounts and percentages..."',
        icon: '📄',
        color: 'format',
        description: 'Specify exactly how you want the response formatted',
        technique: 'output_format'
      },
      examples: {
        title: 'Examples',
        placeholder: 'e.g., "Similar to this format: • Revenue variance: +$200K (8% above budget) due to..."',
        icon: '💡',
        color: 'examples',
        description: 'Show examples of the desired output style',
        technique: 'few_shot'
      },
      constraints: {
        title: 'Constraints & Limitations',
        placeholder: 'e.g., "Focus only on the top 3 risks, exclude operational risks, use data from Q3 only..."',
        icon: '🚫',
        color: 'constraints',
        description: 'Define boundaries and what to exclude',
        technique: 'constraint_specification'
      },
      reasoning: {
        title: 'Reasoning Process',
        placeholder: 'e.g., "Think through this step by step: 1) Analyze trends, 2) Identify causes, 3) Recommend actions..."',
        icon: '🧠',
        color: 'reasoning',
        description: 'Request specific thinking methodology',
        technique: 'chain_of_thought'
      }
    }
    return configs[sectionKey] || {}
  }

  const handleSectionChange = (sectionName, value) => {
    setSections(prev => ({
      ...prev,
      [sectionName]: value
    }))
  }

  const getQualityMessage = () => {
    if (!promptAssessment) return { text: 'Start building your prompt', icon: '✍️' }
    
    switch (promptAssessment.quality) {
      case 'excellent':
        return { text: 'Excellent prompt! 🎉', icon: '✅' }
      case 'good':
        return { text: 'Good prompt! Keep refining 👍', icon: '⚡' }
      default:
        return { text: 'Add more details to improve', icon: '💡' }
    }
  }

  const applyTechniqueCombination = (combination) => {
    setSelectedCombination(combination)
    
    // Auto-fill sections based on combination
    const updates = {}
    
    if (combination.techniques.includes('role_playing')) {
      updates.role = `You are a senior ${category} expert with extensive experience in business analysis and strategic decision making.`
    }
    
    if (combination.techniques.includes('chain_of_thought')) {
      updates.reasoning = 'Think through this step by step: 1) Analyze the data, 2) Identify key patterns, 3) Draw conclusions, 4) Provide specific recommendations.'
    }
    
    if (combination.techniques.includes('output_format')) {
      updates.format = 'Provide a structured response with: • Executive Summary (2-3 sentences) • Key Findings (bullet points) • Specific Recommendations (numbered list) • Next Steps (timeline)'
    }
    
    if (combination.techniques.includes('constraint_specification')) {
      updates.constraints = 'Focus on actionable insights, use specific numbers where available, exclude speculation, prioritize by business impact.'
    }
    
    setSections(prev => ({ ...prev, ...updates }))
  }

  const getDifficultyInfo = () => {
    switch (difficulty) {
      case 'beginner':
        return {
          title: 'Beginner Builder',
          description: 'Focus on clear instructions and basic structure',
          color: '#10b981',
          sections: 3
        }
      case 'intermediate':
        return {
          title: 'Intermediate Builder',
          description: 'Add role-playing and examples for better results',
          color: '#f59e0b',
          sections: 5
        }
      case 'advanced':
        return {
          title: 'Advanced Builder',
          description: 'Full control with advanced techniques and reasoning',
          color: '#ef4444',
          sections: 7
        }
      default:
        return {
          title: 'Prompt Builder',
          description: 'Build effective prompts',
          color: '#6b7280',
          sections: 3
        }
    }
  }

  const visibleSections = getVisibleSections()
  const difficultyInfo = getDifficultyInfo()
  const availableTechniques = getTechniquesByLevel(difficulty === 'beginner' ? 'beginner' : difficulty === 'intermediate' ? 'intermediate' : 'advanced')
  const categoryTechniques = getTechniquesForCategory(category, 7).slice(0, 5)

  return (
    <div className="adaptive-prompt-builder">
      <div className="builder-header">
        <div className="difficulty-indicator">
          <div 
            className="difficulty-badge"
            style={{ backgroundColor: difficultyInfo.color }}
          >
            {difficultyInfo.title}
          </div>
          <div className="difficulty-info">
            <p>{difficultyInfo.description}</p>
            <span>{difficultyInfo.sections} sections available</span>
          </div>
        </div>
        
        {promptAssessment && (
          <div className="quality-feedback">
            <div className={`quality-indicator quality-${promptAssessment.quality}`}>
              <span>{getQualityMessage().icon}</span>
              <span>{getQualityMessage().text}</span>
              <span className="quality-score">Score: {promptAssessment.score}</span>
            </div>
          </div>
        )}
      </div>

      {/* Technique Combinations for Advanced Users */}
      {difficulty === 'advanced' && (
        <div className="technique-combinations">
          <h4>Quick Start Templates</h4>
          <div className="combination-grid">
            {Object.values(TechniqueCombinations)
              .filter(combo => combo.bestFor.includes(category))
              .map(combination => (
                <div 
                  key={combination.name}
                  className={`combination-card ${selectedCombination?.name === combination.name ? 'selected' : ''}`}
                  onClick={() => applyTechniqueCombination(combination)}
                >
                  <h5>{combination.name}</h5>
                  <p>{combination.description}</p>
                  <div className="technique-count">
                    {combination.techniques.length} techniques
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="prompt-sections">
        {visibleSections.map((sectionKey, index) => {
          const sectionConfig = getSectionConfig(sectionKey)
          const isActive = activeTechniques.includes(sectionConfig.technique)
          
          return (
            <div 
              key={sectionKey} 
              className={`prompt-section prompt-section-${sectionConfig.color} ${isActive ? 'technique-active' : ''}`}
            >
              <div className="prompt-section-header">
                <div 
                  className="prompt-section-icon"
                  style={{ background: `var(--gradient-${sectionConfig.color})` }}
                >
                  {sectionConfig.icon}
                </div>
                <div className="section-info">
                  <h4 className="prompt-section-title">
                    {sectionConfig.title}
                    {isActive && <span className="technique-badge">✓</span>}
                  </h4>
                  <p className="text-caption1 text-tertiary">{sectionConfig.description}</p>
                </div>
                {difficulty === 'advanced' && (
                  <div className="technique-info">
                    <span className="technique-name">
                      {PromptTechniques[sectionConfig.technique]?.name}
                    </span>
                  </div>
                )}
              </div>
              
              <textarea
                value={sections[sectionKey]}
                onChange={(e) => handleSectionChange(sectionKey, e.target.value)}
                placeholder={sectionConfig.placeholder}
                className="form-textarea"
                rows={sectionKey === 'reasoning' || sectionKey === 'examples' ? 4 : 3}
                style={{ 
                  borderColor: isActive ? `var(--color-${sectionConfig.color})` : undefined,
                  '--focus-color': `var(--color-${sectionConfig.color})`
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Dynamic Technique Suggestions */}
      {recommendedTechniques.length > 0 && (
        <div className="technique-suggestions">
          <h4>💡 Suggested Improvements</h4>
          <div className="suggestions-grid">
            {recommendedTechniques.slice(0, 3).map(technique => (
              <div key={technique.id} className="suggestion-card">
                <h5>{technique.name}</h5>
                <p>{technique.description}</p>
                <div className="suggestion-example">
                  <strong>Example:</strong> {technique.example}
                </div>
                <div className="effectiveness-score">
                  Effectiveness for {category}: {technique.effectiveness[category]}/10
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Techniques Display */}
      <div className="techniques-section">
        <div className="techniques-header">
          <h4 className="text-headline">Active Techniques</h4>
          <div className="header-buttons">
            <button 
              className="btn btn-secondary"
              onClick={() => setShowTechniqueGuide(true)}
            >
              📚 Technique Guide
            </button>
            <button 
              className="btn btn-tertiary"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Tips
            </button>
          </div>
        </div>
        
        <div className="techniques-badges">
          {availableTechniques.map(technique => {
            const isActive = activeTechniques.includes(technique.id)
            return (
              <div 
                key={technique.id}
                className={`technique-badge technique-badge-${technique.level} ${isActive ? 'active' : 'inactive'}`}
                title={technique.description}
              >
                <span>{technique.name}</span>
                {isActive && <span>✓</span>}
                <div className="effectiveness-indicator">
                  {technique.effectiveness[category]}/10
                </div>
              </div>
            )
          })}
        </div>

        {showAdvanced && (
          <div className="advanced-tips">
            <div className="tips-section">
              <h5>📊 Category-Specific Techniques</h5>
              <div className="category-techniques">
                {categoryTechniques.map(technique => (
                  <div key={technique.id} className="category-technique">
                    <strong>{technique.name}</strong>
                    <span>Effectiveness: {technique.effectiveness[category]}/10</span>
                    <p>{technique.businessUseCase}</p>
                  </div>
                ))}
              </div>
            </div>

            {promptAssessment?.suggestions.length > 0 && (
              <div className="tips-section">
                <h5>🎯 Improvement Suggestions</h5>
                <ul className="suggestions-list">
                  {promptAssessment.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="tips-section">
              <h5>📈 Your Learning Path</h5>
              <div className="learning-path">
                {learningPath.map((pathStep, index) => (
                  <div key={index} className="path-step">
                    <h6>{pathStep.description}</h6>
                    <div className="path-techniques">
                      {pathStep.techniques.map(technique => (
                        <span key={technique.id} className="path-technique">
                          {technique.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {buildFullPrompt() && (
        <div className="prompt-preview">
          <h4 className="text-headline">Your Complete Prompt</h4>
          <div className="prompt-text">
            {buildFullPrompt().split('\n\n').map((part, index) => (
              <div key={index} className="prompt-part">
                {part.split('\n').map((line, lineIndex) => (
                  <div key={lineIndex}>{line}</div>
                ))}
              </div>
            ))}
          </div>
          
          {promptAssessment && (
            <div className="prompt-analysis">
              <div className="analysis-header">
                <h5>Prompt Analysis</h5>
                <div className="quality-score">
                  Quality Score: {promptAssessment.score}/100
                </div>
              </div>
              <div className="active-techniques-list">
                <strong>Active Techniques:</strong>
                {promptAssessment.techniques.map(techniqueId => {
                  const technique = Object.values(PromptTechniques).find(t => t.id === techniqueId)
                  return technique ? (
                    <span key={techniqueId} className="analysis-technique">
                      {technique.name}
                    </span>
                  ) : null
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .adaptive-prompt-builder {
          max-width: 900px;
          margin: 0 auto;
        }

        .builder-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-8);
          gap: var(--spacing-6);
        }

        .difficulty-indicator {
          display: flex;
          align-items: center;
          gap: var(--spacing-4);
        }

        .difficulty-badge {
          padding: var(--spacing-3) var(--spacing-5);
          border-radius: var(--radius-full);
          color: white;
          font-size: var(--font-size-subheadline);
          font-weight: var(--font-weight-semibold);
          box-shadow: var(--shadow-md);
        }

        .difficulty-info p {
          margin: 0 0 var(--spacing-1) 0;
          color: var(--color-text-primary);
          font-weight: var(--font-weight-medium);
        }

        .difficulty-info span {
          font-size: var(--font-size-caption1);
          color: var(--color-text-secondary);
        }

        .quality-feedback {
          text-align: right;
        }

        .quality-score {
          font-size: var(--font-size-caption1);
          color: var(--color-text-secondary);
          margin-left: var(--spacing-3);
        }

        .technique-combinations {
          background: var(--color-bg-elevated);
          border-radius: var(--radius-xl);
          padding: var(--spacing-6);
          margin-bottom: var(--spacing-8);
          border: 2px solid var(--color-primary);
        }

        .technique-combinations h4 {
          margin: 0 0 var(--spacing-5) 0;
          color: var(--color-text-primary);
          font-weight: var(--font-weight-semibold);
        }

        .combination-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-4);
        }

        .combination-card {
          background: var(--color-bg-secondary);
          border: 2px solid var(--color-neutral-200);
          border-radius: var(--radius-large);
          padding: var(--spacing-5);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .combination-card:hover {
          border-color: var(--color-primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .combination-card.selected {
          border-color: var(--color-primary);
          background: rgba(0, 122, 255, 0.05);
        }

        .combination-card h5 {
          margin: 0 0 var(--spacing-2) 0;
          color: var(--color-text-primary);
          font-weight: var(--font-weight-semibold);
        }

        .combination-card p {
          margin: 0 0 var(--spacing-3) 0;
          color: var(--color-text-secondary);
          font-size: var(--font-size-caption1);
          line-height: 1.4;
        }

        .technique-count {
          font-size: var(--font-size-caption2);
          color: var(--color-primary);
          font-weight: var(--font-weight-medium);
        }

        .prompt-sections {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-6);
          margin-bottom: var(--spacing-8);
        }

        .prompt-section.technique-active {
          border: 2px solid var(--color-success);
          box-shadow: 0 0 0 4px rgba(52, 199, 89, 0.1);
        }

        .prompt-section-header {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-4);
          margin-bottom: var(--spacing-4);
        }

        .section-info {
          flex: 1;
        }

        .technique-badge {
          background: var(--color-success);
          color: white;
          font-size: var(--font-size-caption2);
          padding: var(--spacing-1) var(--spacing-2);
          border-radius: var(--radius-small);
          margin-left: var(--spacing-2);
        }

        .technique-info {
          text-align: right;
        }

        .technique-name {
          font-size: var(--font-size-caption1);
          color: var(--color-text-tertiary);
          font-style: italic;
        }

        .technique-suggestions {
          background: linear-gradient(135deg, rgba(255, 149, 0, 0.05), rgba(255, 149, 0, 0.02));
          border: 2px solid rgba(255, 149, 0, 0.2);
          border-radius: var(--radius-xl);
          padding: var(--spacing-6);
          margin-bottom: var(--spacing-8);
        }

        .technique-suggestions h4 {
          margin: 0 0 var(--spacing-5) 0;
          color: var(--color-warning);
          font-weight: var(--font-weight-semibold);
        }

        .suggestions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-4);
        }

        .suggestion-card {
          background: var(--color-bg-primary);
          border: 1px solid rgba(255, 149, 0, 0.3);
          border-radius: var(--radius-large);
          padding: var(--spacing-5);
        }

        .suggestion-card h5 {
          margin: 0 0 var(--spacing-2) 0;
          color: var(--color-text-primary);
          font-weight: var(--font-weight-semibold);
          font-size: var(--font-size-subheadline);
        }

        .suggestion-card p {
          margin: 0 0 var(--spacing-3) 0;
          color: var(--color-text-secondary);
          font-size: var(--font-size-caption1);
          line-height: 1.4;
        }

        .suggestion-example {
          background: var(--color-neutral-50);
          padding: var(--spacing-3);
          border-radius: var(--radius-medium);
          margin-bottom: var(--spacing-3);
          font-size: var(--font-size-caption1);
          border-left: 3px solid var(--color-warning);
        }

        .effectiveness-score {
          font-size: var(--font-size-caption2);
          color: var(--color-warning);
          font-weight: var(--font-weight-semibold);
        }

        .techniques-section {
          background: var(--color-bg-elevated);
          border-radius: var(--radius-xl);
          padding: var(--spacing-6);
          border: 2px solid var(--color-primary);
          margin-bottom: var(--spacing-6);
        }

        .techniques-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-5);
        }

        .header-buttons {
          display: flex;
          gap: var(--spacing-3);
        }

        .techniques-badges {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-3);
          margin-bottom: var(--spacing-5);
        }

        .technique-badge {
          position: relative;
          padding: var(--spacing-3) var(--spacing-4);
          border-radius: var(--radius-large);
          font-size: var(--font-size-caption1);
          font-weight: var(--font-weight-medium);
          transition: all var(--duration-fast) var(--ease-out);
          border: 2px solid transparent;
        }

        .technique-badge-beginner {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .technique-badge-intermediate {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
        }

        .technique-badge-advanced {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
        }

        .technique-badge.inactive {
          opacity: 0.4;
          filter: grayscale(50%);
        }

        .technique-badge.active {
          transform: scale(1.05);
          box-shadow: var(--shadow-md);
        }

        .effectiveness-indicator {
          position: absolute;
          top: -8px;
          right: -8px;
          background: var(--color-bg-primary);
          border: 2px solid currentColor;
          border-radius: var(--radius-full);
          padding: var(--spacing-1) var(--spacing-2);
          font-size: var(--font-size-caption2);
          font-weight: var(--font-weight-bold);
          color: var(--color-text-primary);
        }

        .advanced-tips {
          animation: slideUp var(--duration-normal) var(--ease-out);
        }

        .tips-section {
          margin-bottom: var(--spacing-6);
        }

        .tips-section:last-child {
          margin-bottom: 0;
        }

        .tips-section h5 {
          margin: 0 0 var(--spacing-4) 0;
          color: var(--color-text-primary);
          font-weight: var(--font-weight-semibold);
        }

        .category-techniques {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-4);
        }

        .category-technique {
          background: var(--color-bg-secondary);
          padding: var(--spacing-4);
          border-radius: var(--radius-medium);
          border: 1px solid var(--color-neutral-200);
        }

        .category-technique strong {
          display: block;
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-1);
        }

        .category-technique span {
          display: block;
          font-size: var(--font-size-caption2);
          color: var(--color-primary);
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--spacing-2);
        }

        .category-technique p {
          margin: 0;
          font-size: var(--font-size-caption1);
          color: var(--color-text-secondary);
          line-height: 1.4;
        }

        .suggestions-list {
          margin: 0;
          padding-left: var(--spacing-6);
        }

        .suggestions-list li {
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-2);
          line-height: 1.4;
        }

        .learning-path {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
        }

        .path-step {
          background: var(--color-bg-secondary);
          padding: var(--spacing-4);
          border-radius: var(--radius-medium);
          border-left: 4px solid var(--color-primary);
        }

        .path-step h6 {
          margin: 0 0 var(--spacing-3) 0;
          color: var(--color-text-primary);
          font-weight: var(--font-weight-semibold);
        }

        .path-techniques {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-2);
        }

        .path-technique {
          background: var(--color-primary);
          color: white;
          padding: var(--spacing-1) var(--spacing-3);
          border-radius: var(--radius-full);
          font-size: var(--font-size-caption2);
          font-weight: var(--font-weight-medium);
        }

        .prompt-preview {
          background: var(--color-bg-primary);
          border-radius: var(--radius-xl);
          padding: var(--spacing-6);
          border: 2px solid var(--color-neutral-200);
        }

        .prompt-preview h4 {
          margin: 0 0 var(--spacing-5) 0;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .prompt-text {
          font-family: var(--font-family-mono);
          font-size: var(--font-size-subheadline);
          line-height: 1.6;
          color: var(--color-text-primary);
          background: var(--color-bg-secondary);
          padding: var(--spacing-5);
          border-radius: var(--radius-large);
          border: 1px solid var(--color-neutral-200);
          margin-bottom: var(--spacing-5);
        }

        .prompt-part {
          margin-bottom: var(--spacing-4);
        }

        .prompt-part:last-child {
          margin-bottom: 0;
        }

        .prompt-analysis {
          background: linear-gradient(135deg, rgba(0, 122, 255, 0.05), rgba(0, 122, 255, 0.02));
          border: 1px solid rgba(0, 122, 255, 0.2);
          border-radius: var(--radius-large);
          padding: var(--spacing-5);
        }

        .analysis-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-4);
        }

        .analysis-header h5 {
          margin: 0;
          color: var(--color-primary);
          font-weight: var(--font-weight-semibold);
        }

        .quality-score {
          font-size: var(--font-size-subheadline);
          color: var(--color-primary);
          font-weight: var(--font-weight-bold);
        }

        .active-techniques-list {
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .analysis-technique {
          display: inline-block;
          background: var(--color-primary);
          color: white;
          padding: var(--spacing-1) var(--spacing-3);
          border-radius: var(--radius-full);
          font-size: var(--font-size-caption2);
          font-weight: var(--font-weight-medium);
          margin: 0 var(--spacing-2) var(--spacing-2) 0;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .builder-header {
            flex-direction: column;
            gap: var(--spacing-4);
          }

          .difficulty-indicator {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-3);
          }

          .combination-grid,
          .suggestions-grid,
          .category-techniques {
            grid-template-columns: 1fr;
          }

          .techniques-header {
            flex-direction: column;
            gap: var(--spacing-3);
            align-items: stretch;
          }

          .analysis-header {
            flex-direction: column;
            gap: var(--spacing-2);
            align-items: flex-start;
          }
        }
      `}</style>

      <TechniqueGuide 
        isOpen={showTechniqueGuide}
        onClose={() => setShowTechniqueGuide(false)}
        category={category}
        userLevel={userLevel}
      />
    </div>
  )
}

export default AdaptivePromptBuilder