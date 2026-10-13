import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Utensils, Clock, LayoutDashboard, ListOrdered, BookOpen, Star } from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';

interface BottomNavProps {
  role: 'student' | 'staff';
}

export const BottomNav: React.FC<BottomNavProps> = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const orders = useOrderStore((s) => s.orders);

  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const activeStudentOrdersCount = orders.filter(
    (o) => o.status !== 'COLLECTED' && o.status !== 'REJECTED' && o.status !== 'CANCELLED'
  ).length;

  if (role === 'staff') {
    const tabs = [
      { path: '/staff/dashboard', label: 'Overview', icon: LayoutDashboard },
      { path: '/staff/orders', label: 'Orders', icon: ListOrdered, badge: pendingCount },
      { path: '/staff/menu', label: 'Inventory', icon: BookOpen },
      { path: '/staff/history', label: 'Reviews', icon: Star },
    ];

    return (
      <nav className="bottom-nav-bar" aria-label="Staff navigation">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`nav-tab-item ${isActive ? 'active' : ''}`}
            >
              <div style={{ position: 'relative' }}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                {tab.badge && tab.badge > 0 ? (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-10px',
                      background: 'var(--brand-yellow)',
                      color: 'var(--text-dark)',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '1px 5px',
                      borderRadius: '999px',
                      border: '1.5px solid var(--bg-dark)',
                    }}
                  >
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    );
  }

  // Student bottom nav
  const tabs = [
    { path: '/student/home', label: 'Food Menu', icon: Utensils },
    {
      path: '/student/orders',
      label: 'My Orders',
      icon: Clock,
      badge: activeStudentOrdersCount > 0 ? activeStudentOrdersCount : undefined,
    },
  ];

  return (
    <nav className="bottom-nav-bar" aria-label="Student navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname === tab.path;

        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`nav-tab-item ${isActive ? 'active' : ''}`}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={21} strokeWidth={isActive ? 2.5 : 1.8} />
              {tab.badge && tab.badge > 0 ? (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-10px',
                    background: 'var(--brand-yellow)',
                    color: 'var(--text-dark)',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '1px 5px',
                    borderRadius: '999px',
                    border: '1.5px solid var(--bg-dark)',
                  }}
                >
                  {tab.badge}
                </span>
              ) : null}
            </div>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
