import React from 'react'
import styles from './MarqueeBanner.module.css'

/**
 * MarqueeBanner — scrolling promotional text strip.
 * text prop comes from FastAPI /home-data.
 */
function MarqueeBanner({ text }) {
  return (
    <div className={styles.banner}>
      <div className={styles.track}>
        {/* Duplicate text for seamless loop */}
        <span>{text}&nbsp;&nbsp;&nbsp;&nbsp;{text}</span>
      </div>
    </div>
  )
}

export default MarqueeBanner
