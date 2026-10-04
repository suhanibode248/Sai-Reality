import React from 'react'
import styles from './HeroSection.module.css'

/**
 * HeroSection — full-width hero banner with title, subtitle, description
 * and call-to-action buttons. All content comes from FastAPI /home-data.
 */
function HeroSection({ title, subtitle, description, contact }) {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.overlay} />
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Badge */}
          <span className={styles.badge}>
            <i className="fa fa-star" /> Trusted Real Estate Partner
          </span>

          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          <p className={styles.desc}>{description}</p>

          {/* Call-to-action buttons */}
          <div className={styles.ctaGroup}>
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noreferrer"
              className={styles.ctaPrimary}
            >
              <i className="fab fa-whatsapp" /> WhatsApp Us
            </a>
            <a href={`tel:${contact.phone1}`} className={styles.ctaSecondary}>
              <i className="fa fa-phone" /> {contact.phone1}
            </a>
          </div>

          {/* Quick contact pills */}
          <div className={styles.contactPills}>
            <span className={styles.pill}>
              <i className="fa fa-location-dot" /> {contact.address}
            </span>
            <span className={styles.pill}>
              <i className="fa fa-envelope" /> {contact.email}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
