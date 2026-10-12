import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../api/config';

const GOLD = '#c9a227';
const SHIMMER_GOLD = '#f5d98b';
const DEEP_GOLD = '#7a6010';
const DARK = '#1a1a1a';

const shimmerKeyframes = `
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes glow {
  0%, 100% { box-shadow: 0 0 8px rgba(201,162,39,0.4), 0 0 24px rgba(201,162,39,0.2); }
  50%       { box-shadow: 0 0 20px rgba(201,162,39,0.8), 0 0 48px rgba(201,162,39,0.4); }
}
@keyframes sparkle {
  0%,100%{ opacity:0; transform:scale(0.5); }
  50%    { opacity:1; transform:scale(1.2); }
}
`;

const shimmerBtnStyle = {
  width: '100%',
  padding: '14px',
  border: 'none',
  borderRadius: 6,
  fontSize: 15,
  fontWeight: 800,
  cursor: 'pointer',
  letterSpacing: '1px',
  background: `linear-gradient(90deg, ${DEEP_GOLD} 0%, ${GOLD} 30%, ${SHIMMER_GOLD} 50%, ${GOLD} 70%, ${DEEP_GOLD} 100%)`,
  backgroundSize: '400px 100%',
  color: '#1a1a00',
  animation: 'shimmer 2.5s linear infinite, glow 2s ease-in-out infinite',
  position: 'relative',
  overflow: 'hidden',
  textTransform: 'uppercase',
};

export function isAuthenticated() {
  try {
    const token = localStorage.getItem('cp_visitor_token');
    return !!token;
  } catch {
    return false;
  }
}

export function clearAuth() {
  try { localStorage.removeItem('cp_visitor_token'); localStorage.removeItem('cp_visitor_name'); } catch {}
}

