import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { mockVerifyCertificate, formatCertificateDate } from '../services/certificateService'
import LoadingSpinner from './LoadingSpinner'

const CertificateVerification = () => {
  const { certificateId } = useParams()
  const [loading, setLoading] = useState(true)
  const [verificationResult, setVerificationResult] = useState(null)

  useEffect(() => {
    verifyCertificate()
  }, [certificateId])

  const verifyCertificate = async () => {
    try {
      setLoading(true)
      const result = await mockVerifyCertificate(certificateId)
      setVerificationResult(result)
    } catch (error) {
      console.error('Error verifying certificate:', error)
      setVerificationResult({
        success: false,
        valid: false,
        error: 'Failed to verify certificate'
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  const { valid, certificate, error } = verificationResult

  return (
    <div className="verification-page">
      <div className="container">
        <div className="verification-card">
          {/* Header */}
          <div className="verification-header">
            <div className="header-logo">
              <div className="logo-icon">🎓</div>
              <div className="logo-text">PromptMaster</div>
            </div>
            <h1 className="verification-title">Certificate Verification</h1>
          </div>

          {/* Verification Result */}
          {valid ? (
            <div className="verification-success">
              {/* Success Icon */}
              <div className="success-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="success-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>

              <h2 className="result-title">Verified Certificate</h2>
              <p className="result-description">
                This certificate is authentic and has been verified by PromptMaster
              </p>

              {/* Certificate Details */}
              <div className="cert-details">
                <div className="detail-item">
                  <div className="detail-label">Certificate Holder</div>
                  <div className="detail-value">{certificate.userName}</div>
                </div>

                <div className="detail-divider" />

                <div className="detail-item">
                  <div className="detail-label">Course</div>
                  <div className="detail-value">{certificate.courseName}</div>
                </div>

                <div className="detail-divider" />

                <div className="detail-item">
                  <div className="detail-label">Final Score</div>
                  <div className="detail-value">{certificate.finalScore}%</div>
                </div>

                <div className="detail-divider" />

                <div className="detail-item">
                  <div className="detail-label">Issue Date</div>
                  <div className="detail-value">{formatCertificateDate(certificate.issueDate)}</div>
                </div>

                <div className="detail-divider" />

                <div className="detail-item">
                  <div className="detail-label">Certificate ID</div>
                  <div className="detail-value cert-id">{certificate.id}</div>
                </div>

                <div className="detail-divider" />

                <div className="detail-item">
                  <div className="detail-label">Issued By</div>
                  <div className="detail-value">{certificate.organization}</div>
                </div>
              </div>

              {/* Verification Badge */}
              <div className="verification-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="badge-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Authenticity Guaranteed</span>
              </div>
            </div>
          ) : (
            <div className="verification-error">
              {/* Error Icon */}
              <div className="error-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="error-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <h2 className="result-title">Certificate Not Found</h2>
              <p className="result-description">
                {error || 'The certificate ID you provided could not be verified. Please check the ID and try again.'}
              </p>

              <div className="cert-id-display">
                <strong>Searched ID:</strong> {certificateId}
              </div>

              <div className="help-text">
                <p>If you believe this is an error, please contact support with the certificate ID.</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="verification-footer">
            <p className="footer-text">
              PromptMaster certificates are digitally signed and cryptographically secure.
              This verification page confirms the authenticity of certificates issued by PromptMaster.
            </p>
            <a href="/" className="back-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="back-icon">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to PromptMaster
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .verification-page {
          min-height: 100vh;
          background: linear-gradient(180deg,
            var(--gray-900) 0%,
            var(--navy-900) 100%
          );
          display: flex;
          align-items: center;
          padding: var(--space-8) var(--space-4);
        }

        .verification-card {
          max-width: 700px;
          margin: 0 auto;
          background: var(--bg-secondary);
          border-radius: var(--border-radius-xl);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-2xl);
          overflow: hidden;
        }

        .verification-header {
          padding: var(--space-8);
          text-align: center;
          background: var(--bg-navy);
          border-bottom: 1px solid var(--navy-600);
        }

        .header-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-3);
          margin-bottom: var(--space-6);
        }

        .logo-icon {
          font-size: 40px;
        }

        .logo-text {
          font-size: var(--text-3xl);
          font-weight: var(--font-bold);
          background: linear-gradient(135deg, var(--orange-500), var(--orange-600));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .verification-title {
          font-size: var(--text-3xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin: 0;
        }

        /* Success State */
        .verification-success {
          padding: var(--space-10);
          text-align: center;
        }

        .success-icon-wrapper {
          width: 100px;
          height: 100px;
          margin: 0 auto var(--space-6);
          background: linear-gradient(135deg, var(--teal-600), var(--teal-500));
          border-radius: var(--border-radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-lg), 0 0 40px rgba(20, 184, 166, 0.3);
          animation: successPulse 2s ease-in-out infinite;
        }

        @keyframes successPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: var(--shadow-lg), 0 0 40px rgba(20, 184, 166, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: var(--shadow-2xl), 0 0 60px rgba(20, 184, 166, 0.5);
          }
        }

        .success-icon {
          width: 60px;
          height: 60px;
          color: white;
        }

        /* Error State */
        .verification-error {
          padding: var(--space-10);
          text-align: center;
        }

        .error-icon-wrapper {
          width: 100px;
          height: 100px;
          margin: 0 auto var(--space-6);
          background: linear-gradient(135deg, var(--orange-600), var(--orange-500));
          border-radius: var(--border-radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-lg);
        }

        .error-icon {
          width: 60px;
          height: 60px;
          color: white;
        }

        .result-title {
          font-size: var(--text-3xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin: 0 0 var(--space-3) 0;
        }

        .result-description {
          font-size: var(--text-lg);
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
          margin: 0 0 var(--space-8) 0;
        }

        /* Certificate Details */
        .cert-details {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: var(--space-6);
          margin-bottom: var(--space-6);
          text-align: left;
        }

        .detail-item {
          padding: var(--space-4) 0;
        }

        .detail-label {
          font-size: var(--text-xs);
          font-weight: var(--font-semibold);
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: var(--space-2);
        }

        .detail-value {
          font-size: var(--text-lg);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
        }

        .cert-id {
          font-family: monospace;
          font-size: var(--text-sm);
          color: var(--orange-400);
        }

        .detail-divider {
          height: 1px;
          background: var(--border-color);
        }

        .verification-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-5);
          background: linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(20, 184, 166, 0.05));
          border: 2px solid var(--teal-500);
          border-radius: var(--border-radius-full);
          font-size: var(--text-sm);
          font-weight: var(--font-bold);
          color: var(--teal-400);
        }

        .badge-icon {
          width: 20px;
          height: 20px;
        }

        /* Error Details */
        .cert-id-display {
          padding: var(--space-4);
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          font-family: monospace;
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-6);
        }

        .help-text {
          padding: var(--space-4);
          background: var(--bg-navy);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--navy-600);
        }

        .help-text p {
          margin: 0;
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
        }

        /* Footer */
        .verification-footer {
          padding: var(--space-6);
          background: var(--bg-navy);
          border-top: 1px solid var(--navy-600);
          text-align: center;
        }

        .footer-text {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
          line-height: var(--leading-relaxed);
          margin: 0 0 var(--space-4) 0;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--orange-400);
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          text-decoration: none;
          transition: all var(--transition-base);
        }

        .back-link:hover {
          color: var(--orange-300);
          transform: translateX(-4px);
        }

        .back-icon {
          width: 16px;
          height: 16px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .verification-header {
            padding: var(--space-6);
          }

          .verification-success,
          .verification-error {
            padding: var(--space-6);
          }

          .result-title {
            font-size: var(--text-2xl);
          }

          .success-icon-wrapper,
          .error-icon-wrapper {
            width: 80px;
            height: 80px;
          }

          .success-icon,
          .error-icon {
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </div>
  )
}

export default CertificateVerification
