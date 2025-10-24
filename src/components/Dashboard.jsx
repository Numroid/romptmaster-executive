import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { user, logout } = useAuth0()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    })
  }

  const handleStartScenario = () => {
    navigate('/scenarios')
  }

  return (
    <div className="dashboard" data-testid="dashboard">
      {/* Clean Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h2 className="logo">PromptMaster</h2>
            <div className="header-actions">
              <span className="user-name">Hi, {user?.name?.split(' ')[0]}</span>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Welcome Section - Minimal */}
          <section className="welcome-section">
            <h1>Your Learning Path</h1>
            <p className="subtitle">Master prompt engineering through real business scenarios</p>
          </section>

          {/* Progress Overview - Clean Card */}
          <div className="progress-card card">
            <div className="progress-header">
              <h3>Current Progress</h3>
              <span className="level-badge badge badge-primary">Beginner</span>
            </div>

            <div className="progress-stats">
              <div className="stat">
                <div className="stat-value">0</div>
                <div className="stat-label">Scenarios Completed</div>
              </div>
              <div className="stat">
                <div className="stat-value">0</div>
                <div className="stat-label">Day Streak</div>
              </div>
              <div className="stat">
                <div className="stat-value">0</div>
                <div className="stat-label">Total Points</div>
              </div>
            </div>

            <div className="progress-bar-container">
              <div className="progress-bar-label">
                <span>Overall Progress</span>
                <span>0%</span>
              </div>
              <div className="progress">
                <div className="progress-bar" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>

          {/* Start Learning CTA - Prominent but Simple */}
          <div className="cta-section">
            <div className="cta-content">
              <h2>Ready to start?</h2>
              <p>Begin your first scenario and learn how to write effective prompts for business analysis</p>
              <button className="btn btn-primary btn-lg" onClick={handleStartScenario}>
                Start Learning
              </button>
              <p className="cta-meta">Just 10 minutes to complete</p>
            </div>
          </div>

          {/* Quick Stats - Minimal */}
          <div className="quick-stats">
            <div className="stat-card card">
              <div className="stat-icon">📊</div>
              <h4>5 Scenarios</h4>
              <p>Real business cases to practice</p>
            </div>
            <div className="stat-card card">
              <div className="stat-icon">🎯</div>
              <h4>15+ Techniques</h4>
              <p>Advanced prompting methods</p>
            </div>
            <div className="stat-card card">
              <div className="stat-icon">⚡</div>
              <h4>Self-Paced</h4>
              <p>Learn at your own speed</p>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .dashboard {
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

        .logo {
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
          color: var(--primary);
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .user-name {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          font-weight: var(--font-medium);
        }

        /* Main Content */
        .main-content {
          padding: var(--space-8) 0;
        }

        /* Welcome Section */
        .welcome-section {
          text-align: center;
          margin-bottom: var(--space-8);
        }

        .welcome-section h1 {
          font-size: var(--text-4xl);
          margin-bottom: var(--space-3);
          color: var(--text-primary);
        }

        .subtitle {
          font-size: var(--text-lg);
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }

        /* Progress Card */
        .progress-card {
          margin-bottom: var(--space-8);
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-6);
        }

        .progress-header h3 {
          font-size: var(--text-xl);
          margin: 0;
        }

        .progress-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
          margin-bottom: var(--space-6);
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--gray-200);
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          font-size: var(--text-3xl);
          font-weight: var(--font-bold);
          color: var(--primary);
          margin-bottom: var(--space-2);
        }

        .stat-label {
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .progress-bar-container {
          margin-top: var(--space-4);
        }

        .progress-bar-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--space-2);
          font-size: var(--text-sm);
          color: var(--text-secondary);
          font-weight: var(--font-medium);
        }

        /* CTA Section */
        .cta-section {
          max-width: 600px;
          margin: 0 auto var(--space-12) auto;
          text-align: center;
        }

        .cta-content h2 {
          font-size: var(--text-2xl);
          margin-bottom: var(--space-3);
        }

        .cta-content p {
          font-size: var(--text-base);
          color: var(--text-secondary);
          margin-bottom: var(--space-6);
          line-height: 1.6;
        }

        .cta-meta {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
          margin-top: var(--space-3);
        }

        /* Quick Stats */
        .quick-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
          max-width: 900px;
          margin: 0 auto;
        }

        .stat-card {
          text-align: center;
          padding: var(--space-6);
        }

        .stat-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        .stat-icon {
          font-size: 2.5rem;
          margin-bottom: var(--space-3);
        }

        .stat-card h4 {
          font-size: var(--text-lg);
          margin-bottom: var(--space-2);
          color: var(--text-primary);
        }

        .stat-card p {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header-actions {
            gap: var(--space-2);
          }

          .user-name {
            display: none;
          }

          .welcome-section h1 {
            font-size: var(--text-3xl);
          }

          .progress-stats {
            grid-template-columns: 1fr;
            gap: var(--space-6);
          }

          .quick-stats {
            grid-template-columns: 1fr;
            gap: var(--space-4);
          }

          .cta-content h2 {
            font-size: var(--text-xl);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .stat-card:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  )
}

export default Dashboard
