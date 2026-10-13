import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  Home,
  AlertTriangle,
  Star,
  ChevronRight,
  XCircle,
} from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';
import { Header } from '../../components/common/Header';
import { OrderStatus } from '../../types';
import { Modal } from '../../components/common/Modal';

export const OrderTrackingScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, cancelOrder } = useOrderStore();
  const order = getOrderById(id || '');

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of plan');

  if (!order) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-dark)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <p style={{ color: 'var(--text-cream-muted)', marginBottom: '16px' }}>
          Order #{id} was not found.
        </p>
        <button
          onClick={() => navigate('/student/orders')}
          style={{
            background: 'var(--brand-yellow)',
            color: 'var(--text-dark)',
            padding: '10px 20px',
            borderRadius: '999px',
            fontWeight: 700,
          }}
        >
          View All Orders
        </button>
      </div>
    );
  }

  const handleConfirmCancel = () => {
    cancelOrder(order.id, cancelReason);
    setShowCancelModal(false);
  };

  // Timeline configuration adapting phone 4 reference specifically for campus pickup
  const steps: { key: OrderStatus; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      key: 'PENDING',
      label: 'Order placed',
      icon: <Clock size={18} />,
      desc: 'Simulated payment verified. Waiting for mess counter acceptance.',
    },
    {
      key: 'ACCEPTED',
      label: 'Accepted',
      icon: <CheckCircle2 size={18} />,
      desc: 'Order accepted by mess staff.',
    },
    {
      key: 'PREPARING',
      label: 'Packing / Preparing 📦',
      icon: <Package size={18} />,
      desc: 'Kitchen team assembling food portions.',
    },
    {
      key: 'READY',
      label: 'Ready for Pickup 🔔',
      icon: <MapPin size={18} />,
      desc: `Waiting at: ${order.pickupPoint}`,
    },
    {
      key: 'COLLECTED',
      label: 'Received / Collected 🏠',
      icon: <Home size={18} />,
      desc: 'Collected from campus mess counter.',
    },
  ];

  const statusOrder: OrderStatus[] = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COLLECTED'];
  const currentIndex = statusOrder.indexOf(order.status);
  const isRejected = order.status === 'REJECTED';
  const isCancelled = order.status === 'CANCELLED';

  const canCancel = order.status === 'PENDING' || order.status === 'ACCEPTED';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-dark)',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '40px',
      }}
    >
      <Header title="Order Status" showBack={true} showCart={true} />

      <main className="app-content no-bottom-nav" style={{ padding: '16px 20px' }}>
        {/* Status Callout Card */}
        {isRejected ? (
          <div
            style={{
              background: '#fee2e2',
              borderRadius: '20px',
              padding: '16px',
              color: '#991b1b',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <XCircle size={28} shrink-0="true" />
            <div>
              <strong style={{ fontSize: '15px' }}>Order Declined by Mess Staff</strong>
              <p style={{ fontSize: '12px', marginTop: '2px' }}>
                Reason: {order.rejectionReason || 'Kitchen capacity reached'}. Reserved portions have been returned to stock.
              </p>
            </div>
          </div>
        ) : isCancelled ? (
          <div
            style={{
              background: '#fef3c7',
              borderRadius: '20px',
              padding: '16px',
              color: '#92400e',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <AlertTriangle size={28} shrink-0="true" />
            <div>
              <strong style={{ fontSize: '15px' }}>Order Cancelled</strong>
              <p style={{ fontSize: '12px', marginTop: '2px' }}>
                This order was cancelled. Reserved portions have been restored to mess inventory.
              </p>
            </div>
          </div>
        ) : null}

        {/* Main Tracking Card — Cream styled vertical timeline matching UI reference Phone 4 */}
        <div
          style={{
            backgroundColor: 'var(--surface-cream-card)',
            borderRadius: '26px',
            padding: '24px 20px',
            color: 'var(--text-dark)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            marginBottom: '18px',
          }}
        >
          {/* Top Order ID & Time */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '16px',
              borderBottom: '1px solid #ebd9c5',
              marginBottom: '20px',
            }}
          >
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#8c6d53' }}>ORDER ID</span>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '20px',
                  fontWeight: 800,
                  color: 'var(--text-dark)',
                }}
              >
                {order.id}
              </h2>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '3px 10px',
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
          </div>

          {/* Vertical Progress Timeline - Exact replica of UI reference Phone 4 */}
          <div style={{ position: 'relative', paddingLeft: '32px' }}>
            {/* Timeline Vertical Track Line */}
            <div
              style={{
                position: 'absolute',
                left: '11px',
                top: '12px',
                bottom: '24px',
                width: '3px',
                backgroundColor: '#ebd9c5',
                zIndex: 1,
              }}
            />

            {steps.map((step, idx) => {
              const stepIndex = statusOrder.indexOf(step.key);
              const isCompleted = !isRejected && !isCancelled && currentIndex >= stepIndex;
              const isCurrent = !isRejected && !isCancelled && currentIndex === stepIndex;

              return (
                <div
                  key={step.key}
                  style={{
                    position: 'relative',
                    marginBottom: idx === steps.length - 1 ? '0' : '26px',
                  }}
                >
                  {/* Step Dot / Node */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '-32px',
                      top: '0',
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: isCurrent
                        ? 'var(--brand-yellow)'
                        : isCompleted
                        ? '#3b2010'
                        : '#ebd9c5',
                      color: isCurrent ? 'var(--text-dark)' : isCompleted ? '#faefe0' : '#8c6d53',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                      boxShadow: isCurrent ? '0 0 0 4px rgba(245, 166, 35, 0.25)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isCompleted && !isCurrent ? (
                      <CheckCircle2 size={15} strokeWidth={2.8} />
                    ) : (
                      <span style={{ fontSize: '11px', fontWeight: 800 }}>{idx + 1}</span>
                    )}
                  </div>

                  {/* Step Text Info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span
                        style={{
                          fontSize: '15px',
                          fontWeight: isCurrent || isCompleted ? 800 : 600,
                          color: isCurrent
                            ? 'var(--text-dark)'
                            : isCompleted
                            ? 'var(--text-dark)'
                            : '#8c6d53',
                        }}
                      >
                        {step.label}
                      </span>

                      {/* Display timestamp if reached */}
                      {order.statusTimeline.find((t) => t.status === step.key) && (
                        <span style={{ fontSize: '11px', color: '#8c6d53', fontWeight: 600 }}>
                          {order.statusTimeline.find((t) => t.status === step.key)?.timestamp}
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '12px', color: '#6e5543', marginTop: '2px' }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feedback Prompt if Collected */}
          {order.status === 'COLLECTED' && (
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #ebd9c5' }}>
              <button
                onClick={() => navigate(`/student/feedback/${order.id}`)}
                style={{
                  width: '100%',
                  background: 'var(--brand-yellow)',
                  color: 'var(--text-dark)',
                  padding: '13px',
                  borderRadius: '999px',
                  fontWeight: 800,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(245, 166, 35, 0.4)',
                }}
              >
                <Star size={16} fill="var(--text-dark)" />
                <span>
                  {order.hasFeedback ? 'View or Update Order Rating' : 'Rate Your Mess Order'}
                </span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Verification QR Code Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(250, 239, 224, 0.12)',
            borderRadius: '22px',
            padding: '18px',
            marginBottom: '18px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-cream)', marginBottom: '4px' }}>
            Campus Pickup Verification Code
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-cream-muted)', marginBottom: '14px' }}>
            Show this QR code at {order.pickupPoint} to collect your fresh food tray
          </p>

          <div
            style={{
              background: '#fff',
              padding: '12px',
              borderRadius: '16px',
              display: 'inline-block',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            <QRCodeSVG value={`REPLATE:${order.id}:${order.studentPhone}`} size={120} />
          </div>

          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '13px',
              color: 'var(--brand-yellow)',
              fontWeight: 700,
              marginTop: '10px',
              letterSpacing: '1px',
            }}
          >
            {order.id} • {order.studentName}
          </div>
        </div>

        {/* Order Items Snapshot Summary */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(250, 239, 224, 0.12)',
            borderRadius: '22px',
            padding: '18px',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-cream)', marginBottom: '12px' }}>
            Order Items Summary ({order.itemCount} items)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {order.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '13px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-cream)' }}>
                    {item.quantity}x {item.name}
                  </div>
                  {item.combosDescription && (
                    <div style={{ fontSize: '11px', color: 'var(--brand-yellow)' }}>
                      {item.combosDescription}
                    </div>
                  )}
                  {item.addOnsDescription && (
                    <div style={{ fontSize: '11px', color: 'var(--text-cream-muted)' }}>
                      {item.addOnsDescription}
                    </div>
                  )}
                </div>

                <div style={{ fontWeight: 700, color: 'var(--text-cream)' }}>
                  ₹{item.totalPrice}
                </div>
              </div>
            ))}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 800,
                fontSize: '15px',
                color: 'var(--brand-yellow)',
                paddingTop: '6px',
              }}
            >
              <span>Total Paid</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Student Cancel Order Action */}
        {canCancel && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={() => setShowCancelModal(true)}
              style={{
                color: '#f87171',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              Cancel Order & Restore Portions
            </button>
          </div>
        )}
      </main>

      {/* Cancel Order Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        title="Cancel This Order?"
        onClose={() => setShowCancelModal(false)}
        confirmLabel="Yes, Cancel Order"
        confirmVariant="danger"
        onConfirm={handleConfirmCancel}
      >
        <p style={{ fontSize: '13px', color: 'var(--text-cream)', marginBottom: '14px', lineHeight: 1.4 }}>
          Are you sure you want to cancel order <strong>{order.id}</strong>? The reserved food portions will
          be immediately returned to the campus mess inventory.
        </p>

        <label style={{ fontSize: '12px', color: 'var(--text-cream-muted)', display: 'block', marginBottom: '6px' }}>
          Reason for cancellation:
        </label>
        <select
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '10px',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(250, 239, 224, 0.2)',
            color: 'var(--text-cream)',
            fontSize: '13px',
          }}
        >
          <option value="Change of meal plan">Change of meal plan</option>
          <option value="Ordered wrong item/combo">Ordered wrong item/combo</option>
          <option value="Class timing rescheduled">Class timing rescheduled</option>
          <option value="Other">Other</option>
        </select>
      </Modal>
    </div>
  );
};
