import React, { useEffect, useRef, useState } from 'react'
import styles from './StatsSection.module.css'

/**
 * StatsSection — animated counter cards.
 * stats prop = array of { value, label } from FastAPI.
 */
function StatsSection({ stats }) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {stats.map((stat, i) => (
          <StatCard key={i} value={stat.value} label={stat.label} />
        ))}
      </div>
    </section>
  )
}

/** Individual counter card with intersection-observer animation */
function StatCard({ value, label }) {
  const [displayed, setDisplayed] = useState('0')
  const ref = useRef(null)
  const animated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          // Extract numeric part and suffix (e.g. "150+" → 150, "+")
          const numMatch = value.match(/(\d+)/)
          const suffix = value.replace(/\d+/, '')
          if (!numMatch) { setDisplayed(value); return }

          const end = parseInt(numMatch[1], 10)
          const duration = 1400
          const step = Math.ceil(end / (duration / 30))
          let cur = 0
          const timer = setInterval(() => {
            cur = Math.min(cur + step, end)
            setDisplayed(`${cur}${suffix}`)
            if (cur >= end) clearInterval(timer)
          }, 30)
        }
      },
      { threshold: 0.6 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return (
    <div className={styles.card} ref={ref}>
      <h2 className={styles.number}>{displayed}</h2>
      <p className={styles.label}>{label}</p>
    </div>
  )
}

export default StatsSection
