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
    <div className="landing-page">
      {/* Navigation */}
      <nav className="nav">
        <div className="container">
          <div className="nav-content">
            <h2 className="logo">PromptMaster</h2>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => loginWithRedirect()}
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge badge-primary">For Business Professionals</span>
            </div>
            <h1 className="hero-title">
              Master AI Prompt Engineering<br />
              <span className="hero-gradient">For Real Business Impact</span>
            </h1>
            <p className="hero-subtitle">
              Learn to write effective AI prompts through 50+ realistic business scenarios.
              Designed for finance leaders, SMB owners, and busy professionals.
            </p>
            <div className="hero-cta">
              <button
                className="btn btn-primary btn-xl"
                onClick={handleLogin}
              >
                Start Learning Free
              </button>
              <p className="hero-note">No credit card required • 50 practical scenarios</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Makes This Different</h2>
            <p className="section-subtitle">Premium training designed for professionals who value their time</p>
          </div>
          <div className="feature-grid">
            <div className="feature-card card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="feature-title">Real Business Scenarios</h3>
              <p className="feature-description">
                Practice with actual business tasks: budget analysis, risk assessment,
                customer communication, and strategic planning.
              </p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon-wrapper feature-icon-navy">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="feature-title">Instant AI Feedback</h3>
              <p className="feature-description">
                Get detailed, personalized feedback on every prompt you write.
                Learn what works and why, powered by Claude AI.
              </p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon-wrapper feature-icon-teal">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="feature-title">Professional Certification</h3>
              <p className="feature-description">
                Earn a verified certificate upon completion.
                Showcase your AI skills on LinkedIn and in your professional network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container-sm">
          <div className="section-header">
            <h2 className="section-title">Simple, Focused Learning</h2>
            <p className="section-subtitle">Master prompt engineering in three clear steps</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3 className="step-title">Choose Your Scenario</h3>
                <p className="step-description">
                  Select from 50 business scenarios across 4 modules:
                  Foundation, Intermediate, Advanced, and Expert.
                </p>
              </div>
            </div>

            <div className="step-connector"></div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3 className="step-title">Write Your Prompt</h3>
                <p className="step-description">
                  Practice in a distraction-free environment with clear context
                  and success criteria for each task.
                </p>
              </div>
            </div>

            <div className="step-connector"></div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3 className="step-title">Get Expert Feedback</h3>
                <p className="step-description">
                  Receive detailed analysis with strengths, improvements,
                  and an improved example of your prompt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="social-proof">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Business Scenarios</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">4</div>
              <div className="stat-label">Skill Modules</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">10+</div>
              <div className="stat-label">Achievement Badges</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Practical Focus</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="container-sm">
          <div className="cta-card card-navy">
            <h2 className="cta-title">Ready to Level Up Your AI Skills?</h2>
            <p className="cta-description">
              Join business professionals mastering prompt engineering.
              Start learning today with practical, ROI-focused training.
            </p>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleLogin}
            >
              Start Learning Free
            </button>
            <p className="cta-note">Get started in under 60 seconds</p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          background: linear-gradient(180deg,
            var(--gray-900) 0%,
            var(--navy-900) 100%
          );
        }

        /* Navigation */
        .nav {
          position: sticky;
          top: 0;
          background: rgba(26, 26, 26, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          padding: var(--space-4) 0;
          z-index: var(--z-sticky);
        }

        .nav-content {
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

        /* Hero Section */
        .hero {
          padding: var(--space-20) 0;
          position: relative;
        }

        .hero-content {
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
        }

        .hero-badge {
          margin-bottom: var(--space-6);
          animation: slideDown 0.6s ease-out;
        }

        .hero-title {
          font-size: var(--text-5xl);
          font-weight: var(--font-bold);
          line-height: var(--leading-tight);
          color: var(--text-primary);
          margin: 0 0 var(--space-6) 0;
          animation: slideUp 0.6s ease-out 0.1s both;
        }

        .hero-gradient {
          background: linear-gradient(135deg, var(--orange-500), var(--orange-400));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: var(--text-xl);
          line-height: var(--leading-relaxed);
          color: var(--text-secondary);
          margin: 0 auto var(--space-8);
          max-width: 700px;
          animation: slideUp 0.6s ease-out 0.2s both;
        }

        .hero-cta {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
          animation: slideUp 0.6s ease-out 0.3s both;
        }

        .hero-note {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
          margin: 0;
        }

        /* Features Section */
        .features {
          padding: var(--space-20) 0;
          background: var(--gray-900);
        }

        .section-header {
          text-align: center;
          margin-bottom: var(--space-12);
        }

        .section-title {
          font-size: var(--text-4xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin: 0 0 var(--space-4) 0;
        }

        .section-subtitle {
          font-size: var(--text-lg);
          color: var(--text-secondary);
          margin: 0;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--space-6);
        }

        .feature-card {
          text-align: center;
          padding: var(--space-8);
          transition: all var(--transition-base);
        }

        .feature-card:hover {
          transform: translateY(-4px);
        }

        .feature-icon-wrapper {
          width: 64px;
          height: 64px;
          margin: 0 auto var(--space-5);
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--accent-light);
          border-radius: var(--border-radius-lg);
          color: var(--accent-primary);
        }

        .feature-icon-navy {
          background: var(--navy-100);
          color: var(--navy-400);
        }

        .feature-icon-teal {
          background: var(--teal-100);
          color: var(--teal-500);
        }

        .feature-icon {
          width: 32px;
          height: 32px;
        }

        .feature-title {
          font-size: var(--text-xl);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin: 0 0 var(--space-3) 0;
        }

        .feature-description {
          font-size: var(--text-base);
          line-height: var(--leading-relaxed);
          color: var(--text-secondary);
          margin: 0;
        }

        /* How It Works */
        .how-it-works {
          padding: var(--space-20) 0;
          background: linear-gradient(180deg,
            var(--gray-900) 0%,
            var(--navy-900) 100%
          );
        }

        .steps {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
          max-width: 600px;
          margin: 0 auto;
        }

        .step {
          display: flex;
          gap: var(--space-5);
          align-items: flex-start;
        }

        .step-number {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--orange-600), var(--orange-500));
          color: var(--text-on-orange);
          border-radius: var(--border-radius-full);
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
          box-shadow: var(--shadow-md);
        }

        .step-connector {
          width: 2px;
          height: var(--space-6);
          background: linear-gradient(180deg,
            var(--orange-600),
            transparent
          );
          margin: 0 0 0 23px;
        }

        .step-content {
          flex: 1;
        }

        .step-title {
          font-size: var(--text-xl);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin: 0 0 var(--space-2) 0;
        }

        .step-description {
          font-size: var(--text-base);
          line-height: var(--leading-relaxed);
          color: var(--text-secondary);
          margin: 0;
        }

        /* Social Proof */
        .social-proof {
          padding: var(--space-16) 0;
          background: var(--gray-900);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-6);
        }

        .stat-card {
          text-align: center;
          padding: var(--space-6);
        }

        .stat-number {
          font-size: var(--text-5xl);
          font-weight: var(--font-bold);
          background: linear-gradient(135deg, var(--orange-500), var(--orange-400));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--space-2);
        }

        .stat-label {
          font-size: var(--text-base);
          color: var(--text-secondary);
        }

        /* Final CTA */
        .final-cta {
          padding: var(--space-20) 0;
        }

        .cta-card {
          text-align: center;
          padding: var(--space-12);
          background: var(--bg-navy);
          border: 1px solid var(--navy-600);
          box-shadow: var(--shadow-xl);
        }

        .cta-title {
          font-size: var(--text-4xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin: 0 0 var(--space-4) 0;
        }

        .cta-description {
          font-size: var(--text-lg);
          line-height: var(--leading-relaxed);
          color: var(--text-secondary);
          margin: 0 0 var(--space-8) 0;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-note {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
          margin-top: var(--space-3);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero {
            padding: var(--space-12) 0;
          }

          .hero-title {
            font-size: var(--text-3xl);
          }

          .hero-subtitle {
            font-size: var(--text-lg);
          }

          .section-title {
            font-size: var(--text-3xl);
          }

          .feature-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .cta-title {
            font-size: var(--text-2xl);
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: var(--text-2xl);
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default LandingPage
