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
    'CFO',
    'VP Finance',
    'Finance Director',
    'Finance Manager',
    'Financial Analyst',
    'Other'
  ]

  const experienceLevels = [
    { value: 'beginner', label: 'New to AI' },
    { value: 'intermediate', label: 'Some experience' },
    { value: 'advanced', label: 'Experienced user' }
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

  return (
    <div className="onboarding">
      <div className="container-sm">
        <div className="onboarding-card">
          {/* Progress Steps */}
          <div className="steps-indicator">
            <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <div className="step-circle">1</div>
              <div className="step-label">Role</div>
            </div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <div className="step-circle">2</div>
              <div className="step-label">Experience</div>
            </div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-circle">3</div>
              <div className="step-label">Ready</div>
            </div>
          </div>

          {/* Step Content */}
          <div className="step-content">
            {currentStep === 1 && (
              <div className="form-step">
                <h2>What's your role?</h2>
                <p className="step-description">Help us personalize your learning experience</p>
                <div className="role-grid">
                  {roles.map((role) => (
                    <button
                      key={role}
                      className={`role-button ${formData.role === role ? 'selected' : ''}`}
                      onClick={() => handleInputChange('role', role)}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-step">
                <h2>AI experience level?</h2>
                <p className="step-description">We'll adjust the difficulty accordingly</p>
                <div className="experience-list">
                  {experienceLevels.map((level) => (
                    <button
                      key={level.value}
                      className={`experience-button ${formData.experience === level.value ? 'selected' : ''}`}
                      onClick={() => handleInputChange('experience', level.value)}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="form-step welcome-step">
                <div className="welcome-icon">🎉</div>
                <h2>You're all set!</h2>
                <p className="step-description">
                  Ready to start learning prompt engineering with realistic business scenarios
                </p>
                <div className="summary">
                  <div className="summary-item">
                    <span className="summary-label">Role:</span>
                    <span className="summary-value">{formData.role}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Experience:</span>
                    <span className="summary-value">{formData.experience}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="step-actions">
            {currentStep > 1 && currentStep < 3 && (
              <button className="btn btn-secondary" onClick={handleBack}>
                Back
              </button>
            )}
            {currentStep < 3 && (
              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Continue
              </button>
            )}
            {currentStep === 3 && (
              <button
                className="btn btn-primary btn-lg"
                onClick={handleFinish}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Setting up...' : 'Start Learning'}
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .onboarding {
          min-height: 100vh;
          background: var(--bg-page);
          display: flex;
          align-items: center;
          padding: var(--space-8) 0;
        }

        .onboarding-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          padding: var(--space-8);
          box-shadow: var(--shadow-lg);
          max-width: 600px;
          margin: 0 auto;
        }

        /* Steps Indicator */
        .steps-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-12);
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
        }

        .step-circle {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          background: var(--gray-200);
          color: var(--text-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--font-bold);
          transition: var(--transition);
        }

        .step.active .step-circle {
          background: var(--primary);
          color: var(--white);
        }

        .step.completed .step-circle {
          background: var(--secondary);
          color: var(--white);
        }

        .step-label {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          font-weight: var(--font-medium);
        }

        .step.active .step-label {
          color: var(--text-primary);
        }

        .step-line {
          width: 60px;
          height: 2px;
          background: var(--gray-200);
          margin: 0 var(--space-2);
        }

        /* Step Content */
        .step-content {
          margin-bottom: var(--space-8);
        }

        .form-step {
          text-align: center;
        }

        .form-step h2 {
          font-size: var(--text-3xl);
          margin-bottom: var(--space-3);
          color: var(--text-primary);
        }

        .step-description {
          font-size: var(--text-base);
          color: var(--text-secondary);
          margin-bottom: var(--space-8);
        }

        /* Role Grid */
        .role-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-3);
        }

        .role-button {
          padding: var(--space-4);
          border: 2px solid var(--gray-300);
          background: var(--white);
          border-radius: var(--radius);
          font-size: var(--text-base);
          font-weight: var(--font-medium);
          color: var(--text-primary);
          cursor: pointer;
          transition: var(--transition);
        }

        .role-button:hover {
          border-color: var(--primary);
        }

        .role-button.selected {
          border-color: var(--primary);
          background: var(--primary-light);
          color: var(--primary);
        }

        /* Experience List */
        .experience-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .experience-button {
          padding: var(--space-4);
          border: 2px solid var(--gray-300);
          background: var(--white);
          border-radius: var(--radius);
          font-size: var(--text-base);
          font-weight: var(--font-medium);
          color: var(--text-primary);
          cursor: pointer;
          transition: var(--transition);
          text-align: left;
        }

        .experience-button:hover {
          border-color: var(--primary);
        }

        .experience-button.selected {
          border-color: var(--primary);
          background: var(--primary-light);
          color: var(--primary);
        }

        /* Welcome Step */
        .welcome-step {
          padding: var(--space-8) 0;
        }

        .welcome-icon {
          font-size: 4rem;
          margin-bottom: var(--space-4);
        }

        .summary {
          margin-top: var(--space-8);
          padding: var(--space-6);
          background: var(--gray-50);
          border-radius: var(--radius);
          text-align: left;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--space-3);
        }

        .summary-item:last-child {
          margin-bottom: 0;
        }

        .summary-label {
          font-weight: var(--font-medium);
          color: var(--text-secondary);
        }

        .summary-value {
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          text-transform: capitalize;
        }

        /* Step Actions */
        .step-actions {
          display: flex;
          gap: var(--space-3);
          justify-content: center;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .onboarding-card {
            padding: var(--space-6);
          }

          .form-step h2 {
            font-size: var(--text-2xl);
          }

          .role-grid {
            grid-template-columns: 1fr;
          }

          .step-line {
            width: 40px;
          }
        }
      `}</style>
    </div>
  )
}

export default OnboardingFlow
