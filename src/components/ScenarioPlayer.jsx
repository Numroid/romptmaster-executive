import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { 
  mockGetScenarioById,
  getDifficultyColor,
  getCategoryIcon,
  formatEstimatedTime
} from '../services/scenarioService'
import LoadingSpinner from './LoadingSpinner'
import PromptBuilder from './PromptBuilder'
import AdaptivePromptBuilder from './AdaptivePromptBuilder'

const ScenarioPlayer = () => {
  const [scenario, setScenario] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userPrompt, setUserPrompt] = useState('')
  const [showHints, setShowHints] = useState(false)
  const [currentHintIndex, setCurrentHintIndex] = useState(0)
  const [useStructuredBuilder, setUseStructuredBuilder] = useState(true)
  const [useAdaptiveBuilder, setUseAdaptiveBuilder] = useState(true)
  const [progress, setProgress] = useState(0)
  const [encouragementMessage, setEncouragementMessage] = useState('')
  
  const { scenarioId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth0()

  useEffect(() => {
    loadScenario()
  }, [scenarioId])

  const loadScenario = async () => {
    try {
      setLoading(true)
      const scenarioData = await mockGetScenarioById(scenarioId)
      setScenario(scenarioData)
      setError(null)
    } catch (err) {
      setError('Scenario not found or failed to load.')
      console.error('Error loading scenario:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToSelection = () => {
    navigate('/scenarios')
  }

  const handlePromptSubmit = () => {
    if (!userPrompt.trim()) {
      alert('Please enter a prompt before submitting.')
      return
    }
    
    // For now, just show an alert - this will be connected to AI service in future tasks
    alert('Prompt submitted! AI integration will be implemented in the next task.')
    console.log('User prompt:', userPrompt)
    console.log('Scenario context:', scenario.businessContext)
  }

  const handleShowNextHint = () => {
    if (currentHintIndex < scenario.hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1)
    }
  }

  const handlePromptChange = (prompt) => {
    setUserPrompt(prompt)
    updateProgress(prompt)
    updateEncouragement(prompt)
  }

  const handleTextareaChange = (e) => {
    setUserPrompt(e.target.value)
    updateProgress(e.target.value)
    updateEncouragement(e.target.value)
  }

  const updateProgress = (prompt) => {
    const wordCount = prompt.split(' ').filter(word => word.length > 0).length
    const hasSpecifics = prompt.includes('specific') || prompt.includes('detailed') || prompt.includes('analyze')
    const hasFormat = prompt.includes('format') || prompt.includes('list') || prompt.includes('summary')
    
    let newProgress = Math.min((wordCount / 20) * 60, 60)
    if (hasSpecifics) newProgress += 20
    if (hasFormat) newProgress += 20
    
    setProgress(Math.min(newProgress, 100))
  }

  const updateEncouragement = (prompt) => {
    const messages = [
      "You're getting the hang of this! 🚀",
      "Excellent progress! Keep going! ⭐",
      "Almost there! Your prompt is looking great! 💪",
      "Fantastic work! You're mastering this! 🎉",
      "Perfect! You're becoming a prompt expert! 🏆"
    ]
    
    const progressLevel = Math.floor(progress / 20)
    if (progressLevel > 0 && progressLevel <= messages.length) {
      setEncouragementMessage(messages[progressLevel - 1])
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error || !scenario) {
    return (
      <div className="scenario-error">
        <div className="container">
          <div className="error-content">
            <h2>Scenario Not Found</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={handleBackToSelection}>
              Back to Scenarios
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="scenario-player">
      <header className="scenario-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <button className="back-button" onClick={handleBackToSelection}>
                ← Back to Scenarios
              </button>
              <div className="scenario-info">
                <div className="scenario-title">
                  <span className="scenario-icon">{getCategoryIcon(scenario.category)}</span>
                  <h1>{scenario.title}</h1>
                </div>
                <div className="scenario-meta">
                  <span 
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(scenario.difficulty) }}
                  >
                    {scenario.difficulty}
                  </span>
                  <span className="time-estimate">
                    {formatEstimatedTime(scenario.estimatedTime)}
                  </span>
                </div>
              </div>
            </div>
            <div className="user-info">
              <span>Welcome, {user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="scenario-main">
        <div className="container">
          <div className="scenario-layout">
            <div className="context-panel">
              <div className="panel-header">
                <h2>Business Context</h2>
              </div>
              <div className="panel-content">
                <div className="context-description">
                  <p>{scenario.businessContext}</p>
                </div>

                {scenario.sampleDocuments && scenario.sampleDocuments.length > 0 && (
                  <div className="sample-documents">
                    <h3>Reference Documents</h3>
                    {scenario.sampleDocuments.map((doc, index) => (
                      <div key={index} className="document-card">
                        <div className="document-header">
                          <span className="document-type">{doc.type}</span>
                          <span className="document-title">{doc.title}</span>
                        </div>
                        <div className="document-content">
                          <pre>{doc.content}</pre>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="task-panel">
              <div className="panel-header">
                <h2>Your Task</h2>
              </div>
              <div className="panel-content">
                <div className="objective-section">
                  <h3>Objective</h3>
                  <p>{scenario.objective}</p>
                </div>

                <div className="prompt-section">
                  <div className="prompt-header">
                    <h3>Craft Your Perfect Prompt</h3>
                    <div className="prompt-mode-toggle">
                      <button 
                        className={`mode-button ${useAdaptiveBuilder ? 'active' : ''}`}
                        onClick={() => {
                          setUseAdaptiveBuilder(true)
                          setUseStructuredBuilder(true)
                        }}
                      >
                        🧠 Adaptive Builder
                      </button>
                      <button 
                        className={`mode-button ${useStructuredBuilder && !useAdaptiveBuilder ? 'active' : ''}`}
                        onClick={() => {
                          setUseAdaptiveBuilder(false)
                          setUseStructuredBuilder(true)
                        }}
                      >
                        🏗️ Basic Builder
                      </button>
                      <button 
                        className={`mode-button ${!useStructuredBuilder ? 'active' : ''}`}
                        onClick={() => {
                          setUseStructuredBuilder(false)
                          setUseAdaptiveBuilder(false)
                        }}
                      >
                        ✍️ Free Write
                      </button>
                    </div>
                  </div>

                  {progress > 0 && (
                    <div className="progress-section">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill progress-celebration" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="progress-text">
                        <span>Progress: {Math.round(progress)}%</span>
                        {encouragementMessage && (
                          <span className="encouragement">{encouragementMessage}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {useStructuredBuilder ? (
                    useAdaptiveBuilder ? (
                      <AdaptivePromptBuilder 
                        onPromptChange={handlePromptChange}
                        initialPrompt={userPrompt}
                        difficulty={scenario.difficulty}
                        category={scenario.category}
                        userLevel={scenario.requiredLevel}
                      />
                    ) : (
                      <PromptBuilder 
                        onPromptChange={handlePromptChange}
                        initialPrompt={userPrompt}
                      />
                    )
                  ) : (
                    <div className="freewrite-section">
                      <textarea
                        value={userPrompt}
                        onChange={handleTextareaChange}
                        placeholder="Write your prompt here... Be specific about what you want the AI to analyze and how you want the output formatted."
                        className="prompt-textarea"
                        rows={8}
                      />
                      <div className="prompt-meta">
                        <span className="character-count">
                          {userPrompt.length} characters
                        </span>
                        <span className="word-count">
                          {userPrompt.split(' ').filter(word => word.length > 0).length} words
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="action-section">
                  <button 
                    className="btn btn-primary submit-button"
                    onClick={handlePromptSubmit}
                    disabled={!userPrompt.trim()}
                  >
                    Submit Prompt
                  </button>
                  
                  <button 
                    className="btn btn-secondary hint-button"
                    onClick={() => setShowHints(!showHints)}
                  >
                    💡 {showHints ? 'Hide' : 'Show'} Hints
                  </button>
                </div>

                {showHints && scenario.hints && scenario.hints.length > 0 && (
                  <div className="hints-section">
                    <h3>Hints</h3>
                    <div className="hint-card">
                      <p>{scenario.hints[currentHintIndex]}</p>
                      {currentHintIndex < scenario.hints.length - 1 && (
                        <button 
                          className="btn btn-outline next-hint-button"
                          onClick={handleShowNextHint}
                        >
                          Next Hint ({currentHintIndex + 1}/{scenario.hints.length})
                        </button>
                      )}
                      {currentHintIndex === scenario.hints.length - 1 && (
                        <p className="hint-complete">
                          You've seen all available hints ({scenario.hints.length}/{scenario.hints.length})
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {scenario.successCriteria && scenario.successCriteria.length > 0 && (
                  <div className="success-criteria">
                    <h3>Success Criteria</h3>
                    <ul>
                      {scenario.successCriteria.map((criteria, index) => (
                        <li key={index}>{criteria}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .scenario-player {
          min-height: 100vh;
          background: var(--color-bg-secondary);
        }

        .scenario-header {
          background: var(--color-bg-primary);
          border-bottom: 1px solid var(--color-neutral-200);
          padding: var(--spacing-7) 0;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          animation: slideDown var(--duration-normal) var(--ease-out);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: var(--spacing-7);
        }

        .back-button {
          background: none;
          border: none;
          color: var(--color-primary);
          font-size: var(--font-size-body);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          padding: var(--spacing-3) 0;
          transition: all var(--duration-fast) var(--ease-out);
          border-radius: var(--radius-medium);
        }

        .back-button:hover {
          color: var(--color-primary-dark);
          background: rgba(0, 122, 255, 0.05);
          padding: var(--spacing-3) var(--spacing-4);
          margin: 0 calc(-1 * var(--spacing-4));
        }

        .scenario-title {
          display: flex;
          align-items: center;
          gap: var(--spacing-4);
          margin-bottom: var(--spacing-3);
        }

        .scenario-icon {
          font-size: var(--font-size-title2);
        }

        .scenario-title h1 {
          font-size: var(--font-size-title1);
          font-weight: var(--font-weight-bold);
          color: var(--color-text-primary);
          margin: 0;
          letter-spacing: -0.01em;
        }

        .scenario-meta {
          display: flex;
          gap: var(--spacing-5);
          align-items: center;
        }

        .difficulty-badge {
          padding: var(--spacing-2) var(--spacing-4);
          border-radius: var(--radius-full);
          color: white;
          font-size: var(--font-size-caption1);
          font-weight: var(--font-weight-semibold);
          text-transform: capitalize;
          box-shadow: var(--shadow-sm);
        }

        .time-estimate {
          color: var(--color-text-secondary);
          font-size: var(--font-size-subheadline);
          font-weight: var(--font-weight-medium);
        }

        .user-info {
          color: var(--color-text-secondary);
          font-size: var(--font-size-body);
          font-weight: var(--font-weight-medium);
        }

        .scenario-main {
          padding: var(--spacing-8) 0;
        }

        .scenario-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-8);
          max-width: 1440px;
          margin: 0 auto;
        }

        .context-panel,
        .task-panel {
          background: var(--color-bg-primary);
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--color-neutral-200);
          overflow: hidden;
          transition: all var(--duration-normal) var(--ease-out);
          animation: slideUp var(--duration-slow) var(--ease-out);
        }

        .context-panel:hover,
        .task-panel:hover {
          box-shadow: var(--shadow-xl);
          transform: translateY(-2px);
        }

        .panel-header {
          background: linear-gradient(135deg, var(--color-bg-secondary), var(--color-neutral-100));
          border-bottom: 1px solid var(--color-neutral-200);
          padding: var(--spacing-6) var(--spacing-7);
        }

        .panel-header h2 {
          font-size: var(--font-size-title3);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-primary);
          margin: 0;
          letter-spacing: -0.01em;
        }

        .panel-content {
          padding: var(--spacing-7);
        }

        .context-description p {
          line-height: 1.6;
          color: var(--color-text-secondary);
          margin: 0 0 var(--spacing-7) 0;
          font-size: var(--font-size-body);
        }

        .sample-documents h3 {
          font-size: var(--font-size-headline);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-primary);
          margin: 0 0 var(--spacing-5) 0;
        }

        .document-card {
          border: 1px solid var(--color-neutral-200);
          border-radius: var(--radius-large);
          margin-bottom: var(--spacing-5);
          overflow: hidden;
          transition: all var(--duration-normal) var(--ease-out);
        }

        .document-card:hover {
          border-color: var(--color-primary);
          box-shadow: var(--shadow-md);
          transform: translateY(-1px);
        }

        .document-header {
          background: var(--color-bg-secondary);
          padding: var(--spacing-4) var(--spacing-5);
          border-bottom: 1px solid var(--color-neutral-200);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .document-type {
          font-size: var(--font-size-caption1);
          color: var(--color-primary);
          font-weight: var(--font-weight-semibold);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .document-title {
          font-size: var(--font-size-subheadline);
          color: var(--color-text-primary);
          font-weight: var(--font-weight-medium);
        }

        .document-content {
          padding: var(--spacing-5);
        }

        .document-content pre {
          font-family: var(--font-family-mono);
          font-size: var(--font-size-footnote);
          line-height: 1.5;
          color: var(--color-text-secondary);
          margin: 0;
          white-space: pre-wrap;
          background: var(--color-neutral-50);
          padding: var(--spacing-4);
          border-radius: var(--radius-medium);
          border: 1px solid var(--color-neutral-200);
        }

        .objective-section {
          margin-bottom: var(--spacing-8);
          padding: var(--spacing-6);
          background: linear-gradient(135deg, rgba(0, 122, 255, 0.03), rgba(0, 122, 255, 0.01));
          border-radius: var(--radius-xl);
          border: 2px solid rgba(0, 122, 255, 0.1);
        }

        .objective-section h3 {
          font-size: var(--font-size-headline);
          font-weight: var(--font-weight-semibold);
          color: var(--color-primary);
          margin: 0 0 var(--spacing-4) 0;
        }

        .objective-section p {
          color: var(--color-text-primary);
          line-height: 1.6;
          margin: 0;
          font-size: var(--font-size-body);
          font-weight: var(--font-weight-medium);
        }

        .prompt-section {
          margin-bottom: var(--spacing-7);
        }

        .prompt-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-6);
        }

        .prompt-header h3 {
          font-size: var(--font-size-title3);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-primary);
          margin: 0;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .prompt-mode-toggle {
          display: flex;
          background: var(--color-bg-secondary);
          border-radius: var(--radius-full);
          padding: var(--spacing-1);
          border: 2px solid var(--color-neutral-200);
          flex-wrap: wrap;
          gap: var(--spacing-1);
        }

        .mode-button {
          padding: var(--spacing-2) var(--spacing-4);
          border: none;
          background: transparent;
          border-radius: var(--radius-full);
          font-size: var(--font-size-caption1);
          font-weight: var(--font-weight-medium);
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-out);
          white-space: nowrap;
          flex: 1;
          min-width: 120px;
        }

        .mode-button.active {
          background: var(--gradient-primary);
          color: white;
          box-shadow: var(--shadow-md);
          transform: translateY(-1px);
        }

        .mode-button:hover:not(.active) {
          color: var(--color-text-primary);
          background: var(--color-bg-primary);
        }

        .progress-section {
          margin-bottom: var(--spacing-6);
          padding: var(--spacing-5);
          background: linear-gradient(135deg, rgba(0, 102, 255, 0.05), rgba(0, 102, 255, 0.02));
          border-radius: var(--radius-xl);
          border: 2px solid rgba(0, 102, 255, 0.1);
        }

        .progress-text {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: var(--spacing-3);
          font-size: var(--font-size-subheadline);
          font-weight: var(--font-weight-medium);
        }

        .progress-text span:first-child {
          color: var(--color-primary);
        }

        .encouragement {
          color: var(--color-success);
          font-weight: var(--font-weight-semibold);
          animation: fadeIn var(--duration-normal) var(--ease-out);
        }

        .freewrite-section {
          animation: slideUp var(--duration-normal) var(--ease-out);
        }

        .prompt-textarea {
          width: 100%;
          padding: var(--spacing-5);
          border: 2px solid var(--color-neutral-300);
          border-radius: var(--radius-large);
          font-size: var(--font-size-body);
          font-family: var(--font-family-system);
          line-height: 1.6;
          resize: vertical;
          min-height: 200px;
          background: var(--color-bg-primary);
          color: var(--color-text-primary);
          transition: all var(--duration-fast) var(--ease-out);
        }

        .prompt-textarea:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
          transform: translateY(-1px);
        }

        .prompt-textarea::placeholder {
          color: var(--color-text-tertiary);
        }

        .prompt-meta {
          display: flex;
          justify-content: space-between;
          margin-top: var(--spacing-3);
        }

        .character-count,
        .word-count {
          font-size: var(--font-size-caption1);
          color: var(--color-text-tertiary);
          font-weight: var(--font-weight-medium);
        }

        .action-section {
          display: flex;
          gap: var(--spacing-4);
          margin-bottom: var(--spacing-7);
        }

        .submit-button {
          flex: 1;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .submit-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        .hint-button {
          white-space: nowrap;
          min-width: 140px;
        }

        .hints-section {
          margin-bottom: var(--spacing-7);
          animation: slideUp var(--duration-normal) var(--ease-out);
        }

        .hints-section h3 {
          font-size: var(--font-size-headline);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-primary);
          margin: 0 0 var(--spacing-4) 0;
        }

        .hint-card {
          background: linear-gradient(135deg, rgba(255, 149, 0, 0.05), rgba(255, 149, 0, 0.02));
          border: 2px solid rgba(255, 149, 0, 0.2);
          border-radius: var(--radius-xl);
          padding: var(--spacing-6);
          position: relative;
          overflow: hidden;
        }

        .hint-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--color-warning);
          border-radius: 0 var(--radius-small) var(--radius-small) 0;
        }

        .hint-card p {
          color: var(--color-warning);
          margin: 0 0 var(--spacing-4) 0;
          line-height: 1.6;
          font-size: var(--font-size-body);
          font-weight: var(--font-weight-medium);
          position: relative;
          z-index: 2;
        }

        .next-hint-button {
          font-size: var(--font-size-caption1);
          padding: var(--spacing-2) var(--spacing-4);
          border-radius: var(--radius-full);
        }

        .hint-complete {
          font-size: var(--font-size-caption1);
          color: var(--color-warning);
          font-style: italic;
          margin: 0 !important;
          font-weight: var(--font-weight-medium);
        }

        .success-criteria {
          background: linear-gradient(135deg, rgba(52, 199, 89, 0.03), rgba(52, 199, 89, 0.01));
          border-radius: var(--radius-xl);
          padding: var(--spacing-6);
          border: 2px solid rgba(52, 199, 89, 0.1);
          position: relative;
        }

        .success-criteria::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--color-success);
          border-radius: 0 var(--radius-small) var(--radius-small) 0;
        }

        .success-criteria h3 {
          font-size: var(--font-size-headline);
          font-weight: var(--font-weight-semibold);
          color: var(--color-success);
          margin: 0 0 var(--spacing-4) 0;
        }

        .success-criteria ul {
          margin: 0;
          padding-left: var(--spacing-6);
        }

        .success-criteria li {
          color: var(--color-success);
          line-height: 1.6;
          margin-bottom: var(--spacing-3);
          font-weight: var(--font-weight-medium);
        }

        .scenario-error {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-secondary);
        }

        .error-content {
          text-align: center;
          padding: var(--spacing-10);
          background: var(--color-bg-primary);
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--color-neutral-200);
          max-width: 500px;
          animation: scaleIn var(--duration-normal) var(--ease-spring);
        }

        .error-content h2 {
          color: var(--color-text-primary);
          font-size: var(--font-size-title2);
          font-weight: var(--font-weight-bold);
          margin: 0 0 var(--spacing-5) 0;
        }

        .error-content p {
          color: var(--color-text-secondary);
          font-size: var(--font-size-body);
          margin: 0 0 var(--spacing-7) 0;
          line-height: 1.6;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 1024px) {
          .scenario-layout {
            grid-template-columns: 1fr;
            gap: var(--spacing-7);
          }
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: var(--spacing-5);
            text-align: center;
          }

          .header-left {
            flex-direction: column;
            gap: var(--spacing-5);
          }

          .scenario-meta {
            justify-content: center;
          }

          .action-section {
            flex-direction: column;
          }

          .hint-button {
            white-space: normal;
            min-width: auto;
          }

          .scenario-title h1 {
            font-size: var(--font-size-title2);
          }

          .panel-content {
            padding: var(--spacing-6);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .header-content,
          .context-panel,
          .task-panel,
          .hints-section,
          .error-content {
            animation: none;
          }
          
          .context-panel:hover,
          .task-panel:hover,
          .document-card:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  )
}

export default ScenarioPlayer