export default function AuthGate({ children, projectName = '' }) {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState('register'); // 'register' | 'login'
  const [step, setStep] = useState('form');   // 'form' | 'otp'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCd, setResendCd] = useState(0);

  useEffect(() => {
    setAuthed(isAuthenticated());
  }, []);

  useEffect(() => {
    if (resendCd <= 0) return;
    const t = setTimeout(() => setResendCd(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCd]);

  if (authed) return children;

  const sendOtp = async () => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10) { setError('Enter valid 10-digit mobile number.'); return; }
    if (tab === 'register' && !name.trim()) { setError('Please enter your name.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleaned, name: name.trim() }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setStep('otp');
        setResendCd(30);
        if (data.dev_otp) setDevOtp(data.dev_otp);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch {
      setError('Network error. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length < 6) { setError('Enter the 6-digit OTP.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.replace(/\D/g, ''), otp, name: name.trim() }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        localStorage.setItem('cp_visitor_token', data.token);
        localStorage.setItem('cp_visitor_name', data.name);
        // Also submit as lead
        fetch(`${API_BASE_URL}/api/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ full_name: data.name, phone: data.phone, property_name: projectName, notes: 'Registered via landing page OTP' }),
        }).catch(() => {});
        setAuthed(true);
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setStep('form'); setOtp(''); setError(''); setDevOtp(''); };
  const switchTab = (t) => { setTab(t); reset(); setName(''); setPhone(''); };

  return (
    <>
      <style>{shimmerKeyframes}</style>
      {/* Blurred background preview */}
      <div style={{ filter: 'blur(4px)', opacity: 0.35, pointerEvents: 'none', userSelect: 'none', position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        {children}
      </div>

      {/* Full-screen overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(10,8,0,0.82)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}>
        {/* Sparkles */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: `${[10,20,70,80,15,85][i]}%`,
            left: `${[5,90,8,85,50,45][i]}%`,
            width: 8, height: 8, borderRadius: '50%',
            background: SHIMMER_GOLD,
            animation: `sparkle ${1.5 + i * 0.4}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }} />
        ))}

        {/* Card */}
        <div style={{
          background: '#0f0e00',
          border: `1.5px solid ${GOLD}`,
          borderRadius: 16,
          width: '100%', maxWidth: 420,
          padding: '36px 32px 32px',
          animation: 'fadeInUp 0.4s ease',
          position: 'relative',
          boxShadow: `0 0 0 1px rgba(201,162,39,0.2), 0 8px 48px rgba(0,0,0,0.7), 0 0 80px rgba(201,162,39,0.08)`,
        }}>
          {/* Gold line top */}
          <div style={{
            position: 'absolute', top: 0, left: 32, right: 32, height: 3, borderRadius: 2,
            background: `linear-gradient(90deg, transparent, ${GOLD}, ${SHIMMER_GOLD}, ${GOLD}, transparent)`,
            backgroundSize: '300px 100%',
            animation: 'shimmer 2s linear infinite',
          }} />

          {/* Logo + Title */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <img src="/sai_reality_header_logo.png" alt="SAI Reality" style={{ height: 52, marginBottom: 12, filter: 'brightness(1.2)' }}
              onError={e => e.target.style.display = 'none'} />
            <h2 style={{
              color: GOLD, fontSize: 22, fontWeight: 800, margin: 0,
              background: `linear-gradient(90deg, ${DEEP_GOLD}, ${SHIMMER_GOLD}, ${DEEP_GOLD})`,
              backgroundSize: '300px 100%',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              animation: 'shimmer 2.5s linear infinite',
            }}>Certified Properties</h2>
            <p style={{ color: '#aaa', fontSize: 13, margin: '4px 0 0' }}>
              {step === 'otp' ? `OTP sent to +91 ${phone.slice(-10)}` : 'Register or Login to view details'}
            </p>
          </div>

          {/* Tabs */}
          {step === 'form' && (
            <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', marginBottom: 24, border: `1px solid rgba(201,162,39,0.3)` }}>
              {['register', 'login'].map(t => (
                <button key={t} onClick={() => switchTab(t)} style={{
                  flex: 1, padding: '10px', border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: 14, textTransform: 'capitalize', letterSpacing: '0.5px',
                  background: tab === t ? `linear-gradient(135deg, ${GOLD}, ${DEEP_GOLD})` : 'rgba(255,255,255,0.04)',
                  color: tab === t ? '#0f0e00' : '#888',
                  transition: 'all 0.2s',
                }}>
                  {t === 'register' ? '🔑 Register' : '🔐 Login'}
                </button>
              ))}
            </div>
          )}

          {/* Form fields */}
          {step === 'form' && (
            <div style={{ animation: 'fadeInUp 0.3s ease' }}>
              {tab === 'register' && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ color: '#aaa', fontSize: 12, display: 'block', marginBottom: 6 }}>Full Name *</label>
                  <input
                    type="text" placeholder="Enter your full name"
                    value={name} onChange={e => setName(e.target.value)}
                    style={fieldStyle}
                    onFocus={e => e.target.style.borderColor = GOLD}
                    onBlur={e => e.target.style.borderColor = 'rgba(201,162,39,0.3)'}
                  />
                </div>
              )}
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#aaa', fontSize: 12, display: 'block', marginBottom: 6 }}>Mobile Number *</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,162,39,0.3)', borderRadius: 8, overflow: 'hidden' }}>
                  <span style={{ padding: '12px 12px', color: '#aaa', fontSize: 14, borderRight: '1px solid rgba(201,162,39,0.2)', whiteSpace: 'nowrap' }}>🇮🇳 +91</span>
                  <input
                    type="tel" placeholder="10-digit mobile number"
                    value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    style={{ ...fieldStyle, border: 'none', background: 'transparent', borderRadius: 0 }}
                    maxLength={10}
                  />
                </div>
              </div>
              {error && <p style={{ color: '#ff6b6b', fontSize: 12, marginBottom: 12 }}>⚠ {error}</p>}
              <button onClick={sendOtp} style={shimmerBtnStyle} disabled={loading}>
                {loading ? '⏳ Sending...' : '📱 Send OTP'}
              </button>
            </div>
          )}

          {/* OTP verification */}
          {step === 'otp' && (
            <div style={{ animation: 'fadeInUp 0.3s ease' }}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: '#aaa', fontSize: 12, display: 'block', marginBottom: 8 }}>Enter 6-digit OTP</label>
                <input
                  type="text" placeholder="- - - - - -"
                  value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  style={{ ...fieldStyle, textAlign: 'center', fontSize: 28, letterSpacing: 14, fontWeight: 800, color: GOLD }}
                  autoFocus
                />
                {devOtp && (
                  <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(201,162,39,0.1)', border: `1px solid rgba(201,162,39,0.3)`, borderRadius: 6, textAlign: 'center' }}>
                    <span style={{ color: '#aaa', fontSize: 11 }}>Your OTP: </span>
                    <span style={{ color: SHIMMER_GOLD, fontSize: 20, fontWeight: 800, letterSpacing: 6 }}>{devOtp}</span>
                  </div>
                )}
              </div>
              {error && <p style={{ color: '#ff6b6b', fontSize: 12, marginBottom: 12 }}>⚠ {error}</p>}
              <button onClick={verifyOtp} style={shimmerBtnStyle} disabled={loading}>
                {loading ? '⏳ Verifying...' : '✅ Verify & Continue'}
              </button>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
                <button onClick={reset} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 12 }}>
                  ← Change number
                </button>
                <button onClick={sendOtp} style={{ background: 'none', border: 'none', color: resendCd > 0 ? '#555' : GOLD, cursor: resendCd > 0 ? 'default' : 'pointer', fontSize: 12 }} disabled={resendCd > 0 || loading}>
                  {resendCd > 0 ? `Resend in ${resendCd}s` : 'Resend OTP'}
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <p style={{ color: '#555', fontSize: 11, textAlign: 'center', marginTop: 20, marginBottom: 0 }}>
            By continuing, you agree to our Terms &amp; Privacy Policy.<br />
            <span style={{ color: '#888' }}>MahaRERA Reg No. A52100012381</span>
          </p>
        </div>
      </div>
    </>
  );
}

const fieldStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(201,162,39,0.3)',
  borderRadius: 8,
  padding: '12px 14px',
  color: '#fff',
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};
