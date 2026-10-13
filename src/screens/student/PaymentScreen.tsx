import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { ShieldCheck, ArrowLeft, Loader2, CheckCircle2, AlertCircle, Smartphone } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';
import { Header } from '../../components/common/Header';

export const PaymentScreen: React.FC = () => {
  const navigate = useNavigate();
  const { items, selectedPickupPoint, getSubtotal, clearCart } = useCartStore();
  const { studentProfile } = useAuthStore();
  const createOrder = useOrderStore((s) => s.createOrder);

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'counter'>('upi');
  const [upiId, setUpiId] = useState('student@okcampus');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const total = subtotal;

  if (items.length === 0) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-dark)',
        }}
      >
        <p style={{ color: 'var(--text-cream-muted)', marginBottom: '16px' }}>
          Your order tray is empty.
        </p>
        <button
          onClick={() => navigate('/student/home')}
          style={{
            background: 'var(--brand-yellow)',
            color: 'var(--text-dark)',
            padding: '10px 20px',
            borderRadius: '999px',
            fontWeight: 700,
          }}
        >
          Return to Menu
        </button>
      </div>
    );
  }

  const handlePay = () => {
    setErrorMessage(null);
    setIsProcessing(true);

    // Simulated 1.5s payment delay
    setTimeout(() => {
      const student = studentProfile || {
        name: 'Demo Student',
        hostelNumber: 'Hostel 4',
        phoneNumber: '9876543210',
      };

      const result = createOrder(student, items, selectedPickupPoint);

      if (!result.success) {
        setIsProcessing(false);
        setErrorMessage(result.error || 'Failed to place order.');
        return;
      }

      // Fire victory confetti!
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f5a623', '#faefe0', '#34d399'],
        });
      } catch (e) {
        // ignore
      }

      clearCart();
      setIsProcessing(false);
      navigate(`/student/order/${result.orderId}`);
    }, 1400);
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
      <Header title="Demo Checkout Payment" showBack={true} showCart={false} />

      <main className="app-content no-bottom-nav" style={{ padding: '20px' }}>
        {/* Notice of Simulation */}
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            borderRadius: '16px',
            padding: '12px 14px',
            marginBottom: '20px',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start',
            color: '#93c5fd',
            fontSize: '12px',
          }}
        >
          <ShieldCheck size={18} shrink-0="true" color="#60a5fa" />
          <div>
            <strong style={{ color: '#bfdbfe' }}>Interactive Demo Mode:</strong> No real bank accounts or
            monetary transactions occur. Portions will be reserved immediately in the mess kitchen.
          </div>
        </div>

        {errorMessage && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '16px',
              padding: '12px 14px',
              marginBottom: '20px',
              color: '#fca5a5',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={16} shrink-0="true" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Amount Card */}
        <div
          style={{
            background: 'var(--surface-cream-card)',
            borderRadius: '22px',
            padding: '20px',
            textAlign: 'center',
            color: 'var(--text-dark)',
            marginBottom: '20px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
          }}
        >
          <span style={{ fontSize: '13px', color: 'var(--text-dark-secondary)', fontWeight: 600 }}>
            Payable Amount
          </span>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '36px',
              fontWeight: 800,
              color: 'var(--text-dark)',
              margin: '4px 0 10px',
            }}
          >
            ₹{total}
          </div>
          <div
            style={{
              fontSize: '12px',
              background: '#f2e3cf',
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '999px',
              color: 'var(--text-dark)',
              fontWeight: 600,
            }}
          >
            Pickup: {selectedPickupPoint}
          </div>
        </div>

        {/* Payment Methods */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-cream)', marginBottom: '12px' }}>
            Choose Demo Payment Method
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* UPI Option */}
            <div
              onClick={() => setPaymentMethod('upi')}
              style={{
                background: paymentMethod === 'upi' ? 'rgba(245, 166, 35, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border:
                  paymentMethod === 'upi'
                    ? '1.5px solid var(--brand-yellow)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '14px',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'rgba(245, 166, 35, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--brand-yellow)',
                    }}
                  >
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-cream)' }}>
                      Campus UPI (Simulated)
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-cream-muted)' }}>
                      Instant confirmation via UPI QR / VPA
                    </div>
                  </div>
                </div>
                {paymentMethod === 'upi' && <CheckCircle2 size={18} color="var(--brand-yellow)" />}
              </div>

              {paymentMethod === 'upi' && (
                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="Enter UPI VPA (e.g. name@upi)"
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(250, 239, 224, 0.2)',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      color: 'var(--text-cream)',
                      fontSize: '13px',
                    }}
                  />
                </div>
              )}
            </div>

            {/* Pay at Mess Counter */}
            <div
              onClick={() => setPaymentMethod('counter')}
              style={{
                background:
                  paymentMethod === 'counter' ? 'rgba(245, 166, 35, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border:
                  paymentMethod === 'counter'
                    ? '1.5px solid var(--brand-yellow)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-cream)' }}>
                  Demo Pay at Pickup Counter
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-cream-muted)' }}>
                  Settle at mess coupon window upon collection
                </div>
              </div>
              {paymentMethod === 'counter' && <CheckCircle2 size={18} color="var(--brand-yellow)" />}
            </div>
          </div>
        </div>

        {/* Confirmation Button */}
        <button
          onClick={handlePay}
          disabled={isProcessing}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '999px',
            background: 'var(--brand-yellow)',
            color: 'var(--text-dark)',
            fontWeight: 800,
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 18px rgba(245, 166, 35, 0.4)',
            cursor: isProcessing ? 'wait' : 'pointer',
            opacity: isProcessing ? 0.8 : 1,
          }}
        >
          {isProcessing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Verifying Demo Payment & Reserving Stock...</span>
            </>
          ) : (
            <span>Pay ₹{total} (Demo) & Place Order</span>
          )}
        </button>

        <button
          onClick={() => navigate('/student/cart')}
          style={{
            width: '100%',
            marginTop: '12px',
            padding: '10px',
            color: 'var(--text-cream-muted)',
            fontSize: '13px',
            textAlign: 'center',
          }}
        >
          Cancel and return to cart
        </button>
      </main>
    </div>
  );
};
