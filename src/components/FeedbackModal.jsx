import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const FeedbackModal = ({ isOpen, onClose, feedback, scenarioId, onTryAgain, onNextScenario }) => {
  const [showContent, setShowContent] = useState(false)
  const [animatedScore, setAnimatedScore] = useState(0)
  const navigate = useNavigate()

  // Animate score on mount
  useEffect(() => {
    if (isOpen && feedback) {
      setShowContent(false)
      setAnimatedScore(0)

      // Delay content reveal for dramatic effect
      setTimeout(() => setShowContent(true), 400)

      // Animate score from 0 to final value
      const duration = 1500
      const steps = 60
      const increment = feedback.overallScore / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= feedback.overallScore) {
          setAnimatedScore(feedback.overallScore)
          clearInterval(timer)
        } else {
          setAnimatedScore(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [isOpen, feedback])

  const handleNextScenario = () => {
    if (onNextScenario) {
      onNextScenario()
    } else {
      onClose()
      navigate('/scenarios')
    }
  }

  const handleTryAgain = () => {
    if (onTryAgain) {
      onTryAgain()
    } else {
      onClose()
    }
  }

  if (!isOpen || !feedback) return null

  // Determine score color and message
  const getScoreColor = (score) => {
    if (score >= 90) return 'teal'
    if (score >= 75) return 'navy'
    if (score >= 60) return 'orange'
    return 'gray'
  }

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Excellent Work!'
    if (score >= 75) return 'Great Job!'
    if (score >= 60) return 'Good Effort!'
    return 'Keep Practicing!'
  }

  const scoreColor = getScoreColor(feedback.overallScore)

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="modal-scroll">
          {/* Score Display */}
          <div className="score-section">
            <div className={`score-circle score-${scoreColor}`}>
              <svg className="score-ring" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" className="score-ring-bg" />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  className="score-ring-fill"
                  strokeDasharray={`${(animatedScore / 100) * 565} 565`}
                />
              </svg>
              <div className="score-content">
                <div className="score-value">{animatedScore}</div>
                <div className="score-label">Score</div>
              </div>
            </div>
            <h2 className="score-message">{getScoreMessage(feedback.overallScore)}</h2>
            <p className="score-description">
              Your prompt demonstrates {feedback.overallScore >= 75 ? 'strong' : 'developing'} understanding
              of effective AI communication
            </p>
          </div>

          {/* Criteria Breakdown */}
          {showContent && feedback.criteriaScores && (
            <div className="feedback-section">
              <div className="section-header">
                <h3 className="section-title">Performance Breakdown</h3>
              </div>
              <div className="criteria-grid">
                {feedback.criteriaScores.map((criteria, index) => (
                  <div key={index} className="criteria-item">
                    <div className="criteria-header">
                      <span className="criteria-name">{criteria.name}</span>
                      <span className="criteria-score">{criteria.score}/100</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`progress-bar-fill progress-${getScoreColor(criteria.score)}`}
                        style={{ width: `${criteria.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strengths */}
          {showContent && feedback.strengths && feedback.strengths.length > 0 && (
            <div className="feedback-section">
              <div className="section-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="section-icon section-icon-success">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="section-title">What You Did Well</h3>
              </div>
              <ul className="feedback-list strengths-list">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="feedback-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="item-icon icon-success">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas for Improvement */}
          {showContent && feedback.improvements && feedback.improvements.length > 0 && (
            <div className="feedback-section">
              <div className="section-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="section-icon section-icon-warning">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="section-title">How to Improve</h3>
              </div>
              <ul className="feedback-list improvements-list">
                {feedback.improvements.map((improvement, index) => (
                  <li key={index} className="feedback-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="item-icon icon-warning">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Side-by-Side Comparison */}
          {showContent && feedback.improvedPrompt && (
            <div className="feedback-section">
              <div className="section-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="section-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <h3 className="section-title">Compare: Your Prompt vs. Improved Version</h3>
              </div>
              <div className="comparison-grid">
                <div className="comparison-panel">
                  <div className="comparison-label">Your Prompt</div>
                  <div className="comparison-content comparison-original">
                    {feedback.originalPrompt}
                  </div>
                </div>
                <div className="comparison-panel">
                  <div className="comparison-label comparison-label-improved">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="label-icon">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Improved Version
                  </div>
                  <div className="comparison-content comparison-improved">
                    {feedback.improvedPrompt}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Key Takeaway */}
          {showContent && feedback.keyTakeaway && (
            <div className="feedback-section">
              <div className="takeaway-box">
                <div className="takeaway-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="takeaway-content">
                  <div className="takeaway-label">Key Takeaway</div>
                  <p className="takeaway-text">{feedback.keyTakeaway}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="modal-actions">
            <button className="btn btn-secondary btn-lg" onClick={handleTryAgain}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="btn-icon">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
            <button className="btn btn-primary btn-lg" onClick={handleNextScenario}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="btn-icon">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Next Scenario
            </button>
          </div>
        </div>

        <style jsx>{`
          .feedback-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: var(--z-modal);
            animation: fadeIn 0.3s ease-out;
            padding: var(--space-4);
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .feedback-modal {
            background: var(--gray-900);
            border-radius: var(--border-radius-xl);
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow-2xl);
            max-width: 900px;
            width: 100%;
            max-height: 90vh;
            position: relative;
            animation: slideUp 0.4s ease-out;
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .modal-close {
            position: absolute;
            top: var(--space-4);
            right: var(--space-4);
            width: 40px;
            height: 40px;
            border-radius: var(--border-radius-full);
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            cursor: pointer;
            transition: all var(--transition-base);
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .modal-close:hover {
            background: var(--gray-700);
            color: var(--text-primary);
            transform: rotate(90deg);
          }

          .modal-close svg {
            width: 20px;
            height: 20px;
          }

          .modal-scroll {
            overflow-y: auto;
            max-height: 90vh;
            padding: var(--space-10) var(--space-8) var(--space-8);
          }

          .modal-scroll::-webkit-scrollbar {
            width: 8px;
          }

          .modal-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .modal-scroll::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: var(--border-radius-full);
          }

          /* Score Section */
          .score-section {
            text-align: center;
            margin-bottom: var(--space-10);
          }

          .score-circle {
            position: relative;
            width: 200px;
            height: 200px;
            margin: 0 auto var(--space-6);
          }

          .score-ring {
            width: 100%;
            height: 100%;
            transform: rotate(-90deg);
          }

          .score-ring-bg {
            fill: none;
            stroke: var(--border-color);
            stroke-width: 12;
          }

          .score-ring-fill {
            fill: none;
            stroke-width: 12;
            stroke-linecap: round;
            transition: stroke-dasharray 1.5s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .score-teal .score-ring-fill {
            stroke: url(#scoreGradientTeal);
          }

          .score-navy .score-ring-fill {
            stroke: url(#scoreGradientNavy);
          }

          .score-orange .score-ring-fill {
            stroke: url(#scoreGradientOrange);
          }

          .score-gray .score-ring-fill {
            stroke: var(--gray-600);
          }

          .score-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          .score-value {
            font-size: 64px;
            font-weight: var(--font-bold);
            color: var(--text-primary);
            line-height: 1;
            font-variant-numeric: tabular-nums;
          }

          .score-label {
            font-size: var(--text-sm);
            font-weight: var(--font-medium);
            color: var(--text-tertiary);
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-top: var(--space-2);
          }

          .score-message {
            font-size: var(--text-4xl);
            font-weight: var(--font-bold);
            color: var(--text-primary);
            margin: 0 0 var(--space-3) 0;
          }

          .score-description {
            font-size: var(--text-lg);
            color: var(--text-secondary);
            margin: 0;
          }

          /* Feedback Sections */
          .feedback-section {
            margin-bottom: var(--space-8);
          }

          .section-header {
            display: flex;
            align-items: center;
            gap: var(--space-3);
            margin-bottom: var(--space-5);
          }

          .section-icon {
            width: 28px;
            height: 28px;
            flex-shrink: 0;
          }

          .section-icon-success {
            color: var(--teal-500);
          }

          .section-icon-warning {
            color: var(--orange-500);
          }

          .section-title {
            font-size: var(--text-2xl);
            font-weight: var(--font-bold);
            color: var(--text-primary);
            margin: 0;
          }

          /* Criteria Grid */
          .criteria-grid {
            display: grid;
            gap: var(--space-4);
          }

          .criteria-item {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-lg);
            padding: var(--space-4);
          }

          .criteria-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space-3);
          }

          .criteria-name {
            font-size: var(--text-base);
            font-weight: var(--font-semibold);
            color: var(--text-primary);
          }

          .criteria-score {
            font-size: var(--text-sm);
            font-weight: var(--font-bold);
            color: var(--text-tertiary);
            font-variant-numeric: tabular-nums;
          }

          .progress-bar {
            height: 8px;
            background: var(--border-color);
            border-radius: var(--border-radius-full);
            overflow: hidden;
          }

          .progress-bar-fill {
            height: 100%;
            border-radius: var(--border-radius-full);
            transition: width 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
          }

          .progress-teal {
            background: linear-gradient(90deg, var(--teal-600), var(--teal-500));
          }

          .progress-navy {
            background: linear-gradient(90deg, var(--navy-600), var(--navy-500));
          }

          .progress-orange {
            background: linear-gradient(90deg, var(--orange-600), var(--orange-500));
          }

          .progress-gray {
            background: var(--gray-600);
          }

          /* Feedback Lists */
          .feedback-list {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: var(--space-3);
          }

          .feedback-item {
            display: flex;
            gap: var(--space-3);
            align-items: flex-start;
            padding: var(--space-4);
            background: var(--bg-secondary);
            border-radius: var(--border-radius-lg);
            border: 1px solid var(--border-color);
            line-height: var(--leading-relaxed);
            color: var(--text-secondary);
            font-size: var(--text-base);
          }

          .item-icon {
            flex-shrink: 0;
            width: 20px;
            height: 20px;
            margin-top: 2px;
          }

          .icon-success {
            color: var(--teal-500);
          }

          .icon-warning {
            color: var(--orange-500);
          }

          /* Comparison */
          .comparison-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-4);
          }

          .comparison-panel {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-lg);
            overflow: hidden;
          }

          .comparison-label {
            padding: var(--space-3) var(--space-4);
            background: var(--gray-800);
            border-bottom: 1px solid var(--border-color);
            font-size: var(--text-sm);
            font-weight: var(--font-semibold);
            color: var(--text-tertiary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .comparison-label-improved {
            display: flex;
            align-items: center;
            gap: var(--space-2);
            color: var(--teal-500);
          }

          .label-icon {
            width: 16px;
            height: 16px;
          }

          .comparison-content {
            padding: var(--space-5);
            font-size: var(--text-base);
            line-height: var(--leading-relaxed);
            color: var(--text-secondary);
            max-height: 300px;
            overflow-y: auto;
          }

          .comparison-content::-webkit-scrollbar {
            width: 6px;
          }

          .comparison-content::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: var(--border-radius-full);
          }

          .comparison-improved {
            color: var(--text-primary);
            background: linear-gradient(135deg, rgba(20, 184, 166, 0.05), rgba(20, 184, 166, 0.02));
          }

          /* Takeaway Box */
          .takeaway-box {
            display: flex;
            gap: var(--space-5);
            padding: var(--space-6);
            background: linear-gradient(135deg, rgba(233, 81, 10, 0.1), rgba(233, 81, 10, 0.05));
            border: 2px solid var(--orange-600);
            border-radius: var(--border-radius-lg);
            border-left: 4px solid var(--orange-500);
          }

          .takeaway-icon {
            flex-shrink: 0;
            width: 32px;
            height: 32px;
            color: var(--orange-500);
          }

          .takeaway-icon svg {
            width: 100%;
            height: 100%;
          }

          .takeaway-label {
            font-size: var(--text-sm);
            font-weight: var(--font-bold);
            color: var(--orange-400);
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: var(--space-2);
          }

          .takeaway-text {
            margin: 0;
            font-size: var(--text-lg);
            line-height: var(--leading-relaxed);
            color: var(--text-primary);
            font-weight: var(--font-medium);
          }

          /* Modal Actions */
          .modal-actions {
            display: flex;
            gap: var(--space-4);
            padding-top: var(--space-6);
            border-top: 1px solid var(--border-color);
          }

          .modal-actions .btn {
            flex: 1;
          }

          .btn-icon {
            width: 18px;
            height: 18px;
            margin-right: var(--space-2);
          }

          /* Responsive */
          @media (max-width: 768px) {
            .modal-scroll {
              padding: var(--space-8) var(--space-5) var(--space-6);
            }

            .score-circle {
              width: 160px;
              height: 160px;
            }

            .score-value {
              font-size: 48px;
            }

            .score-message {
              font-size: var(--text-3xl);
            }

            .section-title {
              font-size: var(--text-xl);
            }

            .comparison-grid {
              grid-template-columns: 1fr;
            }

            .modal-actions {
              flex-direction: column;
            }

            .modal-actions .btn {
              width: 100%;
            }
          }

          @media (max-width: 480px) {
            .feedback-modal-overlay {
              padding: 0;
            }

            .feedback-modal {
              max-height: 100vh;
              border-radius: 0;
            }

            .modal-scroll {
              max-height: 100vh;
            }
          }
        `}</style>

        {/* SVG Gradient Definitions */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="scoreGradientTeal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--teal-600)" />
              <stop offset="100%" stopColor="var(--teal-400)" />
            </linearGradient>
            <linearGradient id="scoreGradientNavy" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--navy-600)" />
              <stop offset="100%" stopColor="var(--navy-400)" />
            </linearGradient>
            <linearGradient id="scoreGradientOrange" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--orange-600)" />
              <stop offset="100%" stopColor="var(--orange-400)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}

// Mock feedback data for development
export const mockFeedbackData = {
  overallScore: 85,
  originalPrompt: "Write a summary of the Q3 budget report.",
  improvedPrompt: "Please analyze the Q3 budget report and create a comprehensive executive summary that includes: 1) Key financial highlights and variances from projections, 2) Department-by-department spending breakdown, 3) Identified cost-saving opportunities, 4) Recommendations for Q4 budget adjustments. Format the summary as a professional document with clear sections and bullet points for easy scanning.",
  criteriaScores: [
    { name: 'Clarity & Specificity', score: 90 },
    { name: 'Context Provided', score: 75 },
    { name: 'Output Format Defined', score: 85 },
    { name: 'Actionable Instructions', score: 88 },
    { name: 'Professional Tone', score: 92 }
  ],
  strengths: [
    'Clearly specified the task and desired output format',
    'Provided specific requirements for what should be included in the summary',
    'Used professional language appropriate for business communication'
  ],
  improvements: [
    'Include more context about the audience for this summary (board members, executives, etc.)',
    'Specify the desired length or level of detail',
    'Mention any specific metrics or KPIs that should be highlighted'
  ],
  keyTakeaway: 'Great prompts balance specificity with context. You did well defining what you want, but remember to also explain why and for whom—this helps AI tailor the response to your exact needs.'
}

export default FeedbackModal
