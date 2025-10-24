import React, { useEffect } from 'react'

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-container" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>{title}</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 999;
          animation: fadeIn 0.2s ease;
        }

        .modal-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow: hidden;
          z-index: 1000;
          animation: scaleIn 0.2s ease;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-6);
          border-bottom: 1px solid var(--gray-200);
        }

        .modal-header h2 {
          margin: 0;
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 2rem;
          line-height: 1;
          cursor: pointer;
          color: var(--text-tertiary);
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius);
          transition: var(--transition);
        }

        .modal-close:hover {
          background-color: var(--gray-100);
          color: var(--text-primary);
        }

        .modal-body {
          padding: var(--space-6);
          overflow-y: auto;
          max-height: calc(90vh - 140px);
        }

        .modal-footer {
          padding: var(--space-6);
          border-top: 1px solid var(--gray-200);
          display: flex;
          gap: var(--space-3);
          justify-content: flex-end;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @media (max-width: 768px) {
          .modal-container {
            max-width: 100%;
            width: 95%;
          }

          .modal-header,
          .modal-body,
          .modal-footer {
            padding: var(--space-4);
          }
        }
      `}</style>
    </>
  )
}

export default Modal
