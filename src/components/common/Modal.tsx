import React from 'react';
import { X, AlertCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  confirmLabel?: string;
  confirmVariant?: 'primary' | 'danger';
  onConfirm?: () => void;
  isConfirmDisabled?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  confirmLabel = 'Confirm',
  confirmVariant = 'primary',
  onConfirm,
  isConfirmDisabled = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(5px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#2d180c',
          border: '1px solid #4a2b16',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '380px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          animation: 'fadeIn 0.15s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(250, 239, 224, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {confirmVariant === 'danger' && <AlertCircle size={18} color="#ef4444" />}
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '17px',
                fontWeight: 700,
                color: 'var(--text-cream)',
              }}
            >
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              color: 'var(--text-cream-muted)',
              display: 'flex',
              padding: '4px',
              borderRadius: '50%',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '20px' }}>{children}</div>

        <div
          style={{
            padding: '12px 20px 16px',
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end',
            background: 'rgba(0,0,0,0.15)',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--text-cream)',
              fontWeight: 600,
              fontSize: '13px',
            }}
          >
            Cancel
          </button>
          {onConfirm && (
            <button
              type="button"
              disabled={isConfirmDisabled}
              onClick={onConfirm}
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                background:
                  confirmVariant === 'danger'
                    ? '#ef4444'
                    : 'var(--brand-yellow)',
                color: confirmVariant === 'danger' ? '#fff' : 'var(--text-dark)',
                fontWeight: 700,
                fontSize: '13px',
                opacity: isConfirmDisabled ? 0.5 : 1,
                cursor: isConfirmDisabled ? 'not-allowed' : 'pointer',
              }}
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
