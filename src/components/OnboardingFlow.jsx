import React, { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { createUserProfile } from '../services/userService'
import InteractiveDemo from './InteractiveDemo'

const OnboardingFlow = () => {
  const { user, getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [showDemo, setShowDemo] = useState(false)
  const [formData, setFormData] = useState({
    role: '',
    companySize: '',
    industry: '',
    experience: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const roles = [
    { value: 'CFO', label: 'Chief Financial Officer' },
    { value: 'VP Finance', label: 'VP Finance' },
    { value: 'Finance Director', label: 'Finance Director' },
    { value: 'Finance Manager', label: 'Finance Manager' },
    { value: 'Senior Analyst', label: 'Senior Financial Analyst' },
    { value: 'Analyst', label: 'Financial Analyst' },
    { value: 'Other', label: 'Other Finance Role' }
  ]

  const companySizes = [
    { value: '<100', label: 'Startup (< 100 employees)' },
    { value: '100-1000', label: 'Small Business (100-1,000 employees)' },
    { value: '1000-10000', label: 'Mid-Market (1,000-10,000 employees)' },
    { value: '10000+', label: 'Enterprise (10,000+ employees)' }
  ]

  const industries = [
    { value: 'Technology', label: 'Technology' },
    { value: 'Financial Services', label: 'Financial Services' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Consulting', label: 'Consulting' },
    { value: 'Other', label: 'Other' }
  ]

  const experienceLevels = [
    { value: 'Beginner', label: 'New to AI tools (0-6 months)' },
    { value: 'Some Experience', label: 'Some experience (6 months - 2 years)' },
    { value: 'Experienced', label: 'Experienced user (2+ years)' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStartDemo = () => {
    setShowDemo(true)
  }

  const handleDemoComplete = () => {
    setShowDemo(false)
    setCurrentStep(3) // Go to final step after demo
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const token = await getAccessTokenSilently()
      
      const profileData = {
        auth0Id: user.sub,
        email: user.email,
        name: user.name,
        role: formData.role,
        companySize: formData.companySize,
        industry: formData.industry,
        aiExperience: formData.experience,
        onboardingCompleted: true
      }

      await createUserProfile(profileData, token)
      navigate('/dashboard')
    } catch (error) {
      console.error('Error creating user profile:', error)
      // Handle error - show message to user
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.role && formData.companySize
      case 2:
        return formData.industry && formData.experience
      case 3:
        return true // Demo completed, ready to finish
      default:
        return false
    }
  }

  if (showDemo) {
    return (
      <div className="onboarding-container">
        <div className="container">
          <InteractiveDemo onComplete={handleDemoComplete} />
        </div>
      </div>
    )
  }

  return (
    <div className="onboarding-container" data-testid="onboarding">
      <div className="container">
        <div className="onboarding-card">
          <div className="progress-bar">
            <div className="progress-steps">
              {[1, 2, 3].map(step => (
                <div 
                  key={step}
                  className={`step ${currentStep >= step ? 'active' : ''}`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="progress-line">
              <div 
                className="progress-fill"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              />
            </div>
          </div>

          <div className="step-content">
            {currentStep === 1 && (
              <div className="step-1">
                <h2>Welcome to PromptMaster Executive!</h2>
                <p>Let's personalize your learning experience. First, tell us about your role.</p>
                
                <div className="form-group">
                  <label className="form-label">Your Role</label>
                  <select 
                    className="form-select"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                  >
                    <option value="">Select your role</option>
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Company Size</label>
                  <select 
                    className="form-select"
                    value={formData.companySize}
                    onChange={(e) => handleInputChange('companySize', e.target.value)}
                  >
                    <option value="">Select company size</option>
                    {companySizes.map(size => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="step-2">
                <h2>Tell us more about your background</h2>
                <p>This helps us customize scenarios to your industry and experience level.</p>
                
                <div className="form-group">
                  <label className="form-label">Industry</label>
                  <select 
                    className="form-select"
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                  >
                    <option value="">Select your industry</option>
                    {industries.map(industry => (
                      <option key={industry.value} value={industry.value}>
                        {industry.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">AI Experience Level</label>
                  <select 
                    className="form-select"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                  >
                    <option value="">Select your experience level</option>
                    {experienceLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.industry && formData.experience && (
                  <div className="demo-preview">
                    <h4>Ready for a quick demo?</h4>
                    <p>See how prompt engineering can transform your business communications with a 2-minute interactive demo using real budget analysis.</p>
                    <ul>
                      <li>🎯 Experience a realistic business scenario</li>
                      <li>📝 See the difference between good and poor prompts</li>
                      <li>⚡ Get immediate, actionable AI responses</li>
                      <li>💡 Learn techniques you can use right away</li>
                    </ul>
                    <p className="demo-time">⏱️ Takes just 2 minutes</p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="step-3">
                <h2>🎉 Welcome to PromptMaster Executive!</h2>
                <p>You've completed the demo and seen the power of effective prompt engineering. Ready to start your learning journey?</p>
                
                <div className="completion-summary">
                  <div className="demo-completed">
                    <h4>✅ Demo Completed</h4>
                    <p>You experienced how proper prompts can save 40+ minutes per analysis</p>
                  </div>

                  <div className="next-steps-preview">
                    <h4>🚀 What's Next</h4>
                    <ul>
                      <li>Access 5 core business scenarios</li>
                      <li>Track your progress and skill development</li>
                      <li>Earn achievements as you master new techniques</li>
                      <li>Get 2 scenarios completely free</li>
                    </ul>
                  </div>

                  <div className="time-commitment">
                    <h4>⏱️ Time Investment</h4>
                    <p>Just 10 minutes per day • See results in your first week</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="step-actions">
            {currentStep > 1 && (
              <button 
                className="btn btn-secondary"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                Back
              </button>
            )}
            
            {currentStep < 2 ? (
              <button 
                className="btn btn-primary"
                onClick={handleNext}
                disabled={!isStepValid()}
              >
                Next
              </button>
            ) : currentStep === 2 ? (
              <button 
                className="btn btn-primary"
                onClick={handleStartDemo}
                disabled={!isStepValid()}
              >
                Try the Demo →
              </button>
            ) : (
              <button 
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Setting up your account...' : 'Start Learning'}
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .onboarding-container {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          display: flex;
          align-items: center;
          padding: var(--spacing-9) 0;
          position: relative;
          overflow: hidden;
        }

        .onboarding-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .onboarding-card {
          background: var(--color-bg-primary);
          border-radius: var(--radius-3xl);
          padding: var(--spacing-9);
          max-width: 640px;
          margin: 0 auto;
          box-shadow: var(--shadow-2xl);
          border: 1px solid var(--color-neutral-200);
          position: relative;
          z-index: 2;
          animation: scaleIn var(--duration-slow) var(--ease-spring);
        }

        .progress-bar {
          margin-bottom: var(--spacing-9);
          position: relative;
        }

        .progress-steps {
          display: flex;
          justify-content: space-between;
          position: relative;
          z-index: 2;
        }

        .step {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-full);
          background: var(--color-neutral-200);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--font-weight-semibold);
          font-size: var(--font-size-body);
          color: var(--color-text-tertiary);
          transition: all var(--duration-normal) var(--ease-out);
          box-shadow: var(--shadow-sm);
        }

        .step.active {
          background: var(--color-primary);
          color: white;
          transform: scale(1.1);
          box-shadow: var(--shadow-md);
        }

        .progress-line {
          position: absolute;
          top: 50%;
          left: 24px;
          right: 24px;
          height: 3px;
          background: var(--color-neutral-200);
          transform: translateY(-50%);
          z-index: 1;
          border-radius: var(--radius-full);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
          transition: width var(--duration-slow) var(--ease-out);
          border-radius: var(--radius-full);
          position: relative;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shimmer 2s infinite;
          border-radius: var(--radius-full);
        }

        .step-content {
          margin-bottom: var(--spacing-9);
        }

        .step-content h2 {
          margin-bottom: var(--spacing-4);
          color: var(--color-text-primary);
          font-size: var(--font-size-title1);
          font-weight: var(--font-weight-bold);
          letter-spacing: -0.01em;
        }

        .step-content p {
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-7);
          font-size: var(--font-size-body);
          line-height: 1.6;
        }

        .demo-preview {
          background: linear-gradient(135deg, rgba(0, 122, 255, 0.05), rgba(0, 122, 255, 0.02));
          border-radius: var(--radius-xl);
          padding: var(--spacing-7);
          margin-top: var(--spacing-7);
          border: 2px solid rgba(0, 122, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .demo-preview::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, var(--color-primary), var(--color-primary-light));
          border-radius: 0 var(--radius-small) var(--radius-small) 0;
        }

        .demo-preview h4 {
          color: var(--color-primary);
          margin-bottom: var(--spacing-5);
          font-size: var(--font-size-title3);
          font-weight: var(--font-weight-semibold);
        }

        .demo-preview ul {
          margin: var(--spacing-5) 0;
          padding-left: var(--spacing-6);
        }

        .demo-preview li {
          margin: var(--spacing-3) 0;
          color: var(--color-primary);
          font-weight: var(--font-weight-medium);
        }

        .demo-time {
          text-align: center;
          font-weight: var(--font-weight-semibold);
          color: var(--color-success);
          margin-top: var(--spacing-5);
          padding: var(--spacing-3) var(--spacing-5);
          background: rgba(52, 199, 89, 0.1);
          border-radius: var(--radius-full);
          border: 1px solid rgba(52, 199, 89, 0.2);
        }

        .completion-summary {
          display: grid;
          gap: var(--spacing-6);
          margin-top: var(--spacing-7);
        }

        .demo-completed {
          background: linear-gradient(135deg, rgba(52, 199, 89, 0.05), rgba(52, 199, 89, 0.02));
          border-radius: var(--radius-xl);
          padding: var(--spacing-6);
          border: 2px solid rgba(52, 199, 89, 0.1);
          text-align: center;
          position: relative;
        }

        .demo-completed::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--color-success);
          border-radius: 0 var(--radius-small) var(--radius-small) 0;
        }

        .demo-completed h4 {
          color: var(--color-success);
          margin-bottom: var(--spacing-3);
          font-size: var(--font-size-title3);
          font-weight: var(--font-weight-semibold);
        }

        .demo-completed p {
          color: var(--color-success);
          font-weight: var(--font-weight-medium);
        }

        .next-steps-preview {
          background: var(--color-bg-secondary);
          border-radius: var(--radius-xl);
          padding: var(--spacing-6);
          border: 2px solid var(--color-neutral-200);
          position: relative;
        }

        .next-steps-preview::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, var(--color-primary), var(--color-primary-light));
          border-radius: 0 var(--radius-small) var(--radius-small) 0;
        }

        .next-steps-preview h4 {
          color: var(--color-primary);
          margin-bottom: var(--spacing-4);
          font-size: var(--font-size-title3);
          font-weight: var(--font-weight-semibold);
        }

        .next-steps-preview ul {
          margin: 0;
          padding-left: var(--spacing-6);
        }

        .next-steps-preview li {
          margin: var(--spacing-2) 0;
          color: var(--color-text-secondary);
          font-weight: var(--font-weight-medium);
        }

        .time-commitment {
          background: linear-gradient(135deg, rgba(255, 149, 0, 0.05), rgba(255, 149, 0, 0.02));
          border-radius: var(--radius-xl);
          padding: var(--spacing-6);
          border: 2px solid rgba(255, 149, 0, 0.1);
          text-align: center;
          position: relative;
        }

        .time-commitment::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--color-warning);
          border-radius: 0 var(--radius-small) var(--radius-small) 0;
        }

        .time-commitment h4 {
          color: var(--color-warning);
          margin-bottom: var(--spacing-3);
          font-size: var(--font-size-title3);
          font-weight: var(--font-weight-semibold);
        }

        .time-commitment p {
          color: var(--color-warning);
          font-weight: var(--font-weight-semibold);
        }

        .step-actions {
          display: flex;
          justify-content: space-between;
          gap: var(--spacing-5);
        }

        .step-actions .btn {
          flex: 1;
          transition: all var(--duration-fast) var(--ease-out);
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @media (max-width: 768px) {
          .onboarding-card {
            margin: var(--spacing-6);
            padding: var(--spacing-7);
          }
          
          .step-actions {
            flex-direction: column;
          }

          .step-content h2 {
            font-size: var(--font-size-title2);
          }

          .step {
            width: 40px;
            height: 40px;
            font-size: var(--font-size-subheadline);
          }

          .progress-line {
            left: 20px;
            right: 20px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .onboarding-card {
            animation: none;
          }
          
          .progress-fill::after {
            animation: none;
          }
          
          .step.active {
            transform: none;
          }
        }
      `}</style>
    </div>
  )
}

export default OnboardingFlow