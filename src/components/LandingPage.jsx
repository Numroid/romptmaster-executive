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
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <nav className="nav">
            <h2 className="logo">PromptMaster</h2>
            <button
              className="btn btn-ghost"
              onClick={() => loginWithRedirect()}
            >
              Sign In
            </button>
          </nav>

          <div className="hero-content">
            <h1>Master Prompt Engineering for Business</h1>
            <p className="subtitle">
              Learn to write effective AI prompts through realistic business scenarios.
              Built for finance and business leaders.
            </p>
            <div className="cta-buttons">
              <button
                className="btn btn-primary btn-xl"
                onClick={handleLogin}
              >
                Start Learning Free
              </button>
            </div>
            <p className="cta-note">No credit card required</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>What You'll Learn</h2>
          <div className="feature-grid">
            <div className="feature-card card">
              <div className="feature-icon">📊</div>
              <h3>Real Business Scenarios</h3>
              <p>Practice with budget analysis, risk assessment, and strategic planning tasks</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">🎯</div>
              <h3>Practical Skills</h3>
              <p>Learn techniques you can apply immediately to your daily work</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">⚡</div>
              <h3>Self-Paced Learning</h3>
              <p>Complete scenarios at your own speed, 10-15 minutes each</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container-sm">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Choose a Scenario</h3>
                <p>Select from 5 realistic business scenarios</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Write Your Prompt</h3>
                <p>Practice crafting effective prompts with guidance</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Get Feedback</h3>
                <p>Learn what makes prompts effective</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="container-sm">
          <div className="cta-box">
            <h2>Ready to get started?</h2>
            <p>Join business leaders learning to work more effectively with AI</p>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleLogin}
            >
              Start Learning Free
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          background: var(--bg-page);
        }

        /* Hero Section */
        .hero {
          background: var(--white);
          padding: var(--space-4) 0 var(--space-16) 0;
          border-bottom: 1px solid var(--gray-200);
        }

        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-12);
        }

        .logo {
          font-size: var(--text-2xl);
          font-weight: var(--font-bold);
          color: var(--primary);
          margin: 0;
        }

        .hero-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-content h1 {
          font-size: var(--text-4xl);
          margin-bottom: var(--space-6);
          color: var(--text-primary);
          line-height: 1.2;
        }

        .subtitle {
          font-size: var(--text-xl);
          color: var(--text-secondary);
          margin-bottom: var(--space-8);
          line-height: 1.6;
        }

        .cta-buttons {
          margin-bottom: var(--space-3);
        }

        .cta-note {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
        }

        /* Features Section */
        .features {
          padding: var(--space-16) 0;
          background: var(--bg-page);
        }

        .features h2 {
          text-align: center;
          font-size: var(--text-3xl);
          margin-bottom: var(--space-12);
          color: var(--text-primary);
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-6);
        }

        .feature-card {
          text-align: center;
          padding: var(--space-8) var(--space-6);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: var(--space-4);
        }

        .feature-card h3 {
          font-size: var(--text-xl);
          margin-bottom: var(--space-3);
          color: var(--text-primary);
        }

        .feature-card p {
          font-size: var(--text-base);
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        /* How It Works */
        .how-it-works {
          padding: var(--space-16) 0;
          background: var(--white);
        }

        .how-it-works h2 {
          text-align: center;
          font-size: var(--text-3xl);
          margin-bottom: var(--space-12);
          color: var(--text-primary);
        }

        .steps {
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
        }

        .step {
          display: flex;
          gap: var(--space-6);
          align-items: flex-start;
        }

        .step-number {
          width: 48px;
          height: 48px;
          background: var(--primary);
          color: var(--white);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
          flex-shrink: 0;
        }

        .step-content h3 {
          font-size: var(--text-xl);
          margin-bottom: var(--space-2);
          color: var(--text-primary);
        }

        .step-content p {
          font-size: var(--text-base);
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.6;
        }

        /* Final CTA */
        .final-cta {
          padding: var(--space-16) 0;
          background: var(--bg-page);
        }

        .cta-box {
          text-align: center;
          padding: var(--space-12) var(--space-8);
          background: var(--primary);
          border-radius: var(--radius-xl);
          color: var(--white);
        }

        .cta-box h2 {
          font-size: var(--text-3xl);
          margin-bottom: var(--space-4);
          color: var(--white);
        }

        .cta-box p {
          font-size: var(--text-lg);
          margin-bottom: var(--space-8);
          opacity: 0.9;
        }

        .cta-box .btn {
          background: var(--white);
          color: var(--primary);
          border-color: var(--white);
        }

        .cta-box .btn:hover {
          background: var(--gray-50);
          border-color: var(--gray-50);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: var(--text-3xl);
          }

          .subtitle {
            font-size: var(--text-lg);
          }

          .feature-grid {
            grid-template-columns: 1fr;
            gap: var(--space-4);
          }

          .step {
            flex-direction: column;
            gap: var(--space-3);
          }

          .cta-box {
            padding: var(--space-8) var(--space-6);
          }

          .cta-box h2 {
            font-size: var(--text-2xl);
          }
        }
      `}</style>
    </div>
  )
}

export default LandingPage
