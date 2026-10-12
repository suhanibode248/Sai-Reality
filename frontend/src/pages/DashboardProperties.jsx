import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import DashboardLayout from '../components/DashboardLayout';
import { API_BASE_URL } from '../api/config';

const API = `${API_BASE_URL}/api/dashboard`;
const NO_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#f3f6f9"/>' +
  '<text x="50%" y="50%" fill="#adb5bd" font-family="sans-serif" font-size="28" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>'
)}`;
const EMPTY_FILTERS = { propertyType: '', category: '', city: '', location: [], bedroom: [], minPrice: '', maxPrice: '' };

const EMPTY_PROPERTY = {
  title: '', type: 'For Sale', category: 'Residential Appartment', location: '', city: 'Pune', address: '',
  price: '', bedroom: '', bathroom: '', area: '', seller: '', phone: '', status: 'Draft', description: '', image: '', availableFrom: ''
};

const shareOnWhatsapp = (p) => {
  const text = [p.title, p.price, p.address, p.area ? `Area: ${p.area}` : '', `Sai Realty - Call ${p.phone || ''}`].filter(Boolean).join('\n');
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
};

// Add New / Edit Property form
const PropertyForm = ({ initial, filterOptions, onClose, onSaved }) => {
  const [data, setData] = useState(() => ({ ...EMPTY_PROPERTY, ...initial, price: initial?.priceValue ?? '' }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = (name) => (e) => setData(prev => ({ ...prev, [name]: e.target.value }));
  const isEdit = Boolean(initial?.id);

  const submit = (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    fetch(`${API}/properties${isEdit ? `/${initial.id}` : ''}`, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, price: parseFloat(data.price) || 0 })
    })
      .then(res => res.json())
      .then(res => { if (res.status === 'success') onSaved(res.data); else setError(res.message || 'Could not save'); })
      .catch(() => setError('Could not reach the backend at localhost:8000'))
      .finally(() => setSaving(false));
  };

  const field = (label, name, props = {}) => (
    <div className="col-md-6 mb-3">
      <label className="form-label fw-medium" style={{ fontSize: '13px' }}>{label}</label>
      <input className="form-control form-control-sm" value={data[name] ?? ''} onChange={set(name)} {...props} />
    </div>
  );
  const select = (label, name, options) => (
    <div className="col-md-6 mb-3">
      <label className="form-label fw-medium" style={{ fontSize: '13px' }}>{label}</label>
      <select className="form-select form-select-sm" value={data[name] ?? ''} onChange={set(name)}>
        {options.map(o => <option key={o} value={o}>{o || 'Select'}</option>)}
      </select>
    </div>
  );

  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '40px 16px' }}>
      <form onSubmit={submit} className="card shadow border-0" style={{ width: '100%', maxWidth: '760px', borderRadius: '8px' }}>
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold" style={{ fontSize: '15px' }}>{isEdit ? 'Edit Property Details' : 'Add New Property'}</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="card-body row">
          {field('Property Name/ Title *', 'title', { required: true })}
          {select('Property Type', 'type', filterOptions.propertyType || ['For Sale', 'For Rent', 'For Lease'])}
          {select('Category', 'category', filterOptions.category || ['Residential Appartment'])}
          {select('Location', 'location', ['', ...(filterOptions.location || [])])}
          {field('City', 'city')}
          {field('Price (Rs.) *', 'price', { type: 'number', min: 0, required: true })}
          {select('Bedroom', 'bedroom', ['', ...(filterOptions.bedroom || [])])}
          {field('Bathroom', 'bathroom', { type: 'number', min: 0 })}
          {field('Area', 'area', { placeholder: 'e.g. 800 sqft' })}
          {field('Available From', 'availableFrom', { type: 'date' })}
          {field('Seller Name', 'seller')}
          {field('Seller Phone', 'phone', { type: 'tel' })}
          {select('Status', 'status', ['Draft', 'Published'])}
          {field('Image URL', 'image', { placeholder: '/media/dashboard/images/property/photo1.jpg' })}
          <div className="col-12 mb-3">
            <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Address</label>
            <input className="form-control form-control-sm" value={data.address ?? ''} onChange={set('address')} />
          </div>
          <div className="col-12">
            <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Property Details/ Description</label>
            <textarea className="form-control form-control-sm" rows="4" value={data.description ?? ''} onChange={set('description')}></textarea>
          </div>
          {error && <p className="text-danger mt-2 mb-0" style={{ fontSize: '13px' }}>{error}</p>}
        </div>
        <div className="card-footer bg-white d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-light btn-sm" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-success btn-sm px-4" disabled={saving} style={{ backgroundColor: '#0ab39c', borderColor: '#0ab39c' }}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </div>
  , document.body);
};

const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const matchesFilters = (p, f) => {
  if (f.propertyType && p.type !== f.propertyType) return false;
  if (f.category && p.category !== f.category) return false;
  if (f.city && norm(p.city) !== norm(f.city)) return false;
  if (f.location.length && !f.location.some(loc => norm(p.location).includes(norm(loc)) || norm(p.address).includes(norm(loc)))) return false;
  if (f.bedroom.length && !f.bedroom.includes(p.bedroom)) return false;
  const min = parseFloat(f.minPrice);
  const max = parseFloat(f.maxPrice);
  if (!isNaN(min) && (p.priceValue ?? -Infinity) < min) return false;
  if (!isNaN(max) && (p.priceValue ?? Infinity) > max) return false;
  return true;
};

// Dropdown with checkboxes for Location and Bedroom (the live form lets you pick several)
const MultiSelect = ({ placeholder, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const toggle = (opt) => onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt]);

  return (
    <div ref={ref} className="position-relative">
      <button type="button" className="form-select form-select-sm text-start" onClick={() => setOpen(o => !o)} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', backgroundColor: '#fff' }}>
        {value.length ? value.join(', ') : placeholder}
      </button>
      {open && (
        <div className="position-absolute bg-white border rounded shadow-sm w-100 mt-1 py-1" style={{ zIndex: 20, maxHeight: '220px', overflowY: 'auto' }}>
          {options.map(opt => (
            <label key={opt} className="d-flex align-items-center gap-2 px-2 py-1 mb-0" style={{ fontSize: '13px', cursor: 'pointer' }}>
              <input type="checkbox" checked={value.includes(opt)} onChange={() => toggle(opt)} /> {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const DashboardProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [detailsLoaded, setDetailsLoaded] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const forceReloadRef = useRef(false);
  const silentReloadRef = useRef(false);

  // Search form values, and the ones applied when "Search" was pressed
  const [form, setForm] = useState(EMPTY_FILTERS);
  const [applied, setApplied] = useState(EMPTY_FILTERS);
  const setField = (name, value) => setForm(prev => ({ ...prev, [name]: value }));

  // Property details view
  const [viewProperty, setViewProperty] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [detailsTab, setDetailsTab] = useState('seller');
  const [editing, setEditing] = useState(null); // {} = add new, property = edit
  const [leadForm, setLeadForm] = useState({ name: '', phone: '' });
  const [leadMsg, setLeadMsg] = useState('');

  useEffect(() => {
    let ignore = false;
    const force = forceReloadRef.current;
    forceReloadRef.current = false;
    if (!silentReloadRef.current) setIsLoading(true);
    silentReloadRef.current = false;

    fetch(`${API}/properties${force ? '?force=true' : ''}`)
      .then(res => res.json())
      .then(data => {
        if (ignore) return;
        if (data.status === 'success') {
          setProperties(data.data);
          setFilterOptions(data.filterOptions || {});
          setDetailsLoaded(data.detailsLoaded);
          setLoadError('');
        } else {
          setLoadError(data.message || 'Could not load properties');
        }
      })
      .catch(() => { if (!ignore) setLoadError('Could not reach the backend at localhost:8000'); })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      });
    return () => { ignore = true; };
  }, [reloadKey]);

  // Category and bedrooms are read from each property's detail page in the background; poll until all are in
  useEffect(() => {
    if (!properties.length || detailsLoaded >= properties.length) return;
    const timer = setTimeout(() => {
      silentReloadRef.current = true;
      setReloadKey(k => k + 1);
    }, 5000);
    return () => clearTimeout(timer);
  }, [properties, detailsLoaded]);

  const refresh = () => {
    setForm(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
    forceReloadRef.current = true;
    silentReloadRef.current = properties.length > 0;
    setIsRefreshing(true);
    setReloadKey(k => k + 1);
  };

  const openDetails = (p) => {
    setViewProperty(p);
    setDetails(null);
    setActiveImage(0);
    setDetailsTab('seller');
    setDetailsLoading(true);
    window.scrollTo(0, 0);
    fetch(`${API}/properties/${p.id}?force=true`)
      .then(res => res.json())
      .then(data => { if (data.status === 'success') setDetails(data.data); })
      .catch(() => {})
      .finally(() => setDetailsLoading(false));
  };

  const handleDelete = (p) => {
    if (!window.confirm(`Delete "${p.title}"?`)) return;
    fetch(`${API}/properties/${p.id}`, { method: 'DELETE' })
      .then(() => {
        setProperties(prev => prev.filter(x => x.id !== p.id));
        if (viewProperty?.id === p.id) setViewProperty(null);
      })
      .catch(() => alert('Could not reach the backend at localhost:8000'));
  };

  const onPropertySaved = (saved) => {
    setEditing(null);
    setProperties(prev => prev.some(x => x.id === saved.id) ? prev.map(x => x.id === saved.id ? saved : x) : [saved, ...prev]);
    if (viewProperty?.id === saved.id) openDetails(saved);
  };

  const propertyForm = editing && (
    <PropertyForm initial={editing} filterOptions={filterOptions} onClose={() => setEditing(null)} onSaved={onPropertySaved} />
  );

  const filteredProperties = properties.filter(p => matchesFilters(p, applied));
  const filtersNeedDetails = applied.category || applied.bedroom.length;
  const detailsPending = properties.length - detailsLoaded;

  const selectOptions = (name, fallback) => (filterOptions[name]?.length ? filterOptions[name] : fallback);

  // ── Property Landing Page view ──
  if (viewProperty) {
    const d = details || {};
    const images = details?.images?.length ? details.images : (viewProperty.image ? [viewProperty.image] : []);
    const mainImage = images[activeImage] || images[0];
    const features = d.features || viewProperty.features || {};
    const amenities = d.amenities || viewProperty.amenities || [];
    const propTitle = d.title || viewProperty.title;
    const propPrice = d.price || viewProperty.price;
    const propType = d.type || viewProperty.type;
    const propAddress = d.address || viewProperty.address;
    const propLocation = d.location || viewProperty.location;
    const propCity = d.city || viewProperty.city;
    const propCategory = d.category || viewProperty.category;
    const propBedroom = d.bedroom || viewProperty.bedroom || '';
    const propBathroom = d.bathroom || viewProperty.bathroom || '';
    const propArea = d.area || viewProperty.area || '';
    const propDescription = d.description || viewProperty.description || '';
    const propId = `PR${String(viewProperty.id).padStart(10, '0')}`;

    const similarProps = properties
      .filter(p => p.id !== viewProperty.id && (p.category === propCategory || p.location === propLocation))
      .slice(0, 4);

    const submitLead = (viaWhatsapp) => {
      if (!leadForm.name || !leadForm.phone) { setLeadMsg('Please fill in your name and phone.'); return; }
      if (viaWhatsapp) {
        const msg = `Hi, I am interested in: ${propTitle}\nPrice: ${propPrice}\nLocation: ${propAddress}\nMy name: ${leadForm.name}`;
        window.open(`https://wa.me/919222445513?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
        return;
      }
      fetch(`${API_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: leadForm.name, phone: leadForm.phone, property_name: propTitle, notes: `Interested in: ${propAddress}` })
      })
        .then(r => r.json())
        .then(res => setLeadMsg(res.status === 'success' ? '✅ Thank you! We will call you back shortly.' : '❌ Could not submit. Please call us directly.'))
        .catch(() => setLeadMsg('❌ Could not submit. Please call us directly.'));
    };

    return (
      <DashboardLayout>
        {propertyForm}
        <div className="container-fluid p-0">

          {/* Breadcrumb + Action bar */}
          <div className="row mb-3">
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-between bg-white p-3 shadow-sm rounded">
                <ol className="breadcrumb m-0" style={{ backgroundColor: 'transparent', padding: 0, fontSize: '13px' }}>
                  <li className="breadcrumb-item">
                    <a href="#!" onClick={e => { e.preventDefault(); setViewProperty(null); }} style={{ color: '#405189', textDecoration: 'none' }}>
                      <i className="ri-arrow-left-line me-1"></i> Back to Properties
                    </a>
                  </li>
                  <li className="breadcrumb-item active text-muted">Property Details</li>
                </ol>
                <div className="d-flex gap-2">
                  <button onClick={() => shareOnWhatsapp(viewProperty)} className="btn btn-sm" style={{ backgroundColor: '#25d366', color: '#fff', border: 'none', fontSize: '12px' }} title="Share on WhatsApp">
                    <i className="ri-whatsapp-line me-1"></i> Share
                  </button>
                  <button onClick={() => setEditing(viewProperty)} className="btn btn-sm btn-light border" title="Edit Property" style={{ fontSize: '12px' }}>
                    <i className="ri-pencil-line me-1"></i> Edit
                  </button>
                  <button onClick={() => { handleDelete(viewProperty); }} className="btn btn-sm btn-light border text-danger" title="Delete Property" style={{ fontSize: '12px' }}>
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Property Title Hero */}
          <div className="card shadow-sm border-0 mb-3" style={{ borderRadius: '8px' }}>
            <div className="card-body p-4">
              <div className="d-flex flex-wrap align-items-start justify-content-between gap-3">
                <div>
                  <h2 className="fw-bold mb-2" style={{ fontSize: '22px', color: '#2c3e50' }}>{propTitle}</h2>
                  <p className="text-muted mb-2" style={{ fontSize: '14px' }}>
                    <i className="ri-map-pin-line text-danger me-1"></i>
                    {propAddress || `${propLocation}, ${propCity}`}
                    &nbsp;&nbsp;
                    <a href={`/property-details/${viewProperty.id}`} target="_blank" rel="noreferrer" style={{ color: '#405189', fontWeight: '600', fontSize: '13px', textDecoration: 'none' }}>
                      <i className="ri-global-line me-1"></i>Property Landing Page
                    </a>
                  </p>
                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    <span className="badge px-3 py-2" style={{ backgroundColor: propType === 'For Sale' ? '#0ab39c' : '#405189', fontSize: '12px' }}>
                      {propType}
                    </span>
                    <span className="fw-bold" style={{ fontSize: '20px', color: '#e74c3c' }}>{propPrice}</span>
                    {propArea && <span className="text-muted" style={{ fontSize: '13px' }}><i className="ri-layout-masonry-line me-1"></i>Area : {propArea}</span>}
                  </div>
                </div>
                {detailsLoading && !details && (
                  <span className="badge bg-light text-muted border" style={{ fontSize: '11px' }}>Loading details...</span>
                )}
              </div>
            </div>
          </div>

          {/* Main 2-column layout */}
          <div className="row g-3">

            {/* LEFT: Gallery + Description + Features + Amenities */}
            <div className="col-lg-8">

              {/* Image Gallery */}
              <div className="card shadow-sm border-0 mb-3" style={{ borderRadius: '8px' }}>
                <div className="card-body p-2">
                  <div className="position-relative mb-2">
                    {images.length > 0 && (
                      <div className="position-absolute top-0 start-0 m-2 bg-dark bg-opacity-75 text-white px-2 py-1 rounded" style={{ fontSize: '11px', zIndex: 10 }}>
                        <i className="ri-image-line me-1"></i>{activeImage + 1} / {images.length}
                      </div>
                    )}
                    <img
                      src={mainImage || NO_IMAGE}
                      alt={propTitle}
                      className="w-100 rounded"
                      style={{ height: '340px', objectFit: 'cover' }}
                      onError={e => { e.target.src = NO_IMAGE; }}
                    />
                  </div>
                  {images.length > 1 && (
                    <div className="d-flex gap-2 flex-wrap px-1">
                      {images.map((src, i) => (
                        <img
                          key={src + i}
                          src={src}
                          alt={`Photo ${i + 1}`}
                          onClick={() => setActiveImage(i)}
                          className="rounded"
                          style={{ width: '80px', height: '60px', objectFit: 'cover', cursor: 'pointer', border: i === activeImage ? '2px solid #0ab39c' : '2px solid #dee2e6', opacity: i === activeImage ? 1 : 0.7 }}
                          onError={e => { e.target.src = NO_IMAGE; }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats Row */}
              <div className="card shadow-sm border-0 mb-3" style={{ borderRadius: '8px' }}>
                <div className="card-body p-3">
                  <div className="row g-0 text-center">
                    {[
                      ['ri-hotel-bed-line', propBedroom ? propBedroom.replace('BHK', '') + ' Bedroom' : '-', '#405189'],
                      ['ri-showers-line', propBathroom ? propBathroom + ' Bathroom' : '-', '#0ab39c'],
                      ['ri-layout-masonry-line', propArea || '-', '#e74c3c'],
                      ['ri-home-4-line', features['Furnishing'] || '-', '#f39c12'],
                    ].map(([icon, val, color], idx) => (
                      <div key={idx} className={`col-3 ${idx < 3 ? 'border-end' : ''}`}>
                        <i className={icon} style={{ fontSize: '22px', color }}></i>
                        <p className="mb-0 mt-1" style={{ fontSize: '12px', color: '#495057' }}>{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              {propDescription && (
                <div className="card shadow-sm border-0 mb-3" style={{ borderRadius: '8px' }}>
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-3" style={{ fontSize: '15px', color: '#2c3e50', borderBottom: '2px solid #0ab39c', paddingBottom: '8px', display: 'inline-block' }}>Description</h5>
                    <p className="text-muted mb-0" style={{ fontSize: '14px', lineHeight: '1.7', whiteSpace: 'pre-line' }}>{propDescription}</p>
                  </div>
                </div>
              )}

              {/* Features */}
              {Object.keys(features).length > 0 && (
                <div className="card shadow-sm border-0 mb-3" style={{ borderRadius: '8px' }}>
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-3" style={{ fontSize: '15px', color: '#2c3e50', borderBottom: '2px solid #0ab39c', paddingBottom: '8px', display: 'inline-block' }}>Features</h5>
                    <div className="row g-2">
                      {Object.entries(features).map(([key, val]) => (
                        <div key={key} className="col-sm-6">
                          <div className="d-flex align-items-center gap-2 p-2 rounded" style={{ backgroundColor: '#f8f9fa', fontSize: '13px' }}>
                            <i className="ri-check-double-line text-success"></i>
                            <span className="text-muted">{key}:</span>
                            <span className="fw-medium text-dark">{val}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Amenities */}
              {amenities.length > 0 && (
                <div className="card shadow-sm border-0 mb-3" style={{ borderRadius: '8px' }}>
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-3" style={{ fontSize: '15px', color: '#2c3e50', borderBottom: '2px solid #0ab39c', paddingBottom: '8px', display: 'inline-block' }}>Amenities</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {amenities.map(a => (
                        <span key={a} className="badge border" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', fontSize: '12px', padding: '6px 12px', borderColor: '#a5d6a7' }}>
                          <i className="ri-check-line me-1"></i>{a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Property Details + Lead Form + Support */}
            <div className="col-lg-4">

              {/* Property Details Table */}
              <div className="card shadow-sm border-0 mb-3" style={{ borderRadius: '8px' }}>
                <div className="card-header bg-white border-0 pb-0 pt-3 px-3">
                  <h6 className="fw-bold mb-0" style={{ fontSize: '14px', color: '#2c3e50' }}>Property Details</h6>
                </div>
                <div className="card-body p-0">
                  <table className="table table-sm mb-0" style={{ fontSize: '13px' }}>
                    <tbody>
                      {[
                        ['Property Id', propId],
                        ['Price', propPrice],
                        ['Category', propCategory],
                        ['Bedrooms', propBedroom ? propBedroom.replace('BHK', '') : '-'],
                        ['Bathrooms', propBathroom || '-'],
                        ['Property For', propType],
                        ['Area', propArea || '-'],
                        ['Year Built', features['Built Year'] || '-'],
                        ['Furnishing', features['Furnishing'] || '-'],
                        ['Facing', features['Facing'] || '-'],
                        ['Transaction', features['Transaction'] || '-'],
                      ].map(([label, value]) => (
                        <tr key={label} style={{ borderBottom: '1px solid #f3f6f9' }}>
                          <td className="py-2 px-3 text-muted fw-medium" style={{ width: '45%', whiteSpace: 'nowrap' }}>{label}</td>
                          <td className="py-2 px-3 fw-semibold text-dark">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Lead Capture Form */}
              <div className="card shadow-sm border-0 mb-3" style={{ borderRadius: '8px', border: '1px solid #0ab39c20' }}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-1" style={{ fontSize: '14px', color: '#2c3e50' }}>
                    <i className="ri-phone-line text-success me-2"></i>Get a instant call back !
                  </h6>
                  <p className="text-muted mb-3" style={{ fontSize: '12px' }}>Fill the form below and our agent will contact you shortly.</p>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Name *"
                      value={leadForm.name}
                      onChange={e => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                      style={{ fontSize: '13px' }}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="tel"
                      className="form-control form-control-sm"
                      placeholder="Phone *"
                      value={leadForm.phone}
                      onChange={e => setLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                      style={{ fontSize: '13px' }}
                    />
                  </div>
                  {leadMsg && (
                    <div className={`alert py-2 mb-2`} style={{ fontSize: '12px', backgroundColor: leadMsg.startsWith('✅') ? '#d4edda' : '#f8d7da', color: leadMsg.startsWith('✅') ? '#155724' : '#721c24', border: 'none', borderRadius: '4px' }}>
                      {leadMsg}
                    </div>
                  )}
                  <button
                    onClick={() => submitLead(false)}
                    className="btn btn-sm w-100 mb-2"
                    style={{ backgroundColor: '#0ab39c', color: '#fff', fontSize: '13px', fontWeight: '600' }}
                  >
                    <i className="ri-phone-line me-1"></i> Get a Call back
                  </button>
                  <button
                    onClick={() => submitLead(true)}
                    className="btn btn-sm w-100"
                    style={{ backgroundColor: '#25d366', color: '#fff', fontSize: '13px', fontWeight: '600' }}
                  >
                    <i className="ri-whatsapp-line me-1"></i> Get Details On Whatsapp
                  </button>
                </div>
              </div>

              {/* Customer Support */}
              <div className="card shadow-sm border-0 mb-3" style={{ borderRadius: '8px' }}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3" style={{ fontSize: '14px', color: '#2c3e50' }}>Customer Support</h6>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="ri-phone-line text-success" style={{ fontSize: '16px' }}></i>
                    <a href="tel:+919222445513" className="text-decoration-none text-dark" style={{ fontSize: '13px' }}>+91 9222445513</a>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="ri-phone-line text-success" style={{ fontSize: '16px' }}></i>
                    <a href="tel:+919320072003" className="text-decoration-none text-dark" style={{ fontSize: '13px' }}>+91 9320072003</a>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <i className="ri-mail-line text-primary" style={{ fontSize: '16px' }}></i>
                    <a href="mailto:raj@sairealty.in" className="text-decoration-none text-dark" style={{ fontSize: '13px' }}>raj@sairealty.in</a>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Similar Properties */}
          {similarProps.length > 0 && (
            <div className="card shadow-sm border-0 mt-2" style={{ borderRadius: '8px' }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-1" style={{ fontSize: '15px', color: '#2c3e50' }}>Similar Properties</h5>
                <p className="text-muted mb-3" style={{ fontSize: '13px' }}>Explore the Latest Properties.</p>
                <div className="row g-3">
                  {similarProps.map(p => (
                    <div key={p.id} className="col-lg-3 col-md-6">
                      <div
                        className="card border h-100"
                        style={{ cursor: 'pointer', borderRadius: '6px', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
                        onClick={() => openDetails(p)}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                      >
                        <div style={{ position: 'relative' }}>
                          <span className="badge position-absolute top-0 start-0 m-2" style={{ backgroundColor: p.type === 'For Sale' ? '#0ab39c' : '#405189', fontSize: '10px', zIndex: 5 }}>{p.type}</span>
                          <img
                            src={p.image || NO_IMAGE}
                            alt={p.title}
                            className="w-100"
                            style={{ height: '140px', objectFit: 'cover' }}
                            onError={e => { e.target.src = NO_IMAGE; }}
                          />
                        </div>
                        <div className="card-body p-2">
                          <p className="fw-bold mb-1 text-truncate" style={{ fontSize: '12px', color: '#e74c3c' }}>{p.price}</p>
                          <p className="text-dark fw-medium mb-1 text-truncate" style={{ fontSize: '12px' }} title={p.title}>{p.title}</p>
                          <p className="text-muted mb-2 text-truncate" style={{ fontSize: '11px' }}>
                            <i className="ri-map-pin-line me-1"></i>{p.location} - {p.city}
                          </p>
                          <div className="d-flex gap-2 flex-wrap" style={{ fontSize: '11px', color: '#666' }}>
                            {p.bedroom && <span><i className="ri-hotel-bed-line me-1"></i>{p.bedroom}</span>}
                            {p.bathroom && <span><i className="ri-showers-line me-1"></i>{p.bathroom} Bath</span>}
                            {p.area && <span><i className="ri-layout-masonry-line me-1"></i>{p.area}</span>}
                          </div>
                        </div>
                        <div className="card-footer bg-white p-2 border-top">
                          <button className="btn btn-sm w-100" style={{ backgroundColor: '#405189', color: '#fff', fontSize: '11px', fontWeight: '600' }}>
                            SEE DETAILS
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </DashboardLayout>
    );
  }

  // ── Properties list ──
  return (
    <DashboardLayout>
      {propertyForm}
      <div className="container-fluid p-0">
        <div className="row mb-3">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between bg-transparent border-0 p-0" style={{ margin: 0 }}>
              <h4 className="mb-sm-0 fw-bold" style={{ fontSize: '16px', color: '#495057' }}>Properties List</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0" style={{ backgroundColor: 'transparent', padding: 0 }}>
                  <li className="breadcrumb-item"><a href="#!" style={{ color: '#495057', textDecoration: 'none' }}>Properties</a></li>
                  <li className="breadcrumb-item active" style={{ color: '#74788d' }}>Properties List</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="card shadow-sm border-0 mb-3" style={{ borderRadius: '8px' }}>
          <div className="card-body d-flex align-items-center gap-3 py-2">
            <button onClick={() => setEditing({})} className="btn btn-success btn-sm px-3" style={{ backgroundColor: '#0ab39c', borderColor: '#0ab39c', fontWeight: '500' }}>
              <i className="ri-add-line me-1"></i> Add New
            </button>
            <button onClick={refresh} disabled={isRefreshing} className="btn btn-light btn-sm" style={{ fontWeight: '500' }}>
              <i className="ri-refresh-line me-1"></i> {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Search form */}
        <div className="card shadow-sm border-0 mb-3" style={{ borderRadius: '8px' }}>
          <div className="card-body">
            <form onSubmit={(e) => { e.preventDefault(); setApplied(form); }}>
              <div className="row g-3">
                <div className="col-lg-4 col-md-6">
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#495057' }}>Property Type</label>
                  <select className="form-select form-select-sm" value={form.propertyType} onChange={e => setField('propertyType', e.target.value)}>
                    <option value="">Select Property Type</option>
                    {selectOptions('propertyType', ['For Sale', 'For Rent', 'For Lease']).map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="col-lg-4 col-md-6">
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#495057' }}>Category</label>
                  <select className="form-select form-select-sm" value={form.category} onChange={e => setField('category', e.target.value)}>
                    <option value="">Select Category</option>
                    {selectOptions('category', []).map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="col-lg-4 col-md-6">
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#495057' }}>City</label>
                  <select className="form-select form-select-sm" value={form.city} onChange={e => setField('city', e.target.value)}>
                    <option value="">Select City</option>
                    {selectOptions('city', ['Pune']).map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="col-lg-4 col-md-6">
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#495057' }}>Location</label>
                  <MultiSelect placeholder="Select Location" options={selectOptions('location', [])} value={form.location} onChange={v => setField('location', v)} />
                </div>
                <div className="col-lg-4 col-md-6">
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#495057' }}>Min Price</label>
                  <input type="number" min="0" className="form-control form-control-sm" placeholder="Enter Minimum Price" value={form.minPrice} onChange={e => setField('minPrice', e.target.value)} />
                </div>
                <div className="col-lg-4 col-md-6">
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#495057' }}>Max Price</label>
                  <input type="number" min="0" className="form-control form-control-sm" placeholder="Enter Maximum Price" value={form.maxPrice} onChange={e => setField('maxPrice', e.target.value)} />
                </div>
                <div className="col-lg-4 col-md-6">
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#495057' }}>Bedroom</label>
                  <MultiSelect placeholder="Select Bedroom" options={selectOptions('bedroom', ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK'])} value={form.bedroom} onChange={v => setField('bedroom', v)} />
                </div>
                <div className="col-lg-4 col-md-6 d-flex align-items-end gap-2">
                  <button type="submit" className="btn btn-primary btn-sm px-4" style={{ backgroundColor: '#405189', borderColor: '#405189' }}>
                    <i className="ri-search-line me-1"></i> Search
                  </button>
                  <button type="button" onClick={() => { setForm(EMPTY_FILTERS); setApplied(EMPTY_FILTERS); }} className="btn btn-light btn-sm">
                    Clear
                  </button>
                </div>
              </div>
            </form>
            {filtersNeedDetails && detailsPending > 0 ? (
              <p className="text-muted mb-0 mt-2" style={{ fontSize: '12px' }}>
                Category and bedroom details are still loading for {detailsPending} properties; results will update automatically.
              </p>
            ) : null}
          </div>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <p className="text-muted text-center py-5">Loading properties...</p>
        ) : loadError ? (
          <p className="text-danger text-center py-5">{loadError}</p>
        ) : filteredProperties.length === 0 ? (
          <p className="text-muted text-center py-5">No properties match these filters.</p>
        ) : (
          <div className="row">
            {filteredProperties.map((p) => (
              <div className="col-xxl-3 col-lg-4 col-md-6 mb-4" key={p.id}>
                <div className="card h-100 shadow-sm border" style={{ borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>

                  {/* Diagonal Ribbon */}
                  <div style={{ position: 'absolute', top: '10px', left: '-30px', backgroundColor: '#3b4371', color: 'white', padding: '4px 35px', transform: 'rotate(-45deg)', fontSize: '10px', fontWeight: 'bold', zIndex: 10, letterSpacing: '0.5px' }}>
                    {p.type}
                  </div>

                  <div style={{ height: '180px', width: '100%', overflow: 'hidden', backgroundColor: '#f3f6f9' }}>
                    <img
                      alt={p.title}
                      className="w-100 h-100"
                      src={p.image || NO_IMAGE}
                      loading="lazy"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => { e.target.src = NO_IMAGE; }}
                    />
                  </div>

                  <div className="card-body p-3 pb-2">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h5 className="mb-0 text-truncate me-2" style={{ fontSize: '14px', fontWeight: '600' }} title={p.title}>
                        <a href="#!" onClick={(e) => { e.preventDefault(); openDetails(p); }} className="text-primary text-decoration-none" style={{ color: '#0d6efd' }}>{p.title}</a>
                      </h5>
                      <span className="text-muted d-flex align-items-center" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                        <i className="ri-eye-line me-1"></i> {p.views}
                      </span>
                    </div>
                    <p className="text-muted mb-0 text-truncate" style={{ fontSize: '12px' }} title={p.address}>
                      <i className="ri-map-pin-line align-bottom me-1"></i> {p.address}
                    </p>
                  </div>

                  <div className="card-body p-3 pt-0 pb-2">
                    <div className="row g-2 text-center" style={{ borderTop: '1px solid #f3f6f9', borderBottom: '1px solid #f3f6f9', padding: '8px 0' }}>
                      <div className="col-4 border-end">
                        <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Price</p>
                        <h5 className="mb-0 text-truncate" style={{ fontSize: '12px', fontWeight: '600', color: '#495057' }} title={p.price}>{p.price || '-'}</h5>
                      </div>
                      <div className="col-4 border-end">
                        <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Avl From <i className="ri-calendar-2-line"></i></p>
                        <h5 className="mb-0 text-truncate" style={{ fontSize: '12px', fontWeight: '600', color: '#495057' }}>{p.availableFrom || 'None'}</h5>
                      </div>
                      <div className="col-4">
                        <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Created <i className="ri-calendar-2-line"></i></p>
                        <h5 className="mb-0 text-truncate" style={{ fontSize: '12px', fontWeight: '600', color: '#495057' }}>{p.created}</h5>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer bg-transparent p-2 px-3 border-0 d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-2">
                      <a href={p.phone ? `tel:${p.phone}` : undefined} className="text-muted" title={p.phone ? `Call To Seller (${p.phone})` : 'No seller phone'}><i className="ri-phone-line" style={{ fontSize: '15px', cursor: 'pointer' }}></i></a>
                      <a href="#!" onClick={(e) => { e.preventDefault(); shareOnWhatsapp(p); }} className="text-muted" title="Send Details On Whatsapp"><i className="ri-whatsapp-line" style={{ fontSize: '15px', cursor: 'pointer' }}></i></a>
                      <a href="#!" onClick={(e) => { e.preventDefault(); setEditing(p); }} className="text-muted" title="Edit Property Details"><i className="ri-pencil-line" style={{ fontSize: '15px', cursor: 'pointer' }}></i></a>
                      <a href="#!" onClick={(e) => { e.preventDefault(); handleDelete(p); }} className="text-muted" title="Delete Property"><i className="ri-delete-bin-line" style={{ fontSize: '15px', cursor: 'pointer' }}></i></a>
                    </div>
                    <span style={{ color: '#0d6efd', fontSize: '12px', fontWeight: '600' }}>{p.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !loadError && (
          <p className="text-muted mb-4" style={{ fontSize: '13px' }}>
            Available Properties {filteredProperties.length}{filteredProperties.length !== properties.length ? ` of ${properties.length}` : ''}
          </p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardProperties;
