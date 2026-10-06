import React, { useState } from 'react';
import styles from './FeaturedProjects.module.css';

const DEFAULT_PROJECTS = [
  {
    id: 1,
    title: 'Mahindra Rivenza',
    builder: 'Mahindra Lifespace',
    builderLogo: '🏢',
    location: 'Mahalunge, Pune',
    price: '₹ 90.00 Lacs - 2.17 Cr',
    priceTag: '(All inc)',
    possession: 'Jun 2030',
    area: '700 - 1635 sqft',
    status: 'New Launch',
    isTopDev: true,
    isLitigationFree: true,
    isAvailable: true,
    hasReel: true,
    configurations: [
      { bhk: '2 BHK', size: '700 sqft', price: '₹90.00 Lac' },
      { bhk: '2 BHK', size: '840 sqft', price: '₹1.14 Cr' },
      { bhk: '3 BHK', size: '1000 sqft', price: '₹1.30 Cr' },
      { bhk: '4 BHK', size: '1635 sqft', price: '₹2.17 Cr' },
    ]
  },
  {
    id: 2,
    title: 'Lodha Kasturi Chowk',
    builder: 'Lodha Group',
    builderLogo: '🏰',
    location: 'Wakad, Pune',
    price: '₹ 2.50 Cr - 3.10 Cr',
    priceTag: '(All inc)',
    possession: 'Dec 2028',
    area: '1100 - 1850 sqft',
    status: 'Featured',
    isTopDev: true,
    isLitigationFree: true,
    isAvailable: true,
    hasReel: true,
    configurations: [
      { bhk: '3 BHK', size: '1100 sqft', price: '₹2.50 Cr' },
      { bhk: '3.5 BHK', size: '1450 sqft', price: '₹2.85 Cr' },
      { bhk: '4 BHK', size: '1850 sqft', price: '₹3.10 Cr' },
    ]
  },
  {
    id: 3,
    title: 'Pride World City',
    builder: 'Pride Purple Group',
    builderLogo: '🌆',
    location: 'Charoli / Wagholi, Pune',
    price: '₹ 65.00 Lacs - 1.45 Cr',
    priceTag: '(Starting Price)',
    possession: 'Ready to Move',
    area: '650 - 1400 sqft',
    status: 'Ready',
    isTopDev: false,
    isLitigationFree: true,
    isAvailable: true,
    hasReel: false,
    configurations: [
      { bhk: '2 BHK', size: '650 sqft', price: '₹65.00 Lac' },
      { bhk: '3 BHK', size: '980 sqft', price: '₹98.00 Lac' },
      { bhk: '3 BHK Duplex', size: '1400 sqft', price: '₹1.45 Cr' },
    ]
  }
];

