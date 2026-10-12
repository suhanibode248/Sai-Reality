import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';
import AuthGate from '../components/AuthGate';

const GOLD = '#c9a227';
const DARK = '#1a1a1a';
const OLIVE_BTN = '#7a6a1f';
const SIDEBAR_W = 290;

const NO_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#2a2a2a"/><text x="50%" y="50%" fill="#888" font-family="sans-serif" font-size="22" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>'
)}`;

const SECTIONS = [
  { id: 'overview', label: 'Home', icon: '🏠' },
  { id: 'price', label: 'Price' },
  { id: 'floorplan', label: 'Site & Floor Plan' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'tour', label: 'Virtual Site Tour' },
  { id: 'location', label: 'Location' },
];

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function ProjectLandingPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [activeSection, setActiveSection] = useState('overview');
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [formMsg, setFormMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${API_BASE_URL}/api/crm/projects`)
      .then(r => r.json())
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : [];
        setAllProjects(list);
        const found = list.find(p => String(p.id) === String(id));
        setProject(found || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  // Auto-rotate hero images
  useEffect(() => {
    if (!project) return;
    const imgs = getImages(project);
    if (imgs.length < 2) return;
    timerRef.current = setInterval(() => {
      setActiveImg(i => (i + 1) % imgs.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [project]);

  // Scroll-spy
  useEffect(() => {
    const onScroll = () => {
      for (const s of [...SECTIONS].reverse()) {
        const el = document.getElementById(s.id);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(s.id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submitForm = () => {
    if (!form.name || !form.phone) { setFormMsg('Please fill name and phone.'); return; }
    fetch(`${API_BASE_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: form.name, phone: form.phone, property_name: project?.title || '', notes: `Pre-Register interest. Email: ${form.email}` })
    })
      .then(r => r.json())
      .then(res => setFormMsg(res.status === 'success' ? '✅ Registered! We will contact you soon.' : '❌ Try again or call us.'))
      .catch(() => setFormMsg('❌ Could not submit. Please call us.'));
  };

  function getImages(p) {
    if (!p) return [];
    return p.images?.length ? p.images : (p.image ? [p.image] : []);
  }

  function getAmenities(p) {
    if (!p?.amenities) return [];
    if (Array.isArray(p.amenities)) return p.amenities;
    if (typeof p.amenities === 'string') return p.amenities.split(',').map(a => a.trim()).filter(Boolean);
    return [];
  }

  function getFloorPlans(p) {
    if (!p?.floorPlans) return [];
    if (Array.isArray(p.floorPlans)) return p.floorPlans;
    return [];
  }

  function getEmbedUrl(url) {
    if (!url) return '';
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
    const shortsMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    if (url.includes('/embed/')) return url;
    return url;
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
      <div className="text-center">
        <div className="spinner-border" style={{ color: GOLD, width: 48, height: 48 }}></div>
        <p style={{ color: '#aaa', marginTop: 16 }}>Loading project...</p>
      </div>
    </div>
  );

  if (!project) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
      <div className="text-center">
        <h4 style={{ color: '#fff' }}>Project Not Found</h4>
        <Link to="/dashboard/projects" className="btn mt-3" style={{ background: GOLD, color: '#fff' }}>Back to Projects</Link>
      </div>
    </div>
  );

  const p = project;
  const images = getImages(p);
  const amenities = getAmenities(p);
  const floorPlans = getFloorPlans(p);
  const developer = p.developer || 'SAI Reality';
  const possession = p.possession || p.date || '—';
  const description = p.description || '';

  const inputStyle = {
    width: '100%',
    border: 'none',
    borderBottom: '1px solid #ddd',
    padding: '10px 4px',
    fontSize: 14,
    outline: 'none',
    background: 'transparent',
    marginBottom: 14,
    boxSizing: 'border-box',
  };

  const goldBtnStyle = {
    width: '100%',
    background: `linear-gradient(135deg, ${GOLD}, ${OLIVE_BTN})`,
    color: '#fff',
    border: 'none',
    padding: '12px',
    fontSize: 14,
    fontWeight: 700,
    borderRadius: 4,
    cursor: 'pointer',
    letterSpacing: '0.5px',
  };

  const pageContent = (
    <div style={{ fontFamily: "'Outfit', 'Poppins', sans-serif", background: '#fff', minHeight: '100vh', paddingRight: SIDEBAR_W }}>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        @keyframes shimmerText {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes goldGlow {
          0%, 100% { box-shadow: 0 0 6px rgba(201,162,39,0.35), 0 0 18px rgba(201,162,39,0.15); }
          50%       { box-shadow: 0 0 18px rgba(201,162,39,0.75), 0 0 40px rgba(201,162,39,0.35); }
        }
        @keyframes goldGlowSoft {
          0%, 100% { box-shadow: 0 2px 12px rgba(201,162,39,0.12); }
          50%       { box-shadow: 0 4px 28px rgba(201,162,39,0.38); }
        }
        @keyframes shimmerBorder {
          0%   { border-color: rgba(201,162,39,0.3); }
          50%  { border-color: rgba(245,217,139,0.9); }
          100% { border-color: rgba(201,162,39,0.3); }
        }
        @keyframes sparkle {
          0%,100%{ opacity:0.2; transform:scale(0.8); }
          50%    { opacity:1;   transform:scale(1.3); }
        }
        @keyframes goldPulse {
          0%,100%{ opacity:1; }
          50%    { opacity:0.7; }
        }
        .shimmer-btn {
          background: linear-gradient(90deg, #7a6010 0%, #c9a227 30%, #f5d98b 50%, #c9a227 70%, #7a6010 100%) !important;
          background-size: 600px 100% !important;
          animation: shimmer 2.5s linear infinite, goldGlow 2.2s ease-in-out infinite !important;
          color: #1a1000 !important;
          font-weight: 800 !important;
        }
        .shimmer-btn:hover {
          animation: shimmer 1.5s linear infinite, goldGlow 1.2s ease-in-out infinite !important;
        }
        .shimmer-text {
          background: linear-gradient(90deg, #7a6010 0%, #c9a227 25%, #f5d98b 50%, #c9a227 75%, #7a6010 100%);
          background-size: 400px 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerText 2.8s linear infinite;
          display: inline-block;
        }
        .gold-border-glow {
          border: 1.5px solid rgba(201,162,39,0.5) !important;
          animation: shimmerBorder 2.5s ease-in-out infinite, goldGlowSoft 2.5s ease-in-out infinite;
        }
        .nav-shimmer-active {
          background: linear-gradient(90deg, #7a6010 0%, #c9a227 35%, #f5d98b 50%, #c9a227 65%, #7a6010 100%) !important;
          background-size: 400px 100% !important;
          animation: shimmer 2s linear infinite !important;
        }
        .possession-bar {
          background: linear-gradient(90deg, #4a3a00 0%, #c9a227 30%, #f5d98b 50%, #c9a227 70%, #4a3a00 100%);
          background-size: 600px 100%;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* ─── Sticky section nav ─── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 998, background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: 52, borderBottom: '1px solid #333', boxSizing: 'border-box', marginRight: -SIDEBAR_W }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => scrollTo(s.id)}
              className={activeSection === s.id ? 'nav-shimmer-active' : ''}
              style={{
                background: activeSection === s.id ? GOLD : 'transparent',
                color: activeSection === s.id ? '#1a1000' : '#ccc',
                border: 'none',
                padding: '0 16px',
                height: 52,
                fontSize: 13,
                fontWeight: activeSection === s.id ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}>
              {s.icon && <span style={{ marginRight: 4 }}>{s.icon}</span>}{s.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={() => scrollTo('overview')} className="shimmer-btn" style={{ border: 'none', padding: '6px 14px', borderRadius: 4, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Avail best Offers
          </button>
          <a href={`https://wa.me/919222445513?text=${encodeURIComponent(`Hello, I'm interested in ${p.title}`)}`} target="_blank" rel="noreferrer"
            style={{ background: '#25d366', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            <i className="fa-brands fa-whatsapp"></i> Request Quote
          </a>
        </div>
      </nav>

      {/* ─── Fixed Right Sidebar ─── */}
      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0, width: SIDEBAR_W,
        background: '#fff', borderLeft: '1px solid #e5e5e5', overflowY: 'auto',
        zIndex: 999, padding: '20px 20px 30px', boxSizing: 'border-box',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.1)'
      }}>
        <h6 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}><span className="shimmer-text">Pre-Register here for Best Offers</span></h6>
        <input type="text" placeholder="Enter your name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd', marginBottom: 14 }}>
          <span style={{ fontSize: 18, marginRight: 6 }}>🇮🇳</span>
          <span style={{ fontSize: 13, color: '#888', marginRight: 6 }}>· </span>
          <input type="tel" placeholder="Mobile number *" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} maxLength={10} style={{ ...inputStyle, border: 'none', marginBottom: 0, flex: 1 }} />
        </div>
        <input type="email" placeholder="Email address (Optional)" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
        {formMsg && <p style={{ fontSize: 12, color: formMsg.startsWith('✅') ? 'green' : 'red', marginBottom: 8 }}>{formMsg}</p>}
        <button onClick={submitForm} className="shimmer-btn" style={{ ...goldBtnStyle, background: undefined }}>Pre-Register Now</button>

        <div style={{ margin: '14px 0', fontSize: 13, color: '#666', display: 'flex', alignItems: 'center', gap: 6 }}>
          Free cab for site visit !
          <span style={{ fontSize: 20 }}>🚕</span>
        </div>

        <hr style={{ borderColor: '#eee', margin: '14px 0' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <h6 style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', margin: 0 }}>Customer Support</h6>
          <span style={{ fontSize: 18 }}>🎧</span>
        </div>
        <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: OLIVE_BTN, fontSize: 16 }}>📞</span>
          <a href="tel:919222445513" style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>+91 9222445513</a>
        </div>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: OLIVE_BTN, fontSize: 16 }}>📞</span>
          <a href="tel:919320072003" style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>+91 9320072003</a>
        </div>
        <button onClick={submitForm} className="shimmer-btn" style={{ ...goldBtnStyle, background: undefined, marginTop: 4 }}>
          📞 Request Call Back
        </button>
      </div>

      {/* ─── HERO SECTION ─── */}
      <section id="overview" style={{ position: 'relative', minHeight: 560, overflow: 'hidden', background: '#111' }}>
        {/* Image slider */}
        <div style={{ position: 'absolute', inset: 0 }}>
          {images.length > 0 ? (
            <img
              src={images[activeImg]}
              alt={p.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.5s' }}
              onError={e => e.target.src = NO_IMAGE}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: 20 }}>No Image Available</div>
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.5) 100%)' }}></div>
        </div>

        {/* Image navigation */}
        {images.length > 1 && (
          <>
            <button onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
              style={{ position: 'absolute', left: 320, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 18, zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ‹
            </button>
            <button onClick={() => setActiveImg(i => (i + 1) % images.length)}
              style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 18, zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ›
            </button>
            <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 5 }}>
              {images.map((_, idx) => (
                <div key={idx} onClick={() => setActiveImg(idx)} style={{ width: 32, height: 4, borderRadius: 2, background: idx === activeImg ? GOLD : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'background 0.3s' }}></div>
              ))}
            </div>
          </>
        )}

        {/* Left info card */}
        <div className="gold-border-glow" style={{ position: 'relative', zIndex: 5, display: 'inline-block', margin: '60px 0 60px 40px', background: 'rgba(255,255,255,0.97)', padding: '28px 30px', borderRadius: 6, maxWidth: 300, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' }}>
            <span className="shimmer-text">{p.status === 'Published' ? 'NEW LAUNCH' : (p.status || 'NEW LAUNCH')}</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px', lineHeight: 1.2 }}>{p.title}</h1>
          <p style={{ fontSize: 13, color: '#555', margin: '0 0 14px' }}>{(p.location || '').split('\n')[0].trim()}</p>
          <p style={{ fontSize: 13, color: '#777', margin: '0 0 4px' }}>By {developer}</p>

          {p.area && (
            <div style={{ display: 'flex', gap: 16, margin: '12px 0', padding: '10px 0', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}>
              <div><div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>Land Parcel</div><div style={{ fontSize: 13, fontWeight: 700 }}>{p.area}</div></div>
              {p.floors && <div><div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>Floors</div><div style={{ fontSize: 13, fontWeight: 700 }}>{p.floors}</div></div>}
            </div>
          )}

          {p.config && <p style={{ fontSize: 12, color: '#555', margin: '8px 0' }}>{p.config}</p>}

          <div style={{ fontSize: 20, fontWeight: 800, color: GOLD, margin: '10px 0' }}>
            {p.price?.startsWith('Rs') ? <><span style={{ fontSize: 14 }}>₹ </span>{p.price.replace('Rs.', '').replace('Rs ', '').trim()}</> : p.price}
            <span style={{ fontSize: 13, fontWeight: 400, color: '#888' }}> Onwards</span>
          </div>

          <button onClick={() => scrollTo('price')} className="shimmer-btn" style={{ border: 'none', padding: '10px 24px', borderRadius: 4, fontSize: 13, cursor: 'pointer', marginTop: 4 }}>
            Get Offers
          </button>
        </div>
      </section>

      {/* ─── OVERVIEW / ABOUT ─── */}
      <section id="about" style={{ padding: '50px 40px', background: '#fff' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}><span className="shimmer-text">{p.title}</span></h2>
        <p style={{ fontSize: 16, color: '#888', marginBottom: 24 }}>At {(p.location || '').split('\n')[0].replace(/East|West|North|South/gi, '').trim()}</p>
        {description && <p style={{ fontSize: 14, color: '#444', lineHeight: 1.8, maxWidth: 800 }}>{description}</p>}
      </section>

      {/* ─── PRICE & FLOOR PLAN ─── */}
      <section id="price" style={{ padding: '50px 40px', background: '#f9f9f9' }}>
        {/* Possession bar */}
        <div className="possession-bar" style={{ color: '#1a1000', textAlign: 'center', padding: '12px', fontWeight: 800, fontSize: 15, borderRadius: 4, marginBottom: 24 }}>
          ✨ Possession – {possession} ✨
        </div>

        {floorPlans.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 6, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <thead>
              <tr style={{ background: '#1a1a1a', color: '#fff' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 14 }}>Type</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 14 }}>Area</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 14 }}>Price & Floor Plan</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 14 }}></th>
              </tr>
            </thead>
            <tbody>
              {floorPlans.map((fp, idx) => (
                <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600 }}>{fp.type || fp.bhk || '—'}</td>
                  <td style={{ padding: '14px 20px', fontSize: 14, color: '#555' }}>{fp.area}</td>
                  <td style={{ padding: '14px 20px', fontSize: 14, color: GOLD, fontWeight: 700 }}>₹ {fp.price}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    <button onClick={submitForm} className="shimmer-btn" style={{ border: 'none', padding: '6px 14px', borderRadius: 4, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      Get Price Breakup &amp; Floor Plan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 6, padding: 30, textAlign: 'center' }}>
            <p style={{ color: '#888', margin: 0, fontSize: 14 }}>Contact us for price details and floor plans.</p>
            <button onClick={submitForm} style={{ ...goldBtnStyle, width: 'auto', padding: '10px 32px', marginTop: 14, display: 'inline-block' }}>
              Get Price &amp; Floor Plan
            </button>
          </div>
        )}
      </section>

      {/* ─── FLOOR PLAN IMAGES ─── */}
      {(floorPlans.some(fp => fp.planImage) || images.length > 1) && (
        <section id="floorplan" style={{ padding: '0 40px 50px', background: '#f9f9f9' }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}><span className="shimmer-text">Floor Plan</span></h3>
          <div className="row">
            {(floorPlans.filter(fp => fp.planImage).length > 0
              ? floorPlans.filter(fp => fp.planImage)
              : images.slice(1)
            ).map((item, idx) => (
              <div key={idx} className="col-lg-4 col-md-6 mb-4">
                <div style={{ borderRadius: 6, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', position: 'relative' }}>
                  <img src={item.planImage || item} alt={item.type || `Photo ${idx + 1}`}
                    style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
                    onError={e => e.target.src = NO_IMAGE} />
                  {item.type && (
                    <div style={{ background: `linear-gradient(135deg, ${GOLD}, ${OLIVE_BTN})`, color: '#fff', padding: '8px 16px', textAlign: 'center', fontWeight: 700, fontSize: 14 }}>
                      {item.type}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── AMENITIES ─── */}
      {amenities.length > 0 && (
        <section id="amenities" style={{ padding: '50px 40px', background: '#fff' }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}><span className="shimmer-text">Amenities</span></h3>
          <div className="row">
            {amenities.map((a, idx) => {
              const label = typeof a === 'string' ? a : a.name;
              const imgSrc = typeof a === 'object' && a.image ? a.image : null;
              return (
                <div key={idx} className="col-lg-4 col-md-6 col-sm-6 mb-4">
                  <div style={{ borderRadius: 6, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', position: 'relative', height: 200 }}>
                    {imgSrc ? (
                      <img src={imgSrc} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = NO_IMAGE} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, #f0e6c0, #d4c480)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 40, opacity: 0.3 }}>🏠</span>
                      </div>
                    )}
                    <div className="possession-bar" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, color: '#1a1000', padding: '10px 16px', fontWeight: 800, fontSize: 13 }}>
                      | {label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── GALLERY ─── */}
      {images.length > 1 && (
        <section id="gallery" style={{ padding: '50px 40px', background: '#f9f9f9' }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}><span className="shimmer-text">Gallery</span></h3>
          <div className="row">
            {images.map((img, idx) => (
              <div key={idx} className="col-lg-3 col-md-4 col-sm-6 mb-3">
                <div onClick={() => setActiveImg(idx)} style={{ borderRadius: 6, overflow: 'hidden', cursor: 'pointer', border: idx === activeImg ? `3px solid ${GOLD}` : '3px solid transparent', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <img src={img} alt={`Gallery ${idx + 1}`} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} onError={e => e.target.src = NO_IMAGE} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── VIRTUAL TOUR ─── */}
      {p.videoUrl && getEmbedUrl(p.videoUrl) && (
        <section id="tour" style={{ padding: '50px 40px 0', background: '#fff' }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}><span className="shimmer-text">Virtual Site Tour</span></h3>
          <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
            <div style={{ position: 'relative', height: 0, paddingBottom: '42%', overflow: 'hidden' }}>
              <iframe
                src={getEmbedUrl(p.videoUrl)}
                title="Virtual Tour"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Fallback tour card when no video */}
      {!p.videoUrl && (
        <section id="tour" style={{ padding: '50px 40px', background: '#fff' }}>
          <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.2)', cursor: 'pointer' }} onClick={submitForm}>
            <div style={{ height: 320, background: `linear-gradient(135deg, #1a1a1a, #2a2a2a)`, position: 'relative', overflow: 'hidden' }}>
              {images[0] && <img src={images[0]} alt="Tour" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} onError={e => e.target.src = NO_IMAGE} />}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <div style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>▶</div>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ color: '#fff', fontSize: 28, fontWeight: 800, letterSpacing: 2, margin: 0 }}>VIRTUAL TOUR</h3>
                  <p style={{ color: '#ddd', fontSize: 14, margin: '4px 0 0' }}>{p.title} At {(p.location || '').split('\n')[0].trim()}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── ABOUT / DESCRIPTION ─── */}
      {description && (
        <section id="location" style={{ padding: '50px 40px', background: '#f9f9f9' }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', marginBottom: 16 }}>About {p.title}</h3>
          <p style={{ fontSize: 14, color: '#444', lineHeight: 1.9, whiteSpace: 'pre-line' }}>{description}</p>
        </section>
      )}

      {/* ─── SIMILAR PROJECTS ─── */}
      {allProjects.filter(x => String(x.id) !== String(id)).slice(0, 4).length > 0 && (
        <section style={{ padding: '50px 40px', background: '#fff' }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>
            Similar <span className="shimmer-text">Projects</span>
          </h3>
          <div className="row">
            {allProjects.filter(x => String(x.id) !== String(id)).slice(0, 4).map(sp => {
              const spImg = sp.images?.[0] || sp.image || '';
              return (
                <div key={sp.id} className="col-lg-3 col-md-6 mb-4">
                  <div style={{ background: '#fff', borderRadius: 6, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}>
                    <div style={{ position: 'relative', height: 180 }}>
                      <img src={spImg || NO_IMAGE} alt={sp.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = NO_IMAGE} />
                      <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(26,26,26,0.85)', color: '#fff', padding: '3px 10px', borderRadius: 3, fontSize: 12, fontWeight: 700 }}>{sp.price}</div>
                    </div>
                    <div style={{ padding: 14 }}>
                      <h5 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px', color: '#1a1a1a' }}>{sp.title}</h5>
                      <p style={{ fontSize: 12, color: '#888', margin: 0 }}><i className="fa fa-map-marker me-1" style={{ color: GOLD }}></i>{(sp.location || '').split('\n')[0].trim()}</p>
                    </div>
                    <div style={{ padding: '10px 14px', borderTop: '1px solid #f5f5f5' }}>
                      <a href={`/project-details/${sp.id}`} style={{ background: '#5C4033', color: '#fff', padding: '6px 14px', borderRadius: 4, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                        SEE DETAILS
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── FOOTER ─── */}
      <footer style={{ background: '#1a1a2e', color: '#ccc', padding: '40px 40px 20px', borderTop: '3px solid transparent', backgroundImage: `linear-gradient(#1a1a2e, #1a1a2e), linear-gradient(90deg, #4a3a00, #c9a227, #f5d98b, #c9a227, #4a3a00)`, backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
        <div className="row">
          <div className="col-lg-4 mb-4">
            <h4 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Contact Us</h4>
            <p style={{ fontSize: 13, marginBottom: 6 }}><i className="fa fa-location-dot me-2" style={{ color: GOLD }}></i>Pune Maharashtra 411047</p>
            <p style={{ fontSize: 13, marginBottom: 6 }}><i className="fa fa-envelope me-2" style={{ color: GOLD }}></i><a href="mailto:raj@sairealty.in" style={{ color: '#ccc', textDecoration: 'none' }}>raj@sairealty.in</a></p>
            <p style={{ fontSize: 13 }}><i className="fa fa-phone me-2" style={{ color: GOLD }}></i><a href="tel:919222445513" style={{ color: '#ccc', textDecoration: 'none' }}>+91 9222445513</a> / <a href="tel:919320072003" style={{ color: '#ccc', textDecoration: 'none' }}>9320072003</a></p>
          </div>
          <div className="col-lg-4 mb-4">
            <h4 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Home', 'Projects', 'Properties', 'About Us', 'Contact Us'].map(l => (
                <li key={l} style={{ marginBottom: 6 }}><a href="/home" style={{ color: '#ccc', textDecoration: 'none', fontSize: 13 }}>{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="col-lg-4 mb-4">
            <h4 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>About SAI Reality</h4>
            <p style={{ fontSize: 13, color: '#aaa', lineHeight: 1.7 }}>SAI Reality — MahaRERA Reg No. A52100012381. Certified Properties is your trusted real estate partner in Pune.</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              {[['fa-facebook', '#3b5998'], ['fa-instagram', '#c13584'], ['fa-whatsapp', '#25d366']].map(([icon, color]) => (
                <a key={icon} href="#" style={{ background: color, color: '#fff', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, textDecoration: 'none' }}>
                  <i className={`fa-brands ${icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16, marginTop: 8, textAlign: 'center', fontSize: 12, color: '#666' }}>
          © 2026 <a href="/home" style={{ color: GOLD, textDecoration: 'none' }}>Certified Properties</a> All rights reserved. SAI REALTY MahaRERA Reg No.A52100012381
        </div>
      </footer>

      {/* Floating buttons */}
      <a href="https://wa.me/919222445513" target="_blank" rel="noreferrer"
        style={{ position: 'fixed', left: 20, bottom: 90, zIndex: 9999, background: '#25d366', color: '#fff', width: 50, height: 50, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, boxShadow: '0 4px 15px rgba(0,0,0,0.2)', textDecoration: 'none' }}>
        <i className="fa-brands fa-whatsapp"></i>
      </a>
      <a href="tel:9222445513"
        style={{ position: 'fixed', left: 20, bottom: 25, zIndex: 9999, background: GOLD, color: '#fff', width: 50, height: 50, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 4px 15px rgba(0,0,0,0.2)', textDecoration: 'none' }}>
        <i className="fa fa-phone"></i>
      </a>
    </div>
  );

  return <AuthGate projectName={p?.title || ''}>{pageContent}</AuthGate>;
}
