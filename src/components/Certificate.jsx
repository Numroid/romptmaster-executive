import React, { useState } from 'react'
import { formatCertificateDate, downloadCertificate, shareCertificate } from '../services/certificateService'

const Certificate = ({ certificate, showActions = true }) => {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async (format) => {
    setDownloading(true)
    await downloadCertificate(certificate.id, format)
    setDownloading(false)
  }

  const handleShare = (platform) => {
    shareCertificate(certificate.id, platform)
  }

  return (
    <div className="certificate-container">
      <div className="certificate-wrapper">
        {/* Certificate Design */}
        <div className="certificate">
          {/* Border Design */}
          <div className="certificate-border">
            <svg className="corner-decoration top-left" viewBox="0 0 100 100">
              <path d="M0,0 L100,0 L0,100 Z" fill="var(--orange-600)" opacity="0.1" />
            </svg>
            <svg className="corner-decoration top-right" viewBox="0 0 100 100">
              <path d="M0,0 L100,0 L100,100 Z" fill="var(--orange-600)" opacity="0.1" />
            </svg>
            <svg className="corner-decoration bottom-left" viewBox="0 0 100 100">
              <path d="M0,0 L0,100 L100,100 Z" fill="var(--orange-600)" opacity="0.1" />
            </svg>
            <svg className="corner-decoration bottom-right" viewBox="0 0 100 100">
              <path d="M0,100 L100,0 L100,100 Z" fill="var(--orange-600)" opacity="0.1" />
            </svg>
          </div>

          {/* Certificate Content */}
          <div className="certificate-content">
            {/* Header */}
            <div className="certificate-header">
              <div className="cert-logo">
                <div className="logo-icon">🎓</div>
                <div className="logo-text">PromptMaster</div>
              </div>
              <div className="cert-title">Certificate of Completion</div>
              <div className="cert-subtitle">Professional AI Prompt Engineering</div>
            </div>

            {/* Recipient */}
            <div className="certificate-body">
              <div className="presented-to">This certifies that</div>
              <div className="recipient-name">{certificate.userName}</div>
              <div className="achievement-text">
                has successfully completed the <strong>PromptMaster Executive</strong> certification program,
                demonstrating mastery of professional AI prompt engineering techniques through
                {' '}<strong>{certificate.scenariosCompleted || 50} business scenarios</strong> with an
                outstanding score of <strong>{certificate.finalScore}%</strong>.
              </div>

              {/* Skills Grid */}
              <div className="skills-grid">
                {certificate.skills && certificate.skills.map((skill, index) => (
                  <div key={index} className="skill-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="skill-icon">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {skill}
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="cert-stats">
                <div className="cert-stat">
                  <div className="cert-stat-value">{certificate.totalHours || 25}+</div>
                  <div className="cert-stat-label">Hours</div>
                </div>
                <div className="cert-stat">
                  <div className="cert-stat-value">{certificate.scenariosCompleted || 50}</div>
                  <div className="cert-stat-label">Scenarios</div>
                </div>
                <div className="cert-stat">
                  <div className="cert-stat-value">{certificate.finalScore}%</div>
                  <div className="cert-stat-label">Score</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="certificate-footer">
              <div className="signature-section">
                <div className="signature-line">
                  <div className="signature">{certificate.signatoryName || 'PromptMaster Team'}</div>
                  <div className="signature-title">{certificate.signatoryTitle || 'Chief Learning Officer'}</div>
                </div>
              </div>

              <div className="cert-meta">
                <div className="issue-date">
                  <strong>Issue Date:</strong> {formatCertificateDate(certificate.issueDate)}
                </div>
                <div className="cert-number">
                  <strong>Certificate No:</strong> {certificate.certificateNumber || certificate.id.split('-').pop()}
                </div>
              </div>

              {/* Verification */}
              <div className="verification-section">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="verified-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div className="verification-text">
                  <strong>Verified Certificate</strong>
                  <div className="verification-url">{certificate.verificationUrl?.replace('http://', '').replace('https://', '')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="certificate-actions">
          <div className="actions-group">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => handleDownload('pdf')}
              disabled={downloading}
            >
              {downloading ? (
                <>
                  <svg className="btn-spinner" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="btn-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => window.print()}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="btn-icon">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
          </div>

          <div className="share-section">
            <div className="share-label">Share your achievement:</div>
            <div className="share-buttons">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => handleShare('linkedin')}
                title="Share on LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => handleShare('twitter')}
                title="Share on Twitter"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Twitter
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => handleShare('facebook')}
                title="Share on Facebook"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .certificate-container {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
        }

        .certificate-wrapper {
          padding: var(--space-8);
          background: var(--gray-900);
          border-radius: var(--border-radius-xl);
        }

        .certificate {
          position: relative;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          padding: var(--space-12);
          border-radius: var(--border-radius-lg);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        /* Border Decorations */
        .certificate-border {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .corner-decoration {
          position: absolute;
          width: 100px;
          height: 100px;
        }

        .top-left {
          top: 0;
          left: 0;
        }

        .top-right {
          top: 0;
          right: 0;
          transform: rotate(90deg);
        }

        .bottom-left {
          bottom: 0;
          left: 0;
          transform: rotate(270deg);
        }

        .bottom-right {
          bottom: 0;
          right: 0;
          transform: rotate(180deg);
        }

        /* Certificate Content */
        .certificate-content {
          position: relative;
          z-index: 1;
        }

        .certificate-header {
          text-align: center;
          margin-bottom: var(--space-10);
          padding-bottom: var(--space-6);
          border-bottom: 3px solid var(--orange-600);
        }

        .cert-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-3);
          margin-bottom: var(--space-6);
        }

        .logo-icon {
          font-size: 48px;
        }

        .logo-text {
          font-size: var(--text-3xl);
          font-weight: var(--font-bold);
          background: linear-gradient(135deg, var(--orange-600), var(--orange-500));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cert-title {
          font-size: var(--text-4xl);
          font-weight: var(--font-bold);
          color: #1a1a1a;
          margin-bottom: var(--space-2);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .cert-subtitle {
          font-size: var(--text-xl);
          color: #666;
          font-weight: var(--font-medium);
        }

        .certificate-body {
          margin-bottom: var(--space-10);
        }

        .presented-to {
          text-align: center;
          font-size: var(--text-lg);
          color: #666;
          font-style: italic;
          margin-bottom: var(--space-3);
        }

        .recipient-name {
          text-align: center;
          font-size: var(--text-5xl);
          font-weight: var(--font-bold);
          color: #1a1a1a;
          margin-bottom: var(--space-8);
          padding-bottom: var(--space-4);
          border-bottom: 2px solid #e0e0e0;
        }

        .achievement-text {
          text-align: center;
          font-size: var(--text-lg);
          line-height: var(--leading-relaxed);
          color: #333;
          max-width: 700px;
          margin: 0 auto var(--space-8);
        }

        .achievement-text strong {
          color: var(--orange-600);
        }

        /* Skills Grid */
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-3);
          margin-bottom: var(--space-8);
        }

        .skill-badge {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          background: linear-gradient(135deg, rgba(233, 81, 10, 0.1), rgba(233, 81, 10, 0.05));
          border: 1px solid var(--orange-600);
          border-radius: var(--border-radius-lg);
          font-size: var(--text-sm);
          color: #333;
          font-weight: var(--font-medium);
        }

        .skill-icon {
          width: 16px;
          height: 16px;
          color: var(--orange-600);
          flex-shrink: 0;
        }

        /* Stats */
        .cert-stats {
          display: flex;
          justify-content: center;
          gap: var(--space-12);
          margin-bottom: var(--space-8);
        }

        .cert-stat {
          text-align: center;
        }

        .cert-stat-value {
          font-size: var(--text-4xl);
          font-weight: var(--font-bold);
          color: var(--orange-600);
          margin-bottom: var(--space-1);
        }

        .cert-stat-label {
          font-size: var(--text-sm);
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Footer */
        .certificate-footer {
          border-top: 2px solid #e0e0e0;
          padding-top: var(--space-6);
        }

        .signature-section {
          display: flex;
          justify-content: center;
          margin-bottom: var(--space-6);
        }

        .signature-line {
          text-align: center;
        }

        .signature {
          font-size: var(--text-2xl);
          font-weight: var(--font-semibold);
          color: #1a1a1a;
          font-family: 'Brush Script MT', cursive;
          margin-bottom: var(--space-2);
        }

        .signature-title {
          font-size: var(--text-sm);
          color: #666;
          padding-top: var(--space-2);
          border-top: 2px solid #333;
          display: inline-block;
        }

        .cert-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--space-6);
          font-size: var(--text-sm);
          color: #666;
        }

        .cert-meta strong {
          color: #333;
        }

        .verification-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-3);
          padding: var(--space-4);
          background: linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(20, 184, 166, 0.05));
          border: 1px solid #14b8a6;
          border-radius: var(--border-radius-lg);
        }

        .verified-icon {
          width: 24px;
          height: 24px;
          color: #14b8a6;
          flex-shrink: 0;
        }

        .verification-text {
          text-align: left;
        }

        .verification-text strong {
          display: block;
          font-size: var(--text-base);
          color: #1a1a1a;
          margin-bottom: var(--space-1);
        }

        .verification-url {
          font-size: var(--text-xs);
          color: #666;
          font-family: monospace;
        }

        /* Actions */
        .certificate-actions {
          margin-top: var(--space-8);
          padding: var(--space-6);
          background: var(--bg-secondary);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--border-color);
        }

        .actions-group {
          display: flex;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
          justify-content: center;
        }

        .btn-icon {
          width: 18px;
          height: 18px;
          margin-right: var(--space-2);
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

        .share-section {
          text-align: center;
        }

        .share-label {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-3);
          font-weight: var(--font-medium);
        }

        .share-buttons {
          display: flex;
          gap: var(--space-3);
          justify-content: center;
        }

        .social-icon {
          width: 18px;
          height: 18px;
          margin-right: var(--space-2);
        }

        /* Print Styles */
        @media print {
          .certificate-actions {
            display: none;
          }

          .certificate {
            box-shadow: none;
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .certificate {
            padding: var(--space-6);
          }

          .cert-title {
            font-size: var(--text-2xl);
          }

          .recipient-name {
            font-size: var(--text-3xl);
          }

          .achievement-text {
            font-size: var(--text-base);
          }

          .cert-stats {
            gap: var(--space-6);
          }

          .actions-group {
            flex-direction: column;
          }

          .share-buttons {
            flex-direction: column;
          }

          .skills-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default Certificate
