import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'

// Eager loading for critical components
import LandingPage from './components/LandingPage'

// Lazy loading for performance optimization
const Dashboard = lazy(() => import('./components/Dashboard'))
const OnboardingFlow = lazy(() => import('./components/OnboardingFlow'))
const ScenarioSelection = lazy(() => import('./components/ScenarioSelection'))
const ScenarioPlayer = lazy(() => import('./components/ScenarioPlayer'))
const CertificateVerification = lazy(() => import('./components/CertificateVerification'))
const Help = lazy(() => import('./components/Help'))
const NotFound = lazy(() => import('./components/NotFound'))

function App({ mockAuth0 }) {
  const auth0 = mockAuth0 || useAuth0()
  const { isLoading, error, isAuthenticated, user } = auth0

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Oops... {error.message}</h2>
          <p>Please try refreshing the page or contact support if the problem persists.</p>
        </div>
        <style jsx>{`
          .error-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--color-bg-secondary);
            padding: var(--spacing-6);
          }
          
          .error-content {
            text-align: center;
            padding: var(--spacing-10);
            background: var(--color-bg-primary);
            border-radius: var(--radius-2xl);
            box-shadow: var(--shadow-xl);
            border: 1px solid var(--color-neutral-200);
            max-width: 500px;
          }
          
          .error-content h2 {
            color: var(--color-error);
            font-size: var(--font-size-title2);
            font-weight: var(--font-weight-bold);
            margin: 0 0 var(--spacing-5) 0;
          }
          
          .error-content p {
            color: var(--color-text-secondary);
            font-size: var(--font-size-body);
            margin: 0;
            line-height: 1.6;
          }
        `}</style>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    user?.user_metadata?.onboarding_completed ? (
                      <Dashboard />
                    ) : (
                      <OnboardingFlow />
                    )
                  ) : (
                    <LandingPage />
                  )
                }
              />
              <Route path="/onboarding" element={<OnboardingFlow />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scenarios" element={<ScenarioSelection />} />
              <Route path="/scenario/:scenarioId" element={<ScenarioPlayer />} />
              <Route path="/verify/:certificateId" element={<CertificateVerification />} />
              <Route path="/help" element={<Help />} />
              {/* 404 Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App