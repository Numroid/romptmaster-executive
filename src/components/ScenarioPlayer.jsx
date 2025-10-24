import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { mockGetScenarioById } from '../services/scenarioService'
import LoadingSpinner from './LoadingSpinner'
import { useNotification } from './ui/Notification'

const ScenarioPlayer = () => {
  const [scenario, setScenario] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userPrompt, setUserPrompt] = useState('')
  const [showHints, setShowHints] = useState(false)
  const [currentHintIndex, setCurrentHintIndex] = useState(0)

  const { scenarioId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth0()
  const { showNotification, NotificationContainer } = useNotification()

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

  const handlePromptSubmit = () => {
    if (!userPrompt.trim()) {
      showNotification('Please enter a prompt before submitting', 'warning')
      return
    }

    // For now, show success notification - AI integration comes later
    showNotification('Prompt submitted! AI evaluation will be implemented soon.', 'success')
    console.log('User prompt:', userPrompt)
    console.log('Scenario context:', scenario.businessContext)
  }

  const handleShowNextHint = () => {
    if (currentHintIndex < scenario.hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1)
    }
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'var(--secondary)',
      intermediate: 'var(--accent)',
      advanced: 'var(--error)'
    }
    return colors[difficulty] || 'var(--gray-500)'
  }

  const getWordCount = () => {
    return userPrompt.split(' ').filter(word => word.length > 0).length
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error || !scenario) {
    return (
      <div className="error-page">
        <div className="container">
          <div className="error-content">
            <h2>Scenario Not Found</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/scenarios')}>
              Back to Scenarios
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <NotificationContainer />
      <div className="scenario-player">
        {/* Header */}
        <header className="header">
          <div className="container">
            <div className="header-content">
              <div className="header-left">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => navigate('/scenarios')}
                >
                  ← Back
                </button>
                <div className="scenario-info">
                  <h1>{scenario.title}</h1>
                  <div className="meta">
                    <span
                      className="difficulty-badge"
                      style={{ backgroundColor: getDifficultyColor(scenario.difficulty) }}
                    >
                      {scenario.difficulty}
                    </span>
                    <span className="time">{scenario.estimatedTime} min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Two Column Layout */}
        <main className="main-content">
          <div className="container-lg">
            <div className="content-grid">
              {/* Left: Context */}
              <aside className="context-panel">
                <div className="panel-section">
                  <h2>Business Context</h2>
                  <div className="context-text">
                    {scenario.businessContext.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {scenario.sampleDocuments && scenario.sampleDocuments.length > 0 && (
                  <div className="panel-section">
                    <h3>Reference Documents</h3>
                    {scenario.sampleDocuments.map((doc, index) => (
                      <div key={index} className="document">
                        <div className="document-header">
                          <span className="doc-type">{doc.type}</span>
                          <span className="doc-title">{doc.title}</span>
                        </div>
                        <pre className="document-content">{doc.content}</pre>
                      </div>
                    ))}
                  </div>
                )}

                {/* Hints Section */}
                {scenario.hints && scenario.hints.length > 0 && (
                  <div className="panel-section">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowHints(!showHints)}
                    >
                      {showHints ? 'Hide' : 'Show'} Hints ({scenario.hints.length})
                    </button>

                    {showHints && (
                      <div className="hints-box">
                        <div className="hint">
                          <p>{scenario.hints[currentHintIndex]}</p>
                        </div>
                        {currentHintIndex < scenario.hints.length - 1 && (
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={handleShowNextHint}
                          >
                            Next Hint ({currentHintIndex + 1}/{scenario.hints.length})
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </aside>

              {/* Right: Task & Prompt Builder */}
              <section className="task-panel">
                <div className="panel-section">
                  <h2>Your Task</h2>
                  <div className="objective">
                    <p>{scenario.objective}</p>
                  </div>
                </div>

                <div className="panel-section">
                  <h3>Write Your Prompt</h3>
                  <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="Write a clear, specific prompt that will help you accomplish this task..."
                    className="prompt-editor"
                    rows={12}
                  />

                  <div className="editor-meta">
                    <span className="word-count">{getWordCount()} words</span>
                    <span className="char-count">{userPrompt.length} characters</span>
                  </div>
                </div>

                {/* Success Criteria */}
                {scenario.successCriteria && scenario.successCriteria.length > 0 && (
                  <div className="panel-section">
                    <h3>Success Criteria</h3>
                    <ul className="criteria-list">
                      {scenario.successCriteria.map((criteria, index) => (
                        <li key={index}>{criteria}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Submit Button */}
                <div className="panel-section">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handlePromptSubmit}
                    disabled={!userPrompt.trim()}
                    style={{ width: '100%' }}
                  >
                    Submit Prompt
                  </button>
                </div>
              </section>
            </div>
          </div>
        </main>

        <style jsx>{`
          .scenario-player {
            min-height: 100vh;
            background: var(--bg-page);
          }

          /* Header */
          .header {
            background: var(--white);
            border-bottom: 1px solid var(--gray-200);
            padding: var(--space-4) 0;
            position: sticky;
            top: 0;
            z-index: 10;
          }

          .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .header-left {
            display: flex;
            align-items: center;
            gap: var(--space-4);
            flex: 1;
          }

          .scenario-info h1 {
            font-size: var(--text-xl);
            margin: 0 0 var(--space-2) 0;
            color: var(--text-primary);
          }

          .meta {
            display: flex;
            gap: var(--space-3);
            align-items: center;
          }

          .difficulty-badge {
            padding: var(--space-1) var(--space-3);
            border-radius: var(--radius-full);
            font-size: var(--text-xs);
            font-weight: var(--font-semibold);
            color: var(--white);
            text-transform: capitalize;
          }

          .time {
            font-size: var(--text-sm);
            color: var(--text-tertiary);
          }

          /* Main Content */
          .main-content {
            padding: var(--space-8) 0;
          }

          .content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-8);
          }

          /* Panels */
          .context-panel,
          .task-panel {
            background: var(--white);
            border-radius: var(--radius-lg);
            padding: var(--space-6);
            box-shadow: var(--shadow);
            border: 1px solid var(--gray-200);
          }

          .panel-section {
            margin-bottom: var(--space-8);
          }

          .panel-section:last-child {
            margin-bottom: 0;
          }

          .panel-section h2 {
            font-size: var(--text-2xl);
            margin-bottom: var(--space-4);
            color: var(--text-primary);
          }

          .panel-section h3 {
            font-size: var(--text-lg);
            margin-bottom: var(--space-3);
            color: var(--text-primary);
          }

          .context-text p {
            margin-bottom: var(--space-4);
            line-height: 1.6;
            color: var(--text-secondary);
          }

          .context-text p:last-child {
            margin-bottom: 0;
          }

          /* Documents */
          .document {
            margin-bottom: var(--space-4);
            border: 1px solid var(--gray-200);
            border-radius: var(--radius);
            overflow: hidden;
          }

          .document:last-child {
            margin-bottom: 0;
          }

          .document-header {
            background: var(--gray-50);
            padding: var(--space-3) var(--space-4);
            border-bottom: 1px solid var(--gray-200);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .doc-type {
            font-size: var(--text-xs);
            font-weight: var(--font-semibold);
            color: var(--primary);
            text-transform: uppercase;
          }

          .doc-title {
            font-size: var(--text-sm);
            color: var(--text-secondary);
          }

          .document-content {
            padding: var(--space-4);
            font-family: monospace;
            font-size: var(--text-sm);
            line-height: 1.5;
            color: var(--text-primary);
            background: var(--gray-50);
            margin: 0;
            white-space: pre-wrap;
          }

          /* Hints */
          .hints-box {
            margin-top: var(--space-4);
            padding: var(--space-4);
            background: var(--gray-50);
            border-radius: var(--radius);
            border: 1px solid var(--gray-200);
          }

          .hint {
            margin-bottom: var(--space-3);
          }

          .hint p {
            margin: 0;
            color: var(--text-secondary);
            line-height: 1.6;
          }

          /* Objective */
          .objective {
            padding: var(--space-4);
            background: var(--primary-light);
            border-radius: var(--radius);
            border: 1px solid var(--primary);
            border-left: 4px solid var(--primary);
          }

          .objective p {
            margin: 0;
            color: var(--text-primary);
            line-height: 1.6;
            font-weight: var(--font-medium);
          }

          /* Prompt Editor */
          .prompt-editor {
            width: 100%;
            padding: var(--space-4);
            border: 2px solid var(--gray-300);
            border-radius: var(--radius);
            font-family: var(--font-body);
            font-size: var(--text-base);
            line-height: 1.6;
            color: var(--text-primary);
            resize: vertical;
            min-height: 200px;
            transition: var(--transition);
          }

          .prompt-editor:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px var(--primary-light);
          }

          .prompt-editor::placeholder {
            color: var(--text-tertiary);
          }

          .editor-meta {
            display: flex;
            justify-content: space-between;
            margin-top: var(--space-2);
            font-size: var(--text-sm);
            color: var(--text-tertiary);
          }

          /* Criteria List */
          .criteria-list {
            margin: 0;
            padding-left: var(--space-6);
          }

          .criteria-list li {
            margin-bottom: var(--space-2);
            line-height: 1.6;
            color: var(--text-secondary);
          }

          .criteria-list li:last-child {
            margin-bottom: 0;
          }

          /* Error Page */
          .error-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-page);
          }

          .error-content {
            text-align: center;
            padding: var(--space-10);
            background: var(--white);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            max-width: 500px;
          }

          .error-content h2 {
            margin-bottom: var(--space-4);
          }

          .error-content p {
            margin-bottom: var(--space-6);
            color: var(--text-secondary);
          }

          /* Responsive */
          @media (max-width: 1024px) {
            .content-grid {
              grid-template-columns: 1fr;
            }

            .context-panel {
              order: 2;
            }

            .task-panel {
              order: 1;
            }
          }

          @media (max-width: 768px) {
            .header-left {
              flex-direction: column;
              align-items: flex-start;
              gap: var(--space-3);
            }

            .scenario-info h1 {
              font-size: var(--text-lg);
            }

            .context-panel,
            .task-panel {
              padding: var(--space-4);
            }

            .panel-section {
              margin-bottom: var(--space-6);
            }
          }
        `}</style>
      </div>
    </>
  )
}

export default ScenarioPlayer
