import React, { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { createUserProfile } from '../services/userService'

const OnboardingFlow = () => {
  const { user, getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    role: '',
    experience: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const roles = [
    { value: 'CFO', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )},
    { value: 'VP Finance', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )},
    { value: 'Finance Director', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )},
    { value: 'Finance Manager', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )},
    { value: 'Financial Analyst', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
    { value: 'Other', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )}
  ]

  const experienceLevels = [
    {
      value: 'beginner',
      label: 'New to AI',
      description: 'Just getting started with AI tools',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      value: 'intermediate',
      label: 'Some Experience',
      description: 'Used AI tools a few times',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      value: 'advanced',
      label: 'Experienced User',
      description: 'Regularly use AI in my workflow',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const canProceed = () => {
    if (currentStep === 1) return formData.role
    if (currentStep === 2) return formData.experience
    return true
  }

  const handleNext = () => {
    if (canProceed()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleFinish = async () => {
    try {
      setIsSubmitting(true)
      const token = await getAccessTokenSilently()

      // Create user profile with collected data
      await createUserProfile({
        userId: user.sub,
        email: user.email,
        name: user.name,
        role: formData.role,
        skillLevel: formData.experience,
        completedScenarios: [],
        currentLevel: formData.experience,
        totalPoints: 0,
        achievements: []
      }, token)

      // Navigate to dashboard
      navigate('/dashboard')
    } catch (error) {
      console.error('Error creating user profile:', error)
      setIsSubmitting(false)
      // Still navigate to dashboard even if profile creation fails
      navigate('/dashboard')
    }
  }

  const experienceLabel = experienceLevels.find(e => e.value === formData.experience)?.label || formData.experience

  return (
    <div className="onboarding">
      <div className="container-sm">
        <div className="onboarding-card card-navy">
          {/* Logo */}
          <div className="onboarding-logo">
            <h1 className="logo-text">PromptMaster</h1>
            <p className="logo-subtitle">Professional AI Training</p>
          </div>

          {/* Progress Indicator */}
          <div className="progress-track">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(currentStep / 3) * 100}%` }} />
            </div>
            <div className="progress-steps">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`progress-dot ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
                >
                  {currentStep > step ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="dot-icon">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="step-content">
            {currentStep === 1 && (
              <div className="form-step">
                <div className="step-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="step-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h2 className="step-title">What's your role?</h2>
                  <p className="step-description">
                    We'll tailor scenarios to match your position and responsibilities
                  </p>
                </div>
                <div className="role-grid">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      className={`role-card ${formData.role === role.value ? 'selected' : ''}`}
                      onClick={() => handleInputChange('role', role.value)}
                    >
                      <div className="role-icon">{role.icon}</div>
                      <div className="role-label">{role.value}</div>
                      {formData.role === role.value && (
                        <div className="selected-check">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-step">
                <div className="step-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="step-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h2 className="step-title">AI experience level?</h2>
                  <p className="step-description">
                    We'll adjust the difficulty and provide appropriate guidance
                  </p>
                </div>
                <div className="experience-list">
                  {experienceLevels.map((level) => (
                    <button
                      key={level.value}
                      className={`experience-card ${formData.experience === level.value ? 'selected' : ''}`}
                      onClick={() => handleInputChange('experience', level.value)}
                    >
                      <div className="experience-icon">{level.icon}</div>
                      <div className="experience-content">
                        <div className="experience-label">{level.label}</div>
                        <div className="experience-description">{level.description}</div>
                      </div>
                      {formData.experience === level.value && (
                        <div className="selected-check">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="form-step welcome-step">
                <div className="welcome-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="step-title">You're All Set!</h2>
                <p className="step-description">
                  Ready to master AI prompt engineering with 50+ realistic business scenarios
                </p>
                <div className="summary-card">
                  <div className="summary-item">
                    <div className="summary-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="summary-content">
                      <div className="summary-label">Role</div>
                      <div className="summary-value">{formData.role}</div>
                    </div>
                  </div>
                  <div className="summary-divider" />
                  <div className="summary-item">
                    <div className="summary-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="summary-content">
                      <div className="summary-label">Experience Level</div>
                      <div className="summary-value">{experienceLabel}</div>
                    </div>
                  </div>
                </div>

                <div className="welcome-features">
                  <div className="feature-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="feature-icon">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>50+ Real Business Scenarios</span>
                  </div>
                  <div className="feature-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="feature-icon">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Instant AI-Powered Feedback</span>
                  </div>
                  <div className="feature-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="feature-icon">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Professional Certification</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="step-actions">
            {currentStep > 1 && currentStep < 3 && (
              <button className="btn btn-secondary btn-lg" onClick={handleBack}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="btn-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            )}
            {currentStep < 3 && (
              <button
                className="btn btn-primary btn-lg"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Continue
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="btn-icon btn-icon-right">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            )}
            {currentStep === 3 && (
              <button
                className="btn btn-primary btn-lg btn-block"
                onClick={handleFinish}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="btn-spinner" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Setting up your account...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="btn-icon">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Start Learning
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .onboarding {
          min-height: 100vh;
          background: linear-gradient(180deg,
            var(--gray-900) 0%,
            var(--navy-900) 100%
          );
          display: flex;
          align-items: center;
          padding: var(--space-8) var(--space-4);
        }

        .onboarding-card {
          padding: var(--space-10);
          max-width: 700px;
          margin: 0 auto;
        }

        /* Logo */
        .onboarding-logo {
          text-align: center;
          margin-bottom: var(--space-10);
        }

        .logo-text {
          font-size: var(--text-4xl);
          font-weight: var(--font-bold);
          background: linear-gradient(135deg, var(--orange-500), var(--orange-600));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 var(--space-2) 0;
        }

        .logo-subtitle {
          font-size: var(--text-base);
          color: var(--text-tertiary);
          margin: 0;
          font-weight: var(--font-medium);
        }

        /* Progress Track */
        .progress-track {
          margin-bottom: var(--space-10);
          position: relative;
        }

        .progress-bar {
          height: 4px;
          background: var(--border-color);
          border-radius: var(--border-radius-full);
          overflow: hidden;
          margin-bottom: var(--space-4);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--orange-600), var(--orange-400));
          border-radius: var(--border-radius-full);
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .progress-steps {
          display: flex;
          justify-content: space-between;
        }

        .progress-dot {
          width: 40px;
          height: 40px;
          border-radius: var(--border-radius-full);
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--font-bold);
          font-size: var(--text-base);
          color: var(--text-tertiary);
          transition: all var(--transition-base);
        }

        .progress-dot.active {
          background: linear-gradient(135deg, var(--orange-600), var(--orange-500));
          border-color: var(--orange-500);
          color: var(--text-on-orange);
          box-shadow: var(--shadow-md), var(--glow-orange-sm);
        }

        .progress-dot.completed {
          background: var(--teal-600);
          border-color: var(--teal-500);
          color: white;
        }

        .dot-icon {
          width: 20px;
          height: 20px;
        }

        /* Step Content */
        .step-content {
          margin-bottom: var(--space-8);
          min-height: 400px;
        }

        .form-step {
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .step-header {
          text-align: center;
          margin-bottom: var(--space-8);
        }

        .step-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto var(--space-4);
          color: var(--orange-500);
        }

        .step-title {
          font-size: var(--text-3xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin: 0 0 var(--space-3) 0;
        }

        .step-description {
          font-size: var(--text-base);
          color: var(--text-secondary);
          margin: 0;
          line-height: var(--leading-relaxed);
        }

        /* Role Grid */
        .role-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
        }

        .role-card {
          position: relative;
          padding: var(--space-5);
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          cursor: pointer;
          transition: all var(--transition-base);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
        }

        .role-card:hover {
          border-color: var(--orange-500);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .role-card.selected {
          border-color: var(--orange-500);
          background: linear-gradient(135deg, rgba(233, 81, 10, 0.1), rgba(233, 81, 10, 0.05));
          box-shadow: var(--shadow-md), var(--glow-orange-sm);
        }

        .role-icon {
          width: 32px;
          height: 32px;
          color: var(--orange-500);
        }

        .role-icon svg {
          width: 100%;
          height: 100%;
        }

        .role-label {
          font-size: var(--text-base);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          text-align: center;
        }

        .selected-check {
          position: absolute;
          top: var(--space-2);
          right: var(--space-2);
          width: 24px;
          height: 24px;
          background: var(--teal-600);
          border-radius: var(--border-radius-full);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .selected-check svg {
          width: 14px;
          height: 14px;
        }

        /* Experience List */
        .experience-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .experience-card {
          position: relative;
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-5);
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          cursor: pointer;
          transition: all var(--transition-base);
          text-align: left;
        }

        .experience-card:hover {
          border-color: var(--orange-500);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .experience-card.selected {
          border-color: var(--orange-500);
          background: linear-gradient(135deg, rgba(233, 81, 10, 0.1), rgba(233, 81, 10, 0.05));
          box-shadow: var(--shadow-md), var(--glow-orange-sm);
        }

        .experience-icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          color: var(--orange-500);
        }

        .experience-icon svg {
          width: 100%;
          height: 100%;
        }

        .experience-content {
          flex: 1;
        }

        .experience-label {
          font-size: var(--text-lg);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin-bottom: var(--space-1);
        }

        .experience-description {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
        }

        /* Welcome Step */
        .welcome-step {
          text-align: center;
        }

        .welcome-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto var(--space-6);
          background: linear-gradient(135deg, var(--teal-600), var(--teal-500));
          border-radius: var(--border-radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: var(--shadow-lg), 0 0 40px rgba(20, 184, 166, 0.3);
        }

        .welcome-icon svg {
          width: 48px;
          height: 48px;
        }

        .summary-card {
          padding: var(--space-6);
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          margin: var(--space-8) 0;
        }

        .summary-item {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-3);
        }

        .summary-icon {
          width: 40px;
          height: 40px;
          color: var(--orange-500);
          flex-shrink: 0;
        }

        .summary-icon svg {
          width: 100%;
          height: 100%;
        }

        .summary-content {
          flex: 1;
          text-align: left;
        }

        .summary-label {
          font-size: var(--text-xs);
          font-weight: var(--font-semibold);
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: var(--space-1);
        }

        .summary-value {
          font-size: var(--text-lg);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
        }

        .summary-divider {
          height: 1px;
          background: var(--border-color);
          margin: var(--space-2) 0;
        }

        .welcome-features {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          margin-top: var(--space-6);
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-size: var(--text-base);
          color: var(--text-secondary);
        }

        .feature-icon {
          width: 20px;
          height: 20px;
          color: var(--teal-500);
          flex-shrink: 0;
        }

        /* Step Actions */
        .step-actions {
          display: flex;
          gap: var(--space-4);
          justify-content: center;
          padding-top: var(--space-6);
          border-top: 1px solid var(--border-color);
        }

        .step-actions .btn {
          min-width: 140px;
        }

        .btn-icon {
          width: 18px;
          height: 18px;
          margin-right: var(--space-2);
        }

        .btn-icon-right {
          margin-right: 0;
          margin-left: var(--space-2);
        }

        .btn-spinner {
          width: 18px;
          height: 18px;
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

        /* Responsive */
        @media (max-width: 768px) {
          .onboarding {
            padding: var(--space-4);
          }

          .onboarding-card {
            padding: var(--space-6);
          }

          .logo-text {
            font-size: var(--text-3xl);
          }

          .step-title {
            font-size: var(--text-2xl);
          }

          .role-grid {
            grid-template-columns: 1fr;
          }

          .step-actions {
            flex-direction: column;
          }

          .step-actions .btn {
            width: 100%;
            min-width: auto;
          }
        }

        @media (max-width: 480px) {
          .progress-dot {
            width: 32px;
            height: 32px;
            font-size: var(--text-sm);
          }

          .dot-icon {
            width: 16px;
            height: 16px;
          }

          .step-content {
            min-height: 350px;
          }
        }
      `}</style>
    </div>
  )
}

export default OnboardingFlow
