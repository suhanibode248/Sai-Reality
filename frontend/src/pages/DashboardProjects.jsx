import React, { useState } from 'react';
import useCrmCollection from '../hooks/useCrmCollection';
import scrapedProjects from '../data/scrapedProjects.json';
import DashboardLayout from '../components/DashboardLayout';

const DashboardProjects = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [viewProject, setViewProject] = useState(null);

  const initialProjects = [
    { id: 1, title: 'Nivasa Ananya', location: 'Lane no 22 Near To Easterlia,Khese Park, Lohegaoun Dhanori East', price: 'Rs. 65 Lac - 98 Lac', area: '2.5 Acre', image: '/media/dashboard/images/projects/Creative_rxYtS62.jpg', status: 'Draft', date: 'June 23, 2025' },
    { id: 2, title: 'Majestique Towers', location: 'Kharadi East, Pune', price: 'Rs. 85 Lac - 1.2 Cr', area: '5 Acre', image: 'https://placehold.co/600x400?text=Project+2', status: 'Published', date: 'May 10, 2025' },
    { id: 3, title: 'Godrej Infinity', location: 'Keshav Nagar, Pune', price: 'Rs. 70 Lac - 1.5 Cr', area: '10 Acre', image: 'https://placehold.co/600x400?text=Project+3', status: 'Published', date: 'April 5, 2025' },
    { id: 4, title: 'Pristine Equilife', location: 'Wakad, Pune', price: 'Rs. 50 Lac - 80 Lac', area: '3.5 Acre', image: 'https://placehold.co/600x400?text=Project+4', status: 'Draft', date: 'March 15, 2025' },
  ];

  const [editingProject, setEditingProject] = useState(null);
  const [projectSearch, setProjectSearch] = useState('');
  const [projects, setProjects] = useCrmCollection('projects', scrapedProjects || initialProjects);

  const handleDeleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  return (
    <DashboardLayout>
      <div className="container-fluid p-0">
        
        {viewProject ? (
          <div className="container-fluid p-0">
            {/* Header */}
            <div className="row mb-3">
              <div className="col-12">
                <div className="page-title-box d-sm-flex align-items-center justify-content-between bg-white border-0 p-3 shadow-sm rounded">
                  <h4 className="mb-sm-0 fw-bold text-uppercase" style={{ fontSize: '14px', color: '#495057' }}>Project Details</h4>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0" style={{ backgroundColor: 'transparent', padding: 0 }}>
                      <li className="breadcrumb-item"><a href="#!" style={{ color: '#495057', textDecoration: 'none' }}>CRM</a></li>
                      <li className="breadcrumb-item active" style={{ color: '#74788d' }}>Project Details</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              {/* Left Column: Image Gallery */}
              <div className="col-lg-4">
                <div className="card shadow-sm border-0 mb-3 rounded">
                  <div className="card-body p-2 position-relative">
                    <img src={viewProject.image} alt="Main" className="w-100 rounded mb-2" style={{ height: '250px', objectFit: 'cover' }} />
                  </div>
                </div>
              </div>

              {/* Right Column: Details */}
              <div className="col-lg-8">
                <div className="card shadow-sm border-0 mb-3 rounded">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h4 className="fw-bold mb-1" style={{ color: '#405189', fontSize: '18px' }}>{viewProject.title}</h4>
                        <p className="text-muted mb-2" style={{ fontSize: '12px' }}>
                          Status: {viewProject.status} | Date : {viewProject.date}
                        </p>
                        <p className="text-muted mb-3" style={{ fontSize: '13px' }}>
                          <i className="ri-map-pin-line text-primary me-1"></i> {viewProject.location}
                        </p>
                      </div>
                      <div className="d-flex gap-2">
                        <button onClick={() => { navigator.clipboard?.writeText(`${viewProject.title} - ${viewProject.location} - ${viewProject.price}`); alert('Project details copied'); }} className="btn btn-light btn-sm border" title="Copy project details"><i className="ri-links-line"></i></button>
                        <button onClick={() => { setEditingProject(viewProject); setShowAddModal(true); }} className="btn btn-light btn-sm border" title="Edit"><i className="ri-pencil-line"></i></button>
                        <button onClick={() => setViewProject(null)} className="btn btn-light btn-sm border"><i className="ri-arrow-go-back-line"></i></button>
                      </div>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <div className="border rounded p-3 d-flex align-items-center gap-3">
                          <i className="ri-money-rupee-circle-line" style={{ fontSize: '24px', color: '#0ab39c' }}></i>
                          <div>
                            <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Price Range -</p>
                            <h6 className="mb-0 fw-bold">{viewProject.price}</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="border rounded p-3 d-flex align-items-center gap-3">
                          <i className="ri-shape-line" style={{ fontSize: '24px', color: '#0ab39c' }}></i>
                          <div>
                            <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Project Area -</p>
                            <h6 className="mb-0 fw-bold">{viewProject.area}</h6>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h6 className="fw-bold mt-4" style={{ fontSize: '13px' }}>Project Information :</h6>
                    <p className="text-muted" style={{ fontSize: '13px' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Title Box */}
            <div className="row mb-3">
              <div className="col-12">
                <div className="page-title-box d-sm-flex align-items-center justify-content-between bg-transparent border-0 p-0">
                  <h4 className="mb-sm-0 fw-bold" style={{ fontSize: '16px', color: '#495057' }}>Projects List</h4>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0" style={{ backgroundColor: 'transparent', padding: 0 }}>
                      <li className="breadcrumb-item"><a href="#!" style={{ color: '#495057', textDecoration: 'none' }}>Projects</a></li>
                      <li className="breadcrumb-item active" style={{ color: '#74788d' }}>Projects List</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
              <button onClick={() => setShowAddModal(true)} className="btn btn-success btn-sm px-4" style={{ backgroundColor: '#0ab39c', borderColor: '#0ab39c', fontWeight: '500' }}>
                <i className="ri-add-line me-1"></i> Add New
              </button>
              <div className="d-flex gap-2">
                <form className="d-flex align-items-center bg-white border rounded px-2">
                  <i className="ri-search-line text-muted"></i>
                  <input type="text" className="form-control border-0 shadow-none form-control-sm" placeholder="Search..." value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} />
                </form>
                <button onClick={() => setProjectSearch('')} className="btn btn-light btn-sm px-3 border" style={{ fontWeight: '500' }}>
                  <i className="ri-refresh-line me-1"></i> Refresh
                </button>
                <button onClick={() => setShowFilterModal(true)} className="btn btn-primary btn-sm px-3" style={{ backgroundColor: '#405189', borderColor: '#405189', fontWeight: '500' }}>
                  <i className="ri-filter-3-line me-1"></i> Filters
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="row">
              {projects.filter(p => `${p.title} ${p.location} ${p.price}`.toLowerCase().includes(projectSearch.trim().toLowerCase())).map((p) => (
                <div className="col-xxl-3 col-lg-4 col-md-6 mb-4" key={p.id}>
                  <div className="card h-100 shadow-sm border" style={{ borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                    
                    {/* Ribbon */}
                    <div style={{ position: 'absolute', top: '10px', left: '-30px', backgroundColor: '#3b4371', color: 'white', padding: '4px 35px', transform: 'rotate(-45deg)', fontSize: '10px', fontWeight: 'bold', zIndex: 10 }}>
                      {p.status}
                    </div>

                    <div style={{ height: '180px', width: '100%', overflow: 'hidden', backgroundColor: '#f3f6f9' }}>
                      <img 
                        alt={p.title} 
                        className="w-100 h-100" 
                        src={p.image} 
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    
                    <div className="card-body p-3 pb-2">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h5 className="mb-0 text-truncate me-2" style={{ fontSize: '14px', fontWeight: '600' }}>
                          <a href="#!" onClick={(e) => { e.preventDefault(); setViewProject(p); }} className="text-primary text-decoration-none" style={{ color: '#0d6efd' }}>{p.title}</a>
                        </h5>
                        <span className="text-muted d-flex align-items-center" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                          <i className="ri-eye-line me-1"></i> {p.id}
                        </span>
                      </div>
                      <p className="text-muted mb-0 text-truncate" style={{ fontSize: '12px' }}>
                        <i className="ri-map-pin-line align-bottom me-1"></i> {p.location}
                      </p>
                    </div>
                    
                    <div className="card-body p-3 pt-0 pb-2">
                      <div className="row g-2 text-center" style={{ borderTop: '1px solid #f3f6f9', borderBottom: '1px solid #f3f6f9', padding: '8px 0' }}>
                        <div className="col-6 border-end">
                          <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Price</p>
                          <h5 className="mb-0 text-truncate" style={{ fontSize: '12px', fontWeight: '600', color: '#495057' }}>{p.price}</h5>
                        </div>
                        <div className="col-6">
                          <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Project Area</p>
                          <h5 className="mb-0 text-truncate" style={{ fontSize: '12px', fontWeight: '600', color: '#495057' }}><i className="ri-shape-line align-bottom"></i> {p.area}</h5>
                        </div>
                      </div>
                    </div>

                    <div className="card-footer bg-transparent p-2 px-3 border-0 d-flex justify-content-between align-items-center">
                      <div className="d-flex gap-2">
                        <a href="tel:+919876543210" className="text-muted" title="Call To Seller"><i className="ri-phone-line" style={{ fontSize: '15px' }}></i></a>
                        <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="text-muted" title="Send Details On Whatsapp"><i className="ri-whatsapp-line" style={{ fontSize: '15px' }}></i></a>
                        <a href="#!" onClick={(e) => { e.preventDefault(); setEditingProject(p); setShowAddModal(true); }} className="text-muted" title="Edit Project Details"><i className="ri-pencil-fill" style={{ fontSize: '15px' }}></i></a>
                        <a href="#!" onClick={(e) => { e.preventDefault(); handleDeleteProject(p.id); }} className="text-muted" title="Delete Property"><i className="ri-delete-bin-fill" style={{ fontSize: '15px' }}></i></a>
                      </div>
                      <span className="text-muted d-flex align-items-center" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                        <i className="ri-calendar-2-line me-1 align-bottom"></i> {p.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Filter Modal (Sidebar) ── */}
        {showFilterModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <div style={{ backgroundColor: '#fff', width: '380px', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '-5px 0 25px rgba(0,0,0,0.1)' }}>
              
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h6 style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: '#334155' }}>Filter Projects</h6>
                <button onClick={() => setShowFilterModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>&times;</button>
              </div>

              <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
                
                {/* Priority */}
                <div className="mb-4">
                  <label className="form-label text-muted text-uppercase fw-semibold mb-3" style={{ fontSize: '12px' }}>Priority</label>
                  <div className="row g-2">
                    <div className="col-6"><div className="form-check"><input type="checkbox" className="form-check-input" id="pri1" /><label className="form-check-label" htmlFor="pri1">Medium</label></div></div>
                    <div className="col-6"><div className="form-check"><input type="checkbox" className="form-check-input" id="pri2" /><label className="form-check-label" htmlFor="pri2">High</label></div></div>
                    <div className="col-6"><div className="form-check"><input type="checkbox" className="form-check-input" id="pri3" /><label className="form-check-label" htmlFor="pri3">Low</label></div></div>
                  </div>
                </div>

                {/* Date Range */}
                <div className="mb-4">
                  <label className="form-label text-muted text-uppercase fw-semibold mb-3" style={{ fontSize: '12px' }}>Select Project Created Date Range</label>
                  <div className="row g-2 mb-3">
                    <div className="col-6"><div className="form-check"><input type="radio" name="daterange" className="form-check-input" id="d1" defaultChecked /><label className="form-check-label" htmlFor="d1">All Dates</label></div></div>
                    <div className="col-6"><div className="form-check"><input type="radio" name="daterange" className="form-check-input" id="d2" /><label className="form-check-label" htmlFor="d2">Today</label></div></div>
                    <div className="col-6"><div className="form-check"><input type="radio" name="daterange" className="form-check-input" id="d3" /><label className="form-check-label" htmlFor="d3">Yesterday</label></div></div>
                    <div className="col-6"><div className="form-check"><input type="radio" name="daterange" className="form-check-input" id="d4" /><label className="form-check-label" htmlFor="d4">Tomorrow</label></div></div>
                    <div className="col-6"><div className="form-check"><input type="radio" name="daterange" className="form-check-input" id="d5" /><label className="form-check-label" htmlFor="d5">Select Date</label></div></div>
                  </div>
                  <div className="d-flex gap-2">
                    <input type="date" className="form-control form-control-sm" placeholder="From" />
                    <input type="date" className="form-control form-control-sm" placeholder="To" />
                  </div>
                </div>

                {/* Status */}
                <div className="mb-4">
                  <label className="form-label text-muted text-uppercase fw-semibold mb-3" style={{ fontSize: '12px' }}>Project Status</label>
                  <div className="row g-2">
                    <div className="col-6"><div className="form-check"><input type="checkbox" className="form-check-input" id="st1" /><label className="form-check-label" htmlFor="st1">New Created</label></div></div>
                    <div className="col-6"><div className="form-check"><input type="checkbox" className="form-check-input" id="st2" /><label className="form-check-label" htmlFor="st2">Project Initiated</label></div></div>
                    <div className="col-6"><div className="form-check"><input type="checkbox" className="form-check-input" id="st3" /><label className="form-check-label" htmlFor="st3">Planning Process</label></div></div>
                    <div className="col-6"><div className="form-check"><input type="checkbox" className="form-check-input" id="st4" /><label className="form-check-label" htmlFor="st4">Executing Process</label></div></div>
                    <div className="col-6"><div className="form-check"><input type="checkbox" className="form-check-input" id="st5" /><label className="form-check-label" htmlFor="st5">In Progress</label></div></div>
                    <div className="col-6"><div className="form-check"><input type="checkbox" className="form-check-input" id="st6" /><label className="form-check-label" htmlFor="st6">Completed</label></div></div>
                    <div className="col-6"><div className="form-check"><input type="checkbox" className="form-check-input" id="st7" /><label className="form-check-label" htmlFor="st7">Cancelled</label></div></div>
                  </div>
                </div>

              </div>

              <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowFilterModal(false)} style={{ flex: 1, padding: '10px 0', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Clear Filter</button>
                <button type="button" onClick={() => setShowFilterModal(false)} style={{ flex: 1, padding: '10px 0', backgroundColor: '#405189', border: 'none', color: '#fff', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Apply</button>
              </div>
            </div>
          </div>
        )}

      </div>
    
        {/* ── Add New Project Full Modal ── */}
        {showAddModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#f3f3f9', zIndex: 99999, overflowY: 'auto' }}>
            
            {/* Header */}
            <div style={{ backgroundColor: '#fff', padding: '15px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 10 }}>
              <div>
                <h4 style={{ margin: 0, fontWeight: '700', fontSize: '15px', color: '#495057', textTransform: 'uppercase' }}>Add New Project</h4>
              </div>
              <div className="page-title-right">
                <ol className="breadcrumb m-0" style={{ backgroundColor: 'transparent', padding: 0 }}>
                  <li className="breadcrumb-item"><a href="#!" style={{ color: '#495057', textDecoration: 'none' }}>CRM</a></li>
                  <li className="breadcrumb-item active" style={{ color: '#74788d' }}>Add New Project</li>
                </ol>
              </div>
            </div>

            {/* Form Body */}
            <div className="container-fluid mt-4 mb-5" style={{ maxWidth: '1400px' }}>
              <form key={editingProject?.id || 'new'} onSubmit={(e) => {
                e.preventDefault();
                const val = (placeholder) => e.target.querySelector(`[placeholder="${placeholder}"]`)?.value.trim() || '';
                const min = val('₹ Eg: 75 Lakhs'), max = val('₹ Eg: 3 Cr');
                const data = {
                  title: val('Enter property title'),
                  location: [val('Enter property address'), val('Enter locations name'), val('Enter city name')].filter(Boolean).join(', '),
                  price: min || max ? `Rs. ${[min, max].filter(Boolean).join(' - ')}` : (editingProject?.price || ''),
                  area: val('Eg: 2 Acres') || editingProject?.area || ''
                };
                if (editingProject) {
                  setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...data, location: data.location || p.location } : p));
                  if (viewProject?.id === editingProject.id) setViewProject(prev => ({ ...prev, ...data, location: data.location || prev.location }));
                } else {
                  setProjects(prev => [{ id: `proj-${Date.now()}`, status: 'Draft', image: '', date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), ...data }, ...prev]);
                }
                setEditingProject(null);
                setShowAddModal(false);
              }}>
                <div className="row">
                  
                  {/* LEFT COLUMN */}
                  <div className="col-lg-8">
                    
                    {/* Basic Info */}
                    <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '8px' }}>
                      <div className="card-body">
                        <div className="mb-3">
                          <label style={{ fontSize: '13px', fontWeight: '500', color: '#495057' }}>Property Name/ Title <span className="text-danger">*</span></label>
                          <input type="text" className="form-control form-control-sm" placeholder="Enter property title" defaultValue={editingProject?.title || ''} required />
                        </div>
                        <div className="mb-3">
                          <label style={{ fontSize: '13px', fontWeight: '500', color: '#495057' }}>Property Details / Description <span className="text-danger">*</span></label>
                          <textarea className="form-control form-control-sm" rows="4" placeholder="Enter property description" required={!editingProject}></textarea>
                        </div>
                      </div>
                    </div>

                    {/* Images Gallery */}
                    <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '8px' }}>
                      <div className="card-body">
                        <h6 className="fw-bold mb-3" style={{ fontSize: '14px', color: '#495057' }}>Images Gallery</h6>
                        <div className="mb-3">
                          <label style={{ fontSize: '12px', color: '#878a99' }}>Property Main Image ( Size : 600x400 px )<br/>Add main image. * (jpg, png, jpeg, jfif)</label>
                          <div className="border border-dashed rounded text-center p-4 bg-light" style={{ cursor: 'pointer' }}>
                            <i className="ri-upload-cloud-2-line" style={{ fontSize: '24px', color: '#878a99' }}></i>
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', color: '#878a99' }}>Gallery ( Size : 600x400 px )<br/>Add custom multiple images. (png, jpeg, jpeg, jpg)</label>
                          <div><input type="file" className="form-control form-control-sm w-auto" multiple /></div>
                        </div>
                      </div>
                    </div>

                    {/* Property Specs */}
                    <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '8px' }}>
                      <div className="card-body">
                        <div className="row g-3 mb-3">
                          <div className="col-lg-6">
                            <label style={{ fontSize: '13px', fontWeight: '500' }}>Address *</label>
                            <input type="text" className="form-control form-control-sm" placeholder="Enter property address" defaultValue={editingProject?.location || ''} />
                          </div>
                          <div className="col-lg-6">
                            <label style={{ fontSize: '13px', fontWeight: '500' }}>Locations *</label>
                            <input type="text" className="form-control form-control-sm" placeholder="Enter locations name" />
                          </div>
                          <div className="col-lg-6">
                            <label style={{ fontSize: '13px', fontWeight: '500' }}>City *</label>
                            <input type="text" className="form-control form-control-sm" placeholder="Enter city name" />
                          </div>
                          <div className="col-lg-6">
                            <label style={{ fontSize: '13px', fontWeight: '500' }}>Pincode *</label>
                            <input type="text" className="form-control form-control-sm" placeholder="Enter pincode" />
                          </div>
                          <div className="col-lg-6">
                            <label style={{ fontSize: '13px', fontWeight: '500' }}>Bedrooms</label>
                            <input type="text" className="form-control form-control-sm" placeholder="EG: 2 BHK" />
                          </div>
                          <div className="col-lg-6">
                            <label style={{ fontSize: '13px', fontWeight: '500' }}>Parking Details</label>
                            <input type="text" className="form-control form-control-sm" placeholder="Parking Details" />
                          </div>
                          <div className="col-lg-12">
                            <label style={{ fontSize: '13px', fontWeight: '500' }}>Floor</label>
                            <input type="text" className="form-control form-control-sm" placeholder="Floor's" />
                          </div>
                          <div className="col-lg-12">
                            <label style={{ fontSize: '13px', fontWeight: '500' }}>Offers</label>
                            <input type="text" className="form-control form-control-sm" placeholder="Offer" />
                          </div>
                        </div>

                        <div className="row g-3 mb-3">
                          <div className="col-lg-4">
                            <label style={{ fontSize: '13px', fontWeight: '500' }}>Color Theme</label>
                            <input type="color" className="form-control form-control-sm form-control-color" defaultValue="#cc0000" />
                          </div>
                          <div className="col-lg-4">
                            <label style={{ fontSize: '13px', fontWeight: '500' }}>Color Text/Icon</label>
                            <input type="color" className="form-control form-control-sm form-control-color" defaultValue="#cc0000" />
                          </div>
                          <div className="col-lg-4">
                            <label style={{ fontSize: '13px', fontWeight: '500' }}>Icon Color</label>
                            <input type="color" className="form-control form-control-sm form-control-color" defaultValue="#ffffff" />
                          </div>
                        </div>

                        <div className="row g-3 mb-3">
                          <div className="col-lg-12">
                            <label style={{ fontSize: '13px', fontWeight: '500' }}>Build Year</label>
                            <select className="form-select form-select-sm">
                              <option>2026</option>
                              <option>2025</option>
                              <option>2024</option>
                            </select>
                          </div>
                          <div className="col-lg-3">
                            <label style={{ fontSize: '13px', fontWeight: '500' }}>Project Area *</label>
                            <input type="text" className="form-control form-control-sm" placeholder="Eg: 2 Acres" defaultValue={editingProject?.area || ''} />
                          </div>
                          <div className="col-lg-3">
                            <label style={{ fontSize: '13px', fontWeight: '500' }}>Possession *</label>
                            <input type="date" className="form-control form-control-sm" />
                          </div>
                          <div className="col-lg-3">
                            <label style={{ fontSize: '13px', fontWeight: '500' }}>Min Price *</label>
                            <input type="text" className="form-control form-control-sm" placeholder="₹ Eg: 75 Lakhs" />
                          </div>
                          <div className="col-lg-3">
                            <label style={{ fontSize: '13px', fontWeight: '500' }}>Max Price *</label>
                            <input type="text" className="form-control form-control-sm" placeholder="₹ Eg: 3 Cr" />
                          </div>
                        </div>

                        <div className="row g-3">
                          <h6 className="fw-bold mt-2 mb-1" style={{ fontSize: '14px', color: '#495057' }}>Developer Details</h6>
                          <div className="col-lg-6">
                            <label style={{ fontSize: '13px', fontWeight: '500' }}>Developer Name</label>
                            <input type="text" className="form-control form-control-sm" placeholder="Enter developer Name" />
                          </div>
                          <div className="col-lg-6">
                            <label style={{ fontSize: '13px', fontWeight: '500' }}>Contact</label>
                            <input type="text" className="form-control form-control-sm" placeholder="Enter contact number" />
                          </div>
                          <div className="col-lg-12">
                            <label style={{ fontSize: '13px', fontWeight: '500' }}>About Developer</label>
                            <textarea className="form-control form-control-sm" rows="3" placeholder="About developer"></textarea>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="col-lg-4">
                    
                    {/* Publish */}
                    <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '8px' }}>
                      <div className="card-header bg-transparent border-bottom">
                        <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Publish</h6>
                      </div>
                      <div className="card-body">
                        <label style={{ fontSize: '13px', fontWeight: '500' }}>Status</label>
                        <select className="form-select form-select-sm">
                          <option value="Published">Published</option>
                          <option value="Draft">Draft</option>
                        </select>
                      </div>
                    </div>

                    {/* Templates */}
                    <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '8px' }}>
                      <div className="card-header bg-transparent border-bottom">
                        <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Templates</h6>
                      </div>
                      <div className="card-body">
                        <label style={{ fontSize: '13px', fontWeight: '500' }}>Template</label>
                        <select className="form-select form-select-sm">
                          <option value="Default">Default</option>
                          <option value="Template 1">Template 1</option>
                          <option value="Template 2">Template 2</option>
                        </select>
                      </div>
                    </div>

                    {/* Basic Details */}
                    <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '8px' }}>
                      <div className="card-header bg-transparent border-bottom">
                        <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Basic Details</h6>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label style={{ fontSize: '13px', fontWeight: '500' }}>Select Category</label>
                          <select className="form-select form-select-sm">
                            <option value="Residential Appartment">Residential Appartment</option>
                            <option value="Commercial Space & Office">Commercial Space & Office</option>
                            <option value="Commercial Shop">Commercial Shop</option>
                            <option value="Commercial Showroom">Commercial Showroom</option>
                            <option value="Banglow">Banglow</option>
                            <option value="Open Plot">Open Plot</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label style={{ fontSize: '13px', fontWeight: '500' }}>Facing</label>
                          <select className="form-select form-select-sm">
                            <option value="East">East</option>
                            <option value="West">West</option>
                            <option value="North">North</option>
                            <option value="South">South</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label style={{ fontSize: '13px', fontWeight: '500' }}>Furnishing Status</label>
                          <select className="form-select form-select-sm">
                            <option value="Fully Furnished">Fully Furnished</option>
                            <option value="Semi Furnished">Semi Furnished</option>
                            <option value="Unfurnished">Unfurnished</option>
                            <option value="Basic Furnished">Basic Furnished</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label style={{ fontSize: '13px', fontWeight: '500' }}>Environmental Clearance</label>
                          <select className="form-select form-select-sm">
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label style={{ fontSize: '13px', fontWeight: '500' }}>Water Supply Services</label>
                          <select className="form-select form-select-sm">
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label style={{ fontSize: '13px', fontWeight: '500' }}>Approved By</label>
                          <select className="form-select form-select-sm">
                            <option value="Municipal Corporation">Municipal Corporation</option>
                            <option value="PMRDA">PMRDA</option>
                            <option value="Gram Panchayat">Gram Panchayat</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Select Amenities */}
                    <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '8px' }}>
                      <div className="card-header bg-transparent border-bottom">
                        <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Select Amenities</h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          {[
                            'Rooftop Amenities', 'Indoor Games', 'Party Lawn', 'Open Air Amphitheatre', 
                            'Pantry', 'Spa', 'Basketball Court', 'Library', 'CCTV', 'Playground', 'Clubhouse', 
                            'Swimming Pool', 'Designer Club House', 'Senior Citizen\'s Area', 'Kids Play Area',
                            'Jacuzzi', 'Yoga Room', 'Jogging Track', 'Tennis Court', 'Wi-Fi', 'Parking', 'Security', 'Gym'
                          ].map((am, i) => (
                            <div className="col-6 mb-2" key={i}>
                              <div className="form-check">
                                <input type="checkbox" className="form-check-input" id={`am_${i}`} />
                                <label className="form-check-label text-muted" htmlFor={`am_${i}`} style={{ fontSize: '12.5px' }}>{am}</label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-end gap-2 mt-4 mb-4 pb-4">
                      <button type="submit" className="btn text-white fw-medium px-4" style={{ backgroundColor: '#0ab39c' }}>+ Add Now</button>
                      <button type="reset" className="btn fw-medium px-4" style={{ backgroundColor: '#fef4e4', color: '#f59e0b', border: '1px solid #fef4e4' }}>Reset</button>
                      <button type="button" onClick={() => { setEditingProject(null); setShowAddModal(false); }} className="btn fw-medium px-4" style={{ backgroundColor: '#fde8e4', color: '#ef4444', border: '1px solid #fde8e4' }}>Cancel</button>
                    </div>

                  </div>

                </div>
              </form>
            </div>

          </div>
        )}

    </DashboardLayout>
  );
};

export default DashboardProjects;
