import React from 'react'
import styles from './FeaturedProjects.module.css'

/**
 * FeaturedProjects — horizontal scrollable project cards.
 * projects prop = array of { title, location, price, area, status } from FastAPI.
 */
function FeaturedProjects({ projects }) {
  const statusColour = (status) => {
    switch (status.toLowerCase()) {
      case 'featured':         return styles.badgeFeatured
      case 'ready':            return styles.badgeReady
      case 'under construction': return styles.badgeUnder
      default:                 return styles.badgeDefault
    }
  }

  return (
    <section className={styles.section} id="projects">
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>
            Featured <span>Projects</span>
          </h2>
          <p className={styles.sectionSub}>Explore our best projects across Pune</p>
        </div>

        <div className={styles.scrollWrapper}>
          {projects.map((proj, i) => (
            <div key={i} className={styles.card}>
              {/* Placeholder image block */}
              <div className={styles.imgBlock}>
                <div className={styles.imgPlaceholder}>
                  <i className="fa fa-building" />
                </div>
                <span className={`${styles.badge} ${statusColour(proj.status)}`}>
                  {proj.status}
                </span>
                <span className={styles.priceBadge}>{proj.price}</span>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.projTitle}>{proj.title}</h3>
                <p className={styles.projLocation}>
                  <i className="fa fa-location-dot" /> {proj.location}
                </p>
                <div className={styles.meta}>
                  <span>
                    <i className="fa fa-vector-square" /> {proj.area}
                  </span>
                </div>
                <button className={styles.detailBtn}>
                  See Details <i className="fa fa-arrow-right" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProjects
