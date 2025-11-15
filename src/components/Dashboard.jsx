import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { getUserProgress, getUserAchievements, getLevelName, getPointsForNextLevel, formatDuration, formatRelativeTime } from '../services/progressService'
import { checkCertificateEligibility, generateCertificate } from '../services/certificateService'
import { syncUser } from '../services/userService'
import AchievementBadge from './AchievementBadge'
import SkillRadarChart from './SkillRadarChart'
import Certificate from './Certificate'
import LoadingSpinner from './LoadingSpinner'

const Dashboard = () => {
  const { user, logout, getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [dbUser, setDbUser] = useState(null)
  const [progressData, setProgressData] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [showAllAchievements, setShowAllAchievements] = useState(false)
  const [certificateEligibility, setCertificateEligibility] = useState(null)
  const [userCertificate, setUserCertificate] = useState(null)
  const [generatingCertificate, setGeneratingCertificate] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [user])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get access token (or use empty string for testing without Auth0)
      let token = ''
      try {
        token = await getAccessTokenSilently()
      } catch (err) {
        console.log('No Auth0 token, proceeding without authentication')
      }

      // First, sync user to get database ID
      const userSyncResult = await syncUser(user, token)
      if (!userSyncResult.success) {
        throw new Error('Failed to sync user: ' + userSyncResult.error)
      }

      const databaseUser = userSyncResult.user
      setDbUser(databaseUser)

      // Load progress and achievements using database user ID
      const [progressResult, achievementsResult] = await Promise.all([
        getUserProgress(databaseUser.id, token),
        getUserAchievements(databaseUser.id, token)
      ])

      if (progressResult.success) {
        setProgressData(progressResult)

        // Check certificate eligibility
        try {
          const eligibilityResult = await checkCertificateEligibility(databaseUser.id, progressResult.progress, token)
          setCertificateEligibility(eligibilityResult)
        } catch (certError) {
          console.log('Certificate check not available:', certError.message)
        }
      }

      if (achievementsResult.success) {
        setAchievements(achievementsResult.achievements || [])
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError(error.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateCertificate = async () => {
    try {
      setGeneratingCertificate(true)
      let token = ''
      try {
        token = await getAccessTokenSilently()
      } catch (err) {
        console.log('No Auth0 token')
      }

      const result = await generateCertificate(
        dbUser.id,
        user?.name,
        progressData?.progress?.averageScore || 85
      )

      if (result.success) {
        setUserCertificate(result.certificate)
        setShowCertificate(true)
      }
    } catch (error) {
      console.error('Error generating certificate:', error)
    } finally {
      setGeneratingCertificate(false)
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
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => navigate('/help')}
                aria-label="Help and FAQ"
                title="Help & FAQ"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="help-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
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

          {/* Certificate Section */}
          {certificateEligibility && (
            <section className="certificate-section">
              <div className="section-header">
                <h2 className="section-title">Professional Certification</h2>
                <p className="section-subtitle">
                  {certificateEligibility.eligible
                    ? 'Congratulations! You\'re eligible for your certificate'
                    : 'Complete all requirements to earn your certificate'
                  }
                </p>
              </div>

              {certificateEligibility.eligible ? (
                <div className="certificate-eligible card-navy">
                  <div className="eligible-content">
                    <div className="cert-icon">🎓</div>
                    <div className="eligible-text">
                      <h3 className="eligible-title">You\'ve Earned Your Certificate!</h3>
                      <p className="eligible-description">
                        You've successfully completed all {certificateEligibility.requirements.scenariosCompleted.required} scenarios
                        with an average score of {userProgress.averageScore}%. Claim your professional certification now!
                      </p>
                      {!userCertificate ? (
                        <button
                          className="btn btn-primary btn-lg"
                          onClick={handleGenerateCertificate}
                          disabled={generatingCertificate}
                        >
                          {generatingCertificate ? (
                            <>
                              <svg className="btn-spinner" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Generating Certificate...
                            </>
                          ) : (
                            <>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="btn-icon">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Generate My Certificate
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary btn-lg"
                          onClick={() => setShowCertificate(true)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="btn-icon">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View My Certificate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="certificate-requirements card">
                  <div className="requirements-list">
                    <div className={`requirement-item ${certificateEligibility.requirements.scenariosCompleted.met ? 'met' : ''}`}>
                      <div className="requirement-icon">
                        {certificateEligibility.requirements.scenariosCompleted.met ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <div className="requirement-content">
                        <div className="requirement-title">Complete All Scenarios</div>
                        <div className="requirement-progress">
                          {certificateEligibility.requirements.scenariosCompleted.current} / {certificateEligibility.requirements.scenariosCompleted.required} completed
                        </div>
                      </div>
                    </div>

                    <div className={`requirement-item ${certificateEligibility.requirements.averageScore.met ? 'met' : ''}`}>
                      <div className="requirement-icon">
                        {certificateEligibility.requirements.averageScore.met ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <div className="requirement-content">
                        <div className="requirement-title">Achieve 70%+ Average Score</div>
                        <div className="requirement-progress">
                          Current: {certificateEligibility.requirements.averageScore.current}%
                        </div>
                      </div>
                    </div>

                    <div className={`requirement-item ${certificateEligibility.requirements.capstoneCompleted.met ? 'met' : ''}`}>
                      <div className="requirement-icon">
                        {certificateEligibility.requirements.capstoneCompleted.met ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <div className="requirement-content">
                        <div className="requirement-title">Pass Capstone Project</div>
                        <div className="requirement-progress">
                          {certificateEligibility.requirements.capstoneCompleted.met ? 'Completed' : 'Not completed'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Certificate Modal */}
          {showCertificate && userCertificate && (
            <div className="certificate-modal-overlay" onClick={() => setShowCertificate(false)}>
              <div className="certificate-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setShowCertificate(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <Certificate certificate={userCertificate} showActions={true} />
              </div>
            </div>
          )}

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

        .help-icon {
          width: 20px;
          height: 20px;
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

        /* Certificate Section */
        .certificate-section {
          margin-bottom: var(--space-10);
        }

        .certificate-eligible {
          padding: var(--space-10);
          text-align: center;
          background: linear-gradient(135deg, var(--navy-700), var(--navy-800));
          border: 1px solid var(--navy-600);
        }

        .eligible-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .cert-icon {
          font-size: 64px;
          line-height: 1;
          margin-bottom: var(--space-4);
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .eligible-text {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          align-items: center;
        }

        .eligible-title {
          font-size: var(--text-3xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin: 0;
        }

        .eligible-description {
          font-size: var(--text-base);
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
          margin: 0;
        }

        .certificate-requirements {
          padding: var(--space-8);
        }

        .requirements-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
          max-width: 700px;
          margin: 0 auto;
        }

        .requirement-item {
          display: flex;
          gap: var(--space-4);
          padding: var(--space-5);
          background: var(--bg-secondary);
          border-radius: var(--border-radius-lg);
          border: 2px solid var(--border-color);
          transition: all var(--transition-base);
        }

        .requirement-item.met {
          border-color: var(--teal-600);
          background: linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(20, 184, 166, 0.05));
        }

        .requirement-icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--border-radius-full);
          background: var(--gray-800);
        }

        .requirement-item.met .requirement-icon {
          background: var(--teal-600);
          color: white;
        }

        .requirement-item:not(.met) .requirement-icon {
          background: var(--gray-700);
          color: var(--orange-400);
        }

        .requirement-icon svg {
          width: 24px;
          height: 24px;
        }

        .requirement-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .requirement-title {
          font-size: var(--text-lg);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
        }

        .requirement-progress {
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .requirement-item.met .requirement-progress {
          color: var(--teal-400);
        }

        /* Certificate Modal */
        .certificate-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: var(--z-modal);
          padding: var(--space-4);
          overflow-y: auto;
        }

        .certificate-modal {
          position: relative;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          animation: modalFadeIn 0.3s ease-out;
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .modal-close {
          position: absolute;
          top: var(--space-4);
          right: var(--space-4);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(26, 26, 26, 0.9);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-full);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-base);
          z-index: 10;
        }

        .modal-close:hover {
          background: var(--gray-800);
          border-color: var(--orange-500);
          color: var(--text-primary);
          transform: rotate(90deg);
        }

        .modal-close svg {
          width: 20px;
          height: 20px;
        }

        /* Button Spinner */
        .btn-spinner {
          width: 20px;
          height: 20px;
          margin-right: var(--space-2);
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .btn-icon {
          width: 20px;
          height: 20px;
          margin-right: var(--space-2);
        }

        @media (max-width: 768px) {
          .certificate-modal {
            max-width: 100%;
            max-height: 100vh;
          }

          .eligible-title {
            font-size: var(--text-2xl);
          }

          .cert-icon {
            font-size: 48px;
          }
        }
      `}</style>
    </div>
  )
}

export default Dashboard
