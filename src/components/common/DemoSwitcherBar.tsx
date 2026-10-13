import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RotateCcw, ArrowRightLeft } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useMenuStore } from '../../store/menuStore';
import { useOrderStore } from '../../store/orderStore';
import { useFeedbackStore } from '../../store/feedbackStore';
import { useCartStore } from '../../store/cartStore';

export const DemoSwitcherBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole, switchRole } = useAuthStore();
  const resetMenu = useMenuStore((s) => s.resetToDefaultMenu);
  const resetOrders = useOrderStore((s) => s.resetOrders);
  const resetFeedback = useFeedbackStore((s) => s.resetFeedback);
  const clearCart = useCartStore((s) => s.clearCart);

  const isStaff = location.pathname.startsWith('/staff') || currentRole === 'staff';

  const handleToggleRole = () => {
    if (isStaff) {
      switchRole('student');
      navigate('/student/home');
    } else {
      switchRole('staff');
      navigate('/staff/dashboard');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo orders, inventory portions, and feedback to initial defaults?')) {
      resetMenu();
      resetOrders();
      resetFeedback();
      clearCart();
      window.location.reload();
    }
  };

  // Don't show on initial login page
  if (location.pathname === '/') return null;

  return (
    <aside className="role-switcher-banner" aria-label="Demo role banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontWeight: 800 }}>DEMO:</span>
        <span>Viewing as <strong>{isStaff ? 'Mess Staff' : 'Hostel Student'}</strong></span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={handleToggleRole}
          style={{
            background: 'var(--brand-yellow)',
            color: 'var(--text-dark)',
            padding: '3px 9px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          title="Switch view between Student and Staff"
        >
          <ArrowRightLeft size={11} />
          Switch to {isStaff ? 'Student' : 'Staff'}
        </button>

        <button
          onClick={handleResetData}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'var(--text-cream)',
            padding: '3px 8px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
          }}
          title="Reset demo data"
        >
          <RotateCcw size={10} /> Reset
        </button>
      </div>
    </aside>
  );
};
