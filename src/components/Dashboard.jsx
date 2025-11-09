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

  // Mock data - will be replaced with real data from API
  const userProgress = {
    level: 1,
    currentLevelName: 'Apprentice',
    totalPoints: 0,
    scenariosCompleted: 0,
    totalScenarios: 50,
    currentStreak: 0,
    averageScore: 0,
    completionPercentage: 0
  }

  const modules = [
    {
      id: 1,
      name: 'Foundation',
      description: 'Master the basics of prompt engineering',
      icon: '🎯',
      scenarios: 10,
      completed: 0,
      difficulty: 'Beginner',
      color: 'orange'
    },
    {
      id: 2,
      name: 'Intermediate',
      description: 'Advanced techniques and best practices',
      icon: '⚡',
      scenarios: 15,
      completed: 0,
      difficulty: 'Intermediate',
      color: 'navy',
      locked: true
    },
    {
      id: 3,
      name: 'Advanced',
      description: 'Complex business scenarios and workflows',
      icon: '🚀',
      scenarios: 15,
      completed: 0,
      difficulty: 'Advanced',
      color: 'teal',
      locked: true
    },
    {
      id: 4,
      name: 'Expert Mastery',
      description: 'Industry-specific advanced applications',
      icon: '👑',
      scenarios: 10,
      completed: 0,
      difficulty: 'Expert',
      color: 'orange',
      locked: true
    }
  ]

  const recentAchievements = [
    // Will be populated with real achievements
  ]

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h2 className="logo">PromptMaster</h2>
            <div className="header-actions">
              <div className="user-info">
                {user?.picture && (
                  <img src={user.picture} alt={user.name} className="user-avatar" />
                )}
                <span className="user-name">Hi, {user?.name?.split(' ')[0]}</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Welcome Section */}
          <section className="welcome-section">
            <h1 className="welcome-title">
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="welcome-subtitle">Continue your journey to master AI prompt engineering</p>
          </section>

          {/* Stats Overview */}
          <div className="stats-grid">
            <div className="stat-card card-navy">
              <div className="stat-header">
                <div className="stat-icon-wrapper stat-icon-orange">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="stat-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="stat-badge badge badge-primary">Level {userProgress.level}</div>
              </div>
              <div className="stat-content">
                <div className="stat-value">{userProgress.totalPoints}</div>
                <div className="stat-label">Total Points</div>
                <div className="stat-meta">{userProgress.currentLevelName}</div>
              </div>
            </div>

            <div className="stat-card card">
              <div className="stat-header">
                <div className="stat-icon-wrapper stat-icon-teal">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="stat-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="stat-content">
                <div className="stat-value">{userProgress.scenariosCompleted}/{userProgress.totalScenarios}</div>
                <div className="stat-label">Scenarios Completed</div>
                <div className="stat-meta">{userProgress.completionPercentage}% Complete</div>
              </div>
            </div>

            <div className="stat-card card">
              <div className="stat-header">
                <div className="stat-icon-wrapper stat-icon-orange">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="stat-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
              </div>
              <div className="stat-content">
                <div className="stat-value">{userProgress.currentStreak}</div>
                <div className="stat-label">Day Streak</div>
                <div className="stat-meta">Keep the momentum!</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="overall-progress card">
            <div className="progress-header">
              <div>
                <h3 className="progress-title">Overall Progress</h3>
                <p className="progress-subtitle">Complete all 50 scenarios to earn your certificate</p>
              </div>
              <span className="progress-percentage">{userProgress.completionPercentage}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${userProgress.completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Modules Grid */}
          <section className="modules-section">
            <div className="section-header">
              <h2 className="section-title">Learning Modules</h2>
              <p className="section-subtitle">Progress through 4 modules to master prompt engineering</p>
            </div>

            <div className="modules-grid">
              {modules.map((module, index) => (
                <div
                  key={module.id}
                  className={`module-card card ${module.locked ? 'module-locked' : 'card-interactive'}`}
                  onClick={() => !module.locked && navigate('/scenarios')}
                >
                  {module.locked && (
                    <div className="lock-overlay">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="lock-icon">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  )}

                  <div className="module-header">
                    <div className="module-number">Module {index + 1}</div>
                    <span className={`badge badge-${module.color === 'navy' ? 'info' : module.color === 'teal' ? 'success' : 'primary'}`}>
                      {module.difficulty}
                    </span>
                  </div>

                  <h3 className="module-title">{module.name}</h3>
                  <p className="module-description">{module.description}</p>

                  <div className="module-stats">
                    <div className="module-stat">
                      <span className="module-stat-value">{module.scenarios}</span>
                      <span className="module-stat-label">Scenarios</span>
                    </div>
                    <div className="module-stat">
                      <span className="module-stat-value">{module.completed}/{module.scenarios}</span>
                      <span className="module-stat-label">Completed</span>
                    </div>
                  </div>

                  <div className="module-progress">
                    <div className="progress-bar progress-bar-sm">
                      <div
                        className={`progress-bar-fill ${module.color === 'teal' ? 'progress-bar-success' : module.color === 'navy' ? 'progress-bar-info' : ''}`}
                        style={{ width: `${(module.completed / module.scenarios) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {!module.locked && (
                    <button className="btn btn-primary btn-sm btn-block module-cta">
                      {module.completed > 0 ? 'Continue' : 'Start Module'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Quick Start CTA */}
          {userProgress.scenariosCompleted === 0 && (
            <div className="quick-start-cta card-navy">
              <div className="cta-content">
                <h3 className="cta-title">Ready to begin your journey?</h3>
                <p className="cta-description">
                  Start with your first scenario and learn how to write effective prompts
                  for real business situations. Takes just 10 minutes.
                </p>
                <button className="btn btn-primary btn-lg" onClick={handleStartScenario}>
                  Start First Scenario
                </button>
              </div>
              <div className="cta-illustration">
                <svg viewBox="0 0 200 200" fill="none" className="illustration">
                  <circle cx="100" cy="100" r="80" stroke="var(--orange-600)" strokeWidth="2" opacity="0.2"/>
                  <circle cx="100" cy="100" r="60" stroke="var(--orange-600)" strokeWidth="2" opacity="0.4"/>
                  <circle cx="100" cy="100" r="40" fill="var(--orange-600)" opacity="0.6"/>
                </svg>
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .dashboard {
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
          background: rgba(26, 26, 26, 0.9);
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

        .header-actions {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--border-radius-full);
          border: 2px solid var(--orange-600);
        }

        .user-name {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          font-weight: var(--font-medium);
        }

        /* Main Content */
        .main-content {
          padding: var(--space-12) 0;
        }

        /* Welcome Section */
        .welcome-section {
          text-align: center;
          margin-bottom: var(--space-12);
        }

        .welcome-title {
          font-size: var(--text-5xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin: 0 0 var(--space-3) 0;
          line-height: var(--leading-tight);
        }

        .gradient-text {
          background: linear-gradient(135deg, var(--orange-500), var(--orange-400));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .welcome-subtitle {
          font-size: var(--text-lg);
          color: var(--text-secondary);
          margin: 0;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--space-5);
          margin-bottom: var(--space-8);
        }

        .stat-card {
          padding: var(--space-6);
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-4);
        }

        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--border-radius-lg);
        }

        .stat-icon-orange {
          background: var(--accent-light);
          color: var(--accent-primary);
        }

        .stat-icon-teal {
          background: var(--teal-100);
          color: var(--teal-500);
        }

        .stat-icon {
          width: 24px;
          height: 24px;
        }

        .stat-content {
          margin-top: var(--space-2);
        }

        .stat-value {
          font-size: var(--text-4xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          line-height: 1;
          margin-bottom: var(--space-2);
        }

        .stat-label {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-1);
        }

        .stat-meta {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        /* Overall Progress */
        .overall-progress {
          margin-bottom: var(--space-12);
          padding: var(--space-8);
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-5);
        }

        .progress-title {
          font-size: var(--text-2xl);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin: 0 0 var(--space-1) 0;
        }

        .progress-subtitle {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
          margin: 0;
        }

        .progress-percentage {
          font-size: var(--text-3xl);
          font-weight: var(--font-bold);
          color: var(--orange-600);
        }

        /* Modules Section */
        .modules-section {
          margin-bottom: var(--space-12);
        }

        .section-header {
          text-align: center;
          margin-bottom: var(--space-8);
        }

        .section-title {
          font-size: var(--text-4xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin: 0 0 var(--space-3) 0;
        }

        .section-subtitle {
          font-size: var(--text-lg);
          color: var(--text-secondary);
          margin: 0;
        }

        .modules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--space-6);
        }

        .module-card {
          padding: var(--space-6);
          position: relative;
          overflow: hidden;
        }

        .module-locked {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .lock-overlay {
          position: absolute;
          top: var(--space-4);
          right: var(--space-4);
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--gray-700);
          border-radius: var(--border-radius-full);
          color: var(--text-muted);
        }

        .lock-icon {
          width: 18px;
          height: 18px;
        }

        .module-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-4);
        }

        .module-number {
          font-size: var(--text-xs);
          font-weight: var(--font-semibold);
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .module-title {
          font-size: var(--text-2xl);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin: 0 0 var(--space-2) 0;
        }

        .module-description {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
          margin: 0 0 var(--space-5) 0;
        }

        .module-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
          margin-bottom: var(--space-4);
        }

        .module-stat {
          text-align: center;
          padding: var(--space-3);
          background: var(--gray-750);
          border-radius: var(--border-radius);
        }

        .module-stat-value {
          display: block;
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin-bottom: var(--space-1);
        }

        .module-stat-label {
          display: block;
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        .module-progress {
          margin-bottom: var(--space-4);
        }

        .module-cta {
          margin-top: var(--space-2);
        }

        /* Quick Start CTA */
        .quick-start-cta {
          display: grid;
          grid-template-columns: 1fr 200px;
          gap: var(--space-8);
          align-items: center;
          padding: var(--space-10);
          background: var(--bg-navy);
          border: 1px solid var(--navy-600);
          border-radius: var(--border-radius-xl);
        }

        .cta-content {
          max-width: 500px;
        }

        .cta-title {
          font-size: var(--text-3xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin: 0 0 var(--space-3) 0;
        }

        .cta-description {
          font-size: var(--text-base);
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
          margin: 0 0 var(--space-6) 0;
        }

        .cta-illustration {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .illustration {
          width: 180px;
          height: 180px;
          animation: pulse 3s ease-in-out infinite;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .quick-start-cta {
            grid-template-columns: 1fr;
          }

          .cta-illustration {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .welcome-title {
            font-size: var(--text-3xl);
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .modules-grid {
            grid-template-columns: 1fr;
          }

          .section-title {
            font-size: var(--text-3xl);
          }
        }

        @media (max-width: 480px) {
          .user-info {
            display: none;
          }

          .welcome-title {
            font-size: var(--text-2xl);
          }
        }
      `}</style>
    </div>
  )
}

export default Dashboard
