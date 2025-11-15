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
    <div className="landing-page page-entrance-bg">
      {/* Navigation */}
      <nav className="nav page-entrance-nav">
        <div className="container">
          <div className="nav-content">
            <h2 className="logo">PromptMaster</h2>
            <button
              className="btn btn-ghost btn-sm hover-lift press-effect"
              onClick={() => loginWithRedirect()}
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Atmospheric Background */}
      <section className="hero hero-bg-light texture-noise">
        <div className="container">
          <div className="hero-content">
            {/* Badge with entrance animation */}
            <div className="hero-badge hero-badge-entrance">
              <span className="badge badge-secondary">For Business Professionals</span>
            </div>

            {/* Hero Title with staggered entrance */}
            <h1 className="hero-title hero-title-entrance">
              Master AI Prompt Engineering
              <br />
              <span className="hero-gradient">For Real Business Impact</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle hero-subtitle-entrance">
              Learn to write effective AI prompts through 50+ realistic business scenarios.
              Designed for finance leaders, SMB owners, and busy professionals.
            </p>

            {/* CTA with bounce entrance */}
            <div className="hero-cta hero-cta-entrance">
              <button
                className="btn btn-primary btn-xl hover-lift-scale press-effect"
                onClick={handleLogin}
              >
                Start Learning Free
              </button>
              <p className="hero-note">No credit card required • 50 practical scenarios</p>
            </div>
          </div>
        </div>

        {/* Decorative shapes */}
        <div className="shape-circle-orange" style={{ top: '10%', left: '5%' }}></div>
        <div className="shape-circle-acid" style={{ bottom: '20%', right: '10%' }}></div>
      </section>

      {/* Features Section with Pattern Background */}
      <section className="features section pattern-dots">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Makes This Different</h2>
            <p className="section-subtitle">Premium training designed for professionals who value their time</p>
          </div>

          <div className="feature-grid">
            {/* Feature Card 1 - Orange */}
            <div className="feature-card content-cascade hover-lift-scale press-effect">
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

            {/* Feature Card 2 - Acid */}
            <div className="feature-card content-cascade hover-lift-scale press-effect">
              <div className="feature-icon-wrapper feature-icon-acid">
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

            {/* Feature Card 3 - Orange */}
            <div className="feature-card content-cascade hover-lift-scale press-effect">
              <div className="feature-icon-wrapper">
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

      {/* How It Works - Editorial Layout */}
      <section className="section section-gray">
        <div className="container" style={{ maxWidth: '700px' }}>
          <div className="section-header">
            <h2 className="section-title">Simple, Focused Learning</h2>
            <p className="section-subtitle">Master prompt engineering in three clear steps</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
            {/* Step 1 */}
            <div style={{ display: 'flex', gap: 'var(--spacing-6)', alignItems: 'flex-start' }}>
              <div style={{
                flexShrink: 0,
                width: '56px',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--orange)',
                color: 'var(--white)',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--weight-black)',
                fontFamily: 'var(--font-display)',
                boxShadow: 'var(--shadow-orange)'
              }}>
                1
              </div>
              <div style={{ flex: 1 }}>
                <h3 className="h3" style={{ marginBottom: 'var(--spacing-2)' }}>Choose Your Scenario</h3>
                <p className="text-large" style={{ color: 'var(--text-secondary)', margin: 0 }}>
                  Select from 50 business scenarios across 4 modules:
                  Foundation, Intermediate, Advanced, and Expert.
                </p>
              </div>
            </div>

            {/* Connector */}
            <div style={{
              width: '2px',
              height: 'var(--spacing-8)',
              background: 'linear-gradient(180deg, var(--orange) 0%, transparent 100%)',
              marginLeft: '27px'
            }}></div>

            {/* Step 2 */}
            <div style={{ display: 'flex', gap: 'var(--spacing-6)', alignItems: 'flex-start' }}>
              <div style={{
                flexShrink: 0,
                width: '56px',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--orange)',
                color: 'var(--white)',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--weight-black)',
                fontFamily: 'var(--font-display)',
                boxShadow: 'var(--shadow-orange)'
              }}>
                2
              </div>
              <div style={{ flex: 1 }}>
                <h3 className="h3" style={{ marginBottom: 'var(--spacing-2)' }}>Write Your Prompt</h3>
                <p className="text-large" style={{ color: 'var(--text-secondary)', margin: 0 }}>
                  Practice in a distraction-free environment with clear context
                  and success criteria for each task.
                </p>
              </div>
            </div>

            {/* Connector */}
            <div style={{
              width: '2px',
              height: 'var(--spacing-8)',
              background: 'linear-gradient(180deg, var(--orange) 0%, transparent 100%)',
              marginLeft: '27px'
            }}></div>

            {/* Step 3 */}
            <div style={{ display: 'flex', gap: 'var(--spacing-6)', alignItems: 'flex-start' }}>
              <div style={{
                flexShrink: 0,
                width: '56px',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--acid)',
                color: 'var(--black)',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--weight-black)',
                fontFamily: 'var(--font-display)',
                boxShadow: 'var(--shadow-acid)'
              }}>
                3
              </div>
              <div style={{ flex: 1 }}>
                <h3 className="h3" style={{ marginBottom: 'var(--spacing-2)' }}>Get Expert Feedback</h3>
                <p className="text-large" style={{ color: 'var(--text-secondary)', margin: 0 }}>
                  Receive detailed analysis with strengths, improvements,
                  and an improved example of your prompt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Editorial Numbers */}
      <section className="section mesh-gradient-orange">
        <div className="container">
          <div className="grid-4">
            <div className="stat">
              <div className="editorial-number">50+</div>
              <div className="stat-label">Business Scenarios</div>
            </div>
            <div className="stat">
              <div className="editorial-number">4</div>
              <div className="stat-label">Skill Modules</div>
            </div>
            <div className="stat">
              <div className="editorial-number">10+</div>
              <div className="stat-label">Achievement Badges</div>
            </div>
            <div className="stat">
              <div className="editorial-number">100%</div>
              <div className="stat-label">Practical Focus</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-lg bg-black">
        <div className="container" style={{ maxWidth: '700px', textAlign: 'center' }}>
          <h2 className="h1" style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>
            Ready to Level Up Your <span className="text-gradient">AI Skills</span>?
          </h2>
          <p className="text-large" style={{ color: 'var(--gray-200)', marginBottom: 'var(--spacing-8)' }}>
            Join business professionals mastering prompt engineering.
            Start learning today with practical, ROI-focused training.
          </p>
          <button
            className="btn btn-primary btn-xl hover-lift-scale press-effect"
            onClick={handleLogin}
            style={{ marginBottom: 'var(--spacing-3)' }}
          >
            Start Learning Free
          </button>
          <p className="text-small" style={{ color: 'var(--gray-400)', margin: 0 }}>
            Get started in under 60 seconds
          </p>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
