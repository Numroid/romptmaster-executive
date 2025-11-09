import React from 'react'

const AchievementBadge = ({ achievement, size = 'medium', showLabel = true }) => {
  const { icon, badge_name, badge_description, earned, earnedDate } = achievement

  const sizeClasses = {
    small: 'badge-small',
    medium: 'badge-medium',
    large: 'badge-large'
  }

  return (
    <div className={`achievement-badge ${sizeClasses[size]} ${earned ? 'earned' : 'locked'}`}>
      <div className="badge-icon-wrapper">
        <div className="badge-icon">{icon}</div>
        {!earned && (
          <div className="lock-overlay">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        )}
      </div>
      {showLabel && (
        <div className="badge-info">
          <div className="badge-name">{badge_name}</div>
          <div className="badge-description">{badge_description}</div>
          {earned && earnedDate && (
            <div className="badge-earned-date">
              Earned {new Date(earnedDate).toLocaleDateString()}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .achievement-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
          text-align: center;
        }

        .achievement-badge.earned {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .badge-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--border-radius-full);
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          transition: all var(--transition-base);
        }

        .badge-small .badge-icon-wrapper {
          width: 48px;
          height: 48px;
        }

        .badge-medium .badge-icon-wrapper {
          width: 64px;
          height: 64px;
        }

        .badge-large .badge-icon-wrapper {
          width: 80px;
          height: 80px;
        }

        .achievement-badge.earned .badge-icon-wrapper {
          background: linear-gradient(135deg, var(--orange-600), var(--orange-500));
          border-color: var(--orange-500);
          box-shadow: var(--shadow-md), var(--glow-orange-sm);
        }

        .badge-icon {
          font-size: 24px;
          line-height: 1;
        }

        .badge-small .badge-icon {
          font-size: 20px;
        }

        .badge-medium .badge-icon {
          font-size: 28px;
        }

        .badge-large .badge-icon {
          font-size: 36px;
        }

        .achievement-badge.locked .badge-icon-wrapper {
          opacity: 0.3;
        }

        .lock-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(26, 26, 26, 0.8);
          backdrop-filter: blur(2px);
          border-radius: var(--border-radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lock-overlay svg {
          width: 20px;
          height: 20px;
          color: var(--text-tertiary);
        }

        .badge-info {
          width: 100%;
        }

        .badge-name {
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin-bottom: var(--space-1);
        }

        .achievement-badge.locked .badge-name {
          color: var(--text-tertiary);
        }

        .badge-description {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
        }

        .achievement-badge.locked .badge-description {
          color: var(--text-tertiary);
        }

        .badge-earned-date {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          margin-top: var(--space-2);
        }

        /* Hover effects for earned badges */
        .achievement-badge.earned:hover .badge-icon-wrapper {
          transform: translateY(-4px) scale(1.05);
          box-shadow: var(--shadow-lg), var(--glow-orange-md);
        }
      `}</style>
    </div>
  )
}

export default AchievementBadge
