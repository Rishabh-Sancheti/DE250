import React, { useState } from 'react';
import {
  Clock,
  Package,
  CheckCircle2,
  XCircle,
  Search,
  AlertTriangle,
  MapPin,
  User,
  Phone,
  Home,
} from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';
import { Header } from '../../components/common/Header';
import { BottomNav } from '../../components/common/BottomNav';
import { Order, OrderStatus } from '../../types';
import { Modal } from '../../components/common/Modal';

export const StaffOrdersScreen: React.FC = () => {
  const {
    orders,
    acceptOrder,
    rejectOrder,
    setOrderPreparing,
    setOrderReady,
    confirmOrderCollected,
  } = useOrderStore();

  const [activeTab, setActiveTab] = useState<'ALL' | OrderStatus>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');

  // Reject modal state
  const [rejectModalOrder, setRejectModalOrder] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState('Kitchen capacity exceeded for this slot');

  const tabs: { key: 'ALL' | OrderStatus; label: string; count?: number }[] = [
    {
      key: 'PENDING',
      label: 'Pending',
      count: orders.filter((o) => o.status === 'PENDING').length,
    },
    {
      key: 'ACCEPTED',
      label: 'Accepted',
      count: orders.filter((o) => o.status === 'ACCEPTED').length,
    },
    {
      key: 'PREPARING',
      label: 'Preparing',
      count: orders.filter((o) => o.status === 'PREPARING').length,
    },
    {
      key: 'READY',
      label: 'Ready',
      count: orders.filter((o) => o.status === 'READY').length,
    },
    { key: 'COLLECTED', label: 'Collected' },
    { key: 'ALL', label: 'All Orders' },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === 'ALL' || order.status === activeTab;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.studentHostel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleConfirmReject = () => {
    if (rejectModalOrder) {
      rejectOrder(rejectModalOrder.id, rejectReason);
      setRejectModalOrder(null);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-dark)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header title="Live Orders Dispatch" showLogo={false} showBack={true} showCart={false} />

      <main className="app-content">
        {/* Search Bar */}
        <div style={{ padding: '12px 18px 6px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(250, 239, 224, 0.08)',
              borderRadius: '999px',
              padding: '8px 16px',
              border: '1px solid rgba(250, 239, 224, 0.15)',
              gap: '10px',
            }}
          >
            <Search size={18} color="var(--text-cream-muted)" />
            <input
              type="text"
              placeholder="Search by Order # or student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-cream)',
                width: '100%',
                fontSize: '13px',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ color: 'var(--text-cream-muted)', fontSize: '13px' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Tab Chips */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              padding: '12px 0 6px',
              scrollbarWidth: 'none',
            }}
          >
            {tabs.map((tab) => {
              const isSelected = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    background: isSelected ? 'var(--brand-yellow)' : 'rgba(255, 255, 255, 0.07)',
                    color: isSelected ? 'var(--text-dark)' : 'var(--text-cream)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      style={{
                        background: isSelected ? 'var(--text-dark)' : 'var(--brand-yellow)',
                        color: isSelected ? 'var(--brand-yellow)' : 'var(--text-dark)',
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '999px',
                      }}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        <div style={{ padding: '8px 18px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredOrders.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: 'var(--text-cream-muted)',
              }}
            >
              <Package size={40} color="var(--brand-yellow)" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-cream)' }}>
                No orders in {activeTab.toLowerCase()} status
              </h3>
              <p style={{ fontSize: '12px', marginTop: '4px' }}>
                Incoming orders from hostel students will appear here in real time.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isPending = order.status === 'PENDING';
              const isAccepted = order.status === 'ACCEPTED';
              const isPreparing = order.status === 'PREPARING';
              const isReady = order.status === 'READY';
              const isCollected = order.status === 'COLLECTED';
              const isRejected = order.status === 'REJECTED';
              const isCancelled = order.status === 'CANCELLED';

              return (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: 'var(--surface-cream-card)',
                    borderRadius: '22px',
                    padding: '18px',
                    color: 'var(--text-dark)',
                    boxShadow: 'var(--shadow-cream)',
                    border: isPending ? '2px solid var(--brand-yellow)' : 'none',
                  }}
                >
                  {/* Top Bar: Order ID, Time & Status */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      paddingBottom: '12px',
                      borderBottom: '1px solid #ebd9c5',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '18px',
                            fontWeight: 800,
                            color: 'var(--text-dark)',
                          }}
                        >
                          {order.id}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            background: '#e0e7ff',
                            color: '#3730a3',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 700,
                          }}
                        >
                          ✓ Demo Paid
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#6e5543', marginTop: '2px' }}>
                        Placed at {order.statusTimeline[0]?.timestamp || 'Recently'}
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        background: isCollected
                          ? '#dcfce7'
                          : isReady
                          ? '#dbeafe'
                          : isPreparing
                          ? '#fed7aa'
                          : isAccepted
                          ? '#e0e7ff'
                          : isRejected || isCancelled
                          ? '#fee2e2'
                          : '#fef3c7',
                        color: isCollected
                          ? '#166534'
                          : isReady
                          ? '#1e40af'
                          : isPreparing
                          ? '#9a3412'
                          : isAccepted
                          ? '#3730a3'
                          : isRejected || isCancelled
                          ? '#991b1b'
                          : '#92400e',
                      }}
                    >
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Student & Delivery Point Info */}
                  <div
                    style={{
                      margin: '10px 0',
                      padding: '8px 12px',
                      background: '#f5ecdf',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={13} color="#8c6d53" />
                      <strong>{order.studentName}</strong> ({order.studentHostel})
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={13} color="#8c6d53" />
                      <span>{order.studentPhone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={13} color="var(--brand-yellow-dark)" />
                      <span style={{ fontWeight: 600, color: '#442817' }}>
                        Pickup: {order.pickupPoint}
                      </span>
                    </div>
                  </div>

                  {/* Order Items Breakdown */}
                  <div style={{ margin: '12px 0 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          fontSize: '13px',
                        }}
                      >
                        <div>
                          <strong style={{ color: 'var(--text-dark)' }}>
                            {item.quantity}x {item.name}
                          </strong>{' '}
                          <span style={{ fontSize: '11px', color: '#6e5543' }}>
                            ({item.servingSize})
                          </span>
                          {item.combosDescription && (
                            <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 600 }}>
                              ↳ {item.combosDescription}
                            </div>
                          )}
                          {item.addOnsDescription && (
                            <div style={{ fontSize: '11px', color: '#6e5543' }}>
                              ↳ {item.addOnsDescription}
                            </div>
                          )}
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>
                          ₹{item.totalPrice}
                        </span>
                      </div>
                    ))}

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontWeight: 800,
                        fontSize: '15px',
                        color: 'var(--text-dark)',
                        paddingTop: '6px',
                        borderTop: '1px solid #ebd9c5',
                        marginTop: '4px',
                      }}
                    >
                      <span>Order Value</span>
                      <span>₹{order.totalAmount}</span>
                    </div>
                  </div>

                  {/* Rejection / Cancellation notice if applicable */}
                  {isRejected && (
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#991b1b',
                        background: '#fee2e2',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        marginBottom: '10px',
                      }}
                    >
                      Rejected: {order.rejectionReason} • <em>Reserved portions restored</em>
                    </div>
                  )}

                  {/* Action Buttons Depending on Order State */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {isPending && (
                      <>
                        <button
                          onClick={() => acceptOrder(order.id)}
                          style={{
                            flex: 1,
                            padding: '11px',
                            borderRadius: '999px',
                            background: 'var(--brand-yellow)',
                            color: 'var(--text-dark)',
                            fontWeight: 800,
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 12px rgba(245, 166, 35, 0.3)',
                          }}
                        >
                          <CheckCircle2 size={16} />
                          Accept Order
                        </button>

                        <button
                          onClick={() => setRejectModalOrder(order)}
                          style={{
                            padding: '11px 16px',
                            borderRadius: '999px',
                            background: '#fee2e2',
                            color: '#b91c1c',
                            fontWeight: 700,
                            fontSize: '13px',
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {isAccepted && (
                      <button
                        onClick={() => setOrderPreparing(order.id)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '999px',
                          background: '#f97316',
                          color: '#fff',
                          fontWeight: 800,
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <Package size={16} />
                        Move to Kitchen Preparation 📦
                      </button>
                    )}

                    {isPreparing && (
                      <button
                        onClick={() => setOrderReady(order.id)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '999px',
                          background: '#2563eb',
                          color: '#fff',
                          fontWeight: 800,
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <MapPin size={16} />
                        Mark Ready for Counter Pickup 🔔
                      </button>
                    )}

                    {isReady && (
                      <button
                        onClick={() => confirmOrderCollected(order.id)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '999px',
                          background: '#16a34a',
                          color: '#fff',
                          fontWeight: 800,
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                        }}
                      >
                        <Home size={16} />
                        Confirm Student Collected Food 🏠
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Reject Order Confirmation Dialog */}
      <Modal
        isOpen={!!rejectModalOrder}
        title="Decline Mess Order?"
        onClose={() => setRejectModalOrder(null)}
        confirmLabel="Decline & Restore Stock"
        confirmVariant="danger"
        onConfirm={handleConfirmReject}
      >
        <p style={{ fontSize: '13px', color: 'var(--text-cream)', marginBottom: '12px', lineHeight: 1.4 }}>
          Are you sure you want to decline order <strong>{rejectModalOrder?.id}</strong> from{' '}
          <strong>{rejectModalOrder?.studentName}</strong>?
        </p>

        <p style={{ fontSize: '12px', color: 'var(--brand-yellow)', marginBottom: '14px' }}>
          ✓ All reserved food portions will be immediately returned to the mess stock.
        </p>

        <label style={{ fontSize: '12px', color: 'var(--text-cream-muted)', display: 'block', marginBottom: '6px' }}>
          Select or enter reason:
        </label>
        <select
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
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
          <option value="Kitchen capacity exceeded for this slot">
            Kitchen capacity exceeded for this slot
          </option>
          <option value="Raw ingredients out of stock">Raw ingredients out of stock</option>
          <option value="Mess dining session ending">Mess dining session ending</option>
          <option value="Unable to prepare requested custom combo">
            Unable to prepare requested custom combo
          </option>
        </select>
      </Modal>

      <BottomNav role="staff" />
    </div>
  );
};
