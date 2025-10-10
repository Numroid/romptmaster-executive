import React from 'react'

// Simple development wrapper that bypasses Auth0 for testing
const DevModeWrapper = ({ children }) => {
  const isDev = import.meta.env.VITE_DEV_MODE === 'true'
  
  if (isDev) {
    // Mock Auth0 context for development
    const mockAuth0Context = {
      isLoading: false,
      error: null,
      isAuthenticated: true,
      user: {
        name: 'Test User',
        email: 'test@example.com',
        user_metadata: {
          onboarding_completed: true
        }
      },
      logout: () => console.log('Mock logout'),
      loginWithRedirect: () => console.log('Mock login')
    }

    return (
      <div>
        <div style={{
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          padding: '8px 16px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#92400e'
        }}>
          🚧 Development Mode - Auth0 Bypassed for Testing
        </div>
        {React.cloneElement(children, { mockAuth0: mockAuth0Context })}
      </div>
    )
  }

  return children
}

export default DevModeWrapper