function FeaturedProjects({ projects = [] }) {
  const displayProjects = projects.length > 0 ? projects : DEFAULT_PROJECTS;

  // Filter States
  const [topDevOnly, setTopDevOnly] = useState(false);
  const [litigationFreeOnly, setLitigationFreeOnly] = useState(false);
  const [hideSoldOut, setHideSoldOut] = useState(false);
  const [isMapView, setIsMapView] = useState(false);
  const [activeReel, setActiveReel] = useState(null);

  // Filter Logic
  const filteredProjects = displayProjects.filter(p => {
    if (topDevOnly && !p.isTopDev) return false;
    if (litigationFreeOnly && !p.isLitigationFree) return false;
    if (hideSoldOut && !p.isAvailable) return false;
    return true;
  });

  return (
    <section className={styles.section} id="projects">
      <div className={styles.container}>

        {/* Section Header */}
        <div className={styles.sectionHead}>
          <div>
            <h2 className={styles.sectionTitle}>
              Top Projects in <span>Pune</span>
            </h2>
            <p className={styles.sectionSub}>Buy Directly from Builders | No Brokerage</p>
          </div>

          <button 
            className={`${styles.mapToggleBtn} ${isMapView ? styles.activeMap : ''}`}
            onClick={() => setIsMapView(!isMapView)}
          >
            🗺️ {isMapView ? 'List View' : 'Map View'}
          </button>
        </div>

        {/* Filter Toggle Bar */}
        <div className={styles.filterBar}>
          <label className={styles.toggleLabel}>
            <input 
              type="checkbox" 
              checked={topDevOnly} 
              onChange={(e) => setTopDevOnly(e.target.checked)} 
            />
            <span className={styles.toggleSlider}></span>
            🏆 Top Developers
          </label>

          <label className={styles.toggleLabel}>
            <input 
              type="checkbox" 
              checked={litigationFreeOnly} 
              onChange={(e) => setLitigationFreeOnly(e.target.checked)} 
            />
            <span className={styles.toggleSlider}></span>
            ⚖️ Litigation Free Projects
          </label>

          <label className={styles.toggleLabel}>
            <input 
              type="checkbox" 
              checked={hideSoldOut} 
              onChange={(e) => setHideSoldOut(e.target.checked)} 
            />
            <span className={styles.toggleSlider}></span>
            🚫 Hide Sold Out
          </label>
        </div>

        {/* Project Listings Grid / Map View */}
        {isMapView ? (
          <div className={styles.mapContainer}>
            <div className={styles.mapPlaceholder}>
              📍 <h3>Interactive Map View Active</h3>
              <p>Showing {filteredProjects.length} property pins across Pune (Mahalunge, Wakad, Wagholi, Dhanori)</p>
            </div>
          </div>
        ) : (
          <div className={styles.cardsGrid}>
            {filteredProjects.map((proj) => (
              <div key={proj.id} className={styles.card}>
                
                {/* Image Block with Reels & Wishlist */}
                <div className={styles.imgBlock}>
                  <div className={styles.imgPlaceholder}>
                    <span className={styles.buildingIcon}>{proj.builderLogo || '🏢'}</span>
                  </div>

                  {proj.hasReel && (
                    <button 
                      className={styles.reelBadge}
                      onClick={() => setActiveReel(proj.title)}
                    >
                      🎥 Reels <span className={styles.pulseDot}></span>
                    </button>
                  )}

                  <span className={styles.possessionBadge}>
                    📅 {proj.possession}
                  </span>
                </div>

                {/* Card Body */}
                <div className={styles.cardBody}>
                  
                  {/* Title & Price Header */}
                  <div className={styles.cardHeaderRow}>
                    <div>
                      <h3 className={styles.projTitle}>{proj.title}</h3>
                      <span className={styles.builderName}>{proj.builder}</span>
                    </div>
                    <div className={styles.priceBox}>
                      <span className={styles.priceVal}>{proj.price}</span>
                      <span className={styles.priceTag}>{proj.priceTag}</span>
                    </div>
                  </div>

                  <p className={styles.projLocation}>
                    📍 {proj.location} • <span className={styles.areaText}>{proj.area}</span>
                  </p>

                  {/* Unit Configuration & Price Table */}
                  {proj.configurations && (
                    <div className={styles.configTableBox}>
                      <div className={styles.tableScroll}>
                        {proj.configurations.map((cfg, idx) => (
                          <div key={idx} className={styles.configRow}>
                            <span className={styles.cfgBhk}>{cfg.bhk}</span>
                            <span className={styles.cfgSize}>{cfg.size}</span>
                            <span className={styles.cfgPrice}>{cfg.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dual Action Buttons */}
                  <div className={styles.actionRow}>
                    <button 
                      className={styles.tourBtn}
                      onClick={() => alert(`Opening 360° Virtual Tour & Free Cab Booking for ${proj.title}`)}
                    >
                      💻 / 🚗 Tour
                    </button>

                    <a 
                      className={styles.chatBtn}
                      href={`https://wa.me/919876543210?text=Hi,%20I%20am%20interested%20in%20${encodeURIComponent(proj.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      💬 Live Chat
                    </a>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Reel Modal */}
      {activeReel && (
        <div className={styles.reelOverlay} onClick={() => setActiveReel(null)}>
          <div className={styles.reelModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeReel} onClick={() => setActiveReel(null)}>×</button>
            <h3>🎥 {activeReel} - 15s Property Reel</h3>
            <div className={styles.reelVideoBox}>
              <p>▶️ Short Video Walkthrough Playing...</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default FeaturedProjects;
