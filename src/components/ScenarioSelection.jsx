import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { mockGetAllScenarios } from '../services/scenarioService'
import LoadingSpinner from './LoadingSpinner'

const ScenarioSelection = () => {
  const [scenarios, setScenarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedModule, setSelectedModule] = useState(1)
  const navigate = useNavigate()
  const { user } = useAuth0()

  // Mock user progress data (will be replaced with API call)
  const userProgress = {
    completedScenarios: [1, 2, 3],
    inProgressScenarios: [4],
    unlockedModules: [1, 2]
  }

  // Mock module data
  const modules = [
    { id: 1, name: 'Foundation', difficulty: 'Beginner', color: 'orange', scenarioCount: 12 },
    { id: 2, name: 'Intermediate', difficulty: 'Intermediate', color: 'navy', scenarioCount: 15 },
    { id: 3, name: 'Advanced', difficulty: 'Advanced', color: 'teal', scenarioCount: 13 },
    { id: 4, name: 'Expert', difficulty: 'Expert', color: 'purple', scenarioCount: 10 }
  ]

  useEffect(() => {
    loadScenarios()
  }, [])

  const loadScenarios = async () => {
    try {
      setLoading(true)
      const data = await mockGetAllScenarios()
      setScenarios(data)
    } catch (error) {
      console.error('Error loading scenarios:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category) => {
    const icons = {
      budget: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      risk: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      strategy: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      presentation: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
      analysis: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
    return icons[category] || icons.analysis
  }

  const getCategoryLabel = (category) => {
    const labels = {
      budget: 'Budget Analysis',
      risk: 'Risk Assessment',
      strategy: 'Strategic Planning',
      presentation: 'Presentation',
      analysis: 'Financial Analysis'
    }
    return labels[category] || category
  }

  const getScenarioStatus = (scenarioId) => {
    if (userProgress.completedScenarios.includes(scenarioId)) return 'completed'
    if (userProgress.inProgressScenarios.includes(scenarioId)) return 'in-progress'
    return 'not-started'
  }

  const isScenarioLocked = (scenario) => {
    // Lock scenarios from modules that aren't unlocked yet
    return scenario.moduleId > 1 && !userProgress.unlockedModules.includes(scenario.moduleId)
  }

  const filteredScenarios = filter === 'all'
    ? scenarios.filter(s => s.moduleId === selectedModule)
    : scenarios.filter(s => s.moduleId === selectedModule && s.difficulty === filter)

  const currentModule = modules.find(m => m.id === selectedModule)
  const moduleProgress = scenarios.filter(s => s.moduleId === selectedModule && userProgress.completedScenarios.includes(s.id)).length
  const moduleTotalScenarios = scenarios.filter(s => s.moduleId === selectedModule).length
  const moduleProgressPercent = moduleTotalScenarios > 0 ? Math.round((moduleProgress / moduleTotalScenarios) * 100) : 0

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="scenario-selection">
      {/* Sticky Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h2 className="logo">PromptMaster</h2>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate('/dashboard')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="btn-icon">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {/* Module Selector */}
          <div className="module-selector">
            {modules.map((module) => {
              const isLocked = !userProgress.unlockedModules.includes(module.id)
              const isActive = module.id === selectedModule

              return (
                <button
                  key={module.id}
                  className={`module-tab ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                  onClick={() => !isLocked && setSelectedModule(module.id)}
                  disabled={isLocked}
                >
                  {isLocked && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="lock-icon-sm">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                  <div className="module-tab-content">
                    <div className="module-tab-name">{module.name}</div>
                    <div className="module-tab-meta">{module.scenarioCount} scenarios</div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Module Header */}
          {currentModule && (
            <div className="module-header card-navy">
              <div className="module-header-content">
                <div className="module-header-text">
                  <div className="module-header-top">
                    <h1 className="module-header-title">
                      Module {currentModule.id}: {currentModule.name}
                    </h1>
                    <span className={`badge ${
                      currentModule.color === 'orange' ? 'badge-primary' :
                      currentModule.color === 'navy' ? 'badge-info' :
                      currentModule.color === 'teal' ? 'badge-success' :
                      'badge-warning'
                    }`}>
                      {currentModule.difficulty}
                    </span>
                  </div>
                  <p className="module-header-subtitle">
                    {moduleProgress} of {moduleTotalScenarios} scenarios completed
                  </p>
                </div>
                <div className="module-header-progress">
                  <div className="circular-progress">
                    <svg viewBox="0 0 100 100" className="circular-progress-svg">
                      <circle cx="50" cy="50" r="45" className="circular-progress-bg" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        className="circular-progress-fill"
                        strokeDasharray={`${moduleProgressPercent * 2.827} 282.7`}
                      />
                    </svg>
                    <div className="circular-progress-text">{moduleProgressPercent}%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Scenarios
            </button>
            <button
              className={`filter-tab ${filter === 'beginner' ? 'active' : ''}`}
              onClick={() => setFilter('beginner')}
            >
              Beginner
            </button>
            <button
              className={`filter-tab ${filter === 'intermediate' ? 'active' : ''}`}
              onClick={() => setFilter('intermediate')}
            >
              Intermediate
            </button>
            <button
              className={`filter-tab ${filter === 'advanced' ? 'active' : ''}`}
              onClick={() => setFilter('advanced')}
            >
              Advanced
            </button>
          </div>

          {/* Scenario Grid */}
          <div className="scenario-grid">
            {filteredScenarios.map((scenario) => {
              const status = getScenarioStatus(scenario.id)
              const locked = isScenarioLocked(scenario)

              return (
                <div
                  key={scenario.id}
                  className={`scenario-card card ${locked ? 'scenario-locked' : 'card-interactive'}`}
                  onClick={() => !locked && navigate(`/scenario/${scenario.id}`)}
                >
                  {locked && (
                    <div className="lock-overlay">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="lock-icon">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <div className="lock-text">Complete previous scenarios</div>
                    </div>
                  )}

                  <div className="scenario-card-header">
                    <div className="scenario-badges">
                      <span className={`badge ${
                        scenario.difficulty === 'beginner' ? 'badge-primary' :
                        scenario.difficulty === 'intermediate' ? 'badge-info' :
                        'badge-warning'
                      }`}>
                        {scenario.difficulty}
                      </span>
                      {status === 'completed' && (
                        <span className="badge badge-success">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="badge-icon">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Completed
                        </span>
                      )}
                      {status === 'in-progress' && (
                        <span className="badge badge-warning">In Progress</span>
                      )}
                    </div>
                    <div className="scenario-time">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="time-icon">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {scenario.estimatedTime} min
                    </div>
                  </div>

                  <h3 className="scenario-title">{scenario.title}</h3>
                  <p className="scenario-description">{scenario.description}</p>

                  <div className="scenario-footer">
                    <div className="scenario-category">
                      <div className="category-icon">
                        {getCategoryIcon(scenario.category)}
                      </div>
                      <span className="category-label">
                        {getCategoryLabel(scenario.category)}
                      </span>
                    </div>

                    {!locked && (
                      <button className={`btn btn-sm scenario-cta ${
                        status === 'completed' ? 'btn-secondary' :
                        status === 'in-progress' ? 'btn-warning' :
                        'btn-primary'
                      }`}>
                        {status === 'completed' ? 'Review' :
                         status === 'in-progress' ? 'Continue' :
                         'Start'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Empty State */}
          {filteredScenarios.length === 0 && (
            <div className="empty-state card">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="empty-icon">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="empty-title">No scenarios found</h3>
              <p className="empty-description">
                Try adjusting your filters to see more scenarios
              </p>
              <button className="btn btn-secondary btn-sm" onClick={() => setFilter('all')}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .scenario-selection {
          min-height: 100vh;
          background: linear-gradient(180deg,
            var(--gray-900) 0%,
            var(--navy-900) 100%
          );
        }

        /* Header */
        .header {
          position: sticky;
          top: 0;
          background: rgba(26, 26, 26, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          padding: var(--space-4) 0;
          z-index: var(--z-sticky);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: var(--text-2xl);
          font-weight: var(--font-bold);
          background: linear-gradient(135deg, var(--orange-500), var(--orange-600));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .btn-icon {
          width: 16px;
          height: 16px;
          margin-right: var(--space-2);
        }

        /* Main Content */
        .main-content {
          padding: var(--space-8) 0 var(--space-12);
        }

        /* Module Selector */
        .module-selector {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-3);
          margin-bottom: var(--space-8);
        }

        .module-tab {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4);
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          cursor: pointer;
          transition: all var(--transition-base);
          position: relative;
        }

        .module-tab:hover:not(:disabled) {
          border-color: var(--orange-500);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .module-tab.active {
          background: var(--bg-navy);
          border-color: var(--orange-500);
          box-shadow: var(--shadow-md), var(--glow-orange-sm);
        }

        .module-tab.locked {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .lock-icon-sm {
          width: 20px;
          height: 20px;
          color: var(--text-tertiary);
        }

        .module-tab-content {
          flex: 1;
        }

        .module-tab-name {
          font-size: var(--text-base);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin-bottom: var(--space-1);
        }

        .module-tab-meta {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        /* Module Header */
        .module-header {
          padding: var(--space-8);
          margin-bottom: var(--space-6);
        }

        .module-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-6);
        }

        .module-header-text {
          flex: 1;
        }

        .module-header-top {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-2);
          flex-wrap: wrap;
        }

        .module-header-title {
          font-size: var(--text-3xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin: 0;
        }

        .module-header-subtitle {
          font-size: var(--text-base);
          color: var(--text-secondary);
          margin: 0;
        }

        /* Circular Progress */
        .circular-progress {
          position: relative;
          width: 100px;
          height: 100px;
        }

        .circular-progress-svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .circular-progress-bg {
          fill: none;
          stroke: var(--border-color);
          stroke-width: 8;
        }

        .circular-progress-fill {
          fill: none;
          stroke: url(#progressGradient);
          stroke-width: 8;
          stroke-linecap: round;
          transition: stroke-dasharray 0.6s ease;
        }

        .circular-progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
        }

        /* Filter Tabs */
        .filter-tabs {
          display: flex;
          gap: var(--space-3);
          margin-bottom: var(--space-8);
          flex-wrap: wrap;
        }

        .filter-tab {
          padding: var(--space-3) var(--space-6);
          border: 2px solid var(--border-color);
          background: var(--bg-secondary);
          border-radius: var(--border-radius-full);
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .filter-tab:hover {
          border-color: var(--orange-500);
          color: var(--text-primary);
        }

        .filter-tab.active {
          background: linear-gradient(135deg, var(--orange-600), var(--orange-500));
          border-color: var(--orange-500);
          color: var(--text-on-orange);
          box-shadow: var(--shadow-sm), var(--glow-orange-sm);
        }

        /* Scenario Grid */
        .scenario-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: var(--space-6);
          margin-bottom: var(--space-8);
        }

        .scenario-card {
          display: flex;
          flex-direction: column;
          padding: var(--space-6);
          position: relative;
          overflow: hidden;
        }

        .scenario-card.scenario-locked {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .lock-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(26, 26, 26, 0.9);
          backdrop-filter: blur(4px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-3);
          z-index: 1;
        }

        .lock-icon {
          width: 48px;
          height: 48px;
          color: var(--text-tertiary);
        }

        .lock-text {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          font-weight: var(--font-medium);
        }

        .scenario-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-4);
          gap: var(--space-3);
        }

        .scenario-badges {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
        }

        .badge-icon {
          width: 14px;
          height: 14px;
          margin-right: var(--space-1);
        }

        .scenario-time {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          font-weight: var(--font-medium);
          white-space: nowrap;
        }

        .time-icon {
          width: 16px;
          height: 16px;
        }

        .scenario-title {
          font-size: var(--text-xl);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin: 0 0 var(--space-3) 0;
          line-height: var(--leading-tight);
        }

        .scenario-description {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
          margin: 0 0 var(--space-5) 0;
          flex: 1;
        }

        .scenario-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-4);
          padding-top: var(--space-4);
          border-top: 1px solid var(--border-color);
        }

        .scenario-category {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .category-icon {
          width: 20px;
          height: 20px;
          color: var(--text-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .category-icon svg {
          width: 100%;
          height: 100%;
        }

        .category-label {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          font-weight: var(--font-medium);
        }

        .scenario-cta {
          min-width: 100px;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: var(--space-12);
          max-width: 400px;
          margin: var(--space-8) auto;
        }

        .empty-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto var(--space-4);
          color: var(--text-tertiary);
        }

        .empty-title {
          font-size: var(--text-xl);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin: 0 0 var(--space-2) 0;
        }

        .empty-description {
          font-size: var(--text-base);
          color: var(--text-secondary);
          margin: 0 0 var(--space-6) 0;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .module-selector {
            grid-template-columns: 1fr;
          }

          .module-header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .circular-progress {
            width: 80px;
            height: 80px;
          }

          .module-header-title {
            font-size: var(--text-2xl);
          }

          .scenario-grid {
            grid-template-columns: 1fr;
          }

          .filter-tabs {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .filter-tab {
            white-space: nowrap;
          }
        }

        @media (max-width: 480px) {
          .module-header-title {
            font-size: var(--text-xl);
          }

          .scenario-footer {
            flex-direction: column;
            align-items: stretch;
          }

          .scenario-cta {
            width: 100%;
          }
        }
      `}</style>

      {/* SVG Gradient Definition */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--orange-600)" />
            <stop offset="100%" stopColor="var(--orange-400)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export default ScenarioSelection
