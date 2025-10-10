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
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <h2>PromptMaster Executive</h2>
            </div>
            <div className="user-menu">
              <span>Welcome, {user?.name}</span>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          <div className="welcome-section">
            <h1>🚀 Ready to Transform Your AI Skills?</h1>
            <p>Your journey to prompt mastery starts here. Save 2+ hours every week with AI that actually works for you!</p>
            <div className="value-proposition">
              <div className="value-item">
                <span className="value-icon">⚡</span>
                <span>10x Faster Analysis</span>
              </div>
              <div className="value-item">
                <span className="value-icon">🎯</span>
                <span>Laser-Sharp Results</span>
              </div>
              <div className="value-item">
                <span className="value-icon">💪</span>
                <span>Executive Confidence</span>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="card progress-card">
              <h3>Your Progress</h3>
              <div className="progress-overview">
                <div className="progress-stat">
                  <span className="stat-number">0%</span>
                  <span className="stat-label">Complete</span>
                </div>
                <div className="progress-stat">
                  <span className="stat-number">Beginner</span>
                  <span className="stat-label">Current Level</span>
                </div>
                <div className="progress-stat">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Day Streak</span>
                </div>
              </div>
            </div>

            <div className="card next-action-card">
              <h3>🎯 Start Your Mastery Journey</h3>
              <p>Choose your first challenge and begin transforming how you work with AI</p>
              <button className="btn btn-primary btn-xl" onClick={handleStartScenario}>
                🚀 Launch Your First Mission
              </button>
              <div className="time-commitment">
                <span>⏱️ Just 10 minutes to see the difference</span>
              </div>
            </div>

            <div className="card achievements-card">
              <h3>🏆 Your Success Story</h3>
              <p>Watch your expertise grow with every challenge you conquer</p>
              <div className="achievement-placeholder">
                <div class="achievement-preview">
                  <div class="badge-preview">🎯</div>
                  <div class="badge-preview">💰</div>
                  <div class="badge-preview">⚡</div>
                </div>
                <p>Complete your first scenario to unlock your <strong>Prompt Pioneer</strong> badge!</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: var(--color-bg-secondary);
        }

        .dashboard-header {
          background: var(--color-bg-primary);
          border-bottom: 2px solid var(--color-neutral-200);
          padding: var(--spacing-6) 0; /* Increased padding for executive feel */
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          z-index: 10;
          box-shadow: var(--shadow-sm);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          animation: slideDown var(--duration-normal) var(--ease-out);
        }

        .logo h2 {
          color: var(--color-text-primary);
          font-size: var(--font-size-h2);
          font-weight: var(--font-weight-bold);
          letter-spacing: -0.01em;
          margin: 0;
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: var(--spacing-5);
        }

        .user-menu span {
          color: var(--color-text-secondary);
          font-size: var(--font-size-body);
          font-weight: var(--font-weight-medium);
        }

        .dashboard-main {
          padding: var(--spacing-9) 0;
        }

        .welcome-section {
          text-align: center;
          margin-bottom: var(--spacing-11); /* Increased spacing for executive breathing room */
          animation: fadeIn var(--duration-slow) var(--ease-out) 0.2s both;
        }

        .welcome-section h1 {
          font-size: var(--font-size-h1); /* Executive typography scale */
          font-weight: var(--font-weight-bold);
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--spacing-6); /* Proper spacing */
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .welcome-section p {
          font-size: var(--font-size-h3); /* Executive hierarchy */
          font-weight: var(--font-weight-regular);
          color: var(--color-text-secondary);
          max-width: 720px; /* Better reading width */
          margin: 0 auto var(--spacing-8) auto;
          line-height: 1.6; /* Executive line height */
        }

        .value-proposition {
          display: flex;
          justify-content: center;
          gap: var(--spacing-8);
          flex-wrap: wrap;
        }

        .value-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
          padding: var(--spacing-4) var(--spacing-6);
          background: var(--color-bg-elevated);
          border-radius: var(--radius-full);
          border: 2px solid var(--color-primary);
          font-weight: var(--font-weight-semibold);
          color: var(--color-primary);
          box-shadow: var(--shadow-md);
          transition: all var(--duration-fast) var(--ease-out);
        }

        .value-item:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .value-icon {
          font-size: var(--font-size-headline);
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
          gap: var(--spacing-8); /* Executive spacing */
          max-width: 1200px; /* Executive content width constraint */
          margin: 0 auto;
        }

        .progress-card {
          grid-column: span 2;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          color: white;
          position: relative;
          overflow: hidden;
          animation: slideUp var(--duration-slow) var(--ease-out) 0.3s both;
        }

        .progress-card::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
          transform: translate(50%, -50%);
        }

        .progress-card h3 {
          position: relative;
          z-index: 2;
          font-size: var(--font-size-h2); /* Executive typography */
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--spacing-6);
        }

        .progress-overview {
          display: flex;
          justify-content: space-around;
          gap: var(--spacing-6);
          position: relative;
          z-index: 2;
        }

        .progress-stat {
          text-align: center;
          flex: 1;
        }

        .stat-number {
          display: block;
          font-size: var(--font-size-h1); /* Executive typography */
          font-weight: var(--font-weight-bold);
          color: white;
          line-height: 1.2;
          margin-bottom: var(--spacing-3);
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .stat-label {
          font-size: var(--font-size-subheadline);
          color: rgba(255, 255, 255, 0.9);
          font-weight: var(--font-weight-medium);
        }

        .next-action-card {
          text-align: center;
          transition: all var(--duration-normal) var(--ease-out);
          animation: slideUp var(--duration-slow) var(--ease-out) 0.4s both;
        }

        .next-action-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
        }

        .next-action-card h3 {
          font-size: var(--font-size-h2); /* Executive typography */
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-5);
        }

        .next-action-card p {
          margin: var(--spacing-5) 0 var(--spacing-7) 0;
          color: var(--color-text-secondary);
          font-size: var(--font-size-body);
          line-height: 1.5;
        }

        .time-commitment {
          margin-top: var(--spacing-5);
          padding: var(--spacing-3) var(--spacing-5);
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
          border-radius: var(--radius-full);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .time-commitment span {
          color: var(--color-success);
          font-size: var(--font-size-subheadline);
          font-weight: var(--font-weight-medium);
        }

        .achievements-card {
          text-align: center;
          animation: slideUp var(--duration-slow) var(--ease-out) 0.5s both;
        }

        .achievements-card h3 {
          font-size: var(--font-size-h2); /* Executive typography */
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-5);
        }

        .achievements-card p {
          margin: var(--spacing-5) 0 var(--spacing-7) 0;
          color: var(--color-text-secondary);
          font-size: var(--font-size-body);
        }

        .achievement-placeholder {
          background: linear-gradient(135deg, var(--color-neutral-100), var(--color-neutral-50));
          border-radius: var(--radius-large);
          padding: var(--spacing-7);
          border: 2px dashed var(--color-neutral-300);
          transition: all var(--duration-normal) var(--ease-out);
          text-align: center;
        }

        .achievement-placeholder:hover {
          border-color: var(--color-primary);
          background: linear-gradient(135deg, rgba(0, 122, 255, 0.05), rgba(0, 122, 255, 0.02));
        }

        .achievement-preview {
          display: flex;
          justify-content: center;
          gap: var(--spacing-4);
          margin-bottom: var(--spacing-5);
        }

        .badge-preview {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, var(--color-neutral-300), var(--color-neutral-200));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-title3);
          opacity: 0.6;
          animation: float 3s ease-in-out infinite;
        }

        .badge-preview:nth-child(2) {
          animation-delay: 0.5s;
        }

        .badge-preview:nth-child(3) {
          animation-delay: 1s;
        }

        .achievement-placeholder p {
          color: var(--color-text-secondary);
          font-size: var(--font-size-body);
          margin: 0;
          font-style: normal;
        }

        .achievement-placeholder strong {
          color: var(--color-primary);
          font-weight: var(--font-weight-bold);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
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

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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

        @media (max-width: 768px) {
          .progress-card {
            grid-column: span 1;
          }
          
          .progress-overview {
            flex-direction: column;
            gap: var(--spacing-6);
          }
          
          .header-content {
            flex-direction: column;
            gap: var(--spacing-5);
            text-align: center;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-6);
          }

          .welcome-section h1 {
            font-size: var(--font-size-title1);
          }

          .welcome-section p {
            font-size: var(--font-size-headline);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .header-content,
          .welcome-section,
          .progress-card,
          .next-action-card,
          .achievements-card {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

export default Dashboard