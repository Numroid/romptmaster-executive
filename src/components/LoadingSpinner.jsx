import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading PromptMaster Executive...</div>
        <div className="loading-skeleton">
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-paragraph"></div>
          <div className="skeleton skeleton-paragraph"></div>
          <div className="skeleton skeleton-paragraph" style={{ width: '80%' }}></div>
        </div>
      </div>

      <style jsx>{`
        .loading-container {
          min-height: 100vh;
          background: var(--color-bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-6);
        }

        .loading-content {
          text-align: center;
          max-width: 400px;
          width: 100%;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid var(--color-neutral-200);
          border-radius: var(--radius-full);
          border-top-color: var(--color-primary);
          animation: spin 1s ease-in-out infinite;
          margin: 0 auto var(--spacing-6) auto;
        }

        .loading-text {
          font-size: var(--font-size-title3);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-8);
          animation: pulse 2s ease-in-out infinite;
        }

        .loading-skeleton {
          background: var(--color-bg-primary);
          border-radius: var(--radius-xl);
          padding: var(--spacing-7);
          box-shadow: var(--shadow-base);
          border: 1px solid var(--color-neutral-200);
        }

        .skeleton {
          background: linear-gradient(90deg, var(--color-neutral-200) 25%, var(--color-neutral-100) 50%, var(--color-neutral-200) 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: var(--radius-small);
        }

        .skeleton-title {
          height: 24px;
          width: 60%;
          margin: 0 auto var(--spacing-5) auto;
        }

        .skeleton-paragraph {
          height: 16px;
          margin-bottom: var(--spacing-3);
        }

        .skeleton-paragraph:last-child {
          margin-bottom: 0;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .loading-spinner,
          .loading-text,
          .skeleton {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

export default LoadingSpinner