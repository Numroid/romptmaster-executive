import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

// Mock Auth0
const mockUseAuth0 = vi.fn()
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => mockUseAuth0(),
  Auth0Provider: ({ children }) => children
}))

// Mock components to avoid router issues in tests
vi.mock('../components/LandingPage', () => ({
  default: () => <div data-testid="landing-page">Landing Page</div>
}))

vi.mock('../components/Dashboard', () => ({
  default: () => <div data-testid="dashboard">Dashboard</div>
}))

vi.mock('../components/OnboardingFlow', () => ({
  default: () => <div data-testid="onboarding">Onboarding Flow</div>
}))

describe('App Component', () => {
  it('shows loading spinner when Auth0 is loading', () => {
    mockUseAuth0.mockReturnValue({
      isLoading: true,
      error: null,
      isAuthenticated: false,
      user: null
    })

    render(<App />)
    expect(screen.getByText('Loading PromptMaster Executive...')).toBeInTheDocument()
  })

  it('shows error message when Auth0 has error', () => {
    const errorMessage = 'Authentication failed'
    mockUseAuth0.mockReturnValue({
      isLoading: false,
      error: { message: errorMessage },
      isAuthenticated: false,
      user: null
    })

    render(<App />)
    expect(screen.getByText(`Oops... ${errorMessage}`)).toBeInTheDocument()
  })

  it('shows landing page when user is not authenticated', () => {
    mockUseAuth0.mockReturnValue({
      isLoading: false,
      error: null,
      isAuthenticated: false,
      user: null
    })

    render(<App />)
    expect(screen.getByTestId('landing-page')).toBeInTheDocument()
  })

  it('shows onboarding when user is authenticated but not onboarded', () => {
    mockUseAuth0.mockReturnValue({
      isLoading: false,
      error: null,
      isAuthenticated: true,
      user: {
        sub: 'auth0|123',
        email: 'test@example.com',
        name: 'Test User',
        user_metadata: {}
      }
    })

    render(<App />)
    expect(screen.getByTestId('onboarding')).toBeInTheDocument()
  })

  it('shows dashboard when user is authenticated and onboarded', () => {
    mockUseAuth0.mockReturnValue({
      isLoading: false,
      error: null,
      isAuthenticated: true,
      user: {
        sub: 'auth0|123',
        email: 'test@example.com',
        name: 'Test User',
        user_metadata: {
          onboarding_completed: true
        }
      }
    })

    render(<App />)
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
  })
})