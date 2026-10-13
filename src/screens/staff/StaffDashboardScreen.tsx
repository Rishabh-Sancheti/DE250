import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Package,
  CheckCircle2,
  Utensils,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Star,
  RefreshCw,
} from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';
import { useMenuStore } from '../../store/menuStore';
import { useFeedbackStore } from '../../store/feedbackStore';
import { Header } from '../../components/common/Header';
import { BottomNav } from '../../components/common/BottomNav';

export const StaffDashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const orders = useOrderStore((s) => s.orders);
  const menuItems = useMenuStore((s) => s.items);
  const feedbackAverages = useFeedbackStore((s) => s.getAverageRatings)();

  // Metrics calculation
  const pendingOrders = orders.filter((o) => o.status === 'PENDING');
  const preparingOrders = orders.filter((o) => o.status === 'ACCEPTED' || o.status === 'PREPARING');
  const readyOrders = orders.filter((o) => o.status === 'READY');
  const collectedOrders = orders.filter((o) => o.status === 'COLLECTED');

  const totalPortionsInStock = menuItems.reduce((acc, m) => acc + m.availablePortions, 0);
  const lowStockItems = menuItems.filter((m) => m.availablePortions <= 10 && m.isAvailable);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-dark)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header title="Kitchen Operations" showLogo={true} showCart={false} />

      <main className="app-content">
        <div style={{ padding: '16px 18px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Welcome / Role Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #3d2110 0%, #2b160b 100%)',
              border: '1px solid #5a341b',
              borderRadius: '22px',
              padding: '18px 20px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--brand-yellow)', fontWeight: 700, letterSpacing: '0.04em' }}>
                  CENTRAL DINING MESS
                </span>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-cream)', marginTop: '2px' }}>
                  Live Operations Console
                </h2>
              </div>
              <div
                style={{
                  background: 'rgba(245, 166, 35, 0.2)',
                  color: 'var(--brand-yellow)',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <ShieldCheck size={14} /> Staff Active
              </div>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-cream-muted)', marginTop: '8px' }}>
              Real-time synchronization with student orders and shared pantry portion stock.
            </p>
          </div>

          {/* Pending Alert Banner if orders need acceptance */}
          {pendingOrders.length > 0 && (
            <div
              onClick={() => navigate('/staff/orders')}
              style={{
                background: 'rgba(245, 166, 35, 0.18)',
                border: '1.5px solid var(--brand-yellow)',
                borderRadius: '18px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(245, 166, 35, 0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'var(--brand-yellow)',
                    color: 'var(--text-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                  }}
                >
                  <Clock size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-cream)' }}>
                    {pendingOrders.length} New Order{pendingOrders.length > 1 ? 's' : ''} Awaiting Review
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-cream-muted)' }}>
                    Tap to review and accept incoming orders
                  </div>
                </div>
              </div>
              <ArrowRight size={18} color="var(--brand-yellow)" />
            </div>
          )}

          {/* Key Operational KPI Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* KPI 1: Pending */}
            <div
              onClick={() => navigate('/staff/orders')}
              style={{
                background: 'var(--surface-cream-card)',
                borderRadius: '18px',
                padding: '16px',
                color: 'var(--text-dark)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#8c6d53' }}>PENDING</span>
                <Clock size={16} color="#d97706" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                {pendingOrders.length}
              </div>
              <span style={{ fontSize: '11px', color: '#6e5543' }}>Needs acceptance</span>
            </div>

            {/* KPI 2: Kitchen Prep */}
            <div
              onClick={() => navigate('/staff/orders')}
              style={{
                background: 'var(--surface-cream-card)',
                borderRadius: '18px',
                padding: '16px',
                color: 'var(--text-dark)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#8c6d53' }}>PREPARING</span>
                <Package size={16} color="#ea580c" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                {preparingOrders.length}
              </div>
              <span style={{ fontSize: '11px', color: '#6e5543' }}>Cooking & packing</span>
            </div>

            {/* KPI 3: Ready at counter */}
            <div
              onClick={() => navigate('/staff/orders')}
              style={{
                background: 'var(--surface-cream-card)',
                borderRadius: '18px',
                padding: '16px',
                color: 'var(--text-dark)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#8c6d53' }}>READY</span>
                <CheckCircle2 size={16} color="#059669" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                {readyOrders.length}
              </div>
              <span style={{ fontSize: '11px', color: '#6e5543' }}>At pickup window</span>
            </div>

            {/* KPI 4: Total Stock Portions */}
            <div
              onClick={() => navigate('/staff/menu')}
              style={{
                background: 'var(--surface-cream-card)',
                borderRadius: '18px',
                padding: '16px',
                color: 'var(--text-dark)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#8c6d53' }}>TOTAL STOCK</span>
                <Utensils size={16} color="#2563eb" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                {totalPortionsInStock}
              </div>
              <span style={{ fontSize: '11px', color: '#6e5543' }}>Portions remaining</span>
            </div>
          </div>

          {/* Low Stock Watch Section */}
          {lowStockItems.length > 0 && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '18px',
                padding: '14px 16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <AlertCircle size={16} color="#ef4444" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#fca5a5' }}>
                  Low Stock Attention ({lowStockItems.length} dishes)
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {lowStockItems.map((item) => (
                  <span
                    key={item.id}
                    onClick={() => navigate('/staff/menu')}
                    style={{
                      fontSize: '11px',
                      background: 'rgba(0,0,0,0.3)',
                      color: 'var(--text-cream)',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      cursor: 'pointer',
                    }}
                  >
                    {item.name}: <strong>{item.availablePortions} left</strong>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Average Student Satisfaction Rating Summary */}
          <div
            onClick={() => navigate('/staff/history')}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(250, 239, 224, 0.1)',
              borderRadius: '20px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={16} fill="var(--brand-yellow)" stroke="none" />
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-cream)' }}>
                  Student Satisfaction: {feedbackAverages.overall} / 5.0
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-cream-muted)', marginTop: '2px' }}>
                Based on {feedbackAverages.totalCount} collected order reviews (Taste: {feedbackAverages.taste}, Pickup: {feedbackAverages.pickupTime})
              </p>
            </div>
            <ArrowRight size={16} color="var(--text-cream-muted)" />
          </div>

          {/* Quick Staff Navigation Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-cream)' }}>
              Operations Management
            </h3>

            <button
              onClick={() => navigate('/staff/orders')}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(250, 239, 224, 0.1)',
                borderRadius: '16px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'var(--text-cream)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Package size={20} color="var(--brand-yellow)" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>Incoming Orders Queue</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-cream-muted)' }}>
                    Accept, prepare, mark ready, and complete pickups
                  </div>
                </div>
              </div>
              <ChevronRightIcon />
            </button>

            <button
              onClick={() => navigate('/staff/menu')}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(250, 239, 224, 0.1)',
                borderRadius: '16px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'var(--text-cream)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Utensils size={20} color="var(--brand-yellow)" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>Pantry & Inventory Stock</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-cream-muted)' }}>
                    Adjust portions, edit prices, and mark items sold out
                  </div>
                </div>
              </div>
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </main>

      <BottomNav role="staff" />
    </div>
  );
};

const ChevronRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
