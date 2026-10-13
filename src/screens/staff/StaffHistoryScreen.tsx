import React from 'react';
import { Star, MessageSquare, CheckCircle2, User, Clock } from 'lucide-react';
import { useFeedbackStore } from '../../store/feedbackStore';
import { useOrderStore } from '../../store/orderStore';
import { Header } from '../../components/common/Header';
import { BottomNav } from '../../components/common/BottomNav';
import { StarRating } from '../../components/common/StarRating';

export const StaffHistoryScreen: React.FC = () => {
  const { submissions, getAverageRatings } = useFeedbackStore();
  const orders = useOrderStore((s) => s.orders);
  const collectedOrders = orders.filter((o) => o.status === 'COLLECTED');

  const averages = getAverageRatings();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-dark)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header title="Feedback & History" showLogo={false} showBack={true} showCart={false} />

      <main className="app-content">
        <div style={{ padding: '16px 18px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Summary Scorecard */}
          <div
            style={{
              background: 'var(--surface-cream-card)',
              borderRadius: '24px',
              padding: '20px',
              color: 'var(--text-dark)',
              boxShadow: 'var(--shadow-cream)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#8c6d53' }}>
                  OVERALL SATISFACTION
                </span>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '36px',
                    fontWeight: 800,
                    color: 'var(--text-dark)',
                    lineHeight: 1.1,
                    marginTop: '2px',
                  }}
                >
                  {averages.overall}{' '}
                  <span style={{ fontSize: '18px', color: '#8c6d53', fontWeight: 600 }}>/ 5.0</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <StarRating rating={averages.overall} size={20} />
                <div style={{ fontSize: '12px', color: '#6e5543', marginTop: '4px' }}>
                  {averages.totalCount} student ratings
                </div>
              </div>
            </div>

            {/* Ratings Breakdown Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                marginTop: '16px',
                paddingTop: '14px',
                borderTop: '1px solid #ebd9c5',
                fontSize: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6e5543' }}>Food Taste</span>
                <strong>★ {averages.taste}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6e5543' }}>Quality</span>
                <strong>★ {averages.quality}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6e5543' }}>Pickup Speed</span>
                <strong>★ {averages.pickupTime}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6e5543' }}>App Usability</span>
                <strong>★ {averages.appEase}</strong>
              </div>
            </div>
          </div>

          {/* Student Reviews Feed */}
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-cream)', marginBottom: '12px' }}>
              Student Feedback Submissions ({submissions.length})
            </h3>

            {submissions.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: 'var(--text-cream-muted)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '18px',
                }}
              >
                <MessageSquare size={32} color="var(--brand-yellow)" style={{ marginBottom: '8px' }} />
                <p style={{ fontWeight: 600, color: 'var(--text-cream)' }}>No feedback submitted yet</p>
                <p style={{ fontSize: '12px' }}>Student feedback will appear after orders are marked collected.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {submissions.map((sub, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(250, 239, 224, 0.1)',
                      borderRadius: '18px',
                      padding: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'rgba(245, 166, 35, 0.15)',
                            color: 'var(--brand-yellow)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <User size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-cream)' }}>
                            {sub.studentName}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-cream-muted)' }}>
                            Order #{sub.orderId}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <StarRating rating={sub.overallRating} size={14} showScore={true} />
                      </div>
                    </div>

                    {sub.comments && (
                      <div
                        style={{
                          marginTop: '10px',
                          padding: '10px 12px',
                          background: 'rgba(0,0,0,0.25)',
                          borderRadius: '10px',
                          fontSize: '13px',
                          color: 'var(--text-cream)',
                          fontStyle: 'italic',
                        }}
                      >
                        "{sub.comments}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Collected Orders Roster */}
          <div style={{ marginTop: '8px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-cream)', marginBottom: '12px' }}>
              Recently Collected Pickups ({collectedOrders.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {collectedOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(250, 239, 224, 0.08)',
                    borderRadius: '14px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={14} color="#22c55e" />
                      <strong style={{ fontSize: '13px', color: 'var(--text-cream)' }}>{order.id}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-cream-muted)' }}>
                        • {order.studentName}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-cream-muted)', marginTop: '2px' }}>
                      {order.itemCount} items • ₹{order.totalAmount} • {order.pickupPoint}
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '11px',
                      background: '#dcfce7',
                      color: '#166534',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontWeight: 700,
                    }}
                  >
                    Collected
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <BottomNav role="staff" />
    </div>
  );
};
