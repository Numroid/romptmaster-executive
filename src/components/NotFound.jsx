import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="not-found">
      <div className="not-found-container">
        <div className="not-found-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>

        <p className="not-found-message">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        <div className="not-found-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="btn-icon">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to Dashboard
          </button>

          <button
            className="btn btn-ghost btn-lg"
            onClick={() => navigate(-1)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="btn-icon">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
        </div>

        <div className="helpful-links">
          <h3>Helpful Links</h3>
          <ul>
            <li>
              <button onClick={() => navigate('/scenarios')}>
                Browse Scenarios
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/dashboard')}>
                View Your Progress
              </button>
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .not-found {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, var(--gray-900) 0%, var(--navy-900) 100%);
          padding: var(--space-6);
        }

        .not-found-container {
          max-width: 600px;
          width: 100%;
          text-align: center;
        }

        .not-found-icon {
          width: 120px;
          height: 120px;
          margin: 0 auto var(--space-6);
          color: var(--orange-500);
          opacity: 0.8;
        }

        .not-found-icon svg {
          width: 100%;
          height: 100%;
        }

        .not-found-title {
          font-size: 120px;
          font-weight: var(--font-bold);
          background: linear-gradient(135deg, var(--orange-500), var(--orange-400));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          line-height: 1;
        }

        .not-found-subtitle {
          font-size: var(--text-4xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin: var(--space-4) 0;
        }

        .not-found-message {
          font-size: var(--text-lg);
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
          margin: 0 0 var(--space-8) 0;
        }

        .not-found-actions {
          display: flex;
          gap: var(--space-4);
          justify-content: center;
          margin-bottom: var(--space-12);
          flex-wrap: wrap;
        }

        .btn-icon {
          width: 20px;
          height: 20px;
          margin-right: var(--space-2);
        }

        .helpful-links {
          margin-top: var(--space-12);
          padding-top: var(--space-8);
          border-top: 1px solid var(--border-color);
        }

        .helpful-links h3 {
          font-size: var(--text-lg);
          font-weight: var(--font-semibold);
          color: var(--text-secondary);
          margin: 0 0 var(--space-4) 0;
        }

        .helpful-links ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .helpful-links button {
          background: none;
          border: none;
          color: var(--orange-400);
          font-size: var(--text-base);
          cursor: pointer;
          transition: all var(--transition-base);
          padding: var(--space-2);
        }

        .helpful-links button:hover {
          color: var(--orange-300);
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .not-found-title {
            font-size: 80px;
          }

          .not-found-subtitle {
            font-size: var(--text-3xl);
          }

          .not-found-icon {
            width: 80px;
            height: 80px;
          }

          .not-found-actions {
            flex-direction: column;
          }

          .not-found-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default NotFound
