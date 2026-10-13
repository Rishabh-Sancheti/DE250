import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, MapPin, AlertTriangle, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore, CAMPUS_PICKUP_POINTS } from '../../store/cartStore';
import { Header } from '../../components/common/Header';

export const CartScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    updateQuantity,
    removeItem,
    selectedPickupPoint,
    setPickupPoint,
    getSubtotal,
    reconcileWithInventory,
  } = useCartStore();

  const [inventoryWarnings, setInventoryWarnings] = useState<string[]>([]);

  // Check inventory reconciliation on mount
  useEffect(() => {
    const res = reconcileWithInventory();
    if (res.hasChanges) {
      setInventoryWarnings(res.warnings);
    }
  }, []);

  const subtotal = getSubtotal();
  const campusFee = 0; // Demo free
  const total = subtotal + campusFee;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-dark)',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '110px',
      }}
    >
      <Header title="Your Order Tray" showBack={true} showCart={false} />

      <main className="app-content no-bottom-nav" style={{ padding: '16px' }}>
        {/* Inventory Warning Banner */}
        {inventoryWarnings.length > 0 && (
          <div
            style={{
              background: 'rgba(245, 166, 35, 0.15)',
              border: '1px solid rgba(245, 166, 35, 0.4)',
              borderRadius: '16px',
              padding: '12px 14px',
              marginBottom: '16px',
              color: 'var(--brand-yellow)',
              fontSize: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              <AlertTriangle size={15} />
              <span>Live Inventory Adjustment</span>
            </div>
            {inventoryWarnings.map((w, idx) => (
              <p key={idx} style={{ color: 'var(--text-cream)', opacity: 0.9 }}>
                • {w}
              </p>
            ))}
          </div>
        )}

        {items.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'var(--text-cream-muted)',
            }}
          >
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: 'var(--brand-yellow)',
              }}
            >
              <ShoppingBag size={32} />
            </div>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--text-cream)',
                marginBottom: '6px',
              }}
            >
              Your tray is currently empty
            </h2>
            <p style={{ fontSize: '13px', marginBottom: '24px' }}>
              Select delicious campus mess dishes to place your pickup order.
            </p>
            <button
              onClick={() => navigate('/student/home')}
              style={{
                background: 'var(--brand-yellow)',
                color: 'var(--text-dark)',
                padding: '12px 24px',
                borderRadius: '999px',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              Browse Campus Menu
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {items.map((item) => {
                const lineTotal = item.unitPrice * item.quantity;

                return (
                  <div
                    key={item.cartItemId}
                    style={{
                      background: 'var(--surface-cream-card)',
                      borderRadius: '20px',
                      padding: '14px',
                      color: 'var(--text-dark)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/food/paneer_tikka.jpg';
                        }}
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '14px',
                          objectFit: 'cover',
                          background: '#3d2010',
                        }}
                      />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h3
                            style={{
                              fontFamily: 'var(--font-heading)',
                              fontSize: '16px',
                              fontWeight: 700,
                              color: 'var(--text-dark)',
                            }}
                          >
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeItem(item.cartItemId)}
                            style={{
                              color: '#b91c1c',
                              background: '#fee2e2',
                              padding: '5px',
                              borderRadius: '8px',
                              display: 'flex',
                            }}
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div style={{ fontSize: '11px', color: 'var(--text-dark-secondary)', marginTop: '2px' }}>
                          Serving: {item.servingSize} • From {item.originHostel}
                        </div>

                        {/* Combos breakdown */}
                        {item.selectedCombos.length > 0 && (
                          <div style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {item.selectedCombos.map((c) => (
                              <span
                                key={c.comboId}
                                style={{
                                  fontSize: '11px',
                                  background: '#fef3c7',
                                  color: '#92400e',
                                  padding: '2px 6px',
                                  borderRadius: '6px',
                                  fontWeight: 600,
                                }}
                              >
                                + {c.comboName} (₹{c.price})
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Add-ons breakdown */}
                        {item.selectedAddOns.length > 0 && (
                          <div style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {item.selectedAddOns.map((a) => (
                              <span
                                key={a.id}
                                style={{
                                  fontSize: '11px',
                                  background: '#e0e7ff',
                                  color: '#3730a3',
                                  padding: '2px 6px',
                                  borderRadius: '6px',
                                  fontWeight: 600,
                                }}
                              >
                                + {a.name} (₹{a.price})
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price and Quantity Controller */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '8px',
                        borderTop: '1px solid #ebd9c5',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-dark)' }}>
                          ₹{lineTotal}
                        </span>
                        {item.quantity > 1 && (
                          <span style={{ fontSize: '11px', color: 'var(--text-dark-secondary)' }}>
                            (₹{item.unitPrice} each)
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          background: '#f2e3cf',
                          padding: '3px 8px',
                          borderRadius: '999px',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'var(--brand-yellow)',
                            color: 'var(--text-dark)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Minus size={13} strokeWidth={2.5} />
                        </button>
                        <span style={{ fontSize: '14px', fontWeight: 800, minWidth: '14px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'var(--brand-yellow)',
                            color: 'var(--text-dark)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Plus size={13} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Campus Pickup Point Selector */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(250, 239, 224, 0.12)',
                borderRadius: '20px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <MapPin size={18} color="var(--brand-yellow)" />
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-cream)' }}>
                  Campus Pickup Point
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {CAMPUS_PICKUP_POINTS.map((pp) => {
                  const isSelected = selectedPickupPoint === pp.name;

                  return (
                    <label
                      key={pp.id}
                      onClick={() => setPickupPoint(pp.name)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: isSelected ? 'rgba(245, 166, 35, 0.15)' : 'rgba(0, 0, 0, 0.25)',
                        border: isSelected
                          ? '1.5px solid var(--brand-yellow)'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-cream)' }}>
                          {pp.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-cream-muted)' }}>
                          {pp.locationDetails}
                        </div>
                      </div>

                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: isSelected ? '5px solid var(--brand-yellow)' : '2px solid #75553e',
                          background: isSelected ? '#fff' : 'transparent',
                        }}
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Bill Details */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(250, 239, 224, 0.12)',
                borderRadius: '20px',
                padding: '16px',
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-cream)', marginBottom: '12px' }}>
                Bill Breakdown
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-cream-muted)' }}>
                  <span>Item Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-cream-muted)' }}>
                  <span>Campus Ordering Fee</span>
                  <span style={{ color: '#4ade80' }}>FREE (Demo)</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 800,
                    fontSize: '16px',
                    color: 'var(--text-cream)',
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <span>To Pay</span>
                  <span style={{ color: 'var(--brand-yellow)' }}>₹{total}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sticky Bottom Proceed Button */}
      {items.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            maxWidth: '440px',
            margin: '0 auto',
            padding: '14px 18px',
            background: 'rgba(36, 20, 10, 0.96)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(250, 239, 224, 0.1)',
            zIndex: 40,
          }}
        >
          <button
            onClick={() => navigate('/student/payment')}
            style={{
              width: '100%',
              padding: '15px 20px',
              borderRadius: '999px',
              background: 'var(--brand-yellow)',
              color: 'var(--text-dark)',
              fontWeight: 800,
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(245, 166, 35, 0.4)',
            }}
          >
            <span>Proceed to Payment</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>₹{total}</span>
              <ArrowRight size={18} />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
