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
          background: var(--white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          border-left: 4px solid;
          max-width: 400px;
          z-index: 1001;
          animation: slideInRight 0.3s ease;
        }

        .notification.hiding {
          animation: slideOutRight 0.3s ease;
        }

        .notification-success {
          border-left-color: var(--secondary);
        }

        .notification-error {
          border-left-color: var(--error);
        }

        .notification-warning {
          border-left-color: var(--accent);
        }

        .notification-info {
          border-left-color: var(--primary);
        }

        .notification-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: var(--radius-full);
          font-weight: var(--font-bold);
          font-size: var(--text-sm);
          flex-shrink: 0;
        }

        .notification-success .notification-icon {
          background-color: #f0fdf4;
          color: var(--secondary);
        }

        .notification-error .notification-icon {
          background-color: #fef2f2;
          color: var(--error);
        }

        .notification-warning .notification-icon {
          background-color: #fff7ed;
          color: var(--accent);
        }

        .notification-info .notification-icon {
          background-color: var(--primary-light);
          color: var(--primary);
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
          border-radius: var(--radius);
          transition: var(--transition);
          flex-shrink: 0;
        }

        .notification-close:hover {
          background-color: var(--gray-100);
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
