import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, ShieldCheck, User } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showCart?: boolean;
  showLogo?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  showCart = true,
  showLogo = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const { currentRole, studentProfile } = useAuthStore();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const isStaffPath = location.pathname.startsWith('/staff');

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {showBack ? (
          <button
            onClick={handleBack}
            className="icon-btn"
            title="Go back"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
        ) : showLogo ? (
          <div
            onClick={() => navigate(isStaffPath ? '/staff/dashboard' : '/student/home')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <img
              src="/assets/logo.png"
              alt="Replate"
              style={{ width: '34px', height: '34px', objectFit: 'contain' }}
            />
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '20px',
                fontWeight: 800,
                color: 'var(--text-cream)',
                letterSpacing: '-0.02em',
              }}
            >
              re<span style={{ color: 'var(--brand-yellow)' }}>plate</span>
            </span>
          </div>
        ) : null}

        {title && (
          <h1
            style={{
              fontSize: '17px',
              fontWeight: 700,
              color: 'var(--text-cream)',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {title}
          </h1>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isStaffPath ? (
          <div
            style={{
              background: 'rgba(245, 166, 35, 0.15)',
              color: 'var(--brand-yellow)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              border: '1px solid rgba(245, 166, 35, 0.3)',
            }}
          >
            <ShieldCheck size={13} /> Staff Portal
          </div>
        ) : (
          <>
            {studentProfile && (
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--text-cream-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  maxWidth: '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <User size={12} /> {studentProfile.name.split(' ')[0]}
              </span>
            )}

            {showCart && (
              <button
                onClick={() => navigate('/student/cart')}
                className="icon-btn"
                title="View cart"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={20} />
                {cartItemCount > 0 && (
                  <span className="badge-counter">{cartItemCount}</span>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </header>
  );
};
