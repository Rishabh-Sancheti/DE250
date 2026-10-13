import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight, Package, CheckCircle2, AlertCircle } from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';
import { useAuthStore } from '../../store/authStore';
import { Header } from '../../components/common/Header';
import { BottomNav } from '../../components/common/BottomNav';

export const OrderHistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { orders } = useOrderStore();
  const { studentProfile } = useAuthStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Filter orders
  const displayedOrders = orders.filter((o) => {
    const isActive = o.status !== 'COLLECTED' && o.status !== 'REJECTED' && o.status !== 'CANCELLED';
    if (filter === 'active') return isActive;
    if (filter === 'completed') return !isActive;
    return true;
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-dark)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header title="My Mess Orders" showLogo={false} showBack={true} showCart={true} />

      <main className="app-content">
        {/* Filter Pills */}
        <div style={{ padding: '14px 18px 8px', display: 'flex', gap: '8px' }}>
          {(['all', 'active', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'capitalize',
                background: filter === tab ? 'var(--brand-yellow)' : 'rgba(255, 255, 255, 0.08)',
                color: filter === tab ? 'var(--text-dark)' : 'var(--text-cream)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div style={{ padding: '10px 18px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {displayedOrders.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '50px 20px',
                color: 'var(--text-cream-muted)',
              }}
            >
              <Package size={36} color="var(--brand-yellow)" style={{ marginBottom: '10px' }} />
              <p style={{ fontWeight: 600, color: 'var(--text-cream)' }}>No orders found in this view</p>
              <button
                onClick={() => navigate('/student/home')}
                style={{
                  marginTop: '16px',
                  background: 'var(--brand-yellow)',
                  color: 'var(--text-dark)',
                  padding: '8px 18px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                Browse Mess Menu
              </button>
            </div>
          ) : (
            displayedOrders.map((order) => {
              const dateStr = new Date(order.createdAt).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={order.id}
                  onClick={() => navigate(`/student/order/${order.id}`)}
                  style={{
                    background: 'var(--surface-cream-card)',
                    borderRadius: '20px',
                    padding: '16px',
                    color: 'var(--text-dark)',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-cream)',
                    transition: 'transform 0.12s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '16px', color: 'var(--text-dark)' }}>
                          {order.id}
                        </span>
                        <span style={{ fontSize: '11px', color: '#8c6d53' }}>
                          • {dateStr}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#6e5543', marginTop: '2px' }}>
                        Pickup: {order.pickupPoint}
                      </p>
                    </div>

                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '3px 9px',
                        borderRadius: '999px',
                        background:
                          order.status === 'COLLECTED'
                            ? '#dcfce7'
                            : order.status === 'READY'
                            ? '#dbeafe'
                            : order.status === 'PREPARING'
                            ? '#fed7aa'
                            : order.status === 'ACCEPTED'
                            ? '#e0e7ff'
                            : order.status === 'REJECTED' || order.status === 'CANCELLED'
                            ? '#fee2e2'
                            : '#fef3c7',
                        color:
                          order.status === 'COLLECTED'
                            ? '#166534'
                            : order.status === 'READY'
                            ? '#1e40af'
                            : order.status === 'PREPARING'
                            ? '#9a3412'
                            : order.status === 'ACCEPTED'
                            ? '#3730a3'
                            : order.status === 'REJECTED' || order.status === 'CANCELLED'
                            ? '#991b1b'
                            : '#92400e',
                      }}
                    >
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Items summary */}
                  <div
                    style={{
                      margin: '10px 0 8px',
                      fontSize: '13px',
                      color: 'var(--text-dark)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    {order.items.map((it, i) => (
                      <span key={i} style={{ color: '#442817' }}>
                        {it.quantity}x {it.name}
                      </span>
                    ))}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '8px',
                      borderTop: '1px solid #ebd9c5',
                    }}
                  >
                    <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-dark)' }}>
                      ₹{order.totalAmount}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#8c6d53', fontSize: '12px', fontWeight: 600 }}>
                      <span>Track status</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <BottomNav role="student" />
    </div>
  );
};
