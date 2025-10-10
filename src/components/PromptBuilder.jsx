import React, { useState, useEffect } from 'react'

const PromptBuilder = ({ onPromptChange, initialPrompt = '' }) => {
  const [sections, setSections] = useState({
    role: '',
    task: '',
    context: '',
    format: '',
    examples: ''
  })
  
  const [activeTechniques, setActiveTechniques] = useState([])
  const [promptQuality, setPromptQuality] = useState('needs-work')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Update parent component when sections change
  useEffect(() => {
    const fullPrompt = buildFullPrompt()
    onPromptChange(fullPrompt)
    assessPromptQuality(fullPrompt)
  }, [sections])

  const buildFullPrompt = () => {
    const parts = []
    
    if (sections.role) {
      parts.push(`**Role:** ${sections.role}`)
    }
    
    if (sections.task) {
      parts.push(`**Task:** ${sections.task}`)
    }
    
    if (sections.context) {
      parts.push(`**Context:** ${sections.context}`)
    }
    
    if (sections.format) {
      parts.push(`**Output Format:** ${sections.format}`)
    }
    
    if (sections.examples) {
      parts.push(`**Examples:** ${sections.examples}`)
    }
    
    return parts.join('\n\n')
  }

  const assessPromptQuality = (prompt) => {
    const wordCount = prompt.split(' ').length
    const hasRole = sections.role.length > 0
    const hasTask = sections.task.length > 0
    const hasFormat = sections.format.length > 0
    const hasSpecifics = prompt.includes('specific') || prompt.includes('detailed') || prompt.includes('exactly')
    
    let score = 0
    if (hasRole) score += 20
    if (hasTask) score += 30
    if (hasFormat) score += 25
    if (hasSpecifics) score += 15
    if (wordCount > 20) score += 10
    
    if (score >= 80) {
      setPromptQuality('excellent')
    } else if (score >= 50) {
      setPromptQuality('good')
    } else {
      setPromptQuality('needs-work')
    }
    
    // Update active techniques
    const techniques = []
    if (sections.examples) techniques.push('few-shot')
    if (sections.role) techniques.push('role-play')
    if (prompt.includes('step by step') || prompt.includes('think through')) techniques.push('chain-of-thought')
    if (!sections.examples && sections.task) techniques.push('one-shot')
    
    setActiveTechniques(techniques)
  }

  const handleSectionChange = (sectionName, value) => {
    setSections(prev => ({
      ...prev,
      [sectionName]: value
    }))
  }

  const getQualityMessage = () => {
    switch (promptQuality) {
      case 'excellent':
        return { text: 'Excellent prompt! 🎉', icon: '✅' }
      case 'good':
        return { text: 'Good prompt! Keep refining 👍', icon: '⚡' }
      default:
        return { text: 'Add more details to improve', icon: '💡' }
    }
  }

  const promptSections = [
    {
      key: 'role',
      title: 'Define Your Role',
      placeholder: 'e.g., "You are a senior financial analyst with 10 years of experience..."',
      icon: '👤',
      color: 'role',
      description: 'Set the AI\'s expertise and perspective'
    },
    {
      key: 'task',
      title: 'Specify the Task',
      placeholder: 'e.g., "Analyze the budget variance data and identify the top 3 areas of concern..."',
      icon: '🎯',
      color: 'task',
      description: 'Clearly define what you want the AI to do'
    },
    {
      key: 'context',
      title: 'Provide Context',
      placeholder: 'e.g., "This analysis is for the CFO to present to the board next week..."',
      icon: '📋',
      color: 'context',
      description: 'Give background information and constraints'
    },
    {
      key: 'format',
      title: 'Output Format',
      placeholder: 'e.g., "Provide a bullet-point summary with specific dollar amounts and percentages..."',
      icon: '📄',
      color: 'format',
      description: 'Specify exactly how you want the response formatted'
    },
    {
      key: 'examples',
      title: 'Examples (Optional)',
      placeholder: 'e.g., "Similar to this format: • Revenue variance: +$200K (8% above budget) due to..."',
      icon: '💡',
      color: 'examples',
      description: 'Show examples of the desired output style'
    }
  ]

  const techniques = [
    { key: 'one-shot', label: 'One-Shot', description: 'Single example or instruction' },
    { key: 'few-shot', label: 'Few-Shot', description: 'Multiple examples provided' },
    { key: 'chain-of-thought', label: 'Chain of Thought', description: 'Step-by-step reasoning' },
    { key: 'role-play', label: 'Role Playing', description: 'AI takes on specific expertise' }
  ]

  return (
    <div className="prompt-builder">
      <div className="prompt-builder-header">
        <h3 className="text-title2">Build Your Perfect Prompt</h3>
        <p className="text-body text-secondary">
          Create a structured, effective prompt using our guided approach
        </p>
        
        <div className="quality-feedback">
          <div className={`quality-indicator quality-${promptQuality}`}>
            <span>{getQualityMessage().icon}</span>
            <span>{getQualityMessage().text}</span>
          </div>
        </div>
      </div>

      <div className="prompt-sections">
        {promptSections.map((section, index) => (
          <div key={section.key} className={`prompt-section prompt-section-${section.color}`}>
            <div className="prompt-section-header">
              <div className={`prompt-section-icon`} style={{ background: `var(--gradient-${section.color})` }}>
                {section.icon}
              </div>
              <div>
                <h4 className="prompt-section-title">{section.title}</h4>
                <p className="text-caption1 text-tertiary">{section.description}</p>
              </div>
            </div>
            
            <textarea
              value={sections[section.key]}
              onChange={(e) => handleSectionChange(section.key, e.target.value)}
              placeholder={section.placeholder}
              className="form-textarea"
              rows={3}
              style={{ 
                borderColor: `var(--color-${section.color})`,
                '--focus-color': `var(--color-${section.color})`
              }}
            />
          </div>
        ))}
      </div>

      <div className="techniques-section">
        <div className="techniques-header">
          <h4 className="text-headline">Active Techniques</h4>
          <button 
            className="btn btn-tertiary"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Tips
          </button>
        </div>
        
        <div className="techniques-badges">
          {techniques.map(technique => (
            <div 
              key={technique.key}
              className={`technique-badge technique-badge-${technique.key.replace('-', '')} ${
                activeTechniques.includes(technique.key) ? 'active' : 'inactive'
              }`}
              style={{ 
                opacity: activeTechniques.includes(technique.key) ? 1 : 0.3,
                transform: activeTechniques.includes(technique.key) ? 'scale(1)' : 'scale(0.95)'
              }}
            >
              <span>{technique.label}</span>
              {activeTechniques.includes(technique.key) && <span>✓</span>}
            </div>
          ))}
        </div>

        {showAdvanced && (
          <div className="advanced-tips">
            <div className="tips-grid">
              <div className="tip-card">
                <h5>💪 Power Words</h5>
                <p>Use "analyze", "evaluate", "synthesize", "prioritize" for stronger instructions</p>
              </div>
              <div className="tip-card">
                <h5>🎯 Be Specific</h5>
                <p>Instead of "summarize", try "create a 3-bullet executive summary"</p>
              </div>
              <div className="tip-card">
                <h5>📊 Request Structure</h5>
                <p>Ask for numbered lists, tables, or specific formatting</p>
              </div>
              <div className="tip-card">
                <h5>🔍 Add Constraints</h5>
                <p>Specify word limits, focus areas, or what to exclude</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {buildFullPrompt() && (
        <div className="prompt-preview">
          <h4 className="text-headline" style={{ marginBottom: 'var(--spacing-4)' }}>
            Your Complete Prompt
          </h4>
          <div className="prompt-text">
            {buildFullPrompt().split('\n\n').map((part, index) => (
              <div key={index} className="prompt-part">
                {part.split('\n').map((line, lineIndex) => (
                  <div key={lineIndex}>{line}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .prompt-builder {
          max-width: 800px;
          margin: 0 auto;
        }

        .prompt-builder-header {
          text-align: center;
          margin-bottom: var(--spacing-8);
        }

        .prompt-builder-header h3 {
          margin-bottom: var(--spacing-3);
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .quality-feedback {
          margin-top: var(--spacing-6);
          display: flex;
          justify-content: center;
        }

        .prompt-sections {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-6);
          margin-bottom: var(--spacing-8);
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

        .techniques-badges {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-3);
          margin-bottom: var(--spacing-5);
        }

        .technique-badge.inactive {
          filter: grayscale(50%);
        }

        .advanced-tips {
          animation: slideUp var(--duration-normal) var(--ease-out);
        }

        .tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-4);
        }

        .tip-card {
          background: var(--color-bg-secondary);
          padding: var(--spacing-4);
          border-radius: var(--radius-large);
          border: 1px solid var(--color-neutral-200);
        }

        .tip-card h5 {
          font-size: var(--font-size-subheadline);
          font-weight: var(--font-weight-semibold);
          margin: 0 0 var(--spacing-2) 0;
          color: var(--color-text-primary);
        }

        .tip-card p {
          font-size: var(--font-size-caption1);
          color: var(--color-text-secondary);
          margin: 0;
          line-height: 1.4;
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
        }

        .prompt-part {
          margin-bottom: var(--spacing-4);
        }

        .prompt-part:last-child {
          margin-bottom: 0;
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
          .techniques-header {
            flex-direction: column;
            gap: var(--spacing-3);
            align-items: stretch;
          }

          .tips-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default PromptBuilder