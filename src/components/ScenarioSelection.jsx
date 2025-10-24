import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { mockGetAllScenarios } from '../services/scenarioService'
import LoadingSpinner from './LoadingSpinner'

const ScenarioSelection = () => {
  const [scenarios, setScenarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()
  const { user } = useAuth0()

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

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'var(--secondary)',
      intermediate: 'var(--accent)',
      advanced: 'var(--error)'
    }
    return colors[difficulty] || 'var(--gray-500)'
  }

  const getCategoryLabel = (category) => {
    const labels = {
      budget: 'Budget Analysis',
      risk: 'Risk Assessment',
      strategy: 'Strategy',
      presentation: 'Presentation',
      analysis: 'Financial Analysis'
    }
    return labels[category] || category
  }

  const filteredScenarios = filter === 'all'
    ? scenarios
    : scenarios.filter(s => s.difficulty === filter)

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="scenario-selection">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h2 className="logo">PromptMaster</h2>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate('/dashboard')}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="page-header">
            <h1>Choose a Scenario</h1>
            <p className="subtitle">
              Practice with realistic business scenarios and improve your prompt engineering skills
            </p>
          </div>

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
            {filteredScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="scenario-card card card-interactive"
                onClick={() => navigate(`/scenario/${scenario.id}`)}
              >
                <div className="scenario-header">
                  <span
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(scenario.difficulty) }}
                  >
                    {scenario.difficulty}
                  </span>
                  <span className="time-badge">{scenario.estimatedTime} min</span>
                </div>

                <h3>{scenario.title}</h3>
                <p className="scenario-description">{scenario.description}</p>

                <div className="scenario-meta">
                  <span className="category-label">
                    {getCategoryLabel(scenario.category)}
                  </span>
                </div>

                <button className="btn btn-primary btn-sm scenario-cta">
                  Start Scenario
                </button>
              </div>
            ))}
          </div>

          {filteredScenarios.length === 0 && (
            <div className="empty-state">
              <p>No scenarios found for this filter</p>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .scenario-selection {
          min-height: 100vh;
          background: var(--bg-page);
        }

        /* Header */
        .header {
          background: var(--white);
          border-bottom: 1px solid var(--gray-200);
          padding: var(--space-4) 0;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
          color: var(--primary);
          margin: 0;
        }

        /* Main Content */
        .main-content {
          padding: var(--space-8) 0;
        }

        .page-header {
          text-align: center;
          margin-bottom: var(--space-8);
        }

        .page-header h1 {
          font-size: var(--text-4xl);
          margin-bottom: var(--space-3);
        }

        .subtitle {
          font-size: var(--text-lg);
          color: var(--text-secondary);
          max-width: 700px;
          margin: 0 auto;
        }

        /* Filter Tabs */
        .filter-tabs {
          display: flex;
          gap: var(--space-2);
          margin-bottom: var(--space-8);
          justify-content: center;
          flex-wrap: wrap;
        }

        .filter-tab {
          padding: var(--space-3) var(--space-6);
          border: 2px solid var(--gray-300);
          background: var(--white);
          border-radius: var(--radius-lg);
          font-size: var(--text-base);
          font-weight: var(--font-medium);
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
        }

        .filter-tab:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .filter-tab.active {
          background: var(--primary);
          border-color: var(--primary);
          color: var(--white);
        }

        /* Scenario Grid */
        .scenario-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--space-6);
          margin-bottom: var(--space-8);
        }

        .scenario-card {
          display: flex;
          flex-direction: column;
          padding: var(--space-6);
        }

        .scenario-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-4);
        }

        .difficulty-badge {
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: var(--font-semibold);
          color: var(--white);
          text-transform: capitalize;
        }

        .time-badge {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          font-weight: var(--font-medium);
        }

        .scenario-card h3 {
          font-size: var(--text-xl);
          margin-bottom: var(--space-3);
          color: var(--text-primary);
        }

        .scenario-description {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: var(--space-4);
          flex: 1;
        }

        .scenario-meta {
          margin-bottom: var(--space-4);
          padding-top: var(--space-4);
          border-top: 1px solid var(--gray-200);
        }

        .category-label {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          font-weight: var(--font-medium);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .scenario-cta {
          width: 100%;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: var(--space-12) 0;
          color: var(--text-secondary);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .page-header h1 {
            font-size: var(--text-3xl);
          }

          .scenario-grid {
            grid-template-columns: 1fr;
          }

          .filter-tabs {
            width: 100%;
          }

          .filter-tab {
            flex: 1;
            min-width: 120px;
          }
        }
      `}</style>
    </div>
  )
}

export default ScenarioSelection
