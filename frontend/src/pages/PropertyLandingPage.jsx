import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';
import AuthGate from '../components/AuthGate';

const NO_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#f3f6f9"/><text x="50%" y="50%" fill="#adb5bd" font-family="sans-serif" font-size="28" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>'
)}`;

const NAV_LINKS = [
  { label: 'Home', href: '/home' },
  { label: 'Projects', href: '/dashboard/projects' },
  { label: 'Properties', href: '/dashboard/properties' },
  { label: 'About Us', href: '/home#about' },
  { label: 'Contact Us', href: '/home#contact' },
];

function TopHeader() {
  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 30px', minHeight: 69, display: 'flex', alignItems: 'center', zIndex: 1000, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <a href="/home">
          <img src="/sai_reality_header_logo.png" style={{ height: 65, width: 'auto', maxWidth: 280, objectFit: 'contain' }} alt="Sai Reality Logo" />
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="bi bi-telephone-inbound" style={{ fontSize: 24, color: '#118e42' }}></i>
            <div>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b', fontWeight: 500 }}>Free Contact</p>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <a href="tel:919222445513" style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', textDecoration: 'none' }}>+91 9222445513</a>
                <a href="tel:919320072003" style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', textDecoration: 'none' }}>+91 9320072003</a>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="bi bi-envelope-open" style={{ fontSize: 24, color: '#118e42' }}></i>
            <div>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b', fontWeight: 500 }}>Online Support</p>
              <a href="mailto:support@sairealty.in" style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', textDecoration: 'none' }}>support@sairealty.in</a>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="bi bi-geo-alt" style={{ fontSize: 24, color: '#118e42' }}></i>
            <div>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b', fontWeight: 500 }}>Our Location</p>
              <a href="https://goo.gl/maps/6SbWMzuEHDD4YmdV7" target="_blank" rel="noreferrer" style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', textDecoration: 'none' }}>Pune</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MainNav() {
  const [open, setOpen] = useState(false);
  return (
    <header style={{ background: '#1a1a2e', position: 'sticky', top: 0, zIndex: 999, boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
      <div className="container">
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0', minHeight: 70 }}>
          <a href="/home">
            <img src="/logo.png" style={{ height: 55, width: 'auto', objectFit: 'contain' }} alt="Sai Reality" />
          </a>
          <button
            onClick={() => setOpen(!open)}
            style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '6px 12px', borderRadius: 4, cursor: 'pointer', display: 'none' }}
            className="d-lg-none"
          >
            <i className="fa fa-bars"></i>
          </button>
          <div className="d-none d-lg-flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} style={{ color: '#fff', padding: '8px 14px', fontSize: 14, fontWeight: 500, textDecoration: 'none', borderRadius: 4, transition: 'background 0.2s' }}
                onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.target.style.background = 'transparent'}>
                {l.label}
              </a>
            ))}
            <a href="/dashboard/properties" style={{ background: '#118e42', color: '#fff', padding: '7px 16px', fontSize: 14, fontWeight: 600, borderRadius: 4, textDecoration: 'none', marginLeft: 8 }}>
              <i className="fa fa-plus me-1" style={{ fontSize: 11 }}></i> Submit Property
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

function SubBanner({ title }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d5e 100%)', padding: '40px 0' }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-6">
            <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 700, margin: 0 }}>{title}</h1>
          </div>
          <div className="col-lg-6 col-md-6">
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                <li><a href="/home" style={{ color: '#fff', textDecoration: 'none', fontSize: 14 }}>Home</a></li>
                <li style={{ color: '#fff', margin: '0 6px' }}>/</li>
                <li><span style={{ color: '#ccc', fontSize: 14 }}>Property Details</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyBox({ prop }) {
  const img = prop.images?.[0] || prop.image || '';
  return (
    <div style={{ background: '#fff', borderRadius: 6, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: 24, border: '1px solid #e9ecef' }}>
      <div style={{ position: 'relative' }}>
        <a href={`/property-details/${prop.id}`}>
          <div style={{ height: 220, overflow: 'hidden', position: 'relative' }}>
            <img src={img || NO_IMAGE} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => e.target.src = NO_IMAGE} />
          </div>
          <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(26,26,46,0.85)', color: '#fff', padding: '4px 12px', borderRadius: 4, fontWeight: 700, fontSize: 15 }}>
            {prop.price || '—'}
          </div>
        </a>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <h5 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 600 }}>
          <a href={`/property-details/${prop.id}`} style={{ color: '#1a1a2e', textDecoration: 'none' }}>{prop.title}</a>
        </h5>
        <div style={{ color: '#666', fontSize: 13, marginBottom: 10 }}>
          <i className="fa fa-map-marker me-1" style={{ color: '#118e42' }}></i>
          {prop.location || prop.address || '—'}
        </div>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: '6px 16px', borderTop: '1px solid #f0f0f0', paddingTop: 10 }}>
          {prop.bedroom && <li style={{ fontSize: 13, color: '#555' }}><i className="flaticon-furniture me-1"></i> {prop.bedroom} Bedrooms</li>}
          {prop.bathroom && <li style={{ fontSize: 13, color: '#555' }}><i className="flaticon-holidays me-1"></i> {prop.bathroom} Bathrooms</li>}
          {prop.area && <li style={{ fontSize: 13, color: '#555' }}><i className="flaticon-square me-1"></i> Sq Ft: {prop.area}</li>}
          {prop.features?.Furnishing && <li style={{ fontSize: 13, color: '#555' }}><i className="flaticon-furniture me-1"></i> {prop.features.Furnishing}</li>}
        </ul>
      </div>
      <div style={{ padding: '10px 16px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href={`/property-details/${prop.id}`} style={{ background: '#5C4033', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: 4, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
          SEE DETAILS
        </a>
        <span style={{ fontSize: 12, color: '#888' }}>
          <i className="flaticon-time me-1"></i> {prop.meta?.date || ''}
        </span>
      </div>
    </div>
  );
}

function SiteFooter() {
  return (
    <>
      <footer style={{ background: '#1a1a2e', color: '#ccc', padding: '50px 0 30px' }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-4 col-md-6 mb-4">
              <h4 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Contact Us</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: 8, fontSize: 14 }}><i className="fa fa-location-dot me-2" style={{ color: '#118e42' }}></i>Pune Maharashtra 411047</li>
                <li style={{ marginBottom: 8, fontSize: 14 }}><i className="fa fa-envelope me-2" style={{ color: '#118e42' }}></i><a href="mailto:raj@sairealty.in" style={{ color: '#ccc', textDecoration: 'none' }}>raj@sairealty.in</a></li>
                <li style={{ fontSize: 14 }}><i className="fa fa-phone me-2" style={{ color: '#118e42' }}></i>
                  <a href="tel:919222445513" style={{ color: '#ccc', textDecoration: 'none' }}>+91 9222445513</a> / <a href="tel:919320072003" style={{ color: '#ccc', textDecoration: 'none' }}>9320072003</a>
                </li>
              </ul>
            </div>
            <div className="col-xl-2 col-lg-2 col-md-6 col-6 mb-4">
              <h4 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Important Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Residentials Projects', 'Commercials Projects', 'Properties for sale', 'Properties for rent', 'Plots'].map(l => (
                  <li key={l} style={{ marginBottom: 6 }}><a href="/dashboard/properties" style={{ color: '#ccc', textDecoration: 'none', fontSize: 14 }}>{l}</a></li>
                ))}
              </ul>
            </div>
            <div className="col-xl-2 col-lg-2 col-md-6 col-6 mb-4">
              <h4 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['About Us', 'Services', 'Contact Us', 'Terms & Conditions', 'Privacy Policy'].map(l => (
                  <li key={l} style={{ marginBottom: 6 }}><a href="/home" style={{ color: '#ccc', textDecoration: 'none', fontSize: 14 }}>{l}</a></li>
                ))}
              </ul>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 mb-4">
              <h4 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Subscribe</h4>
              <p style={{ color: '#aaa', fontSize: 14, marginBottom: 14 }}>Get latest updates and notifications of new projects & properties.</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <input type="text" placeholder="Your Email" style={{ flex: 1, border: '1px solid #444', background: 'rgba(255,255,255,0.08)', color: '#fff', padding: '8px 14px', borderRadius: 4, outline: 'none', fontSize: 14 }} />
                <button style={{ background: '#118e42', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}>
                  <i className="fa fa-paper-plane"></i>
                </button>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {[['fa-facebook', '#3b5998'], ['fa-instagram', '#c13584'], ['fa-google', '#dd4b39'], ['fa-linkedin', '#0077b5'], ['fa-whatsapp', '#25d366']].map(([icon, color]) => (
                  <a key={icon} href="#" style={{ background: color, color: '#fff', width: 34, height: 34, borderRadius: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, textDecoration: 'none' }}>
                    <i className={`fa-brands ${icon}`}></i>
                  </a>
                ))}
              </div>
            </div>
            <div className="col-12">
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, marginTop: 10 }}>
                <h4 style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Disclaimer :</h4>
                <p style={{ color: '#aaa', fontSize: 13, lineHeight: 1.6 }}>Certified Properties is only an intermediary offering its platform to advertise properties of Seller for a Customer/Buyer/User coming on its Website and is not and cannot be a party to or privy to or control in any manner any transactions between the Seller and the Customer/Buyer/User.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div style={{ background: '#111122', padding: '14px 0', textAlign: 'center' }}>
        <p style={{ margin: 0, color: '#888', fontSize: 13 }}>
          © 2026 <a href="/home" style={{ color: '#118e42', textDecoration: 'none' }}>Certified Properties</a> All rights reserved. Developed by SAI REALTY MahaRERA Reg No.A52100012381
        </p>
      </div>
    </>
  );
}

export default function PropertyLandingPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [allProperties, setAllProperties] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', phone2: '' });
  const [leadMsg, setLeadMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${API_BASE_URL}/api/dashboard/properties/${id}`)
      .then(r => r.json())
      .then(res => { if (res.status === 'success') setProperty(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch(`${API_BASE_URL}/api/dashboard/properties`)
      .then(r => r.json())
      .then(res => { if (res.status === 'success') setAllProperties(res.data || []); })
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    setActiveImage(0);
    setLeadMsg('');
    window.scrollTo(0, 0);
  }, [id]);

  const submitLead = (viaWhatsapp) => {
    if (!leadForm.name || !leadForm.phone) { setLeadMsg('Please fill in your name and phone.'); return; }
    if (viaWhatsapp) {
      const msg = `Hello, Please send property details of - ${property?.title || ''}`;
      window.open(`https://wa.me/919320072003?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
      return;
    }
    fetch(`${API_BASE_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: leadForm.name, phone: leadForm.phone, property_name: property?.title || '', notes: `Interested in: ${property?.address || property?.location || ''}` })
    })
      .then(r => r.json())
      .then(res => setLeadMsg(res.status === 'success' ? '✅ Thank you! We will call you back shortly.' : '❌ Could not submit. Please call us directly.'))
      .catch(() => setLeadMsg('❌ Could not submit. Please call us directly.'));
  };

  if (loading) return (
    <>
      <TopHeader />
      <MainNav />
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3"></div>
          <p className="text-muted">Loading property...</p>
        </div>
      </div>
      <SiteFooter />
    </>
  );

  if (!property) return (
    <>
      <TopHeader />
      <MainNav />
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <h4 className="text-danger">Property Not Found</h4>
          <Link to="/dashboard/properties" className="btn btn-primary mt-3">Back to Properties</Link>
        </div>
      </div>
      <SiteFooter />
    </>
  );

  const p = property;
  const images = p.images?.length ? p.images : (p.image ? [p.image] : []);
  const features = p.features || {};
  const amenities = p.amenities || [];
  const propId = `PR${new Date().getFullYear()}${String(p.id).padStart(7, '0')}`;
  const similarProps = allProperties
    .filter(x => x.id !== p.id && (x.category === p.category || x.location === p.location))
    .slice(0, 4);

  const sidebarCardStyle = {
    background: '#fff',
    borderRadius: 6,
    boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
    padding: 20,
    marginBottom: 24,
    border: '1px solid #e9ecef'
  };

  const sidebarTitleStyle = {
    fontSize: 16,
    fontWeight: 700,
    color: '#1a1a2e',
    borderBottom: '2px solid #118e42',
    paddingBottom: 10,
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 8
  };

  const pageContent = (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#f7f9fb', minHeight: '100vh' }}>
      <TopHeader />
      <MainNav />

      {/* Sub-banner */}
      <SubBanner title="Property Details" />

      {/* Main content */}
      <div style={{ background: '#f7f9fb', padding: '40px 0' }}>
        <div className="container">
          <div className="row">
            {/* Left column */}
            <div className="col-lg-8 col-md-12">
              <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '24px', marginBottom: 24 }}>

                {/* Heading properties */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>{p.title}</h3>
                    <p style={{ color: '#666', margin: 0, fontSize: 14 }}>
                      <i className="fa fa-map-marker me-1" style={{ color: '#118e42' }}></i>
                      {p.address || p.location || '—'}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#118e42', marginBottom: 6 }}>
                      {p.type === 'Rent' ? 'For Rent' : 'For Sale'} : {p.price}
                    </h3>
                    <p style={{ color: '#666', margin: 0, fontSize: 14 }}>
                      <i className="flaticon-square me-1"></i>Area : {p.area} sqft
                    </p>
                  </div>
                </div>

                {/* Main image */}
                {images.length > 0 ? (
                  <>
                    <div style={{ width: '100%', height: 450, overflow: 'hidden', borderRadius: 6, marginBottom: 10, background: '#f0f0f0' }}>
                      <img
                        src={images[activeImage] || NO_IMAGE}
                        alt={p.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={e => e.target.src = NO_IMAGE}
                      />
                    </div>
                    {images.length > 1 && (
                      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                        {images.map((img, idx) => (
                          <div
                            key={idx}
                            onClick={() => setActiveImage(idx)}
                            style={{ flexShrink: 0, width: 100, height: 70, borderRadius: 4, overflow: 'hidden', cursor: 'pointer', border: idx === activeImage ? '2px solid #118e42' : '2px solid transparent', opacity: idx === activeImage ? 1 : 0.7 }}
                          >
                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = NO_IMAGE} />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ width: '100%', height: 300, background: '#f0f4f8', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 18, marginBottom: 20 }}>
                    No Image Available
                  </div>
                )}
              </div>

              {/* Description */}
              {p.description && (
                <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 24, marginBottom: 24 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a2e', borderBottom: '2px solid #118e42', paddingBottom: 10, marginBottom: 16 }}>Description</h3>
                  <p style={{ color: '#555', lineHeight: 1.7, margin: 0, fontSize: 14 }}>{p.description}</p>
                </div>
              )}

              {/* Property Details */}
              <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 24, marginBottom: 24 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a2e', borderBottom: '2px solid #118e42', paddingBottom: 10, marginBottom: 16 }}>Property Details</h3>
                <div className="row">
                  <div className="col-md-4 col-sm-6">
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      <li style={{ marginBottom: 10, fontSize: 14, color: '#555', borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
                        <strong style={{ color: '#1a1a2e' }}>Property Id:</strong> {propId}
                      </li>
                      <li style={{ marginBottom: 10, fontSize: 14, color: '#555', borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
                        <strong style={{ color: '#1a1a2e' }}>Price:</strong> {p.price}
                      </li>
                      <li style={{ marginBottom: 10, fontSize: 14, color: '#555', borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
                        <strong style={{ color: '#1a1a2e' }}>Category:</strong> {p.category}
                      </li>
                      <li style={{ marginBottom: 10, fontSize: 14, color: '#555', borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
                        <strong style={{ color: '#1a1a2e' }}>Bedrooms:</strong> {p.bedroom || '—'}
                      </li>
                      <li style={{ fontSize: 14, color: '#555' }}>
                        <strong style={{ color: '#1a1a2e' }}>Bathrooms:</strong> {p.bathroom || '—'}
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-4 col-sm-6">
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      <li style={{ marginBottom: 10, fontSize: 14, color: '#555', borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
                        <strong style={{ color: '#1a1a2e' }}>Property For:</strong> {p.type || '—'}
                      </li>
                      <li style={{ marginBottom: 10, fontSize: 14, color: '#555', borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
                        <strong style={{ color: '#1a1a2e' }}>Area:</strong> {p.area} sqft
                      </li>
                      <li style={{ marginBottom: 10, fontSize: 14, color: '#555', borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
                        <strong style={{ color: '#1a1a2e' }}>Year Built:</strong> {features['Built Year'] || '—'}
                      </li>
                      <li style={{ marginBottom: 10, fontSize: 14, color: '#555', borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
                        <strong style={{ color: '#1a1a2e' }}>Furnishing:</strong> {features.Furnishing || '—'}
                      </li>
                      <li style={{ fontSize: 14, color: '#555' }}>
                        <strong style={{ color: '#1a1a2e' }}>Facing:</strong> {features.Facing || '—'}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 24, marginBottom: 24 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a2e', borderBottom: '2px solid #118e42', paddingBottom: 10, marginBottom: 16 }}>Features</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '10px 0' }}>
                  {p.bedroom && (
                    <li style={{ width: 160, marginRight: 16, fontSize: 14, color: '#555' }}>
                      <i className="flaticon-furniture me-2" style={{ color: '#118e42' }}></i>{p.bedroom} Bedroom
                    </li>
                  )}
                  {p.bathroom && (
                    <li style={{ width: 160, marginRight: 16, fontSize: 14, color: '#555' }}>
                      <i className="flaticon-holidays me-2" style={{ color: '#118e42' }}></i>{p.bathroom} Bathroom
                    </li>
                  )}
                  {p.area && (
                    <li style={{ width: 160, marginRight: 16, fontSize: 14, color: '#555' }}>
                      <i className="flaticon-square me-2" style={{ color: '#118e42' }}></i>{p.area} sq ft
                    </li>
                  )}
                  {features.Furnishing && (
                    <li style={{ width: 160, marginRight: 16, fontSize: 14, color: '#555' }}>
                      <i className="flaticon-furniture me-2" style={{ color: '#118e42' }}></i>{features.Furnishing}
                    </li>
                  )}
                  {features.Transaction && (
                    <li style={{ width: 160, marginRight: 16, fontSize: 14, color: '#555' }}>
                      <i className="flaticon-furniture me-2" style={{ color: '#118e42' }}></i>{features.Transaction}
                    </li>
                  )}
                </ul>
              </div>

              {/* Amenities */}
              {amenities.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 24, marginBottom: 24 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a2e', borderBottom: '2px solid #118e42', paddingBottom: 10, marginBottom: 16 }}>Amenities</h3>
                  <div className="row">
                    {amenities.map((a, idx) => (
                      <div key={idx} className="col-lg-4 col-md-4 col-sm-6">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 14, color: '#555' }}>
                          <i className="fa fa-check-circle" style={{ color: '#118e42' }}></i>
                          {a}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="col-lg-4 col-md-12">
              {/* Lead form */}
              <div style={sidebarCardStyle}>
                <h5 style={sidebarTitleStyle}>
                  Get a instant call back !
                  <span style={{ fontSize: 22 }}>📞</span>
                </h5>
                <div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, color: '#1a1a2e' }}>Name *</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={leadForm.name}
                      onChange={e => setLeadForm(f => ({ ...f, name: e.target.value }))}
                      style={{ width: '100%', border: '1px solid #dee2e6', borderRadius: 4, padding: '8px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, color: '#1a1a2e' }}>Primary Phone <span style={{ color: '#dc3545' }}>*</span></label>
                    <input
                      type="tel"
                      placeholder="Primary Phone Number"
                      maxLength={10}
                      value={leadForm.phone}
                      onChange={e => setLeadForm(f => ({ ...f, phone: e.target.value }))}
                      style={{ width: '100%', border: '1px solid #dee2e6', borderRadius: 4, padding: '8px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, color: '#1a1a2e' }}>Secondary Phone <span style={{ color: '#dc3545' }}>*</span></label>
                    <input
                      type="tel"
                      placeholder="Secondary Phone Number"
                      maxLength={10}
                      value={leadForm.phone2}
                      onChange={e => setLeadForm(f => ({ ...f, phone2: e.target.value }))}
                      style={{ width: '100%', border: '1px solid #dee2e6', borderRadius: 4, padding: '8px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  {leadMsg && <p style={{ fontSize: 13, marginBottom: 10, color: leadMsg.startsWith('✅') ? '#118e42' : '#dc3545' }}>{leadMsg}</p>}
                  <button
                    onClick={() => submitLead(false)}
                    style={{ width: '100%', background: '#118e42', color: '#fff', border: 'none', padding: '10px', borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Get a Call back
                  </button>
                </div>
              </div>

              {/* WhatsApp button */}
              <div style={{ marginBottom: 24 }}>
                <a
                  href={`https://wa.me/919320072003?text=${encodeURIComponent(`Hello, Please send property details of - ${p.title}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'block', background: '#25d366', color: '#fff', textAlign: 'center', padding: '12px 16px', borderRadius: 6, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
                >
                  Get Details On Whatsapp &nbsp;<i className="fa-brands fa-whatsapp" style={{ fontSize: 16 }}></i>
                </a>
              </div>

              {/* Customer Support */}
              <div style={sidebarCardStyle}>
                <h5 style={sidebarTitleStyle}>
                  Customer Support
                  <span style={{ fontSize: 22 }}>🎧</span>
                </h5>
                <div>
                  <p style={{ fontSize: 14, color: '#555', marginBottom: 8 }}>
                    <i className="flaticon-technology-1 me-2" style={{ color: '#118e42' }}></i>
                    <a href="tel:9222445513" style={{ color: '#1a1a2e', textDecoration: 'none', fontWeight: 600 }}>+91 9222445513</a>
                  </p>
                  <p style={{ fontSize: 14, color: '#555', marginBottom: 8 }}>
                    <i className="flaticon-technology-1 me-2" style={{ color: '#118e42' }}></i>
                    <a href="tel:9320072003" style={{ color: '#1a1a2e', textDecoration: 'none', fontWeight: 600 }}>+91 9320072003</a>
                  </p>
                  <p style={{ fontSize: 14, color: '#555', margin: 0 }}>
                    <i className="flaticon-envelope me-2" style={{ color: '#118e42' }}></i>
                    <a href="mailto:raj@sairealty.in" style={{ color: '#1a1a2e', textDecoration: 'none', fontWeight: 600 }}>raj@sairealty.in</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      {similarProps.length > 0 && (
        <div style={{ background: '#f7f9fb', padding: '20px 0 50px' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a2e' }}>Similar <span style={{ color: '#118e42' }}>Properties</span></h1>
              <p style={{ color: '#666', fontSize: 14 }}>Explore the Latest Properties.</p>
            </div>
            <div className="row">
              {similarProps.map(sp => (
                <div key={sp.id} className="col-lg-3 col-md-6 col-sm-6">
                  <PropertyBox prop={sp} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp */}
      <a href="https://wa.me/919222445513" target="_blank" rel="noreferrer"
        style={{ position: 'fixed', right: 20, bottom: 90, zIndex: 9999, background: '#25d366', color: '#fff', width: 50, height: 50, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, boxShadow: '0 4px 15px rgba(0,0,0,0.2)', textDecoration: 'none' }}>
        <i className="fa-brands fa-whatsapp"></i>
      </a>
      <a href="tel:9222445513"
        style={{ position: 'fixed', right: 20, bottom: 25, zIndex: 9999, background: '#118e42', color: '#fff', width: 50, height: 50, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 4px 15px rgba(0,0,0,0.2)', textDecoration: 'none' }}>
        <i className="fa fa-phone"></i>
      </a>

      <SiteFooter />
    </div>
  );

  return <AuthGate projectName={property?.title || ''}>{pageContent}</AuthGate>;
}
