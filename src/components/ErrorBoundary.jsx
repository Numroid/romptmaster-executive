import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })

    // You can also log to an error reporting service here
    // Example: Sentry.captureException(error)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    // Optionally reload the page or navigate to home
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1>Oops! Something went wrong</h1>
            <p className="error-message">
              We're sorry, but something unexpected happened. Please try refreshing the page or going back to the dashboard.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <pre className="error-stack">
                  <strong>{this.state.error.toString()}</strong>
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="error-actions">
              <button className="btn btn-primary" onClick={this.handleReset}>
                Go to Dashboard
              </button>
              <button className="btn btn-ghost" onClick={() => window.location.reload()}>
                Refresh Page
              </button>
            </div>
          </div>

          <style jsx>{`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(180deg, var(--gray-900) 0%, var(--navy-900) 100%);
              padding: var(--space-6);
            }

            .error-container {
              max-width: 600px;
              width: 100%;
              background: var(--bg-secondary);
              border: 1px solid var(--border-color);
              border-radius: var(--border-radius-xl);
              padding: var(--space-10);
              text-align: center;
            }

            .error-icon {
              width: 80px;
              height: 80px;
              margin: 0 auto var(--space-6);
              color: var(--orange-500);
            }

            .error-icon svg {
              width: 100%;
              height: 100%;
            }

            h1 {
              font-size: var(--text-3xl);
              font-weight: var(--font-bold);
              color: var(--text-primary);
              margin: 0 0 var(--space-4) 0;
            }

            .error-message {
              font-size: var(--text-base);
              color: var(--text-secondary);
              line-height: var(--leading-relaxed);
              margin: 0 0 var(--space-8) 0;
            }

            .error-details {
              margin: var(--space-6) 0;
              text-align: left;
              background: var(--gray-900);
              border: 1px solid var(--border-color);
              border-radius: var(--border-radius);
              padding: var(--space-4);
            }

            .error-details summary {
              cursor: pointer;
              font-size: var(--text-sm);
              font-weight: var(--font-semibold);
              color: var(--text-secondary);
              padding: var(--space-2);
              user-select: none;
            }

            .error-details summary:hover {
              color: var(--text-primary);
            }

            .error-stack {
              margin: var(--space-4) 0 0 0;
              padding: var(--space-4);
              background: var(--gray-950);
              border-radius: var(--border-radius);
              font-size: var(--text-xs);
              color: var(--orange-400);
              overflow-x: auto;
              white-space: pre-wrap;
              word-wrap: break-word;
            }

            .error-actions {
              display: flex;
              gap: var(--space-4);
              justify-content: center;
              flex-wrap: wrap;
            }

            @media (max-width: 768px) {
              .error-container {
                padding: var(--space-6);
              }

              h1 {
                font-size: var(--text-2xl);
              }

              .error-icon {
                width: 60px;
                height: 60px;
              }

              .error-actions {
                flex-direction: column;
              }

              .error-actions button {
                width: 100%;
              }
            }
          `}</style>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
