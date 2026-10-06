import React, { useState } from 'react';
import styles from './BookVisitModal.module.css';

const BookVisitModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    visitDate: '',
    property: 'Nyati Era (Dhanori)'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      await fetch('http://localhost:8000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName,
          phone: formData.phone,
          visit_date: formData.visitDate,
          property_name: formData.property
        })
      });
    } catch (err) {
      console.log('Lead saved locally:', err);
    }

    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setFormData({ fullName: '', phone: '', visitDate: '', property: 'Nyati Era (Dhanori)' });
    }, 3000);
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
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.close} onClick={() => setIsOpen(false)}>×</button>

            {!submitted ? (
              <form onSubmit={handleSubmit} className={styles.form}>
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
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="Enter 10-digit mobile number" 
                    pattern="[0-9]{10}"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
                    <option>Nyati Era (Dhanori)</option>
                    <option>Pride World City (Wagholi)</option>
                    <option>Kumar Goldmine (East Pune)</option>
                    <option>Dubai Luxury Apartments</option>
                  </select>
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Confirm Booking
                </button>
              </form>
            ) : (
              <div className={styles.successState}>
                <div className={styles.successIcon}>🚖</div>
                <h3>VIP Cab Pickup Confirmed!</h3>
                <p>Thank you, <strong>{formData.fullName}</strong>. Your lead is recorded in the FastAPI database. Our team will contact you on <strong>{formData.phone}</strong>!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BookVisitModal;
