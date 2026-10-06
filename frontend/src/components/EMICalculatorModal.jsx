import React, { useState } from 'react';
import styles from './EMICalculatorModal.module.css';

const EMICalculatorModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loanAmount, setLoanAmount] = useState(5000000); // 50 Lakhs
  const [interestRate, setInterestRate] = useState(8.5); // 8.5%
  const [tenureYears, setTenureYears] = useState(20); // 20 years

  const calculateEMI = () => {
    const p = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;
    if (r === 0) return p / n;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  };

  const monthlyEMI = calculateEMI();
  const totalPayment = monthlyEMI * tenureYears * 12;
  const totalInterest = totalPayment - loanAmount;

  const principalPercent = Math.round((loanAmount / totalPayment) * 100);
  const interestPercent = 100 - principalPercent;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <>
      <button 
        className={styles.launcherBtn} 
        onClick={() => setIsOpen(!isOpen)}
        title="Calculate Home Loan EMI"
      >
        <span className={styles.icon}>🧮</span>
        <span className={styles.label}>EMI Calculator</span>
      </button>

      {isOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Home Loan EMI Calculator</h3>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.inputGroup}>
                <div className={styles.labelRow}>
                  <label>Loan Amount</label>
                  <span className={styles.valueDisplay}>{formatCurrency(loanAmount)}</span>
                </div>
                <input 
                  type="range" 
                  min="500000" 
                  max="30000000" 
                  step="100000"
                  value={loanAmount} 
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                />
                <div className={styles.rangeLabels}>
                  <span>₹5 L</span>
                  <span>₹3 Cr</span>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.labelRow}>
                  <label>Interest Rate (% p.a.)</label>
                  <span className={styles.valueDisplay}>{interestRate}%</span>
                </div>
                <input 
                  type="range" 
                  min="6.5" 
                  max="15.0" 
                  step="0.1"
                  value={interestRate} 
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                />
                <div className={styles.rangeLabels}>
                  <span>6.5%</span>
                  <span>15.0%</span>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.labelRow}>
                  <label>Loan Tenure (Years)</label>
                  <span className={styles.valueDisplay}>{tenureYears} Years</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  step="1"
                  value={tenureYears} 
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                />
                <div className={styles.rangeLabels}>
                  <span>1 Yr</span>
                  <span>30 Yrs</span>
                </div>
              </div>

              <div className={styles.resultsCard}>
                <div className={styles.mainEMI}>
                  <span className={styles.emiTitle}>Monthly Payment (EMI)</span>
                  <span className={styles.emiAmount}>{formatCurrency(monthlyEMI)}</span>
                </div>

                <div className={styles.progressBar}>
                  <div className={styles.principalFill} style={{ width: `${principalPercent}%` }} />
                  <div className={styles.interestFill} style={{ width: `${interestPercent}%` }} />
                </div>

                <div className={styles.breakdownDetails}>
                  <div className={styles.detailItem}>
                    <span className={`${styles.dot} ${styles.principalDot}`}></span>
                    <span>Principal: <strong>{formatCurrency(loanAmount)}</strong></span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={`${styles.dot} ${styles.interestDot}`}></span>
                    <span>Interest: <strong>{formatCurrency(totalInterest)}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EMICalculatorModal;
