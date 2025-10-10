import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import {
  mockGetAllScenarios,
  getDifficultyColor,
  getCategoryIcon,
  formatEstimatedTime
} from '../services/scenarioService'
import LoadingSpinner from './LoadingSpinner'

const ScenarioSelection = () => {
  const [scenarios, setScenarios] = useState([])
  const [filteredScenarios, setFilteredScenarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [expandedScenario, setExpandedScenario] = useState(null)

  const navigate = useNavigate()
  const { user } = useAuth0()

  // Mock user progress - in real app this would come from user service
  const userProgress = {
    currentLevel: 'beginner', // beginner, developing, proficient, advanced
    completedScenarios: ['scenario_budget_analysis'], // completed scenario IDs
    totalPoints: 150
  }

  useEffect(() => {
    loadScenarios()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [scenarios, selectedDifficulty])

  const loadScenarios = async () => {
    try {
      setLoading(true)
      const scenarioData = await mockGetAllScenarios()
      setScenarios(scenarioData)
      setError(null)
    } catch (err) {
      setError('Failed to load scenarios. Please try again.')
      console.error('Error loading scenarios:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...scenarios]

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(scenario => scenario.difficulty === selectedDifficulty)
    }

    setFilteredScenarios(filtered)
  }

  const getRecommendedScenarios = () => {
    return scenarios.filter(scenario => {
      // Recommend scenarios at user's level or one level above
      const levelOrder = { 'beginner': 0, 'intermediate': 1, 'advanced': 2 }
      const userLevelIndex = levelOrder[userProgress.currentLevel] || 0
      const scenarioLevelIndex = levelOrder[scenario.difficulty] || 0
      
      return scenarioLevelIndex <= userLevelIndex + 1 && 
             !userProgress.completedScenarios.includes(scenario.id)
    }).slice(0, 3) // Show top 3 recommendations
  }

  const isScenarioUnlocked = (scenario) => {
    const levelOrder = { 'beginner': 0, 'intermediate': 1, 'advanced': 2 }
    const userLevelIndex = levelOrder[userProgress.currentLevel] || 0
    const scenarioLevelIndex = levelOrder[scenario.difficulty] || 0
    
    return scenarioLevelIndex <= userLevelIndex + 1
  }

  const isScenarioCompleted = (scenarioId) => {
    return userProgress.completedScenarios.includes(scenarioId)
  }

  const handleScenarioSelect = (scenarioId) => {
    if (isScenarioUnlocked(scenarios.find(s => s.id === scenarioId))) {
      navigate(`/scenario/${scenarioId}`)
    }
  }

  const handleBackToDashboard = () => {
    navigate('/dashboard')
  }

  const toggleScenarioDetails = (scenarioId) => {
    setExpandedScenario(expandedScenario === scenarioId ? null : scenarioId)
  }

  const difficulties = [
    { value: 'all', label: 'All Levels', icon: '🎯' },
    { value: 'beginner', label: 'Beginner', icon: '🌱' },
    { value: 'intermediate', label: 'Intermediate', icon: '🚀' },
    { value: 'advanced', label: 'Advanced', icon: '⭐' }
  ]

  const getDifficultyProgress = () => {
    const levelOrder = { 'beginner': 0, 'intermediate': 1, 'advanced': 2 }
    const userLevelIndex = levelOrder[userProgress.currentLevel] || 0
    return ((userLevelIndex + 1) / 3) * 100
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="scenario-selection">
      <header className="scenario-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <button className="back-button" onClick={handleBackToDashboard}>
                ← Back to Dashboard
              </button>
              <div className="header-text">
                <h1>Choose Your Scenario</h1>
                <p>Select a business scenario to practice your prompt engineering skills</p>
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
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button className="btn btn-primary" onClick={loadScenarios}>
                Try Again
              </button>
            </div>
          )}

          {/* Progress Overview */}
          <div className="progress-overview">
            <div className="progress-header">
              <h2>Your Learning Journey</h2>
              <div className="progress-stats">
                <div className="stat">
                  <span className="stat-value">{userProgress.completedScenarios.length}</span>
                  <span className="stat-label">Completed</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{userProgress.totalPoints}</span>
                  <span className="stat-label">Points</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{userProgress.currentLevel}</span>
                  <span className="stat-label">Level</span>
                </div>
              </div>
            </div>
            <div className="difficulty-progression">
              <div className="progression-track">
                <div className="progression-fill" style={{ width: `${getDifficultyProgress()}%` }}></div>
              </div>
              <div className="progression-labels">
                <span className={userProgress.currentLevel === 'beginner' ? 'active' : ''}>🌱 Beginner</span>
                <span className={userProgress.currentLevel === 'intermediate' ? 'active' : ''}>🚀 Intermediate</span>
                <span className={userProgress.currentLevel === 'advanced' ? 'active' : ''}>⭐ Advanced</span>
              </div>
            </div>
          </div>

          {/* Recommended Scenarios */}
          {getRecommendedScenarios().length > 0 && (
            <div className="recommended-section">
              <div className="section-header">
                <h2>🎯 Recommended for You</h2>
                <p>Perfect scenarios to continue your learning journey</p>
              </div>
              <div className="recommended-grid">
                {getRecommendedScenarios().map(scenario => (
                  <div key={scenario.id} className="recommended-card">
                    <div className="recommended-badge">Start Here</div>
                    <div className="card-header">
                      <div className="scenario-icon">{getCategoryIcon(scenario.category)}</div>
                      <div className="difficulty-info">
                        <span 
                          className="difficulty-badge large"
                          style={{ backgroundColor: getDifficultyColor(scenario.difficulty) }}
                        >
                          {scenario.difficulty}
                        </span>
                        <span className="time-estimate">{formatEstimatedTime(scenario.estimatedTime)}</span>
                      </div>
                    </div>
                    <h3>{scenario.title}</h3>
                    <p className="short-description">{scenario.description.split('.')[0]}.</p>
                    <button
                      className="btn btn-primary start-button"
                      onClick={() => handleScenarioSelect(scenario.id)}
                    >
                      Start Learning
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Difficulty Filter */}
          <div className="filters-section">
            <div className="filter-header">
              <h2>All Scenarios</h2>
              <div className="difficulty-filters">
                {difficulties.map(difficulty => (
                  <button
                    key={difficulty.value}
                    className={`difficulty-filter ${selectedDifficulty === difficulty.value ? 'active' : ''}`}
                    onClick={() => setSelectedDifficulty(difficulty.value)}
                  >
                    <span className="filter-icon">{difficulty.icon}</span>
                    <span className="filter-label">{difficulty.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="results-count">
              {filteredScenarios.length} scenario{filteredScenarios.length !== 1 ? 's' : ''} available
            </div>
          </div>

          {/* Scenarios Grid */}
          <div className="scenarios-grid">
            {filteredScenarios.map(scenario => {
              const isCompleted = isScenarioCompleted(scenario.id)
              const isUnlocked = isScenarioUnlocked(scenario)
              const isExpanded = expandedScenario === scenario.id

              return (
                <div key={scenario.id} className={`scenario-card ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`}>
                  {isCompleted && <div className="completion-badge">✓ Completed</div>}
                  {!isUnlocked && <div className="lock-badge">🔒 Locked</div>}
                  
                  <div className="card-header">
                    <div className="scenario-icon">{getCategoryIcon(scenario.category)}</div>
                    <div className="difficulty-info">
                      <span 
                        className="difficulty-badge large"
                        style={{ backgroundColor: getDifficultyColor(scenario.difficulty) }}
                      >
                        {scenario.difficulty}
                      </span>
                      <span className="time-estimate">{formatEstimatedTime(scenario.estimatedTime)}</span>
                    </div>
                  </div>

                  <div className="card-content">
                    <h3>{scenario.title}</h3>
                    <p className="short-description">{scenario.description.split('.')[0]}.</p>
                    
                    {!isExpanded && (
                      <button 
                        className="learn-more-btn"
                        onClick={() => toggleScenarioDetails(scenario.id)}
                      >
                        Learn More ↓
                      </button>
                    )}

                    {isExpanded && (
                      <div className="expanded-content">
                        <div className="full-description">
                          <p>{scenario.description}</p>
                        </div>
                        
                        <div className="scenario-details">
                          <div className="detail-section">
                            <h4>🎯 Your Objective</h4>
                            <p>{scenario.objective}</p>
                          </div>
                          
                          <div className="detail-section">
                            <h4>💼 Business Context Preview</h4>
                            <p>{scenario.businessContext.substring(0, 200)}...</p>
                          </div>
                        </div>

                        <button 
                          className="learn-more-btn collapse"
                          onClick={() => toggleScenarioDetails(scenario.id)}
                        >
                          Show Less ↑
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="card-footer">
                    <button
                      className={`btn ${isUnlocked ? 'btn-primary' : 'btn-disabled'} start-button`}
                      onClick={() => handleScenarioSelect(scenario.id)}
                      disabled={!isUnlocked}
                      title={!isUnlocked ? 'Complete previous scenarios to unlock' : ''}
                    >
                      {isCompleted ? 'Practice Again' : isUnlocked ? 'Start Scenario' : 'Locked'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredScenarios.length === 0 && !loading && !error && (
            <div className="no-scenarios">
              <h3>No scenarios found</h3>
              <p>Try selecting a different difficulty level to see more scenarios.</p>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .scenario-selection {
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

        .header-text h1 {
          font-size: var(--font-size-large-title);
          font-weight: var(--font-weight-bold);
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 var(--spacing-3) 0;
          letter-spacing: -0.02em;
        }

        .header-text p {
          color: var(--color-text-secondary);
          margin: 0;
          font-size: var(--font-size-body);
          line-height: 1.5;
        }

        .user-info {
          color: var(--color-text-secondary);
          font-size: var(--font-size-body);
          font-weight: var(--font-weight-medium);
        }

        .scenario-main {
          padding: var(--spacing-8) 0;
        }

        .error-message {
          background: linear-gradient(135deg, rgba(255, 59, 48, 0.05), rgba(255, 59, 48, 0.02));
          border: 2px solid rgba(255, 59, 48, 0.2);
          border-radius: var(--radius-xl);
          padding: var(--spacing-7);
          text-align: center;
          margin-bottom: var(--spacing-8);
          position: relative;
          animation: slideUp var(--duration-normal) var(--ease-out);
        }

        .error-message::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--color-error);
          border-radius: 0 var(--radius-small) var(--radius-small) 0;
        }

        .error-message p {
          color: var(--color-error);
          margin: 0 0 var(--spacing-5) 0;
          font-size: var(--font-size-body);
          font-weight: var(--font-weight-medium);
        }

        /* Progress Overview */
        .progress-overview {
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
          border-radius: var(--radius-2xl);
          padding: var(--spacing-8);
          margin-bottom: var(--spacing-8);
          color: white;
          animation: slideUp var(--duration-slow) var(--ease-out);
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-6);
        }

        .progress-header h2 {
          font-size: var(--font-size-title2);
          font-weight: var(--font-weight-bold);
          margin: 0;
        }

        .progress-stats {
          display: flex;
          gap: var(--spacing-6);
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: var(--font-size-title1);
          font-weight: var(--font-weight-bold);
          line-height: 1;
        }

        .stat-label {
          font-size: var(--font-size-subheadline);
          opacity: 0.9;
          text-transform: capitalize;
        }

        .difficulty-progression {
          background: rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-xl);
          padding: var(--spacing-5);
        }

        .progression-track {
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-full);
          margin-bottom: var(--spacing-4);
          overflow: hidden;
        }

        .progression-fill {
          height: 100%;
          background: white;
          border-radius: var(--radius-full);
          transition: width var(--duration-slow) var(--ease-out);
        }

        .progression-labels {
          display: flex;
          justify-content: space-between;
          font-size: var(--font-size-subheadline);
          font-weight: var(--font-weight-medium);
        }

        .progression-labels span {
          opacity: 0.7;
          transition: opacity var(--duration-fast) var(--ease-out);
        }

        .progression-labels span.active {
          opacity: 1;
          font-weight: var(--font-weight-bold);
        }

        /* Recommended Section */
        .recommended-section {
          margin-bottom: var(--spacing-10);
          animation: slideUp var(--duration-slow) var(--ease-out) 0.1s both;
        }

        .section-header {
          text-align: center;
          margin-bottom: var(--spacing-8);
        }

        .section-header h2 {
          font-size: var(--font-size-title1);
          font-weight: var(--font-weight-bold);
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 var(--spacing-3) 0;
        }

        .section-header p {
          color: var(--color-text-secondary);
          font-size: var(--font-size-body);
          margin: 0;
        }

        .recommended-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-6);
        }

        .recommended-card {
          background: linear-gradient(135deg, var(--color-success), var(--color-success-dark));
          border-radius: var(--radius-2xl);
          padding: var(--spacing-7);
          color: white;
          position: relative;
          transform: translateY(0);
          transition: all var(--duration-normal) var(--ease-out);
          box-shadow: var(--shadow-lg);
        }

        .recommended-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-2xl);
        }

        .recommended-badge {
          position: absolute;
          top: var(--spacing-4);
          right: var(--spacing-4);
          background: rgba(255, 255, 255, 0.2);
          padding: var(--spacing-2) var(--spacing-4);
          border-radius: var(--radius-full);
          font-size: var(--font-size-caption1);
          font-weight: var(--font-weight-bold);
          backdrop-filter: blur(10px);
        }

        .recommended-card .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-5);
        }

        .recommended-card .scenario-icon {
          font-size: var(--font-size-title1);
        }

        .recommended-card h3 {
          font-size: var(--font-size-title3);
          font-weight: var(--font-weight-bold);
          margin: 0 0 var(--spacing-4) 0;
          line-height: 1.3;
        }

        .recommended-card .short-description {
          font-size: var(--font-size-body);
          margin: 0 0 var(--spacing-6) 0;
          opacity: 0.9;
          line-height: 1.5;
        }

        .start-button {
          background: white !important;
          color: var(--color-success) !important;
          border: none !important;
          font-weight: var(--font-weight-bold);
          width: 100%;
        }

        .start-button:hover {
          background: rgba(255, 255, 255, 0.95) !important;
          transform: translateY(-2px);
        }

        /* Filters Section */
        .filters-section {
          margin-bottom: var(--spacing-8);
          animation: slideUp var(--duration-slow) var(--ease-out) 0.2s both;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-6);
        }

        .filter-header h2 {
          font-size: var(--font-size-title2);
          font-weight: var(--font-weight-bold);
          color: var(--color-text-primary);
          margin: 0;
        }

        .difficulty-filters {
          display: flex;
          gap: var(--spacing-3);
        }

        .difficulty-filter {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          padding: var(--spacing-3) var(--spacing-5);
          border: 2px solid var(--color-neutral-300);
          border-radius: var(--radius-full);
          background: var(--color-bg-primary);
          color: var(--color-text-secondary);
          font-size: var(--font-size-subheadline);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .difficulty-filter:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
          transform: translateY(-2px);
        }

        .difficulty-filter.active {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: white;
          box-shadow: var(--shadow-base);
        }

        .filter-icon {
          font-size: var(--font-size-body);
        }

        .results-count {
          color: var(--color-text-secondary);
          font-size: var(--font-size-subheadline);
          font-weight: var(--font-weight-medium);
          text-align: center;
          padding: var(--spacing-3) var(--spacing-5);
          background: var(--color-bg-primary);
          border-radius: var(--radius-full);
          border: 1px solid var(--color-neutral-200);
          display: inline-block;
          margin: 0 auto;
        }

        /* Scenarios Grid */
        .scenarios-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: var(--spacing-7);
          animation: fadeIn var(--duration-slow) var(--ease-out) 0.3s both;
        }

        .scenario-card {
          background: var(--color-bg-primary);
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-base);
          border: 1px solid var(--color-neutral-200);
          overflow: hidden;
          transition: all var(--duration-normal) var(--ease-out);
          position: relative;
        }

        .scenario-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
          border-color: var(--color-primary);
        }

        .scenario-card.completed {
          border-color: var(--color-success);
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.02), var(--color-bg-primary));
        }

        .scenario-card.locked {
          opacity: 0.6;
          background: var(--color-neutral-100);
        }

        .scenario-card.locked:hover {
          transform: none;
          box-shadow: var(--shadow-base);
          border-color: var(--color-neutral-200);
        }

        .completion-badge,
        .lock-badge {
          position: absolute;
          top: var(--spacing-4);
          right: var(--spacing-4);
          padding: var(--spacing-2) var(--spacing-4);
          border-radius: var(--radius-full);
          font-size: var(--font-size-caption1);
          font-weight: var(--font-weight-bold);
          z-index: 2;
        }

        .completion-badge {
          background: var(--color-success);
          color: white;
        }

        .lock-badge {
          background: var(--color-neutral-400);
          color: white;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-6) var(--spacing-7) var(--spacing-5) var(--spacing-7);
          border-bottom: 1px solid var(--color-neutral-200);
          background: linear-gradient(135deg, var(--color-bg-secondary), var(--color-neutral-100));
        }

        .scenario-icon {
          font-size: var(--font-size-title2);
        }

        .difficulty-info {
          display: flex;
          gap: var(--spacing-4);
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

        .difficulty-badge.large {
          padding: var(--spacing-3) var(--spacing-5);
          font-size: var(--font-size-subheadline);
        }

        .time-estimate {
          color: var(--color-text-secondary);
          font-size: var(--font-size-subheadline);
          font-weight: var(--font-weight-medium);
        }

        .card-content {
          padding: var(--spacing-6) var(--spacing-7);
        }

        .card-content h3 {
          font-size: var(--font-size-title3);
          font-weight: var(--font-weight-bold);
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 var(--spacing-4) 0;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }

        .short-description {
          color: var(--color-text-secondary);
          margin: 0 0 var(--spacing-5) 0;
          line-height: 1.6;
          font-size: var(--font-size-body);
        }

        .learn-more-btn {
          background: none;
          border: none;
          color: var(--color-primary);
          font-size: var(--font-size-subheadline);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          padding: var(--spacing-2) 0;
          transition: all var(--duration-fast) var(--ease-out);
          border-radius: var(--radius-medium);
        }

        .learn-more-btn:hover {
          color: var(--color-primary-dark);
          background: rgba(0, 122, 255, 0.05);
          padding: var(--spacing-2) var(--spacing-3);
          margin: 0 calc(-1 * var(--spacing-3));
        }

        .expanded-content {
          margin-top: var(--spacing-5);
          animation: slideDown var(--duration-normal) var(--ease-out);
        }

        .full-description {
          margin-bottom: var(--spacing-6);
        }

        .full-description p {
          color: var(--color-text-secondary);
          line-height: 1.6;
          font-size: var(--font-size-body);
          margin: 0;
        }

        .scenario-details {
          margin-bottom: var(--spacing-6);
        }

        .detail-section {
          margin-bottom: var(--spacing-5);
          padding: var(--spacing-4);
          background: var(--color-bg-secondary);
          border-radius: var(--radius-large);
          border: 1px solid var(--color-neutral-200);
        }

        .detail-section h4 {
          font-size: var(--font-size-subheadline);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-primary);
          margin: 0 0 var(--spacing-2) 0;
        }

        .detail-section p {
          font-size: var(--font-size-subheadline);
          color: var(--color-text-secondary);
          margin: 0;
          line-height: 1.5;
        }

        .card-footer {
          padding: var(--spacing-6) var(--spacing-7);
          border-top: 1px solid var(--color-neutral-200);
          background: var(--color-bg-secondary);
        }

        .card-footer .start-button {
          width: 100%;
          justify-content: center;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .btn-disabled {
          background: var(--color-neutral-300) !important;
          color: var(--color-neutral-500) !important;
          cursor: not-allowed !important;
        }

        .btn-disabled:hover {
          transform: none !important;
          background: var(--color-neutral-300) !important;
        }

        .no-scenarios {
          text-align: center;
          padding: var(--spacing-12) var(--spacing-7);
          color: var(--color-text-secondary);
          background: var(--color-bg-primary);
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-base);
          border: 1px solid var(--color-neutral-200);
          animation: slideUp var(--duration-normal) var(--ease-out);
        }

        .no-scenarios h3 {
          color: var(--color-text-primary);
          font-size: var(--font-size-title2);
          font-weight: var(--font-weight-semibold);
          margin: 0 0 var(--spacing-4) 0;
        }

        .no-scenarios p {
          margin: 0;
          font-size: var(--font-size-body);
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

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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

          .header-text h1 {
            font-size: var(--font-size-title1);
          }

          .progress-header {
            flex-direction: column;
            gap: var(--spacing-5);
            text-align: center;
          }

          .progress-stats {
            justify-content: center;
          }

          .recommended-grid {
            grid-template-columns: 1fr;
          }

          .filter-header {
            flex-direction: column;
            gap: var(--spacing-5);
            text-align: center;
          }

          .difficulty-filters {
            flex-wrap: wrap;
            justify-content: center;
          }

          .scenarios-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-6);
          }

          .card-content {
            padding: var(--spacing-5) var(--spacing-6);
          }

          .card-header {
            padding: var(--spacing-5) var(--spacing-6) var(--spacing-4) var(--spacing-6);
          }

          .card-footer {
            padding: var(--spacing-5) var(--spacing-6);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .progress-overview,
          .recommended-section,
          .filters-section,
          .scenarios-grid,
          .scenario-card,
          .error-message,
          .no-scenarios,
          .expanded-content {
            animation: none;
          }
          
          .scenario-card:hover,
          .recommended-card:hover,
          .difficulty-filter:hover,
          .start-button:hover {
            transform: none;
          }

          .progression-fill {
            transition: none;
          }
        }
      `}</style>
    </div>
  )
}

export default ScenarioSelection