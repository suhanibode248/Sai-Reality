import React, { useState } from 'react';
import styles from './VirtualTourModal.module.css';

const VirtualTourModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className={styles.tourBtn} 
        onClick={() => setIsOpen(true)}
      >
        <span className={styles.icon}>360°</span>
        <span className={styles.label}>360° Virtual Tour</span>
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <h3>360° Virtual Property Walkthrough</h3>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
            </div>
            <div className={styles.videoContainer}>
              <iframe 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="360 Property Tour" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VirtualTourModal;
