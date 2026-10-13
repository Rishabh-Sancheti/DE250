import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';
import { useFeedbackStore } from '../../store/feedbackStore';
import { StarRating } from '../../components/common/StarRating';

export const FeedbackScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, markFeedbackSubmitted } = useOrderStore();
  const { addFeedback, getFeedbackForOrder } = useFeedbackStore();

  const order = getOrderById(id || '');
  const existingFeedback = getFeedbackForOrder(id || '');

  const [taste, setTaste] = useState(existingFeedback ? existingFeedback.tasteRating : 5);
  const [quality, setQuality] = useState(existingFeedback ? existingFeedback.qualityRating : 5);
  const [pickupTime, setPickupTime] = useState(existingFeedback ? existingFeedback.pickupTimeRating : 4);
  const [appEase, setAppEase] = useState(existingFeedback ? existingFeedback.appEaseRating : 5);
  const [comments, setComments] = useState(existingFeedback ? existingFeedback.comments : '');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const overall = Number(((taste + quality + pickupTime + appEase) / 4).toFixed(1));

    addFeedback({
      orderId: id || 'DEMO-ORDER',
      studentName: order?.studentName || 'Student',
      tasteRating: taste,
      qualityRating: quality,
      pickupTimeRating: pickupTime,
      appEaseRating: appEase,
      overallRating: overall,
      comments: comments.trim(),
      submittedAt: new Date().toISOString(),
    });

    if (id) {
      markFeedbackSubmitted(id);
    }

    setSubmitted(true);
    setTimeout(() => {
      navigate('/student/home');
    }, 1200);
  };

  const handleSkip = () => {
    navigate('/student/home');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-dark)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 20px',
      }}
    >
      {/* Top Header matching UI reference Phone 5 */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '24px',
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '22px',
                fontWeight: 800,
                color: 'var(--text-cream)',
                lineHeight: 1.2,
              }}
            >
              Feedback:
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--text-cream)', fontWeight: 600, marginTop: '2px' }}>
              Rate your last order {order ? `(#${order.id})` : ''}
            </p>
          </div>

          <button
            onClick={handleSkip}
            style={{
              color: 'var(--text-cream-muted)',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              padding: '6px 10px',
              background: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '999px',
            }}
          >
            <span>Skip</span>
            <X size={14} />
          </button>
        </div>

        {submitted ? (
          <div
            style={{
              background: 'var(--surface-cream-card)',
              borderRadius: '24px',
              padding: '40px 20px',
              textAlign: 'center',
              color: 'var(--text-dark)',
              marginTop: '40px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Check size={32} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Thank you for your rating!</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-dark-secondary)', marginTop: '6px' }}>
              Your feedback helps our campus mess team improve food taste and pickup times.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Criteria 1: Taste */}
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-cream)', marginBottom: '8px' }}>
                Taste
              </div>
              <StarRating rating={taste} size={30} interactive={true} onChange={setTaste} />
            </div>

            {/* Criteria 2: Quality */}
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-cream)', marginBottom: '8px' }}>
                Quality
              </div>
              <StarRating rating={quality} size={30} interactive={true} onChange={setQuality} />
            </div>

            {/* Criteria 3: Pickup/Delivery Time */}
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-cream)', marginBottom: '8px' }}>
                Pickup time & service
              </div>
              <StarRating rating={pickupTime} size={30} interactive={true} onChange={setPickupTime} />
            </div>

            {/* Criteria 4: Ease of using app */}
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-cream)', marginBottom: '8px' }}>
                Ease of using app
              </div>
              <StarRating rating={appEase} size={30} interactive={true} onChange={setAppEase} />
            </div>

            {/* Written suggestions textarea - Cream card in Phone 5 */}
            <div style={{ marginTop: '8px' }}>
              <label
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--text-cream)',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                How can we improve?
              </label>

              <textarea
                rows={4}
                placeholder="How can we improve?"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--surface-cream-card)',
                  border: '1.5px solid var(--surface-cream-border)',
                  borderRadius: '18px',
                  padding: '14px 16px',
                  color: 'var(--text-dark)',
                  fontSize: '14px',
                  resize: 'none',
                }}
              />
            </div>
          </form>
        )}
      </div>

      {/* Dark Pill Submit Button matching Phone 5 reference */}
      {!submitted && (
        <div style={{ marginTop: '24px' }}>
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '999px',
              backgroundColor: '#3b2010',
              border: '1px solid rgba(227, 210, 190, 0.4)',
              color: 'var(--text-cream)',
              fontSize: '16px',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
              cursor: 'pointer',
              letterSpacing: '0.02em',
            }}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};
