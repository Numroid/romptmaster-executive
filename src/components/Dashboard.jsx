import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { mockGetUserProgress, mockGetUserAchievements, getLevelName, getPointsForNextLevel, formatDuration, formatRelativeTime } from '../services/progressService'
import AchievementBadge from './AchievementBadge'
import SkillRadarChart from './SkillRadarChart'
import LoadingSpinner from './LoadingSpinner'

const Dashboard = () => {
  const { user, logout } = useAuth0()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [progressData, setProgressData] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [showAllAchievements, setShowAllAchievements] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      // Load progress and achievements (currently using mock)
      const [progressResult, achievementsResult] = await Promise.all([
        mockGetUserProgress(user?.sub),
        mockGetUserAchievements(user?.sub)
      ])

      if (progressResult.success) {
        setProgressData(progressResult)
      }

      if (achievementsResult.success) {
        setAchievements(achievementsResult.achievements)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

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

  if (loading || !progressData) {
    return <LoadingSpinner />
  }

  const { user: userData, progress } = progressData
  const userProgress = {
    level: userData.currentLevel,
    currentLevelName: getLevelName(userData.currentLevel),
    totalPoints: userData.totalPoints,
    scenariosCompleted: progress.scenariosCompleted,
    totalScenarios: progress.totalScenarios,
    currentStreak: userData.currentStreak,
    longestStreak: userData.longestStreak,
    averageScore: progress.averageScore,
    completionPercentage: progress.completionRate,
    totalTimeSpent: progress.totalTimeSpent
  }

  const pointsForNextLevel = getPointsForNextLevel(userData.totalPoints)
  const earnedAchievements = achievements.filter(a => a.earned)

  // Helper functions for module display
  const getModuleIcon = (moduleName) => {
    const icons = {
      'Foundation': '🎯',
      'Intermediate': '⚡',
      'Advanced': '🚀',
      'Expert': '👑'
    }
    return icons[moduleName] || '📚'
  }

  const getModuleDescription = (moduleName) => {
    const descriptions = {
      'Foundation': 'Master the basics of prompt engineering',
      'Intermediate': 'Advanced techniques and best practices',
      'Advanced': 'Complex business scenarios and workflows',
      'Expert': 'Industry-specific advanced applications'
    }
    return descriptions[moduleName] || 'Continue your learning journey'
  }

  const getModuleColor = (moduleId) => {
    const colors = ['orange', 'navy', 'teal', 'orange']
    return colors[(moduleId - 1) % colors.length]
  }

  // Map backend module progress to frontend display
  const modules = progress.moduleProgress.map(mod => ({
    id: mod.moduleId,
    name: mod.moduleName,
    description: getModuleDescription(mod.moduleName),
    icon: getModuleIcon(mod.moduleName),
    scenarios: mod.totalScenarios,
    completed: mod.scenariosCompleted,
    difficulty: mod.moduleName,
    color: getModuleColor(mod.moduleId),
    locked: mod.isLocked,
    averageScore: mod.averageScore
  }))

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
                <div className="stat-meta">{pointsForNextLevel} to Level {userProgress.level + 1}</div>
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
                <div className="stat-value">{userProgress.currentStreak} 🔥</div>
                <div className="stat-label">Day Streak</div>
                <div className="stat-meta">Best: {userProgress.longestStreak} days</div>
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

          {/* Achievement Showcase */}
          <section className="achievements-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">Achievements</h2>
                <p className="section-subtitle">{earnedAchievements.length} of {achievements.length} unlocked</p>
              </div>
              {achievements.length > 6 && (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowAllAchievements(!showAllAchievements)}
                >
                  {showAllAchievements ? 'Show Less' : 'View All'}
                </button>
              )}
            </div>

            <div className="achievements-grid">
              {(showAllAchievements ? achievements : achievements.slice(0, 6)).map(achievement => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  size="medium"
                  showLabel={true}
                />
              ))}
            </div>

            {earnedAchievements.length === 0 && (
              <div className="empty-achievements card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="empty-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <p className="empty-text">Complete scenarios to start earning achievements!</p>
              </div>
            )}
          </section>

          {/* Skills & Activity Section */}
          <section className="skills-activity-section">
            <div className="two-column-grid">
              {/* Skill Radar Chart */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Skill Breakdown</h3>
                  <p className="card-subtitle">Your performance across 6 key dimensions</p>
                </div>
                <div className="card-body">
                  <SkillRadarChart skills={progress.skillScores} size={280} />
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Recent Activity</h3>
                  <p className="card-subtitle">Your latest achievements and completions</p>
                </div>
                <div className="card-body">
                  {progress.recentActivity && progress.recentActivity.length > 0 ? (
                    <div className="activity-feed">
                      {progress.recentActivity.map(activity => (
                        <div key={activity.id} className="activity-item">
                          <div className="activity-icon">{activity.icon}</div>
                          <div className="activity-content">
                            <div className="activity-message">{activity.message}</div>
                            {activity.score && (
                              <div className="activity-score">Score: {activity.score}%</div>
                            )}
                            <div className="activity-time">{formatRelativeTime(activity.timestamp)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-activity">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="empty-icon-sm">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="empty-text-sm">No activity yet. Complete your first scenario!</p>
                    </div>
                  )}
                </div>
              </div>
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

        /* Achievements Section */
        .achievements-section {
          margin-bottom: var(--space-10);
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: var(--space-6);
        }

        .empty-achievements {
          padding: var(--space-12);
          text-align: center;
        }

        .empty-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto var(--space-4);
          color: var(--text-tertiary);
        }

        .empty-text {
          font-size: var(--text-base);
          color: var(--text-secondary);
          margin: 0;
        }

        /* Skills & Activity Section */
        .skills-activity-section {
          margin-bottom: var(--space-10);
        }

        .two-column-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-6);
        }

        .card-header {
          margin-bottom: var(--space-6);
        }

        .card-title {
          font-size: var(--text-xl);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin: 0 0 var(--space-1) 0;
        }

        .card-subtitle {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin: 0;
        }

        .card-body {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
        }

        /* Activity Feed */
        .activity-feed {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .activity-item {
          display: flex;
          gap: var(--space-3);
          padding: var(--space-4);
          background: var(--bg-secondary);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--border-color);
          transition: all var(--transition-base);
        }

        .activity-item:hover {
          border-color: var(--orange-500);
          box-shadow: var(--shadow-sm);
        }

        .activity-icon {
          font-size: 24px;
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--gray-800);
          border-radius: var(--border-radius-lg);
        }

        .activity-content {
          flex: 1;
        }

        .activity-message {
          font-size: var(--text-base);
          font-weight: var(--font-medium);
          color: var(--text-primary);
          margin-bottom: var(--space-1);
        }

        .activity-score {
          font-size: var(--text-sm);
          color: var(--orange-400);
          font-weight: var(--font-semibold);
          margin-bottom: var(--space-1);
        }

        .activity-time {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        .empty-activity {
          text-align: center;
          padding: var(--space-8);
        }

        .empty-icon-sm {
          width: 48px;
          height: 48px;
          margin: 0 auto var(--space-3);
          color: var(--text-tertiary);
        }

        .empty-text-sm {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin: 0;
        }

        @media (max-width: 1024px) {
          .two-column-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .achievements-grid {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
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
