import React, { useState, useEffect } from 'react'

const Notification = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!isVisible) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      default:
        return 'ℹ'
    }
  }

  return (
    <div className={`notification notification-${type} ${!isVisible ? 'hiding' : ''}`}>
      <div className="notification-icon">{getIcon()}</div>
      <div className="notification-message">{message}</div>
      <button
        className="notification-close"
        onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, 300)
        }}
        aria-label="Close notification"
      >
        ×
      </button>

      <style jsx>{`
        .notification {
          position: fixed;
          top: var(--space-4);
          right: var(--space-4);
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4);
          background: var(--bg-secondary);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          border-left: 4px solid;
          max-width: 400px;
          z-index: var(--z-modal);
          animation: slideInRight 0.3s ease;
        }

        .notification.hiding {
          animation: slideOutRight 0.3s ease;
        }

        .notification-success {
          border-left-color: var(--teal-500);
          background: linear-gradient(135deg, rgba(20, 184, 166, 0.1), var(--bg-secondary));
        }

        .notification-error {
          border-left-color: #ef4444;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), var(--bg-secondary));
        }

        .notification-warning {
          border-left-color: var(--orange-500);
          background: linear-gradient(135deg, rgba(233, 81, 10, 0.1), var(--bg-secondary));
        }

        .notification-info {
          border-left-color: var(--navy-500);
          background: linear-gradient(135deg, rgba(71, 126, 219, 0.1), var(--bg-secondary));
        }

        .notification-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: var(--border-radius-full);
          font-weight: var(--font-bold);
          font-size: var(--text-sm);
          flex-shrink: 0;
        }

        .notification-success .notification-icon {
          background-color: rgba(20, 184, 166, 0.2);
          color: var(--teal-400);
        }

        .notification-error .notification-icon {
          background-color: rgba(239, 68, 68, 0.2);
          color: #f87171;
        }

        .notification-warning .notification-icon {
          background-color: rgba(233, 81, 10, 0.2);
          color: var(--orange-400);
        }

        .notification-info .notification-icon {
          background-color: rgba(71, 126, 219, 0.2);
          color: var(--navy-400);
        }

        .notification-message {
          flex: 1;
          font-size: var(--text-sm);
          color: var(--text-primary);
          line-height: 1.4;
        }

        .notification-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          line-height: 1;
          cursor: pointer;
          color: var(--text-tertiary);
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--border-radius);
          transition: var(--transition-base);
          flex-shrink: 0;
        }

        .notification-close:hover {
          background-color: var(--gray-800);
          color: var(--text-primary);
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }

        @media (max-width: 768px) {
          .notification {
            left: var(--space-4);
            right: var(--space-4);
            max-width: none;
          }
        }
      `}</style>
    </div>
  )
}

// Notification Manager Hook
export const useNotification = () => {
  const [notifications, setNotifications] = useState([])

  const showNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type, duration }])
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const NotificationContainer = () => (
    <>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </>
  )

  return { showNotification, NotificationContainer }
}

export default Notification
