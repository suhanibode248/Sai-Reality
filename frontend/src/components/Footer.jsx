import React from 'react'
import styles from './Footer.module.css'

/**
 * Footer component — contact info and quick links.
 * contact prop comes from FastAPI /home-data.
 */
function Footer({ contact, title }) {
  return (
    <footer className={styles.footer} id="footer">
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand column */}
          <div className={styles.col}>
            <div className={styles.brand}>
              <img src="/logo.png" alt="Sai Reality Logo" style={{ height: '70px' }} />
            </div>
            <p className={styles.brandDesc}>
              With 7+ years of experience in developing and building plots, flats
              and commercial properties in Pune, we are a trusted name in real estate.
            </p>
            <div className={styles.socialIcons}>
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook-f" />
              </a>
              <a href={contact.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <i className="fab fa-whatsapp" />
              </a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram" /></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in" /></a>
            </div>
          </div>

          {/* Quick links */}
          <div className={styles.col}>
            <h5>Quick Links</h5>
            <ul className={styles.linkList}>
              {['Home', 'Services', 'Projects', 'Why Us', 'Contact'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '')}`}>
                    <i className="fa fa-angle-right" /> {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div className={styles.col}>
            <h5>Contact Info</h5>
            <ul className={styles.contactList}>
              <li>
                <i className="fa fa-location-dot" />
                <span>{contact.address}</span>
              </li>
              <li>
                <i className="fa fa-phone" />
                <span>
                  <a href={`tel:${contact.phone1}`}>{contact.phone1}</a>
                </span>
              </li>
              <li>
                <i className="fa fa-phone" />
                <span>
                  <a href={`tel:${contact.phone2}`}>{contact.phone2}</a>
                </span>
              </li>
              <li>
                <i className="fa fa-envelope" />
                <span>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className={styles.col}>
            <h5>Newsletter</h5>
            <p className={styles.newsletterText}>
              Subscribe to get the latest property updates and special offers.
            </p>
            <div className={styles.newsletterInput}>
              <input type="email" placeholder="Enter your email address" />
              <button type="button">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>© 2026 Sai Reality. All Rights Reserved. | Designed for Pune</p>
      </div>
    </footer>
  )
}

export default Footer
