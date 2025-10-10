import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const LandingPage = () => {
  const { loginWithRedirect } = useAuth0()

  const handleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup'
      }
    })
  }

  return (
    <div className="landing-page" data-testid="landing-page">
      <header className="hero-section">
        <div className="container">
          <nav className="navbar">
            <div className="logo">
              <h2>PromptMaster Executive</h2>
            </div>
            <div className="nav-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => loginWithRedirect()}
              >
                Sign In
              </button>
            </div>
          </nav>
          
          <div className="hero-content">
            <h1>Master AI Prompts for Business Success</h1>
            <p className="hero-subtitle">
              Transform your AI productivity with gamified prompt engineering training 
              designed specifically for finance and business leaders.
            </p>
            
            <div className="roi-calculator">
              <div className="card">
                <h3>Calculate Your Time Savings</h3>
                <div className="savings-display">
                  <div className="metric">
                    <span className="number">10</span>
                    <span className="label">Hours saved per week</span>
                  </div>
                  <div className="metric">
                    <span className="number">300%</span>
                    <span className="label">Productivity increase</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="cta-section">
              <button 
                className="btn btn-primary btn-large"
                onClick={handleLogin}
              >
                Start Free Trial
              </button>
              <p className="cta-subtitle">No credit card required • 2 scenarios free</p>
            </div>
          </div>
        </div>
      </header>

      <section className="features-section">
        <div className="container">
          <h2>Why Finance Leaders Choose PromptMaster</h2>
          <div className="features-grid">
            <div className="feature">
              <h3>🎯 Business-Focused Scenarios</h3>
              <p>Practice with realistic budget analysis, risk assessment, and board presentation contexts</p>
            </div>
            <div className="feature">
              <h3>📊 Immediate ROI</h3>
              <p>See measurable time savings and productivity improvements from day one</p>
            </div>
            <div className="feature">
              <h3>🏆 Gamified Learning</h3>
              <p>Stay motivated with achievements, progress tracking, and peer comparisons</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          background: var(--color-bg-secondary);
        }

        .hero-section {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          color: white;
          padding: 0 0 var(--spacing-16) 0;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-6) 0;
          position: relative;
          z-index: 2;
        }

        .logo h2 {
          font-size: var(--font-size-h2); /* Executive typography */
          font-weight: var(--font-weight-bold);
          letter-spacing: -0.01em;
          margin: 0;
        }

        .hero-content {
          text-align: center;
          padding: var(--spacing-12) 0;
          position: relative;
          z-index: 2;
        }

        .hero-content h1 {
          font-size: var(--font-size-h1); /* Executive typography scale */
          font-weight: var(--font-weight-bold);
          margin-bottom: var(--spacing-6);
          line-height: 1.2; /* Executive line height */
          letter-spacing: -0.02em;
          animation: slideUp var(--duration-slow) var(--ease-out);
        }

        .hero-subtitle {
          font-size: var(--font-size-h3); /* Executive hierarchy */
          font-weight: var(--font-weight-regular);
          margin-bottom: var(--spacing-9);
          opacity: 0.95;
          max-width: 720px; /* Executive reading width */
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6; /* Executive line height */
          animation: slideUp var(--duration-slow) var(--ease-out) 0.1s both;
        }

        .roi-calculator {
          margin: var(--spacing-9) 0;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
          animation: slideUp var(--duration-slow) var(--ease-out) 0.2s both;
        }

        .roi-calculator .card {
          background: var(--glass-bg);
          backdrop-filter: var(--glass-backdrop);
          -webkit-backdrop-filter: var(--glass-backdrop);
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow-2xl);
          transition: all var(--duration-normal) var(--ease-out);
        }

        .roi-calculator .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.4);
        }

        .roi-calculator h3 {
          margin-bottom: var(--spacing-6);
          text-align: center;
          font-size: var(--font-size-h3); /* Executive typography */
          font-weight: var(--font-weight-semibold);
        }

        .savings-display {
          display: flex;
          justify-content: space-around;
          gap: var(--spacing-6);
        }

        .metric {
          text-align: center;
          flex: 1;
        }

        .metric .number {
          display: block;
          font-size: var(--font-size-h1); /* Executive typography */
          font-weight: var(--font-weight-bold);
          color: var(--color-warning);
          line-height: 1.2;
          margin-bottom: var(--spacing-3);
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .metric .label {
          font-size: var(--font-size-footnote);
          opacity: 0.9;
          font-weight: var(--font-weight-medium);
        }

        .cta-section {
          margin-top: var(--spacing-9);
          animation: slideUp var(--duration-slow) var(--ease-out) 0.3s both;
        }

        .cta-subtitle {
          margin-top: var(--spacing-4);
          opacity: 0.9;
          font-size: var(--font-size-subheadline);
        }

        .features-section {
          padding: var(--spacing-16) 0;
          background: var(--color-bg-primary);
          position: relative;
        }

        .features-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-neutral-200), transparent);
        }

        .features-section h2 {
          text-align: center;
          margin-bottom: var(--spacing-12);
          font-size: var(--font-size-h1); /* Executive typography */
          font-weight: var(--font-weight-bold);
          color: var(--color-text-primary);
          letter-spacing: -0.02em;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: var(--spacing-9);
        }

        .feature {
          text-align: center;
          padding: var(--spacing-7);
          background: var(--color-bg-elevated);
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-base);
          transition: all var(--duration-normal) var(--ease-out);
          border: 1px solid var(--color-neutral-200);
        }

        .feature:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
          border-color: var(--color-primary);
        }

        .feature h3 {
          font-size: var(--font-size-h2); /* Executive typography */
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--spacing-5);
          color: var(--color-text-primary);
        }

        .feature p {
          color: var(--color-text-secondary);
          line-height: 1.6;
          font-size: var(--font-size-body);
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
          .hero-content h1 {
            font-size: var(--font-size-title1);
          }
          
          .hero-subtitle {
            font-size: var(--font-size-headline);
          }
          
          .savings-display {
            flex-direction: column;
            gap: var(--spacing-6);
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-6);
          }

          .feature {
            padding: var(--spacing-6);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-content h1,
          .hero-subtitle,
          .roi-calculator,
          .cta-section {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

export default LandingPage