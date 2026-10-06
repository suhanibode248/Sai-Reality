import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import certifiedData from '../data/certifiedData.json';

const DashboardProperties = () => {
  const [properties, setProperties] = useState(certifiedData.properties || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const itemsPerPage = 9;

  const [newProp, setNewProp] = useState({
    title: '',
    builder: 'Sai Reality Certified Partner',
    location: 'Kharadi, Pune',
    price: '₹ 65 Lakhs',
    bedrooms: '2 BHK',
    area: '1050 sq.ft',
    type: 'Residential',
    status: 'Ready to Move',
    tag: 'Verified',
    image: '/media/dashboard/images/gallery/1000607247.jpg',
    rera: 'P52100099882'
  });

  const filtered = properties.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.builder.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || p.type.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesStatus = statusFilter === 'All' || (p.status && p.status.toLowerCase().includes(statusFilter.toLowerCase()));
    const matchesLoc = locationFilter === 'All' || p.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesCat && matchesStatus && matchesLoc;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedProps = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddProperty = (e) => {
    e.preventDefault();
    if (!newProp.title) return;
    const item = {
      ...newProp,
      id: `PROP-${1000 + properties.length}`,
      leadsCount: 0
    };
    setProperties([item, ...properties]);
    setShowAddModal(false);
    setNewProp({
      title: '',
      builder: 'Sai Reality Certified Partner',
      location: 'Kharadi, Pune',
      price: '₹ 65 Lakhs',
      bedrooms: '2 BHK',
      area: '1050 sq.ft',
      type: 'Residential',
      status: 'Ready to Move',
      tag: 'Verified',
      image: '/media/dashboard/images/gallery/1000607247.jpg',
      rera: 'P52100099882'
    });
  };

  const handleDeleteProperty = (id) => {
    if (window.confirm('Are you sure you want to delete this property listing?')) {
      setProperties(properties.filter(p => p.id !== id));
      if (selectedProperty && selectedProperty.id === id) {
        setSelectedProperty(null);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="container-fluid p-0">
        {/* Page Title Box */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div>
            <h4 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>Properties Directory (808)</h4>
            <span style={{ fontSize: '12px', color: '#64748b' }}>CRM &gt; Properties &gt; Verified Pune Properties &amp; NA Plots</span>
          </div>
          <div className="d-flex gap-2">
            <button 
              onClick={() => setShowAddModal(true)} 
              className="btn btn-sm" 
              style={{ backgroundColor: '#00b894', color: '#fff', fontWeight: '600' }}
            >
              <i className="ri-add-line me-1"></i> + Add New Property
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: '8px' }}>
          <div className="card-body p-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="d-flex gap-2 flex-wrap">
              {[
                { label: 'All Properties (808)', value: 'All' },
                { label: 'Residential (540)', value: 'Residential' },
                { label: 'Commercial (168)', value: 'Commercial' },
                { label: 'Collector NA Plots (100)', value: 'Plot' }
              ].map(tab => (
                <button
                  key={tab.value}
                  onClick={() => { setCategoryFilter(tab.value); setCurrentPage(1); }}
                  className={`btn btn-sm ${categoryFilter === tab.value ? 'btn-primary' : 'btn-light border'}`}
                  style={{ fontWeight: categoryFilter === tab.value ? '700' : '500', fontSize: '12.5px' }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="btn-group btn-group-sm">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`btn ${viewMode === 'grid' ? 'btn-dark' : 'btn-light border'}`}
                title="Grid View"
              >
                <i className="ri-grid-fill"></i>
              </button>
              <button 
                onClick={() => setViewMode('table')} 
                className={`btn ${viewMode === 'table' ? 'btn-dark' : 'btn-light border'}`}
                title="Table View"
              >
                <i className="ri-list-check-2"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '8px' }}>
          <div className="card-body p-3">
            <div className="row g-2 align-items-center">
              <div className="col-lg-5 col-md-6">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="ri-search-line text-muted"></i>
                  </span>
                  <input 
                    type="text" 
                    className="form-control border-start-0 ps-0" 
                    placeholder="Search by title, builder, or location (Kharadi, Dhanori, Lohegaon, Wagholi)..."
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  />
                </div>
              </div>
              <div className="col-lg-3 col-md-3">
                <select 
                  className="form-select form-select-sm"
                  value={locationFilter}
                  onChange={e => { setLocationFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="All">All Locations (Pune)</option>
                  <option value="Kharadi">Kharadi</option>
                  <option value="Dhanori">Dhanori</option>
                  <option value="Lohegaon">Lohegaon</option>
                  <option value="Wagholi">Wagholi</option>
                  <option value="Baner">Baner</option>
                  <option value="Viman Nagar">Viman Nagar</option>
                </select>
              </div>
              <div className="col-lg-2 col-md-3">
                <select 
                  className="form-select form-select-sm"
                  value={statusFilter}
                  onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Ready">Ready to Move</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="New Launch">New Launch</option>
                </select>
              </div>
              <div className="col-lg-2 col-md-12 text-lg-end text-muted small">
                <span>Showing <strong>{paginatedProps.length}</strong> of <strong>{filtered.length}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* ── GRID VIEW ── */}
        {viewMode === 'grid' && (
          <div className="row g-3">
            {paginatedProps.map(prop => (
              <div className="col-xl-4 col-md-6" key={prop.id}>
                <div className="card border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '8px', transition: 'transform 0.2s' }}>
                  <div className="position-relative" style={{ height: '200px', backgroundColor: '#e2e8f0' }}>
                    <img 
                      src={prop.image} 
                      alt={prop.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = '/media/dashboard/images/gallery/1000607247.jpg'; }}
                    />
                    <span className="badge bg-success position-absolute top-0 start-0 m-2 py-1 px-2 fw-semibold shadow-sm">
                      {prop.tag || 'Verified'}
                    </span>
                    <span className="badge bg-dark position-absolute top-0 end-0 m-2 py-1 px-2 fw-semibold shadow-sm">
                      {prop.status || 'Ready to Move'}
                    </span>
                    <div className="position-absolute bottom-0 start-0 w-100 p-2 text-white" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.9 }}>{prop.builder}</span>
                    </div>
                  </div>

                  <div className="card-body p-3 d-flex flex-column">
                    <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '14.5px', lineHeight: 1.3 }}>
                      {prop.title}
                    </h6>
                    <div className="text-muted small mb-3">
                      📍 {prop.location} • RERA: {prop.rera || 'P52100018592'}
                    </div>

                    <div className="row g-1 bg-light rounded p-2 text-center mb-3 mt-auto" style={{ fontSize: '11.5px' }}>
                      <div className="col-4 border-end">
                        <small className="text-muted d-block">CONFIG</small>
                        <strong className="text-dark">{prop.bedrooms}</strong>
                      </div>
                      <div className="col-4 border-end">
                        <small className="text-muted d-block">AREA</small>
                        <strong className="text-dark">{prop.area}</strong>
                      </div>
                      <div className="col-4">
                        <small className="text-muted d-block">LEADS</small>
                        <strong className="text-primary">{prop.leadsCount || 12} Inquiries</strong>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                      <div>
                        <small className="text-muted d-block" style={{ fontSize: '10.5px' }}>STARTING PRICE</small>
                        <h5 className="mb-0 fw-bold text-primary" style={{ fontSize: '16px' }}>{prop.price}</h5>
                      </div>
                      <div className="d-flex gap-1">
                        <button 
                          onClick={() => setSelectedProperty(prop)}
                          className="btn btn-sm btn-outline-primary py-1 px-2"
                          style={{ fontSize: '12px' }}
                          title="View Details"
                        >
                          <i className="ri-eye-line"></i> View
                        </button>
                        <button 
                          onClick={() => setEditingProperty(prop)}
                          className="btn btn-sm btn-outline-info py-1 px-2 text-dark"
                          style={{ fontSize: '12px', fontWeight: '600' }}
                          title="Edit Property"
                        >
                          <i className="ri-edit-line"></i> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProperty(prop.id)}
                          className="btn btn-sm btn-outline-danger py-1 px-2"
                          style={{ fontSize: '12px' }}
                          title="Delete Property"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TABLE VIEW ── */}
        {viewMode === 'table' && (
          <div className="card border-0 shadow-sm" style={{ borderRadius: '8px' }}>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
                  <thead style={{ backgroundColor: '#f8fafc', color: '#475569' }}>
                    <tr>
                      <th className="ps-3 py-2">Property & Elevation</th>
                      <th className="py-2">Builder / Developer</th>
                      <th className="py-2">Location</th>
                      <th className="py-2">Config</th>
                      <th className="py-2">Super Area</th>
                      <th className="py-2">Price</th>
                      <th className="py-2">Status</th>
                      <th className="text-end pe-3 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProps.map(prop => (
                      <tr key={prop.id}>
                        <td className="ps-3">
                          <div className="d-flex align-items-center gap-2">
                            <img 
                              src={prop.image} 
                              alt="" 
                              style={{ width: '50px', height: '36px', objectFit: 'cover', borderRadius: '4px' }}
                              onError={(e) => { e.target.src = '/media/dashboard/images/gallery/1000607247.jpg'; }}
                            />
                            <div>
                              <div className="fw-bold text-dark">{prop.title}</div>
                              <small className="text-muted">#{prop.id} • {prop.type}</small>
                            </div>
                          </div>
                        </td>
                        <td className="text-muted">{prop.builder}</td>
                        <td>📍 {prop.location}</td>
                        <td className="fw-semibold">{prop.bedrooms}</td>
                        <td className="text-muted">{prop.area}</td>
                        <td className="fw-bold text-primary">{prop.price}</td>
                        <td>
                          <span className="badge bg-success-subtle text-success">{prop.status}</span>
                        </td>
                        <td className="text-end pe-3">
                          <button 
                            onClick={() => setSelectedProperty(prop)}
                            className="btn btn-sm btn-light border me-1"
                            title="View Details"
                          >
                            <i className="ri-eye-line text-primary"></i>
                          </button>
                          <button 
                            onClick={() => setEditingProperty(prop)}
                            className="btn btn-sm btn-light border text-info me-1"
                            title="Edit Listing"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button 
                            onClick={() => handleDeleteProperty(prop.id)}
                            className="btn btn-sm btn-light border text-danger"
                            title="Delete"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className="btn btn-sm btn-light border"
            >
              &laquo; Previous
            </button>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              className="btn btn-sm btn-light border"
            >
              Next &raquo;
            </button>
          </div>
        )}

        {/* ── ADD PROPERTY MODAL ── */}
        {showAddModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="modal-title fw-bold text-dark m-0">+ Add New Property Listing</h5>
                <button onClick={() => setShowAddModal(false)} className="btn-close"></button>
              </div>
              <form onSubmit={handleAddProperty}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-bold mb-1">Property Title*</label>
                    <input 
                      type="text" 
                      required 
                      className="form-control form-control-sm" 
                      placeholder="e.g. 2 BHK Luxury Flat in Lodha Kharadi"
                      value={newProp.title}
                      onChange={e => setNewProp({...newProp, title: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold mb-1">Builder / Developer*</label>
                    <input 
                      type="text" 
                      required 
                      className="form-control form-control-sm" 
                      placeholder="e.g. Lodha Group"
                      value={newProp.builder}
                      onChange={e => setNewProp({...newProp, builder: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold mb-1">Pune Location*</label>
                    <input 
                      type="text" 
                      required 
                      className="form-control form-control-sm" 
                      placeholder="e.g. Kharadi, Pune"
                      value={newProp.location}
                      onChange={e => setNewProp({...newProp, location: e.target.value})}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold mb-1">Configuration*</label>
                    <select 
                      className="form-select form-select-sm"
                      value={newProp.bedrooms}
                      onChange={e => setNewProp({...newProp, bedrooms: e.target.value})}
                    >
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="2.5 BHK">2.5 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="4 BHK">4 BHK</option>
                      <option value="Commercial Space">Commercial Space</option>
                      <option value="Collector NA Plot">Collector NA Plot</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold mb-1">Super Area*</label>
                    <input 
                      type="text" 
                      required 
                      className="form-control form-control-sm" 
                      placeholder="e.g. 1050 sq.ft"
                      value={newProp.area}
                      onChange={e => setNewProp({...newProp, area: e.target.value})}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold mb-1">Price*</label>
                    <input 
                      type="text" 
                      required 
                      className="form-control form-control-sm" 
                      placeholder="e.g. ₹ 75 Lakhs"
                      value={newProp.price}
                      onChange={e => setNewProp({...newProp, price: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold mb-1">Category Type*</label>
                    <select 
                      className="form-select form-select-sm"
                      value={newProp.type}
                      onChange={e => setNewProp({...newProp, type: e.target.value})}
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Plot">Plot / Land</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold mb-1">Possession Status*</label>
                    <select 
                      className="form-select form-select-sm"
                      value={newProp.status}
                      onChange={e => setNewProp({...newProp, status: e.target.value})}
                    >
                      <option value="Ready to Move">Ready to Move</option>
                      <option value="Under Construction">Under Construction</option>
                      <option value="New Launch">New Launch</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold mb-1">MahaRERA Registration No</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      placeholder="e.g. P52100018592"
                      value={newProp.rera}
                      onChange={e => setNewProp({...newProp, rera: e.target.value})}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-sm btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-sm btn-success" style={{ backgroundColor: '#00b894', borderColor: '#00b894' }}>Save Property</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── PROPERTY DETAIL MODAL ── */}
        {selectedProperty && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="modal-title fw-bold text-dark m-0">{selectedProperty.title}</h5>
                <button onClick={() => setSelectedProperty(null)} className="btn-close"></button>
              </div>
              <div className="border-top pt-3">
                <div style={{ height: '220px', backgroundColor: '#e2e8f0', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
                  <img 
                    src={selectedProperty.image} 
                    alt="" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = '/media/dashboard/images/gallery/1000607247.jpg'; }}
                  />
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-6"><strong>Developer:</strong> {selectedProperty.builder}</div>
                  <div className="col-6"><strong>Location:</strong> {selectedProperty.location}</div>
                  <div className="col-6"><strong>Config:</strong> {selectedProperty.bedrooms}</div>
                  <div className="col-6"><strong>Carpet Area:</strong> {selectedProperty.area}</div>
                  <div className="col-6"><strong>Price:</strong> <span className="text-primary fw-bold">{selectedProperty.price}</span></div>
                  <div className="col-6"><strong>MahaRERA:</strong> {selectedProperty.rera || 'P52100018592'}</div>
                  <div className="col-6"><strong>Status:</strong> <span className="badge bg-success">{selectedProperty.status}</span></div>
                  <div className="col-6"><strong>Lead Inquiries:</strong> {selectedProperty.leadsCount || 12} Buyers</div>
                </div>
                <div className="p-3 bg-light rounded mb-3">
                  <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '13px' }}>Included Amenities:</h6>
                  <div className="d-flex gap-2 flex-wrap" style={{ fontSize: '12px' }}>
                    <span className="badge bg-white text-dark border">🏊 Swimming Pool</span>
                    <span className="badge bg-white text-dark border">🏋️ Gym &amp; Fitness</span>
                    <span className="badge bg-white text-dark border">🌳 Landscaped Gardens</span>
                    <span className="badge bg-white text-dark border">🚗 Covered Car Parking</span>
                    <span className="badge bg-white text-dark border">⚡ 100% Power Backup</span>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <button 
                  onClick={() => {
                    setEditingProperty(selectedProperty);
                    setSelectedProperty(null);
                  }}
                  className="btn btn-sm btn-primary fw-bold"
                >
                  <i className="ri-edit-line me-1"></i> Edit Property Listing
                </button>
                <div className="d-flex gap-2">
                  <button onClick={() => setSelectedProperty(null)} className="btn btn-sm btn-secondary">Close</button>
                  <a href={`https://wa.me/919518701503?text=Details%20for%20${encodeURIComponent(selectedProperty.title)}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-success">
                    <i className="ri-whatsapp-line me-1"></i> Share on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── EDIT PROPERTY MODAL ── */}
        {editingProperty && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="modal-title fw-bold text-dark m-0">✏️ Edit Property: {editingProperty.title}</h5>
                <button onClick={() => setEditingProperty(null)} className="btn-close"></button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                setProperties(properties.map(p => p.id === editingProperty.id ? {
                  ...p,
                  title: fd.get('title') || p.title,
                  builder: fd.get('builder') || p.builder,
                  location: fd.get('location') || p.location,
                  price: fd.get('price') || p.price,
                  bedrooms: fd.get('bedrooms') || p.bedrooms,
                  area: fd.get('area') || p.area,
                  type: fd.get('type') || p.type,
                  status: fd.get('status') || p.status,
                  rera: fd.get('rera') || p.rera,
                } : p));
                setEditingProperty(null);
              }}>
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ fontSize: '13px' }}>Property Title *</label>
                  <input required name="title" type="text" className="form-control form-control-sm" defaultValue={editingProperty.title} />
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label fw-bold" style={{ fontSize: '13px' }}>Builder / Developer</label>
                    <input name="builder" type="text" className="form-control form-control-sm" defaultValue={editingProperty.builder} />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-bold" style={{ fontSize: '13px' }}>Location in Pune</label>
                    <input name="location" type="text" className="form-control form-control-sm" defaultValue={editingProperty.location} />
                  </div>
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-4">
                    <label className="form-label fw-bold" style={{ fontSize: '13px' }}>Price</label>
                    <input name="price" type="text" className="form-control form-control-sm" defaultValue={editingProperty.price} />
                  </div>
                  <div className="col-4">
                    <label className="form-label fw-bold" style={{ fontSize: '13px' }}>Bedrooms / Config</label>
                    <input name="bedrooms" type="text" className="form-control form-control-sm" defaultValue={editingProperty.bedrooms} />
                  </div>
                  <div className="col-4">
                    <label className="form-label fw-bold" style={{ fontSize: '13px' }}>Super Area</label>
                    <input name="area" type="text" className="form-control form-control-sm" defaultValue={editingProperty.area} />
                  </div>
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label fw-bold" style={{ fontSize: '13px' }}>Property Category</label>
                    <select name="type" className="form-select form-select-sm" defaultValue={editingProperty.type}>
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Plot">Plot / Land</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-bold" style={{ fontSize: '13px' }}>Construction Status</label>
                    <select name="status" className="form-select form-select-sm" defaultValue={editingProperty.status}>
                      <option value="Ready to Move">Ready to Move</option>
                      <option value="Under Construction">Under Construction</option>
                      <option value="New Launch">New Launch</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ fontSize: '13px' }}>MahaRERA Registration Number</label>
                  <input name="rera" type="text" className="form-control form-control-sm" defaultValue={editingProperty.rera || 'P52100018592'} />
                </div>
                <div className="d-flex justify-content-end gap-2 border-top pt-3">
                  <button type="button" onClick={() => setEditingProperty(null)} className="btn btn-sm btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-sm btn-success" style={{ backgroundColor: '#00b894', borderColor: '#00b894' }}>💾 Save Property Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardProperties;
