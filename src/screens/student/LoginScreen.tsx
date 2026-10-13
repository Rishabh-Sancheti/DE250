import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ShieldCheck, Info } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { loginStudent, loginStaff, demoOtp } = useAuthStore();

  const [name, setName] = useState('');
  const [hostel, setHostel] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!hostel.trim()) {
      setError('Please enter your hostel name/room number.');
      return;
    }
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setOtpSent(true);
    setOtp(demoOtp); // pre-populate with convenience for demo
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otpSent) {
      setError('Please click "Send OTP" first.');
      return;
    }

    if (otp.trim() !== demoOtp) {
      setError(`Invalid OTP. For demo testing, please use "${demoOtp}".`);
      return;
    }

    loginStudent({
      name: name.trim(),
      hostelNumber: hostel.trim(),
      phoneNumber: phone.trim(),
    });

    navigate('/student/home');
  };

  const handleQuickStudentDemo = () => {
    loginStudent({
      name: 'Rohan Sharma',
      hostelNumber: 'Hostel 4, Room 302',
      phoneNumber: '9876543210',
    });
    navigate('/student/home');
  };

  const handleEnterStaff = () => {
    loginStaff();
    navigate('/staff/dashboard');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '36px 24px 20px',
        backgroundColor: 'var(--bg-dark)',
        textAlign: 'center',
      }}
    >
      {/* Top Branding Section */}
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', marginBottom: '8px' }}>
          <img
            src="/assets/logo.png"
            alt="Replate Campus Food"
            style={{
              width: '130px',
              height: '130px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))',
            }}
          />
        </div>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-cream-muted)',
            marginTop: '2px',
            letterSpacing: '0.02em',
          }}
        >
          Campus Mess Food Ordering & Portion Management
        </p>
      </div>

      {/* Form Fields Section */}
      <div style={{ margin: '24px 0', width: '100%', maxWidth: '340px', alignSelf: 'center' }}>
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              color: '#fca5a5',
              fontSize: '13px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textAlign: 'left',
            }}
          >
            <Info size={16} shrink-0="true" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={otpSent ? handleVerify : handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Name Field */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={otpSent}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '999px',
                background: 'rgba(56, 32, 16, 0.55)',
                border: '1.5px solid rgba(227, 210, 190, 0.35)',
                color: 'var(--text-cream)',
                fontSize: '14px',
                textAlign: 'left',
              }}
            />
          </div>

          {/* Hostel Field */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Enter Hostel number (e.g. Hostel 4, Room 204)"
              value={hostel}
              onChange={(e) => setHostel(e.target.value)}
              disabled={otpSent}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '999px',
                background: 'rgba(56, 32, 16, 0.55)',
                border: '1.5px solid rgba(227, 210, 190, 0.35)',
                color: 'var(--text-cream)',
                fontSize: '14px',
                textAlign: 'left',
              }}
            />
          </div>

          {/* Phone Field */}
          <div style={{ position: 'relative' }}>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
              disabled={otpSent}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '999px',
                background: 'rgba(56, 32, 16, 0.55)',
                border: '1.5px solid rgba(227, 210, 190, 0.35)',
                color: 'var(--text-cream)',
                fontSize: '14px',
                textAlign: 'left',
              }}
            />
          </div>

          {/* Send OTP button or OTP Input */}
          {!otpSent ? (
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '999px',
                backgroundColor: 'var(--brand-yellow)',
                color: 'var(--text-dark)',
                fontSize: '15px',
                fontWeight: 800,
                letterSpacing: '0.02em',
                boxShadow: '0 4px 14px rgba(245, 166, 35, 0.35)',
                marginTop: '4px',
              }}
            >
              Send OTP
            </button>
          ) : (
            <>
              <div
                style={{
                  background: 'rgba(245, 166, 35, 0.12)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  color: 'var(--brand-yellow)',
                  border: '1px dashed rgba(245, 166, 35, 0.4)',
                }}
              >
                Demo test OTP: <strong>123456</strong>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: '999px',
                    background: 'rgba(56, 32, 16, 0.85)',
                    border: '2px solid var(--brand-yellow)',
                    color: 'var(--text-cream)',
                    fontSize: '16px',
                    fontWeight: 700,
                    letterSpacing: '4px',
                    textAlign: 'center',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--brand-yellow)',
                  color: 'var(--text-dark)',
                  fontSize: '15px',
                  fontWeight: 800,
                  boxShadow: '0 4px 14px rgba(245, 166, 35, 0.35)',
                }}
              >
                Verify & Continue
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                style={{
                  color: 'var(--text-cream-muted)',
                  fontSize: '12px',
                  textDecoration: 'underline',
                  background: 'none',
                  padding: '4px',
                }}
              >
                Change details / Resend OTP
              </button>
            </>
          )}
        </form>

        {/* Quick Demo Student shortcut button */}
        <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(250, 239, 224, 0.08)' }}>
          <button
            onClick={handleQuickStudentDemo}
            type="button"
            style={{
              fontSize: '12px',
              color: 'var(--text-cream-muted)',
              background: 'rgba(255, 255, 255, 0.06)',
              padding: '6px 14px',
              borderRadius: '999px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            ⚡ Quick 1-Click Student Login (Rohan, Hostel 4)
          </button>
        </div>
      </div>

      {/* Staff Entrance Option & Footer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
        <button
          onClick={handleEnterStaff}
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--brand-yellow)',
            background: 'rgba(245, 166, 35, 0.12)',
            padding: '8px 18px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 700,
            border: '1px solid rgba(245, 166, 35, 0.3)',
          }}
        >
          <ShieldCheck size={15} />
          Mess Staff? Enter Kitchen Dashboard
        </button>

        <p
          style={{
            fontSize: '11px',
            color: 'var(--text-cream-muted)',
            opacity: 0.7,
            letterSpacing: '0.04em',
          }}
        >
          replate. Rights reserved 2026
        </p>
      </div>
    </div>
  );
};
