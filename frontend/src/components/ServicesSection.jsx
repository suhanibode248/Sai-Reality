import React from 'react'
import styles from './ServicesSection.module.css'

/**
 * ServicesSection — grid of service cards.
 * services prop = array of { icon, title, description } from FastAPI.
 */
function ServicesSection({ services }) {
  return (
    <section className={styles.section} id="services">
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>
            Our <span>Services</span>
          </h2>
          <p className={styles.sectionSub}>
            Comprehensive real estate solutions for every need
          </p>
        </div>
        <div className={styles.grid}>
          {services.map((svc, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.iconWrap}>
                <i className={`fa ${svc.icon}`} />
              </div>
              <h3 className={styles.cardTitle}>{svc.title}</h3>
              <p className={styles.cardDesc}>{svc.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
