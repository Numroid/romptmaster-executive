import React, { useState } from 'react'
import { 
  PromptTechniques, 
  TechniqueCombinations,
  getTechniquesByLevel,
  getTechniquesForCategory
} from '../services/promptTechniqueService'

const TechniqueGuide = ({ 
  isOpen, 
  onClose, 
  category = 'budget',
  userLevel = 'beginner' 
}) => {
  const [activeTab, setActiveTab] = useState('techniques')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedTechnique, setSelectedTechnique] = useState(null)

  if (!isOpen) return null

  const allTechniques = Object.values(PromptTechniques)
  const filteredTechniques = selectedLevel === 'all' 
    ? allTechniques 
    : getTechniquesByLevel(selectedLevel)

  const categoryTechniques = getTechniquesForCategory(category, 6)
  const combinations = Object.values(TechniqueCombinations)
    .filter(combo => combo.bestFor.includes(category))

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return '#10b981'
      case 'intermediate': return '#f59e0b'
      case 'advanced': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getEffectivenessColor = (score) => {
    if (score >= 8) return '#10b981'
    if (score >= 6) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="technique-guide-overlay">
      <div className="technique-guide">
        <div className="guide-header">
          <h2>Prompt Engineering Technique Guide</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="guide-tabs">
          <button 
            className={`tab-button ${activeTab === 'techniques' ? 'active' : ''}`}
            onClick={() => setActiveTab('techniques')}
          >
            📚 All Techniques
          </button>
          <button 
            className={`tab-button ${activeTab === 'category' ? 'active' : ''}`}
            onClick={() => setActiveTab('category')}
          >
            🎯 Best for {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
          <button 
            className={`tab-button ${activeTab === 'combinations' ? 'active' : ''}`}
            onClick={() => setActiveTab('combinations')}
          >
            🔗 Combinations
          </button>
          <button 
            className={`tab-button ${activeTab === 'examples' ? 'active' : ''}`}
            onClick={() => setActiveTab('examples')}
          >
            💡 Examples
          </button>
        </div>

        <div className="guide-content">
          {activeTab === 'techniques' && (
            <div className="techniques-tab">
              <div className="filter-controls">
                <label>Filter by Level:</label>
                <select 
                  value={selectedLevel} 
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="level-filter"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="techniques-grid">
                {filteredTechniques.map(technique => (
                  <div 
                    key={technique.id} 
                    className="technique-card"
                    onClick={() => setSelectedTechnique(technique)}
                  >
                    <div className="technique-header">
                      <h3>{technique.name}</h3>
                      <div 
                        className="level-badge"
                        style={{ backgroundColor: getLevelColor(technique.level) }}
                      >
                        {technique.level}
                      </div>
                    </div>
                    <p className="technique-description">{technique.description}</p>
                    <div className="technique-meta">
                      <div className="business-use">
                        <strong>Use Case:</strong> {technique.businessUseCase}
                      </div>
                      <div className="effectiveness">
                        <strong>Effectiveness for {category}:</strong>
                        <span 
                          className="effectiveness-score"
                          style={{ color: getEffectivenessColor(technique.effectiveness[category]) }}
                        >
                          {technique.effectiveness[category]}/10
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'category' && (
            <div className="category-tab">
              <h3>Most Effective Techniques for {category.charAt(0).toUpperCase() + category.slice(1)} Analysis</h3>
              <p>These techniques are specifically optimized for {category} scenarios and business contexts.</p>
              
              <div className="category-techniques-list">
                {categoryTechniques.map((technique, index) => (
                  <div key={technique.id} className="category-technique-item">
                    <div className="rank-badge">#{index + 1}</div>
                    <div className="technique-info">
                      <h4>{technique.name}</h4>
                      <p>{technique.description}</p>
                      <div className="technique-example">
                        <strong>Example:</strong> {technique.example}
                      </div>
                      <div className="effectiveness-bar">
                        <div className="effectiveness-label">
                          Effectiveness: {technique.effectiveness[category]}/10
                        </div>
                        <div className="bar">
                          <div 
                            className="bar-fill"
                            style={{ 
                              width: `${technique.effectiveness[category] * 10}%`,
                              backgroundColor: getEffectivenessColor(technique.effectiveness[category])
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'combinations' && (
            <div className="combinations-tab">
              <h3>Proven Technique Combinations</h3>
              <p>These combinations work exceptionally well together for complex business scenarios.</p>
              
              <div className="combinations-list">
                {combinations.map(combination => (
                  <div key={combination.name} className="combination-item">
                    <h4>{combination.name}</h4>
                    <p>{combination.description}</p>
                    <div className="combination-techniques">
                      <strong>Includes:</strong>
                      <div className="technique-tags">
                        {combination.techniques.map(techniqueId => {
                          const technique = Object.values(PromptTechniques).find(t => t.id === techniqueId)
                          return technique ? (
                            <span 
                              key={techniqueId} 
                              className="technique-tag"
                              style={{ backgroundColor: getLevelColor(technique.level) }}
                            >
                              {technique.name}
                            </span>
                          ) : null
                        })}
                      </div>
                    </div>
                    <div className="best-for">
                      <strong>Best for:</strong> {combination.bestFor.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="examples-tab">
              <h3>Real Business Examples</h3>
              <p>See how different techniques apply to actual business scenarios.</p>
              
              <div className="examples-list">
                <div className="example-scenario">
                  <h4>Budget Variance Analysis</h4>
                  <div className="example-comparison">
                    <div className="example-bad">
                      <h5>❌ Basic Prompt</h5>
                      <div className="prompt-example">
                        "Analyze this budget data and tell me what's wrong."
                      </div>
                      <div className="example-issues">
                        <strong>Issues:</strong> Vague, no context, no format specified
                      </div>
                    </div>
                    
                    <div className="example-good">
                      <h5>✅ Advanced Prompt (Multiple Techniques)</h5>
                      <div className="prompt-example">
                        <strong>Role:</strong> You are a senior financial analyst with 10 years of SaaS experience.<br/>
                        <strong>Task:</strong> Analyze Q3 budget variances and identify top 3 concerns.<br/>
                        <strong>Context:</strong> This is for CFO board presentation next week.<br/>
                        <strong>Format:</strong> Bullet points with specific dollar amounts and percentages.<br/>
                        <strong>Reasoning:</strong> Think step by step: 1) Calculate variances, 2) Identify patterns, 3) Prioritize by impact.
                      </div>
                      <div className="techniques-used">
                        <strong>Techniques Used:</strong>
                        <span className="technique-tag" style={{ backgroundColor: '#f59e0b' }}>Role Playing</span>
                        <span className="technique-tag" style={{ backgroundColor: '#10b981' }}>Output Format</span>
                        <span className="technique-tag" style={{ backgroundColor: '#10b981' }}>Context Setting</span>
                        <span className="technique-tag" style={{ backgroundColor: '#f59e0b' }}>Chain of Thought</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="example-scenario">
                  <h4>Risk Assessment</h4>
                  <div className="example-comparison">
                    <div className="example-bad">
                      <h5>❌ Basic Prompt</h5>
                      <div className="prompt-example">
                        "What are the risks for our company?"
                      </div>
                      <div className="example-issues">
                        <strong>Issues:</strong> Too broad, no prioritization, no actionable output
                      </div>
                    </div>
                    
                    <div className="example-good">
                      <h5>✅ Advanced Prompt (Self-Consistency + Constraints)</h5>
                      <div className="prompt-example">
                        <strong>Role:</strong> You are a risk management expert in manufacturing.<br/>
                        <strong>Task:</strong> Assess top 5 risks and provide mitigation strategies.<br/>
                        <strong>Context:</strong> Mid-size manufacturer, $50M revenue, global supply chain.<br/>
                        <strong>Constraints:</strong> Focus on next 12 months, exclude force majeure events.<br/>
                        <strong>Format:</strong> Risk matrix with probability/impact scores and specific actions.<br/>
                        <strong>Validation:</strong> Rate confidence level 1-10 for each assessment.
                      </div>
                      <div className="techniques-used">
                        <strong>Techniques Used:</strong>
                        <span className="technique-tag" style={{ backgroundColor: '#f59e0b' }}>Role Playing</span>
                        <span className="technique-tag" style={{ backgroundColor: '#f59e0b' }}>Constraint Specification</span>
                        <span className="technique-tag" style={{ backgroundColor: '#ef4444' }}>Self-Consistency</span>
                        <span className="technique-tag" style={{ backgroundColor: '#10b981' }}>Output Format</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {selectedTechnique && (
          <div className="technique-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{selectedTechnique.name}</h3>
                <button 
                  className="close-modal"
                  onClick={() => setSelectedTechnique(null)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <div 
                  className="level-badge"
                  style={{ backgroundColor: getLevelColor(selectedTechnique.level) }}
                >
                  {selectedTechnique.level} level
                </div>
                <p><strong>Description:</strong> {selectedTechnique.description}</p>
                <p><strong>Business Use Case:</strong> {selectedTechnique.businessUseCase}</p>
                <div className="example-section">
                  <strong>Example:</strong>
                  <div className="example-text">{selectedTechnique.example}</div>
                </div>
                <div className="effectiveness-section">
                  <strong>Effectiveness by Category:</strong>
                  <div className="effectiveness-grid">
                    {Object.entries(selectedTechnique.effectiveness).map(([cat, score]) => (
                      <div key={cat} className="effectiveness-item">
                        <span className="category-name">{cat}</span>
                        <div className="score-bar">
                          <div 
                            className="score-fill"
                            style={{ 
                              width: `${score * 10}%`,
                              backgroundColor: getEffectivenessColor(score)
                            }}
                          ></div>
                        </div>
                        <span className="score-value">{score}/10</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .technique-guide-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-6);
        }

        .technique-guide {
          background: var(--color-bg-primary);
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-2xl);
          width: 100%;
          max-width: 1200px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .guide-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-6) var(--spacing-7);
          border-bottom: 1px solid var(--color-neutral-200);
          background: linear-gradient(135deg, var(--color-bg-secondary), var(--color-neutral-100));
        }

        .guide-header h2 {
          margin: 0;
          color: var(--color-text-primary);
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-title2);
        }

        .close-button {
          background: none;
          border: none;
          font-size: var(--font-size-title3);
          color: var(--color-text-secondary);
          cursor: pointer;
          padding: var(--spacing-2);
          border-radius: var(--radius-medium);
          transition: all var(--duration-fast) var(--ease-out);
        }

        .close-button:hover {
          background: var(--color-neutral-200);
          color: var(--color-text-primary);
        }

        .guide-tabs {
          display: flex;
          background: var(--color-bg-secondary);
          border-bottom: 1px solid var(--color-neutral-200);
          overflow-x: auto;
        }

        .tab-button {
          padding: var(--spacing-4) var(--spacing-6);
          border: none;
          background: transparent;
          color: var(--color-text-secondary);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-out);
          white-space: nowrap;
          border-bottom: 3px solid transparent;
        }

        .tab-button:hover {
          background: var(--color-neutral-100);
          color: var(--color-text-primary);
        }

        .tab-button.active {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
          background: var(--color-bg-primary);
        }

        .guide-content {
          flex: 1;
          overflow-y: auto;
          padding: var(--spacing-7);
        }

        .filter-controls {
          display: flex;
          align-items: center;
          gap: var(--spacing-4);
          margin-bottom: var(--spacing-6);
        }

        .filter-controls label {
          font-weight: var(--font-weight-medium);
          color: var(--color-text-primary);
        }

        .level-filter {
          padding: var(--spacing-2) var(--spacing-4);
          border: 2px solid var(--color-neutral-300);
          border-radius: var(--radius-medium);
          background: var(--color-bg-primary);
          color: var(--color-text-primary);
          font-size: var(--font-size-body);
        }

        .techniques-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: var(--spacing-5);
        }

        .technique-card {
          background: var(--color-bg-secondary);
          border: 2px solid var(--color-neutral-200);
          border-radius: var(--radius-large);
          padding: var(--spacing-5);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .technique-card:hover {
          border-color: var(--color-primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .technique-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-3);
        }

        .technique-header h3 {
          margin: 0;
          color: var(--color-text-primary);
          font-weight: var(--font-weight-semibold);
          font-size: var(--font-size-headline);
        }

        .level-badge {
          padding: var(--spacing-1) var(--spacing-3);
          border-radius: var(--radius-full);
          color: white;
          font-size: var(--font-size-caption2);
          font-weight: var(--font-weight-semibold);
          text-transform: capitalize;
        }

        .technique-description {
          color: var(--color-text-secondary);
          margin: 0 0 var(--spacing-4) 0;
          line-height: 1.5;
        }

        .technique-meta {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
        }

        .business-use,
        .effectiveness {
          font-size: var(--font-size-caption1);
          color: var(--color-text-secondary);
        }

        .effectiveness-score {
          font-weight: var(--font-weight-bold);
          margin-left: var(--spacing-2);
        }

        .category-techniques-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-5);
        }

        .category-technique-item {
          display: flex;
          gap: var(--spacing-4);
          background: var(--color-bg-secondary);
          border-radius: var(--radius-large);
          padding: var(--spacing-5);
          border: 2px solid var(--color-neutral-200);
        }

        .rank-badge {
          background: var(--color-primary);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-headline);
          flex-shrink: 0;
        }

        .technique-info {
          flex: 1;
        }

        .technique-info h4 {
          margin: 0 0 var(--spacing-2) 0;
          color: var(--color-text-primary);
          font-weight: var(--font-weight-semibold);
        }

        .technique-info p {
          margin: 0 0 var(--spacing-3) 0;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .technique-example {
          background: var(--color-neutral-50);
          padding: var(--spacing-3);
          border-radius: var(--radius-medium);
          margin-bottom: var(--spacing-3);
          font-size: var(--font-size-caption1);
          border-left: 3px solid var(--color-primary);
        }

        .effectiveness-bar {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
        }

        .effectiveness-label {
          font-size: var(--font-size-caption1);
          color: var(--color-text-secondary);
          font-weight: var(--font-weight-medium);
          min-width: 120px;
        }

        .bar {
          flex: 1;
          height: 8px;
          background: var(--color-neutral-200);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          transition: width var(--duration-normal) var(--ease-out);
        }

        .combinations-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-6);
        }

        .combination-item {
          background: var(--color-bg-secondary);
          border-radius: var(--radius-large);
          padding: var(--spacing-6);
          border: 2px solid var(--color-neutral-200);
        }

        .combination-item h4 {
          margin: 0 0 var(--spacing-3) 0;
          color: var(--color-text-primary);
          font-weight: var(--font-weight-semibold);
        }

        .combination-item p {
          margin: 0 0 var(--spacing-4) 0;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .combination-techniques {
          margin-bottom: var(--spacing-4);
        }

        .technique-tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-2);
          margin-top: var(--spacing-2);
        }

        .technique-tag {
          padding: var(--spacing-1) var(--spacing-3);
          border-radius: var(--radius-full);
          color: white;
          font-size: var(--font-size-caption2);
          font-weight: var(--font-weight-medium);
        }

        .best-for {
          font-size: var(--font-size-caption1);
          color: var(--color-text-secondary);
        }

        .examples-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-8);
        }

        .example-scenario {
          background: var(--color-bg-secondary);
          border-radius: var(--radius-large);
          padding: var(--spacing-6);
          border: 2px solid var(--color-neutral-200);
        }

        .example-scenario h4 {
          margin: 0 0 var(--spacing-5) 0;
          color: var(--color-text-primary);
          font-weight: var(--font-weight-semibold);
        }

        .example-comparison {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-5);
        }

        .example-bad,
        .example-good {
          background: var(--color-bg-primary);
          border-radius: var(--radius-medium);
          padding: var(--spacing-5);
        }

        .example-bad {
          border: 2px solid #ef4444;
        }

        .example-good {
          border: 2px solid #10b981;
        }

        .example-bad h5,
        .example-good h5 {
          margin: 0 0 var(--spacing-3) 0;
          font-weight: var(--font-weight-semibold);
        }

        .prompt-example {
          background: var(--color-neutral-50);
          padding: var(--spacing-4);
          border-radius: var(--radius-medium);
          font-family: var(--font-family-mono);
          font-size: var(--font-size-caption1);
          line-height: 1.5;
          margin-bottom: var(--spacing-3);
          border-left: 3px solid currentColor;
        }

        .example-issues {
          font-size: var(--font-size-caption1);
          color: #ef4444;
        }

        .techniques-used {
          font-size: var(--font-size-caption1);
          color: #10b981;
        }

        .techniques-used .technique-tag {
          margin-left: var(--spacing-2);
          margin-top: var(--spacing-1);
          display: inline-block;
        }

        .technique-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-6);
        }

        .modal-content {
          background: var(--color-bg-primary);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-2xl);
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-6);
          border-bottom: 1px solid var(--color-neutral-200);
        }

        .modal-header h3 {
          margin: 0;
          color: var(--color-text-primary);
          font-weight: var(--font-weight-semibold);
        }

        .close-modal {
          background: none;
          border: none;
          font-size: var(--font-size-headline);
          color: var(--color-text-secondary);
          cursor: pointer;
          padding: var(--spacing-2);
          border-radius: var(--radius-medium);
          transition: all var(--duration-fast) var(--ease-out);
        }

        .close-modal:hover {
          background: var(--color-neutral-200);
          color: var(--color-text-primary);
        }

        .modal-body {
          padding: var(--spacing-6);
        }

        .modal-body p {
          margin: 0 0 var(--spacing-4) 0;
          line-height: 1.5;
          color: var(--color-text-secondary);
        }

        .example-section {
          margin: var(--spacing-5) 0;
        }

        .example-text {
          background: var(--color-neutral-50);
          padding: var(--spacing-4);
          border-radius: var(--radius-medium);
          font-family: var(--font-family-mono);
          font-size: var(--font-size-caption1);
          line-height: 1.5;
          border-left: 3px solid var(--color-primary);
          margin-top: var(--spacing-2);
        }

        .effectiveness-section {
          margin-top: var(--spacing-5);
        }

        .effectiveness-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--spacing-3);
          margin-top: var(--spacing-3);
        }

        .effectiveness-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
        }

        .category-name {
          font-size: var(--font-size-caption1);
          color: var(--color-text-secondary);
          text-transform: capitalize;
          min-width: 60px;
        }

        .score-bar {
          flex: 1;
          height: 6px;
          background: var(--color-neutral-200);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .score-fill {
          height: 100%;
          transition: width var(--duration-normal) var(--ease-out);
        }

        .score-value {
          font-size: var(--font-size-caption2);
          color: var(--color-text-secondary);
          font-weight: var(--font-weight-medium);
          min-width: 30px;
        }

        @media (max-width: 768px) {
          .technique-guide-overlay {
            padding: var(--spacing-4);
          }

          .guide-header {
            padding: var(--spacing-5);
          }

          .guide-content {
            padding: var(--spacing-5);
          }

          .techniques-grid {
            grid-template-columns: 1fr;
          }

          .example-comparison {
            grid-template-columns: 1fr;
          }

          .effectiveness-grid {
            grid-template-columns: 1fr;
          }

          .guide-tabs {
            flex-wrap: wrap;
          }

          .tab-button {
            flex: 1;
            min-width: 120px;
          }
        }
      `}</style>
    </div>
  )
}

export default TechniqueGuide