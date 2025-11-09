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
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showContext, setShowContext] = useState(true)

  const { scenarioId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth0()
  const { showNotification, NotificationContainer } = useNotification()

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

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

  const getWordCount = () => {
    return userPrompt.split(' ').filter(word => word.length > 0).length
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error || !scenario) {
    return (
      <div className="error-page">
        <div className="container">
          <div className="error-content card">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="error-icon">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="error-title">Scenario Not Found</h2>
            <p className="error-description">{error}</p>
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
        {/* Minimal Sticky Header */}
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => navigate('/scenarios')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="btn-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Exit
              </button>
              <div className="scenario-title">{scenario.title}</div>
            </div>
            <div className="header-right">
              <div className="timer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="timer-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTime(elapsedTime)}
              </div>
              <span className={`badge ${
                scenario.difficulty === 'beginner' ? 'badge-primary' :
                scenario.difficulty === 'intermediate' ? 'badge-info' :
                'badge-warning'
              }`}>
                {scenario.difficulty}
              </span>
              <button
                className="btn btn-ghost btn-sm mobile-toggle"
                onClick={() => setShowContext(!showContext)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="btn-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Full-Screen Two-Panel Layout */}
        <main className="main-content">
          <div className={`content-grid ${!showContext ? 'context-hidden' : ''}`}>
            {/* Left Panel: Business Context (Navy Background) */}
            <aside className={`context-panel ${showContext ? 'visible' : ''}`}>
              <div className="panel-scroll">
                <div className="panel-section">
                  <div className="section-header">
                    <h2 className="section-title">Business Context</h2>
                  </div>
                  <div className="context-text">
                    {scenario.businessContext.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {scenario.sampleDocuments && scenario.sampleDocuments.length > 0 && (
                  <div className="panel-section">
                    <div className="section-header">
                      <h3 className="section-subtitle">Reference Documents</h3>
                    </div>
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
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="btn-icon">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      {showHints ? 'Hide' : 'Show'} Hints
                    </button>

                    {showHints && (
                      <div className="hints-box">
                        <div className="hint">
                          <div className="hint-number">Hint {currentHintIndex + 1} of {scenario.hints.length}</div>
                          <p className="hint-text">{scenario.hints[currentHintIndex]}</p>
                        </div>
                        {currentHintIndex < scenario.hints.length - 1 && (
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={handleShowNextHint}
                          >
                            Next Hint
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </aside>

            {/* Right Panel: Task & Prompt Editor (Dark Background) */}
            <section className="task-panel">
              <div className="panel-scroll">
                {/* Task Objective */}
                <div className="panel-section">
                  <div className="section-header">
                    <h2 className="section-title">Your Task</h2>
                  </div>
                  <div className="objective-box">
                    <div className="objective-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="objective-text">{scenario.objective}</p>
                  </div>
                </div>

                {/* Success Criteria */}
                {scenario.successCriteria && scenario.successCriteria.length > 0 && (
                  <div className="panel-section">
                    <div className="section-header">
                      <h3 className="section-subtitle">Success Criteria</h3>
                    </div>
                    <ul className="criteria-list">
                      {scenario.successCriteria.map((criteria, index) => (
                        <li key={index}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="criteria-icon">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {criteria}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prompt Editor */}
                <div className="panel-section editor-section">
                  <div className="section-header">
                    <h3 className="section-subtitle">Write Your Prompt</h3>
                    <div className="editor-stats">
                      <span className="stat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="stat-icon">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {getWordCount()} words
                      </span>
                      <span className="stat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="stat-icon">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        {userPrompt.length} chars
                      </span>
                    </div>
                  </div>
                  <div className="editor-wrapper">
                    <textarea
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      placeholder="Write a clear, specific prompt that will help you accomplish this task...

Think about:
• What information does the AI need?
• What format should the response be in?
• What context is important?
• What are the constraints or requirements?"
                      className="prompt-editor"
                      rows={16}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="panel-section submit-section">
                  <button
                    className="btn btn-primary btn-lg btn-block"
                    onClick={handlePromptSubmit}
                    disabled={!userPrompt.trim()}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="btn-icon">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Submit Prompt for Evaluation
                  </button>
                  <p className="submit-note">
                    Your prompt will be evaluated by Claude AI and you'll receive detailed feedback
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>

        <style jsx>{`
          .scenario-player {
            height: 100vh;
            display: flex;
            flex-direction: column;
            background: var(--gray-900);
          }

          /* Minimal Header */
          .header {
            flex-shrink: 0;
            background: rgba(26, 26, 26, 0.95);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--border-color);
            padding: var(--space-3) var(--space-6);
            z-index: var(--z-sticky);
          }

          .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: var(--space-4);
          }

          .header-left {
            display: flex;
            align-items: center;
            gap: var(--space-4);
            flex: 1;
            min-width: 0;
          }

          .header-right {
            display: flex;
            align-items: center;
            gap: var(--space-3);
          }

          .scenario-title {
            font-size: var(--text-base);
            font-weight: var(--font-medium);
            color: var(--text-primary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .timer {
            display: flex;
            align-items: center;
            gap: var(--space-2);
            font-size: var(--text-sm);
            font-weight: var(--font-medium);
            color: var(--text-secondary);
            font-variant-numeric: tabular-nums;
          }

          .timer-icon {
            width: 16px;
            height: 16px;
            color: var(--teal-500);
          }

          .btn-icon {
            width: 16px;
            height: 16px;
            margin-right: var(--space-2);
          }

          .mobile-toggle {
            display: none;
          }

          /* Main Content */
          .main-content {
            flex: 1;
            overflow: hidden;
          }

          .content-grid {
            display: grid;
            grid-template-columns: 45% 55%;
            height: 100%;
          }

          .content-grid.context-hidden {
            grid-template-columns: 0% 100%;
          }

          /* Context Panel (Navy) */
          .context-panel {
            background: var(--bg-navy);
            border-right: 1px solid var(--navy-600);
            overflow: hidden;
            transition: all var(--transition-base);
          }

          .context-panel.visible {
            display: block;
          }

          /* Task Panel (Dark) */
          .task-panel {
            background: var(--gray-900);
            overflow: hidden;
          }

          /* Scrollable Content */
          .panel-scroll {
            height: 100%;
            overflow-y: auto;
            padding: var(--space-8) var(--space-6);
          }

          .panel-scroll::-webkit-scrollbar {
            width: 8px;
          }

          .panel-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .panel-scroll::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: var(--border-radius-full);
          }

          .panel-scroll::-webkit-scrollbar-thumb:hover {
            background: var(--gray-600);
          }

          /* Panel Sections */
          .panel-section {
            margin-bottom: var(--space-8);
          }

          .panel-section:last-child {
            margin-bottom: 0;
          }

          .section-header {
            margin-bottom: var(--space-4);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .section-title {
            font-size: var(--text-2xl);
            font-weight: var(--font-bold);
            color: var(--text-primary);
            margin: 0;
          }

          .section-subtitle {
            font-size: var(--text-lg);
            font-weight: var(--font-semibold);
            color: var(--text-primary);
            margin: 0;
          }

          /* Context Text */
          .context-text p {
            margin-bottom: var(--space-4);
            line-height: var(--leading-relaxed);
            color: var(--text-secondary);
            font-size: var(--text-base);
          }

          .context-text p:last-child {
            margin-bottom: 0;
          }

          /* Documents */
          .document {
            margin-bottom: var(--space-4);
            border: 1px solid var(--navy-600);
            border-radius: var(--border-radius-lg);
            overflow: hidden;
            background: var(--navy-800);
          }

          .document:last-child {
            margin-bottom: 0;
          }

          .document-header {
            background: var(--navy-700);
            padding: var(--space-3) var(--space-4);
            border-bottom: 1px solid var(--navy-600);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .doc-type {
            font-size: var(--text-xs);
            font-weight: var(--font-semibold);
            color: var(--orange-400);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .doc-title {
            font-size: var(--text-sm);
            color: var(--text-secondary);
          }

          .document-content {
            padding: var(--space-4);
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: var(--text-sm);
            line-height: var(--leading-relaxed);
            color: var(--text-primary);
            background: var(--navy-900);
            margin: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
          }

          /* Hints */
          .hints-box {
            margin-top: var(--space-4);
            padding: var(--space-5);
            background: var(--navy-800);
            border-radius: var(--border-radius-lg);
            border: 1px solid var(--navy-600);
          }

          .hint {
            margin-bottom: var(--space-4);
          }

          .hint-number {
            font-size: var(--text-xs);
            font-weight: var(--font-semibold);
            color: var(--orange-400);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: var(--space-2);
          }

          .hint-text {
            margin: 0;
            color: var(--text-secondary);
            line-height: var(--leading-relaxed);
            font-size: var(--text-base);
          }

          /* Objective Box */
          .objective-box {
            display: flex;
            gap: var(--space-4);
            padding: var(--space-5);
            background: linear-gradient(135deg, rgba(233, 81, 10, 0.1), rgba(233, 81, 10, 0.05));
            border: 2px solid var(--orange-600);
            border-radius: var(--border-radius-lg);
            border-left: 4px solid var(--orange-500);
          }

          .objective-icon {
            flex-shrink: 0;
            width: 28px;
            height: 28px;
            color: var(--orange-500);
          }

          .objective-icon svg {
            width: 100%;
            height: 100%;
          }

          .objective-text {
            margin: 0;
            color: var(--text-primary);
            line-height: var(--leading-relaxed);
            font-weight: var(--font-medium);
            font-size: var(--text-base);
          }

          /* Criteria List */
          .criteria-list {
            margin: 0;
            padding: 0;
            list-style: none;
          }

          .criteria-list li {
            display: flex;
            gap: var(--space-3);
            margin-bottom: var(--space-3);
            line-height: var(--leading-relaxed);
            color: var(--text-secondary);
            font-size: var(--text-base);
          }

          .criteria-list li:last-child {
            margin-bottom: 0;
          }

          .criteria-icon {
            flex-shrink: 0;
            width: 20px;
            height: 20px;
            color: var(--teal-500);
            margin-top: 2px;
          }

          /* Prompt Editor */
          .editor-section {
            flex: 1;
          }

          .editor-stats {
            display: flex;
            gap: var(--space-4);
          }

          .stat {
            display: flex;
            align-items: center;
            gap: var(--space-2);
            font-size: var(--text-sm);
            color: var(--text-tertiary);
            font-weight: var(--font-medium);
          }

          .stat-icon {
            width: 14px;
            height: 14px;
          }

          .editor-wrapper {
            position: relative;
          }

          .prompt-editor {
            width: 100%;
            padding: var(--space-5);
            background: var(--bg-secondary);
            border: 2px solid var(--border-color);
            border-radius: var(--border-radius-lg);
            font-family: var(--font-body);
            font-size: var(--text-base);
            line-height: var(--leading-relaxed);
            color: var(--text-primary);
            resize: vertical;
            min-height: 300px;
            transition: all var(--transition-base);
          }

          .prompt-editor:focus {
            outline: none;
            border-color: var(--orange-500);
            box-shadow: 0 0 0 3px rgba(233, 81, 10, 0.1), var(--glow-orange-sm);
            background: var(--gray-800);
          }

          .prompt-editor::placeholder {
            color: var(--text-tertiary);
            line-height: var(--leading-relaxed);
          }

          /* Submit Section */
          .submit-section {
            margin-top: auto;
            padding-top: var(--space-6);
            border-top: 1px solid var(--border-color);
          }

          .submit-note {
            text-align: center;
            font-size: var(--text-sm);
            color: var(--text-tertiary);
            margin-top: var(--space-3);
            margin-bottom: 0;
          }

          /* Error Page */
          .error-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(180deg,
              var(--gray-900) 0%,
              var(--navy-900) 100%
            );
            padding: var(--space-6);
          }

          .error-content {
            text-align: center;
            padding: var(--space-12);
            max-width: 500px;
          }

          .error-icon {
            width: 64px;
            height: 64px;
            margin: 0 auto var(--space-6);
            color: var(--orange-500);
          }

          .error-title {
            font-size: var(--text-2xl);
            font-weight: var(--font-bold);
            color: var(--text-primary);
            margin: 0 0 var(--space-3) 0;
          }

          .error-description {
            font-size: var(--text-base);
            color: var(--text-secondary);
            margin: 0 0 var(--space-6) 0;
          }

          /* Responsive Design */
          @media (max-width: 1024px) {
            .content-grid {
              grid-template-columns: 1fr;
              position: relative;
            }

            .context-panel {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              z-index: 10;
              border-right: none;
              display: none;
            }

            .context-panel.visible {
              display: block;
            }

            .mobile-toggle {
              display: flex;
            }

            .scenario-title {
              display: none;
            }
          }

          @media (max-width: 768px) {
            .header {
              padding: var(--space-3) var(--space-4);
            }

            .panel-scroll {
              padding: var(--space-6) var(--space-4);
            }

            .section-title {
              font-size: var(--text-xl);
            }

            .section-subtitle {
              font-size: var(--text-base);
            }

            .timer {
              font-size: var(--text-xs);
            }

            .editor-stats {
              flex-direction: column;
              gap: var(--space-2);
            }
          }

          @media (max-width: 480px) {
            .header-right .badge {
              display: none;
            }
          }
        `}</style>
      </div>
    </>
  )
}

export default ScenarioPlayer
