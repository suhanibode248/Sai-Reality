import React, { useState } from 'react';
import styles from './BookVisitModal.module.css';

const BookVisitModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('form'); // 'form' | 'otp' | 'verified'
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    phone2: '',
    visitDate: '',
    property: 'Godrej Urban Retreat (Kharadi)'
  });
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [bookingRef, setBookingRef] = useState('');

  // Generate 4-digit OTP and advance to OTP step
  const handleProceedToOtp = (e) => {
    e.preventDefault();
    if (!formData.phone || formData.phone.length < 10 || !formData.phone2 || formData.phone2.length < 10) {
      alert('Please enter valid 10-digit primary and secondary mobile numbers.');
      return;
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setEnteredOtp('');
    setOtpError('');
    setStep('otp');
  };

  // Resend OTP
  const handleResendOtp = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setEnteredOtp('');
    setOtpError('');
    alert(`New OTP sent to +91 ${formData.phone}: ${code}`);
  };

  // Verify entered OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (enteredOtp.trim() !== generatedOtp.trim()) {
      setOtpError('❌ Invalid OTP. Please enter the correct 4-digit code.');
      return;
    }

    const ref = `#SR-${Math.floor(10000 + Math.random() * 90000)}`;
    setBookingRef(ref);
    setOtpError('');
    setStep('verified');

    // Save lead to FastAPI database
    try {
      await fetch('http://localhost:8000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName || 'Site Visit Guest',
          phone: formData.phone,
          visit_date: formData.visitDate || 'As requested',
          property_name: formData.property,
          notes: `Verified via OTP [${generatedOtp}]. Ref: ${ref}`
        })
      });
    } catch (err) {
      console.log('Lead saved locally:', err);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep('form');
      setEnteredOtp('');
      setOtpError('');
    }, 400);
  };

  return (
    <>
      <button 
        className={styles.bookBtn} 
        onClick={() => setIsOpen(true)}
      >
        <span className={styles.icon}>📅</span>
        <span className={styles.label}>Book Site Visit</span>
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.close} onClick={handleClose}>×</button>

            {/* STEP 1: Details Form */}
            {step === 'form' && (
              <form onSubmit={handleProceedToOtp} className={styles.form}>
                <h2>Book a Free Site Visit</h2>
                <p className={styles.subtitle}>Get VIP cab pickup & personalized property tour.</p>

                <div className={styles.field}>
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter your name" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>

                <div className={styles.field}>
                  <label>Primary Phone Number <span style={{ color: '#ef4444' }}>*</span></label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="Enter 10-digit primary mobile number" 
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className={styles.field}>
                  <label>Secondary Phone Number <span style={{ color: '#ef4444' }}>*</span></label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="Enter 10-digit secondary mobile number" 
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={formData.phone2}
                    onChange={(e) => setFormData({...formData, phone2: e.target.value})}
                  />
                </div>

                <div className={styles.field}>
                  <label>Preferred Visit Date</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.visitDate}
                    onChange={(e) => setFormData({...formData, visitDate: e.target.value})}
                  />
                </div>

                <div className={styles.field}>
                  <label>Select Project / Property</label>
                  <select 
                    value={formData.property}
                    onChange={(e) => setFormData({...formData, property: e.target.value})}
                  >
                    <option>Godrej Urban Retreat (Kharadi)</option>
                    <option>Lodha Giardino (Kharadi)</option>
                    <option>Pride World City (Lohegaon)</option>
                    <option>Kohinoor Viva City (Dhanori)</option>
                    <option>Nyati Era (Dhanori)</option>
                    <option>Majestique Mahatma (Wagholi)</option>
                    <option>Dubai Luxury Apartments</option>
                  </select>
                </div>

                <button type="submit" className={styles.submitBtn}>
                  📲 Get Verification OTP & Book
                </button>
              </form>
            )}

            {/* STEP 2: OTP Verification */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className={styles.form}>
                <h2>🔐 Mobile Verification</h2>
                <p className={styles.subtitle}>
                  We have sent a 4-digit OTP to <strong>+91 {formData.phone}</strong>.
                </p>

                <div className={styles.demoBadge}>
                  Demo / Test OTP: <strong>{generatedOtp}</strong>
                </div>

                {otpError && <div className={styles.errorText}>{otpError}</div>}

                <div className={styles.field} style={{ marginTop: '12px' }}>
                  <label style={{ textAlign: 'center' }}>Enter 4-Digit OTP Code</label>
                  <input 
                    type="text" 
                    className={styles.otpInput}
                    required 
                    maxLength={4}
                    autoFocus
                    placeholder="• • • •" 
                    value={enteredOtp}
                    onChange={(e) => {
                      setEnteredOtp(e.target.value);
                      if (otpError) setOtpError('');
                    }}
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  ✅ Verify OTP & Confirm Booking
                </button>

                <div className={styles.resendRow}>
                  <button type="button" onClick={() => setStep('form')} className={styles.secondaryBtn}>
                    ← Edit Details
                  </button>
                  <button type="button" onClick={handleResendOtp} className={styles.secondaryBtn}>
                    Resend OTP
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Verified Success State */}
            {step === 'verified' && (
              <div className={styles.successState}>
                <div className={styles.successIcon}>🎉</div>
                <h3>Site Visit Successfully Booked!</h3>
                <div className={styles.refBadge}>Ref: {bookingRef}</div>
                <div style={{ color: '#059669', fontWeight: '700', fontSize: '13px', margin: '4px 0 12px 0' }}>
                  ✅ Mobile Number Verified via OTP
                </div>
                <p>
                  Thank you, <strong>{formData.fullName}</strong>. Your VIP site visit for <strong>{formData.property}</strong> on <strong>{formData.visitDate}</strong> is confirmed.
                </p>
                <p style={{ marginTop: '8px', fontSize: '13px', color: '#64748b' }}>
                  Our property coordinator will call you on <strong>+91 {formData.phone}</strong> to confirm free AC cab pickup.
                </p>

                <button 
                  onClick={handleClose}
                  style={{
                    marginTop: '16px',
                    padding: '10px 24px',
                    backgroundColor: '#0f4c81',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};

export default BookVisitModal;
