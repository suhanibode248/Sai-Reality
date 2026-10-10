import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import certifiedData from '../data/certifiedData.json';
import useCrmCollection from '../hooks/useCrmCollection';

/**
 * ════════════════════════════════════════════════════════════
 * 1. PROPERTIES DIRECTORY (Alias to DashboardProperties)
 * ════════════════════════════════════════════════════════════
 */
export { default as DashboardProperties } from './DashboardProperties';

/**
 * ════════════════════════════════════════════════════════════
 * 2. PROJECTS MANAGEMENT (48 Projects & Builder Townships)
 * ════════════════════════════════════════════════════════════
 */
export function DashboardProjects() {
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('cp_projects_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return certifiedData.projects || [
      { id: 'proj-1', title: 'Lodha Kharadi Luxury Towers', builder: 'Lodha Group', location: 'Kharadi, Pune', units: 450, completion: '85%', status: 'Under Construction', price: '₹ 1.25 Cr*', rera: 'P52100028491', image: '/media/dashboard/images/gallery/AddText_11-08-07.17.24.jpg' },
      { id: 'proj-2', title: 'VTP Township Pegasuss', builder: 'VTP Realty', location: 'Kharadi - Manjri Road, Pune', units: 620, completion: '90%', status: 'Ready Soon', price: '₹ 85 Lakhs*', rera: 'P52100019283', image: '/media/dashboard/images/gallery/WhatsApp_Image_2025-09-20_at_2.37.32_PM.jpeg' },
      { id: 'proj-3', title: 'Bramha F-Residences', builder: 'Bramha Corp', location: 'Wagholi, Pune', units: 320, completion: '100%', status: 'Ready to Move', price: '₹ 72 Lakhs*', rera: 'P52100018592', image: '/media/dashboard/images/gallery/IMG-20250121-WA0002.jpg' },
      { id: 'proj-4', title: 'Goel Ganga Newtown', builder: 'Goel Ganga Developments', location: 'Dhanori, Pune', units: 580, completion: '95%', status: 'Ready to Move', price: '₹ 58 Lakhs*', rera: 'P52100022410', image: '/media/dashboard/images/gallery/Palladium_qp5ZpJM.jpg' },
      { id: 'proj-5', title: 'Collector NA Bungalow Plots', builder: 'Sai Reality Infrastructure', location: 'Lohegaon, Pune', units: 100, completion: '100%', status: 'Ready for Registration', price: '₹ 35 Lakhs*', rera: 'P52100018592', image: '/media/dashboard/images/gallery/1000607247.jpg' },
      { id: 'proj-6', title: 'Majestique Manhattan', builder: 'Majestique Landmarks', location: 'Wagholi, Pune', units: 410, completion: '70%', status: 'Under Construction', price: '₹ 62 Lakhs*', rera: 'P52100027104', image: '/media/dashboard/images/gallery/WhatsApp_Image_2024-04-08_at_2.54.28_PM.jpeg' },
      { id: 'proj-7', title: 'Pride World City (Kingsbury)', builder: 'Pride Group', location: 'Charholi / Lohegaon, Pune', units: 800, completion: '92%', status: 'Ready Soon', price: '₹ 78 Lakhs*', rera: 'P52100016482', image: '/media/dashboard/images/gallery/WhatsApp_Image_2025-09-20_at_2.48.58_PM.jpeg' },
      { id: 'proj-8', title: 'Kolte Patil Equa', builder: 'Kolte Patil Developers', location: 'Wagholi, Pune', units: 350, completion: '65%', status: 'Under Construction', price: '₹ 68 Lakhs*', rera: 'P52100029381', image: '/media/dashboard/images/gallery/1000162207.jpg' }
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [developerFilter, setDeveloperFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [alertMsg, setAlertMsg] = useState('');

  const [newProj, setNewProj] = useState({
    title: '',
    builder: 'Lodha Group',
    location: 'Kharadi, Pune',
    units: 250,
    completion: '75%',
    status: 'Under Construction',
    price: '₹ 80 Lakhs*',
    rera: 'P52100099882',
    image: '/media/dashboard/images/gallery/1000607247.jpg'
  });

  const showAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(''), 3000);
  };

  const saveToStorage = (updated) => {
    setProjects(updated);
    try {
      localStorage.setItem('cp_projects_list', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = projects.filter(p => {
    const matchSearch = (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || (p.location || '').toLowerCase().includes(searchTerm.toLowerCase()) || (p.builder || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchDev = developerFilter === 'All' || (p.builder || '').toLowerCase().includes(developerFilter.toLowerCase());
    const matchStatus = statusFilter === 'All' || (p.status || '').toLowerCase().includes(statusFilter.toLowerCase());
    return matchSearch && matchDev && matchStatus;
  });

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProj.title) return;
    const item = { ...newProj, id: `proj-${Date.now()}` };
    const updated = [item, ...projects];
    saveToStorage(updated);
    setShowAddModal(false);
    setNewProj({
      title: '',
      builder: 'Lodha Group',
      location: 'Kharadi, Pune',
      units: 250,
      completion: '75%',
      status: 'Under Construction',
      price: '₹ 80 Lakhs*',
      rera: 'P52100099882',
      image: '/media/dashboard/images/gallery/1000607247.jpg'
    });
    showAlert('✓ Project added successfully!');
  };

  const handleUpdateProject = (e) => {
    e.preventDefault();
    if (!editingProject) return;
    const updated = projects.map(p => (p.id === editingProject.id || p.title === editingProject.title) ? editingProject : p);
    saveToStorage(updated);
    setEditingProject(null);
    showAlert('✓ Project details updated successfully!');
  };

  const handleDeleteProject = (proj) => {
    if (window.confirm(`Are you sure you want to delete "${proj.title}"?`)) {
      const updated = projects.filter(p => p !== proj && p.id !== proj.id && p.title !== proj.title);
      saveToStorage(updated);
      showAlert('✓ Project removed successfully.');
    }
  };

  return (
    <DashboardLayout>
      {alertMsg && (
        <div className="alert alert-success d-flex align-items-center justify-content-between py-2 px-3 mb-3 border-0 shadow-sm" style={{ backgroundColor: '#10b981', color: '#fff', borderRadius: '8px', fontSize: '13.5px', fontWeight: '600' }}>
          <span>{alertMsg}</span>
          <button onClick={() => setAlertMsg('')} className="btn-close btn-close-white" style={{ fontSize: '10px' }}></button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>Projects Management ({projects.length})</h4>
          <span style={{ fontSize: '12px', color: '#64748b' }}>CRM &gt; Projects &gt; Builder Townships &amp; Floor Plans</span>
        </div>
        <button 
          onClick={() => setShowAddModal(true)} 
          className="btn btn-sm" 
          style={{ backgroundColor: '#00b894', color: '#fff', fontWeight: '600' }}
        >
          <i className="ri-add-line me-1"></i> + Add New Project
        </button>
      </div>

      {/* Project Status Overview Badges */}
      <div className="row g-3 mb-3">
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '8px' }}>
            <small className="text-muted fw-bold" style={{ fontSize: '11px' }}>TOTAL PROJECTS</small>
            <h4 className="fw-bold my-1 text-primary">{projects.length}</h4>
            <small className="text-muted">Pune Townships</small>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '8px' }}>
            <small className="text-muted fw-bold" style={{ fontSize: '11px' }}>UNDER CONSTRUCTION</small>
            <h4 className="fw-bold my-1 text-warning">{projects.filter(p => (p.status || '').includes('Under')).length}</h4>
            <small className="text-muted">Possession 2026-27</small>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '8px' }}>
            <small className="text-muted fw-bold" style={{ fontSize: '11px' }}>READY TO MOVE</small>
            <h4 className="fw-bold my-1 text-success">{projects.filter(p => (p.status || '').includes('Ready')).length}</h4>
            <small className="text-muted">OC Received</small>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '8px' }}>
            <small className="text-muted fw-bold" style={{ fontSize: '11px' }}>VERIFIED DEVELOPERS</small>
            <h4 className="fw-bold my-1 text-info">8 Builders</h4>
            <small className="text-muted">MahaRERA Registered</small>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: '8px' }}>
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            <div className="col-md-6">
              <input 
                type="text" 
                className="form-control form-control-sm"
                placeholder="Search project name, developer (Lodha, Bramha, VTP), or location..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select 
                className="form-select form-select-sm"
                value={developerFilter}
                onChange={e => setDeveloperFilter(e.target.value)}
              >
                <option value="All">All Developers</option>
                <option value="Lodha">Lodha Group</option>
                <option value="VTP">VTP Realty</option>
                <option value="Bramha">Bramha Corp</option>
                <option value="Goel">Goel Ganga</option>
                <option value="Majestique">Majestique Landmarks</option>
                <option value="Pride">Pride Group</option>
                <option value="Kolte">Kolte Patil</option>
                <option value="Sai Reality">Sai Reality Infrastructure</option>
              </select>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select form-select-sm"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Ready">Ready to Move</option>
                <option value="Under Construction">Under Construction</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '8px' }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
              <thead style={{ backgroundColor: '#f8fafc', color: '#475569' }}>
                <tr>
                  <th className="ps-3 py-2">Project &amp; Elevation</th>
                  <th className="py-2">Developer</th>
                  <th className="py-2">Location</th>
                  <th className="py-2">Total Units</th>
                  <th className="py-2" style={{ minWidth: '150px' }}>Construction Progress</th>
                  <th className="py-2">Price From</th>
                  <th className="py-2">Status</th>
                  <th className="text-end pe-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, idx) => (
                  <tr key={p.id || idx}>
                    <td className="ps-3">
                      <div className="d-flex align-items-center gap-2">
                        <img 
                          src={p.image} 
                          alt="" 
                          style={{ width: '56px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                          onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#f1f5f9"/><text x="50%" y="50%" fill="#94a3b8" font-family="sans-serif" font-size="28" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>')}`;
                  }}
                        />
                        <div>
                          <div className="fw-bold text-dark">{p.title}</div>
                          <small className="text-muted">RERA: {p.rera || 'P52100018592'}</small>
                        </div>
                      </div>
                    </td>
                    <td className="text-muted fw-semibold">{p.builder}</td>
                    <td>📍 {p.location}</td>
                    <td className="fw-bold">{p.units} Units</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress flex-grow-1" style={{ height: '6px' }}>
                          <div 
                            className="progress-bar bg-primary" 
                            style={{ width: p.completion, backgroundColor: parseInt(p.completion) >= 90 ? '#16a34a' : '#0284c7' }}
                          ></div>
                        </div>
                        <strong style={{ fontSize: '11px' }}>{p.completion}</strong>
                      </div>
                    </td>
                    <td className="fw-bold text-primary">{p.price}</td>
                    <td>
                      <span className="badge bg-success-subtle text-success">{p.status}</span>
                    </td>
                    <td className="text-end pe-3">
                      <div className="d-inline-flex gap-1">
                        <button 
                          onClick={() => setEditingProject({ ...p })}
                          className="btn btn-sm btn-outline-primary"
                          title="Edit Project"
                        >
                          <i className="ri-pencil-line"></i> Edit
                        </button>
                        <button 
                          onClick={() => setSelectedProject(p)}
                          className="btn btn-sm btn-light border"
                          title="View Details"
                        >
                          <i className="ri-eye-line text-primary"></i>
                        </button>
                        <button 
                          onClick={() => handleDeleteProject(p)}
                          className="btn btn-sm btn-light border text-danger"
                          title="Delete Project"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '100%', maxWidth: '550px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="modal-title fw-bold text-dark m-0">+ Add New Builder Project</h5>
              <button onClick={() => setShowAddModal(false)} className="btn-close"></button>
            </div>
            <form onSubmit={handleAddProject}>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Project Name*</label>
                <input type="text" required className="form-control form-control-sm" placeholder="e.g. Godrej Horizon Kharadi" value={newProj.title} onChange={e => setNewProj({...newProj, title: e.target.value})} />
              </div>
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Developer*</label>
                  <input type="text" required className="form-control form-control-sm" placeholder="e.g. Godrej Properties" value={newProj.builder} onChange={e => setNewProj({...newProj, builder: e.target.value})} />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Location (Pune)*</label>
                  <input type="text" required className="form-control form-control-sm" placeholder="e.g. Kharadi, Pune" value={newProj.location} onChange={e => setNewProj({...newProj, location: e.target.value})} />
                </div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-4">
                  <label className="form-label small fw-bold mb-1">Total Units</label>
                  <input type="number" className="form-control form-control-sm" value={newProj.units} onChange={e => setNewProj({...newProj, units: parseInt(e.target.value) || 100})} />
                </div>
                <div className="col-4">
                  <label className="form-label small fw-bold mb-1">Progress %</label>
                  <input type="text" className="form-control form-control-sm" value={newProj.completion} onChange={e => setNewProj({...newProj, completion: e.target.value})} />
                </div>
                <div className="col-4">
                  <label className="form-label small fw-bold mb-1">Starting Price</label>
                  <input type="text" className="form-control form-control-sm" placeholder="₹ 75 Lakhs*" value={newProj.price} onChange={e => setNewProj({...newProj, price: e.target.value})} />
                </div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Status</label>
                  <select className="form-select form-select-sm" value={newProj.status} onChange={e => setNewProj({...newProj, status: e.target.value})}>
                    <option value="Under Construction">Under Construction</option>
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="Ready Soon">Ready Soon</option>
                    <option value="Ready for Registration">Ready for Registration</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">MahaRERA Number</label>
                  <input type="text" className="form-control form-control-sm" placeholder="P52100018592" value={newProj.rera} onChange={e => setNewProj({...newProj, rera: e.target.value})} />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-sm btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-sm btn-success" style={{ backgroundColor: '#00b894', borderColor: '#00b894' }}>Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '100%', maxWidth: '550px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="modal-title fw-bold text-dark m-0">✏️ Edit Builder Project</h5>
              <button onClick={() => setEditingProject(null)} className="btn-close"></button>
            </div>
            <form onSubmit={handleUpdateProject}>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Project Name*</label>
                <input type="text" required className="form-control form-control-sm" value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value})} />
              </div>
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Developer*</label>
                  <input type="text" required className="form-control form-control-sm" value={editingProject.builder} onChange={e => setEditingProject({...editingProject, builder: e.target.value})} />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Location (Pune)*</label>
                  <input type="text" required className="form-control form-control-sm" value={editingProject.location} onChange={e => setEditingProject({...editingProject, location: e.target.value})} />
                </div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-4">
                  <label className="form-label small fw-bold mb-1">Total Units</label>
                  <input type="number" className="form-control form-control-sm" value={editingProject.units} onChange={e => setEditingProject({...editingProject, units: parseInt(e.target.value) || 100})} />
                </div>
                <div className="col-4">
                  <label className="form-label small fw-bold mb-1">Progress %</label>
                  <input type="text" className="form-control form-control-sm" value={editingProject.completion} onChange={e => setEditingProject({...editingProject, completion: e.target.value})} />
                </div>
                <div className="col-4">
                  <label className="form-label small fw-bold mb-1">Starting Price</label>
                  <input type="text" className="form-control form-control-sm" value={editingProject.price} onChange={e => setEditingProject({...editingProject, price: e.target.value})} />
                </div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Status</label>
                  <select className="form-select form-select-sm" value={editingProject.status} onChange={e => setEditingProject({...editingProject, status: e.target.value})}>
                    <option value="Under Construction">Under Construction</option>
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="Ready Soon">Ready Soon</option>
                    <option value="Ready for Registration">Ready for Registration</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">MahaRERA Number</label>
                  <input type="text" className="form-control form-control-sm" value={editingProject.rera || ''} onChange={e => setEditingProject({...editingProject, rera: e.target.value})} />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" onClick={() => setEditingProject(null)} className="btn btn-sm btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-sm btn-success" style={{ backgroundColor: '#00b894', borderColor: '#00b894' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Project Modal */}
      {selectedProject && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '100%', maxWidth: '600px', padding: '24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="modal-title fw-bold text-dark m-0">{selectedProject.title}</h5>
              <button onClick={() => setSelectedProject(null)} className="btn-close"></button>
            </div>
            <div className="border-top pt-3">
              <div style={{ height: '200px', backgroundColor: '#e2e8f0', borderRadius: '6px', overflow: 'hidden', marginBottom: '14px' }}>
                <img src={selectedProject.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = '/media/dashboard/images/gallery/1000607247.jpg'; }} />
              </div>
              <div className="row g-2">
                <div className="col-6"><strong>Developer:</strong> {selectedProject.builder}</div>
                <div className="col-6"><strong>Location:</strong> {selectedProject.location}</div>
                <div className="col-6"><strong>Total Inventory:</strong> {selectedProject.units} Units</div>
                <div className="col-6"><strong>Starting Price:</strong> <span className="text-primary fw-bold">{selectedProject.price}</span></div>
                <div className="col-6"><strong>RERA Number:</strong> {selectedProject.rera || 'P52100018592'}</div>
                <div className="col-6"><strong>Progress:</strong> <span className="badge bg-success">{selectedProject.completion} Completed</span></div>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button onClick={() => setSelectedProject(null)} className="btn btn-sm btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

/**
 * ════════════════════════════════════════════════════════════
 * 3. DAILY REPORT & CALL LOGS
 * ════════════════════════════════════════════════════════════
 */
export function DashboardDailyReport() {
  const [selectedDate, setSelectedDate] = useState('2026-10-05');
  const [showLogModal, setShowLogModal] = useState(false);

  const [staffLogs, setStaffLogs] = useState([
    { staff: 'Amit Sharma', role: 'Senior Sales Consultant', territory: 'Kharadi & Viman Nagar', targetCalls: 50, completedCalls: 48, connected: 38, siteVisitsFixed: 4, followupsDue: 8, remarks: '3 family visits confirmed for Lodha Kharadi on Saturday.', status: 'Target Met' },
    { staff: 'Pooja Deshpande', role: 'Telecalling Specialist', territory: 'Dhanori & Lohegaon', targetCalls: 70, completedCalls: 72, connected: 54, siteVisitsFixed: 6, followupsDue: 14, remarks: 'High demand for 2 BHK Ganga Newtown and NA plots.', status: 'Target Met' },
    { staff: 'Rajesh Patil', role: 'Area Manager', territory: 'Wagholi Townships', targetCalls: 40, completedCalls: 38, connected: 31, siteVisitsFixed: 3, followupsDue: 6, remarks: 'Token amount of ₹50,000 received for Bramha F-Residences.', status: 'Target Met' },
    { staff: 'Vikas Kulkarni', role: 'Sales Executive', territory: 'Kharadi Riverside', targetCalls: 50, completedCalls: 42, connected: 30, siteVisitsFixed: 2, followupsDue: 9, remarks: 'Shared brochures and pricing calculator on WhatsApp.', status: 'In Progress' },
    { staff: 'Sneha More', role: 'Telecalling Executive', territory: 'Pune Inbound Leads', targetCalls: 65, completedCalls: 60, connected: 45, siteVisitsFixed: 3, followupsDue: 11, remarks: 'Inbound leads from 99acres and MagicBricks processed.', status: 'In Progress' }
  ]);

  const [newLog, setNewLog] = useState({ staff: 'Amit Sharma', calls: 10, connected: 8, visits: 1, remarks: '' });

  const handleAddLog = (e) => {
    e.preventDefault();
    setStaffLogs(staffLogs.map(s => {
      if (s.staff === newLog.staff) {
        return {
          ...s,
          completedCalls: s.completedCalls + parseInt(newLog.calls || 0),
          connected: s.connected + parseInt(newLog.connected || 0),
          siteVisitsFixed: s.siteVisitsFixed + parseInt(newLog.visits || 0),
          remarks: newLog.remarks || s.remarks
        };
      }
      return s;
    }));
    setShowLogModal(false);
  };

  const totalCalls = staffLogs.reduce((acc, s) => acc + s.completedCalls, 0);
  const totalConnected = staffLogs.reduce((acc, s) => acc + s.connected, 0);
  const totalVisits = staffLogs.reduce((acc, s) => acc + s.siteVisitsFixed, 0);

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>Daily Calling Report &amp; Logs</h4>
          <span style={{ fontSize: '12px', color: '#64748b' }}>CRM &gt; Daily Report &gt; Telecaller Productivity &amp; Site Visit Sheet</span>
        </div>
        <div className="d-flex gap-2">
          <input 
            type="date" 
            className="form-control form-control-sm" 
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            style={{ width: '150px' }}
          />
          <button 
            onClick={() => setShowLogModal(true)}
            className="btn btn-sm" 
            style={{ backgroundColor: '#00b894', color: '#fff', fontWeight: '600' }}
          >
            <i className="ri-add-line me-1"></i> + Log Calls
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '8px', borderLeft: '4px solid #0284c7' }}>
            <small className="text-muted fw-bold" style={{ fontSize: '11px' }}>TOTAL CALLS LOGGED</small>
            <h3 className="fw-bold my-1 text-primary">{totalCalls}</h3>
            <small className="text-success fw-bold">&uarr; 18% vs yesterday</small>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
            <small className="text-muted fw-bold" style={{ fontSize: '11px' }}>CONNECTED &amp; SPOKEN</small>
            <h3 className="fw-bold my-1 text-success">{totalConnected}</h3>
            <small className="text-muted">{Math.round((totalConnected / (totalCalls || 1)) * 100)}% Connect Rate</small>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
            <small className="text-muted fw-bold" style={{ fontSize: '11px' }}>SITE VISITS BOOKED</small>
            <h3 className="fw-bold my-1 text-warning">{totalVisits}</h3>
            <small className="text-muted">For this weekend</small>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '8px', borderLeft: '4px solid #8b5cf6' }}>
            <small className="text-muted fw-bold" style={{ fontSize: '11px' }}>DEALS IN FINAL TALKS</small>
            <h3 className="fw-bold my-1 text-info">4 Deals</h3>
            <small className="text-success fw-bold">₹ 3.2 Cr Potential</small>
          </div>
        </div>
      </div>

      {/* Calling Performance Table */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '8px' }}>
        <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0 fw-bold" style={{ fontSize: '15px', color: '#1e293b' }}>
            Staff Calling &amp; Site Visit Sheet ({selectedDate})
          </h5>
          <button 
            onClick={() => alert('Daily sheet exported successfully to CSV!')} 
            className="btn btn-sm btn-light border text-primary fw-bold"
          >
            <i className="ri-download-2-line me-1"></i> Export Sheet
          </button>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
              <thead style={{ backgroundColor: '#f8fafc', color: '#475569' }}>
                <tr>
                  <th className="ps-3 py-2">Executive Name</th>
                  <th className="py-2">Territory</th>
                  <th className="py-2">Target</th>
                  <th className="py-2">Completed Calls</th>
                  <th className="py-2">Spoken</th>
                  <th className="py-2">Visits Booked</th>
                  <th className="py-2">Followups</th>
                  <th className="py-2">Day Remarks</th>
                  <th className="text-end pe-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {staffLogs.map((s, i) => (
                  <tr key={i}>
                    <td className="ps-3">
                      <div className="fw-bold text-dark">{s.staff}</div>
                      <small className="text-muted">{s.role}</small>
                    </td>
                    <td>📍 {s.territory}</td>
                    <td className="text-muted">{s.targetCalls}</td>
                    <td className="fw-bold text-primary">{s.completedCalls}</td>
                    <td className="fw-bold text-success">{s.connected}</td>
                    <td>
                      <span className="badge bg-warning-subtle text-warning fw-bold">{s.siteVisitsFixed} Visits</span>
                    </td>
                    <td className="text-muted">{s.followupsDue}</td>
                    <td style={{ maxWidth: '240px', whiteSpace: 'normal' }}>
                      <small className="text-dark">{s.remarks}</small>
                    </td>
                    <td className="text-end pe-3">
                      <span className={`badge ${s.status === 'Target Met' ? 'bg-success-subtle text-success' : 'bg-info-subtle text-info'}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Log Calling Modal */}
      {showLogModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '100%', maxWidth: '480px', padding: '24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="modal-title fw-bold text-dark m-0">+ Log Calls &amp; Activity</h5>
              <button onClick={() => setShowLogModal(false)} className="btn-close"></button>
            </div>
            <form onSubmit={handleAddLog}>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Select Executive*</label>
                <select className="form-select form-select-sm" value={newLog.staff} onChange={e => setNewLog({...newLog, staff: e.target.value})}>
                  {staffLogs.map((s, i) => <option key={i} value={s.staff}>{s.staff} ({s.role})</option>)}
                </select>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-4">
                  <label className="form-label small fw-bold mb-1">Calls Done*</label>
                  <input type="number" min="1" className="form-control form-control-sm" value={newLog.calls} onChange={e => setNewLog({...newLog, calls: e.target.value})} />
                </div>
                <div className="col-4">
                  <label className="form-label small fw-bold mb-1">Connected*</label>
                  <input type="number" min="0" className="form-control form-control-sm" value={newLog.connected} onChange={e => setNewLog({...newLog, connected: e.target.value})} />
                </div>
                <div className="col-4">
                  <label className="form-label small fw-bold mb-1">Visits Booked</label>
                  <input type="number" min="0" className="form-control form-control-sm" value={newLog.visits} onChange={e => setNewLog({...newLog, visits: e.target.value})} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold mb-1">Daily Notes / Summary</label>
                <textarea rows="3" className="form-control form-control-sm" placeholder="e.g. Clients interested in 2BHK Kharadi..." value={newLog.remarks} onChange={e => setNewLog({...newLog, remarks: e.target.value})}></textarea>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setShowLogModal(false)} className="btn btn-sm btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-sm btn-success" style={{ backgroundColor: '#00b894', borderColor: '#00b894' }}>Submit Log</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

/**
 * ════════════════════════════════════════════════════════════
 * 4. FINANCE & ACCOUNTING OVERVIEW
 * ════════════════════════════════════════════════════════════
 */
export function DashboardFinance() {
  const [invoices, setInvoices] = useState([
    { id: 'INV-2026-088', builder: 'Lodha Group', property: 'Lodha Kharadi Unit 1402 (3BHK)', dealValue: '₹ 1.45 Cr', rate: '2.0%', amount: '₹ 2,90,000', status: 'Received', date: 'Oct 2, 2026' },
    { id: 'INV-2026-087', builder: 'VTP Realty', property: 'VTP Pegasuss Unit 804 (2BHK)', dealValue: '₹ 85 Lakhs', rate: '2.5%', amount: '₹ 2,12,500', status: 'Received', date: 'Sep 28, 2026' },
    { id: 'INV-2026-086', builder: 'Pride Group', property: 'Pride Kingsbury Unit 502 (3BHK)', dealValue: '₹ 95 Lakhs', rate: '2.0%', amount: '₹ 1,90,000', status: 'Processing', date: 'Sep 25, 2026' },
    { id: 'INV-2026-085', builder: 'Goel Ganga', property: 'Ganga Newtown Unit 1105 (2BHK)', dealValue: '₹ 65 Lakhs', rate: '3.0%', amount: '₹ 1,95,000', status: 'Received', date: 'Sep 18, 2026' },
    { id: 'INV-2026-084', builder: 'Sai Reality Plots', property: 'Lohegaon NA Plot No. 14', dealValue: '₹ 40 Lakhs', rate: '3.0%', amount: '₹ 1,20,000', status: 'Received', date: 'Sep 12, 2026' }
  ]);

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>Finance &amp; Accounting Overview</h4>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Finance &amp; Accounting &gt; Developer Brokerage &amp; Profit Margins</span>
        </div>
        <Link to="/dashboard/transactions" className="btn btn-sm btn-primary fw-semibold">
          <i className="ri-exchange-line me-1"></i> View All Transactions
        </Link>
      </div>

      {/* Financial Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
            <small className="text-muted fw-bold" style={{ fontSize: '11px' }}>TOTAL COMMISSION EARNED</small>
            <h3 className="fw-bold my-1 text-success">₹ 76,80,000</h3>
            <small className="text-muted">Across 39 closed deals</small>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
            <small className="text-muted fw-bold" style={{ fontSize: '11px' }}>TOTAL EXPENSES</small>
            <h3 className="fw-bold my-1" style={{ color: '#0B1F4B' }}>₹ 14,20,000</h3>
            <small className="text-muted">Marketing &amp; Office</small>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '8px', borderLeft: '4px solid #0284c7' }}>
            <small className="text-muted fw-bold" style={{ fontSize: '11px' }}>NET PROFIT</small>
            <h3 className="fw-bold my-1 text-primary">₹ 62,60,000</h3>
            <small className="text-success fw-bold">81.5% Net Margin</small>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
            <small className="text-muted fw-bold" style={{ fontSize: '11px' }}>PENDING RECEIVABLES</small>
            <h3 className="fw-bold my-1 text-warning">₹ 18,40,000</h3>
            <small className="text-muted">Due from 3 developers</small>
          </div>
        </div>
      </div>

      {/* Commission Invoices Table */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '8px' }}>
        <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0 fw-bold" style={{ fontSize: '15px', color: '#1e293b' }}>
            Recent Developer Commission Invoices
          </h5>
          <button onClick={() => alert('Exporting all commission invoices...')} className="btn btn-sm btn-light border text-primary fw-bold">
            <i className="ri-download-2-line me-1"></i> Export Invoices
          </button>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
              <thead style={{ backgroundColor: '#f8fafc', color: '#475569' }}>
                <tr>
                  <th className="ps-3 py-2">Invoice ID</th>
                  <th className="py-2">Developer / Builder</th>
                  <th className="py-2">Property Unit Sold</th>
                  <th className="py-2">Deal Value</th>
                  <th className="py-2">Commission %</th>
                  <th className="py-2">Payout Amount</th>
                  <th className="py-2">Status</th>
                  <th className="text-end pe-3 py-2">Invoice Date</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, idx) => (
                  <tr key={idx}>
                    <td className="ps-3 fw-bold text-primary">{inv.id}</td>
                    <td className="fw-semibold text-dark">{inv.builder}</td>
                    <td>{inv.property}</td>
                    <td className="fw-bold">{inv.dealValue}</td>
                    <td><span className="badge bg-light text-dark border">{inv.rate}</span></td>
                    <td className="fw-bold text-success">{inv.amount}</td>
                    <td>
                      <span className={`badge ${inv.status === 'Received' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="text-end pe-3 text-muted">{inv.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/**
 * ════════════════════════════════════════════════════════════
 * 5. TRANSACTIONS LEDGER (All, Income, Expenses)
 * ════════════════════════════════════════════════════════════
 */
export function DashboardTransactions({ filter = 'All' }) {
  const [txns, setTxns] = useState([
    { id: 'TXN-9021', client: 'Sneha Kulkarni', prop: 'Lohegaon NA Plot No. 14', category: 'Income', type: 'Brokerage Commission', amount: '₹ 1,20,000', mode: 'NEFT Transfer', status: 'Received', date: '2026-10-04' },
    { id: 'TXN-9022', client: 'Amit Deshmukh', prop: 'Bramha F-Residences 2.5BHK', category: 'Income', type: 'Booking Token Deposit', amount: '₹ 50,000', mode: 'UPI / Direct', status: 'Verified', date: '2026-10-02' },
    { id: 'TXN-9023', client: 'Goel Ganga Builders', prop: 'Ganga Newtown Payout', category: 'Income', type: 'Developer Commission', amount: '₹ 3,45,000', mode: 'RTGS Transfer', status: 'Received', date: '2026-09-28' },
    { id: 'TXN-9024', client: 'Meta Ads Marketing', prop: 'Lead Generation Campaign', category: 'Expenses', type: 'Marketing Expense', amount: '₹ 45,000', mode: 'Corporate Card', status: 'Paid Out', date: '2026-09-25' },
    { id: 'TXN-9025', client: 'Kharadi Branch Office', prop: 'Office Rent & Maintenance', category: 'Expenses', type: 'Operational Expense', amount: '₹ 60,000', mode: 'Bank Transfer', status: 'Paid Out', date: '2026-09-01' },
    { id: 'TXN-9026', client: 'Google Ads Search', prop: 'Kharadi 2BHK Campaign', category: 'Expenses', type: 'Advertising Spend', amount: '₹ 35,000', mode: 'Corporate Card', status: 'Paid Out', date: '2026-09-15' },
    { id: 'TXN-9027', client: 'Lodha Group Payout', prop: 'Lodha Kharadi Unit 1402', category: 'Income', type: 'Developer Commission', amount: '₹ 2,90,000', mode: 'RTGS Transfer', status: 'Received', date: '2026-09-10' }
  ]);

  const [activeTab, setActiveTab] = useState(filter);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTxn, setNewTxn] = useState({ client: '', prop: '', category: 'Income', type: 'Brokerage Commission', amount: '', mode: 'UPI / Direct' });

  const displayed = txns.filter(t => {
    const matchCat = activeTab === 'All' || t.category.toLowerCase() === activeTab.toLowerCase();
    const matchSearch = t.client.toLowerCase().includes(searchTerm.toLowerCase()) || t.prop.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAddTxn = (e) => {
    e.preventDefault();
    if (!newTxn.client || !newTxn.amount) return;
    const added = {
      id: `TXN-${9030 + txns.length}`,
      client: newTxn.client,
      prop: newTxn.prop || 'Pune Property',
      category: newTxn.category,
      type: newTxn.type,
      amount: newTxn.amount.startsWith('₹') ? newTxn.amount : `₹ ${newTxn.amount}`,
      mode: newTxn.mode,
      status: 'Verified',
      date: new Date().toISOString().split('T')[0]
    };
    setTxns([added, ...txns]);
    setShowAddModal(false);
  };

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>Transactions Ledger ({activeTab.toUpperCase()})</h4>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Finance &amp; Accounting &gt; Transactions Ledger</span>
        </div>
        <button 
          onClick={() => setShowAddModal(true)} 
          className="btn btn-sm" 
          style={{ backgroundColor: '#00b894', color: '#fff', fontWeight: '600' }}
        >
          <i className="ri-add-line me-1"></i> + Add Transaction
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: '8px' }}>
        <div className="card-body p-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="d-flex gap-2">
            {['All', 'Income', 'Expenses'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`btn btn-sm ${activeTab.toLowerCase() === tab.toLowerCase() ? 'btn-primary' : 'btn-light border'}`}
                style={{ fontWeight: activeTab.toLowerCase() === tab.toLowerCase() ? '700' : '500' }}
              >
                {tab === 'All' ? 'All Transactions' : `${tab} Only`}
              </button>
            ))}
          </div>
          <input 
            type="text" 
            className="form-control form-control-sm"
            placeholder="Search by client, property, or TXN ID..."
            style={{ width: '260px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '8px' }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
              <thead style={{ backgroundColor: '#f8fafc', color: '#475569' }}>
                <tr>
                  <th className="ps-3 py-2">Transaction ID</th>
                  <th className="py-2">Client / Entity</th>
                  <th className="py-2">Property Reference</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Payment Mode</th>
                  <th className="py-2">Status</th>
                  <th className="text-end pe-3 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map(t => (
                  <tr key={t.id}>
                    <td className="ps-3 fw-bold text-primary">{t.id}</td>
                    <td className="fw-semibold text-dark">{t.client}</td>
                    <td className="text-muted">{t.prop}</td>
                    <td>
                      <span className={`badge ${t.category === 'Income' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className={`fw-bold ${t.category === 'Income' ? 'text-success' : 'text-danger'}`}>
                      {t.category === 'Income' ? `+ ${t.amount}` : `- ${t.amount}`}
                    </td>
                    <td className="text-muted">{t.mode}</td>
                    <td>
                      <span className="badge bg-success">{t.status}</span>
                    </td>
                    <td className="text-end pe-3 text-muted">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '100%', maxWidth: '480px', padding: '24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="modal-title fw-bold text-dark m-0">+ Record New Transaction</h5>
              <button onClick={() => setShowAddModal(false)} className="btn-close"></button>
            </div>
            <form onSubmit={handleAddTxn}>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Client / Vendor Name*</label>
                <input type="text" required className="form-control form-control-sm" placeholder="e.g. Ramesh Kumar" value={newTxn.client} onChange={e => setNewTxn({...newTxn, client: e.target.value})} />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Property Reference</label>
                <input type="text" className="form-control form-control-sm" placeholder="e.g. Lodha Kharadi 2BHK" value={newTxn.prop} onChange={e => setNewTxn({...newTxn, prop: e.target.value})} />
              </div>
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Category*</label>
                  <select className="form-select form-select-sm" value={newTxn.category} onChange={e => setNewTxn({...newTxn, category: e.target.value})}>
                    <option value="Income">Income (+)</option>
                    <option value="Expenses">Expenses (-)</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Amount (₹)*</label>
                  <input type="text" required className="form-control form-control-sm" placeholder="e.g. 50,000" value={newTxn.amount} onChange={e => setNewTxn({...newTxn, amount: e.target.value})} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold mb-1">Payment Mode</label>
                <select className="form-select form-select-sm" value={newTxn.mode} onChange={e => setNewTxn({...newTxn, mode: e.target.value})}>
                  <option value="UPI / Direct">UPI / Direct</option>
                  <option value="NEFT Transfer">NEFT Transfer</option>
                  <option value="RTGS Transfer">RTGS Transfer</option>
                  <option value="Corporate Card">Corporate Card</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-sm btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-sm btn-success" style={{ backgroundColor: '#00b894', borderColor: '#00b894' }}>Save Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

/**
 * ════════════════════════════════════════════════════════════
 * 6. USER & TEAM MANAGEMENT
 * ════════════════════════════════════════════════════════════
 */
export function DashboardUsers() {
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('cp_users_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 'usr-1', name: 'Admin User', email: 'admin@sairealty.in', role: 'Super Administrator', phone: '+91 9222445513', activeLeads: 24, branch: 'Pune HQ', status: 'Active' },
      { id: 'usr-2', name: 'Amit Sharma', email: 'amit.sales@sairealty.in', role: 'Senior Sales Executive', phone: '+91 9518701503', activeLeads: 48, branch: 'Kharadi Office', status: 'Active' },
      { id: 'usr-3', name: 'Pooja Deshpande', email: 'pooja.tele@sairealty.in', role: 'Telecalling Specialist', phone: '+91 9812345678', activeLeads: 65, branch: 'Lohegaon Office', status: 'Active' },
      { id: 'usr-4', name: 'Rajesh Patil', email: 'rajesh.mgr@sairealty.in', role: 'Area Manager', phone: '+91 9988776655', activeLeads: 32, branch: 'Wagholi Office', status: 'Active' },
      { id: 'usr-5', name: 'Vikas Kulkarni', email: 'vikas.sales@sairealty.in', role: 'Sales Executive', phone: '+91 9765432109', activeLeads: 28, branch: 'Dhanori Office', status: 'Active' }
    ];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [alertMsg, setAlertMsg] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', role: 'Sales Executive', branch: 'Kharadi Office' });

  const showAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(''), 3000);
  };

  const saveToStorage = (updated) => {
    setUsers(updated);
    try {
      localStorage.setItem('cp_users_list', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    const item = { ...newUser, id: `usr-${Date.now()}`, activeLeads: 0, status: 'Active' };
    const updated = [...users, item];
    saveToStorage(updated);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', phone: '', role: 'Sales Executive', branch: 'Kharadi Office' });
    showAlert('✓ New team member added successfully!');
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    const updated = users.map(u => (u.id === editingUser.id || u.email === editingUser.email) ? editingUser : u);
    saveToStorage(updated);
    setEditingUser(null);
    showAlert('✓ Team member details updated successfully!');
  };

  const handleToggleStatus = (u) => {
    const newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
    const updated = users.map(item => (item.id === u.id || item.email === u.email) ? { ...item, status: newStatus } : item);
    saveToStorage(updated);
    showAlert(`✓ User status changed to ${newStatus}`);
  };

  const handleDeleteUser = (u) => {
    if (window.confirm(`Are you sure you want to remove ${u.name} from the team?`)) {
      const updated = users.filter(item => item !== u && item.id !== u.id && item.email !== u.email);
      saveToStorage(updated);
      showAlert('✓ Team member removed successfully.');
    }
  };

  return (
    <DashboardLayout>
      {alertMsg && (
        <div className="alert alert-success d-flex align-items-center justify-content-between py-2 px-3 mb-3 border-0 shadow-sm" style={{ backgroundColor: '#10b981', color: '#fff', borderRadius: '8px', fontSize: '13.5px', fontWeight: '600' }}>
          <span>{alertMsg}</span>
          <button onClick={() => setAlertMsg('')} className="btn-close btn-close-white" style={{ fontSize: '10px' }}></button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>Team &amp; User Management ({users.length})</h4>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Master &gt; Users &gt; Roles, Permissions &amp; Lead Quotas</span>
        </div>
        <button 
          onClick={() => setShowAddModal(true)} 
          className="btn btn-sm" 
          style={{ backgroundColor: '#00b894', color: '#fff', fontWeight: '600' }}
        >
          <i className="ri-add-line me-1"></i> + Add Team Member
        </button>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: '8px' }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
              <thead style={{ backgroundColor: '#f8fafc', color: '#475569' }}>
                <tr>
                  <th className="ps-3 py-2">Staff Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Phone</th>
                  <th className="py-2">Assigned Role</th>
                  <th className="py-2">Branch Office</th>
                  <th className="py-2">Active Leads Cap</th>
                  <th className="py-2">Status</th>
                  <th className="text-end pe-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id || i}>
                    <td className="ps-3">
                      <div className="d-flex align-items-center gap-2">
                        <img 
                          src={`/static/dashboard/assets/images/users/avatar-${(i % 3) + 1}.jpg`} 
                          alt="" 
                          style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #e2e8f0' }}
                          onError={(e) => { e.target.src = '/static/dashboard/assets/images/users/user-dummy-img.jpg'; }}
                        />
                        <div>
                          <div className="fw-bold text-dark">{u.name}</div>
                          <small className="text-muted">ID #SAI-USR-10{i+1}</small>
                        </div>
                      </div>
                    </td>
                    <td className="text-muted">{u.email}</td>
                    <td>{u.phone}</td>
                    <td><span className="badge bg-primary-subtle text-primary">{u.role}</span></td>
                    <td className="text-muted">{u.branch}</td>
                    <td className="fw-bold">{u.activeLeads} Leads</td>
                    <td>
                      <span className={`badge ${u.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="text-end pe-3">
                      <div className="d-inline-flex gap-1">
                        <button 
                          onClick={() => setEditingUser({ ...u })} 
                          className="btn btn-sm btn-outline-primary" 
                          title="Edit Details"
                        >
                          <i className="ri-pencil-line"></i> Edit
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(u)} 
                          className={`btn btn-sm ${u.status === 'Active' ? 'btn-light border text-warning' : 'btn-light border text-success'}`}
                          title={u.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                        >
                          <i className={u.status === 'Active' ? 'ri-pause-circle-line' : 'ri-play-circle-line'}></i>
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u)} 
                          className="btn btn-sm btn-light border text-danger" 
                          title="Delete User"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '100%', maxWidth: '450px', padding: '24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="modal-title fw-bold text-dark m-0">+ Add New Team Member</h5>
              <button onClick={() => setShowAddModal(false)} className="btn-close"></button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Full Name*</label>
                <input type="text" required className="form-control form-control-sm" placeholder="e.g. Vikas Kulkarni" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Email Address*</label>
                <input type="email" required className="form-control form-control-sm" placeholder="vikas@sairealty.in" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
              </div>
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Primary Phone*</label>
                  <input type="text" required className="form-control form-control-sm" placeholder="+91 9876543210" value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Secondary Phone*</label>
                  <input type="text" required className="form-control form-control-sm" placeholder="+91 9876543211" value={newUser.phone2 || ''} onChange={e => setNewUser({...newUser, phone2: e.target.value})} />
                </div>
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Assigned Role*</label>
                  <select className="form-select form-select-sm" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="Senior Sales Manager">Senior Sales Manager</option>
                    <option value="Telecalling Specialist">Telecalling Specialist</option>
                    <option value="Super Administrator">Super Administrator</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Branch</label>
                  <select className="form-select form-select-sm" value={newUser.branch} onChange={e => setNewUser({...newUser, branch: e.target.value})}>
                    <option value="Pune HQ">Pune HQ</option>
                    <option value="Kharadi Office">Kharadi Office</option>
                    <option value="Dhanori Office">Dhanori Office</option>
                    <option value="Lohegaon Office">Lohegaon Office</option>
                  </select>
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-sm btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-sm btn-success" style={{ backgroundColor: '#00b894', borderColor: '#00b894' }}>Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '100%', maxWidth: '450px', padding: '24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="modal-title fw-bold text-dark m-0">✏️ Edit Team Member</h5>
              <button onClick={() => setEditingUser(null)} className="btn-close"></button>
            </div>
            <form onSubmit={handleUpdateUser}>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Full Name*</label>
                <input type="text" required className="form-control form-control-sm" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Email Address*</label>
                <input type="email" required className="form-control form-control-sm" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
              </div>
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Primary Phone*</label>
                  <input type="text" required className="form-control form-control-sm" value={editingUser.phone} onChange={e => setEditingUser({...editingUser, phone: e.target.value})} />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Secondary Phone*</label>
                  <input type="text" required className="form-control form-control-sm" value={editingUser.phone2 || ''} onChange={e => setEditingUser({...editingUser, phone2: e.target.value})} />
                </div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Assigned Role*</label>
                  <select className="form-select form-select-sm" value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value})}>
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="Senior Sales Manager">Senior Sales Manager</option>
                    <option value="Senior Sales Executive">Senior Sales Executive</option>
                    <option value="Telecalling Specialist">Telecalling Specialist</option>
                    <option value="Area Manager">Area Manager</option>
                    <option value="Super Administrator">Super Administrator</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Branch</label>
                  <select className="form-select form-select-sm" value={editingUser.branch} onChange={e => setEditingUser({...editingUser, branch: e.target.value})}>
                    <option value="Pune HQ">Pune HQ</option>
                    <option value="Kharadi Office">Kharadi Office</option>
                    <option value="Dhanori Office">Dhanori Office</option>
                    <option value="Lohegaon Office">Lohegaon Office</option>
                    <option value="Wagholi Office">Wagholi Office</option>
                  </select>
                </div>
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Active Leads Cap</label>
                  <input type="number" className="form-control form-control-sm" value={editingUser.activeLeads || 0} onChange={e => setEditingUser({...editingUser, activeLeads: parseInt(e.target.value) || 0})} />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Status</label>
                  <select className="form-select form-select-sm" value={editingUser.status} onChange={e => setEditingUser({...editingUser, status: e.target.value})}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setEditingUser(null)} className="btn btn-sm btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-sm btn-success" style={{ backgroundColor: '#00b894', borderColor: '#00b894' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

/**
 * ════════════════════════════════════════════════════════════
 * 7. ATTENDANCE SHEET
 * ════════════════════════════════════════════════════════════
 */
export function DashboardAttendance() {
  const [punchedIn, setPunchedIn] = useState(true);

  const records = [
    { staff: 'Admin User', role: 'Super Administrator', shift: '09:00 AM - 06:00 PM', punchIn: '08:45 AM', punchOut: 'Active Now', status: 'On Time', hours: '8h 20m' },
    { staff: 'Amit Sharma', role: 'Senior Consultant', shift: '09:00 AM - 06:00 PM', punchIn: '08:55 AM', punchOut: '06:10 PM', status: 'On Time', hours: '9h 15m' },
    { staff: 'Pooja Deshpande', role: 'Telecalling Specialist', shift: '10:00 AM - 07:00 PM', punchIn: '09:58 AM', punchOut: '07:05 PM', status: 'On Time', hours: '9h 07m' },
    { staff: 'Rajesh Patil', role: 'Area Manager', shift: '09:00 AM - 06:00 PM', punchIn: '09:15 AM', punchOut: '06:30 PM', status: 'Late 15m', hours: '9h 15m' },
    { staff: 'Vikas Kulkarni', role: 'Sales Executive', shift: '09:00 AM - 06:00 PM', punchIn: '08:50 AM', punchOut: '06:00 PM', status: 'On Time', hours: '9h 10m' }
  ];

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>Staff Daily Attendance Sheet</h4>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Master &gt; Users &gt; Attendance Logs &amp; Working Hours</span>
        </div>
        <div className="d-flex gap-2">
          <button 
            onClick={() => setPunchedIn(!punchedIn)}
            className={`btn btn-sm fw-bold ${punchedIn ? 'btn-danger' : 'btn-success'}`}
          >
            <i className="ri-fingerprint-line me-1"></i> {punchedIn ? 'Punch Out' : 'Punch In Now'}
          </button>
          <button onClick={() => alert('Attendance sheet exported!')} className="btn btn-sm btn-light border text-primary fw-bold">
            <i className="ri-download-2-line me-1"></i> Download Sheet
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: '8px' }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
              <thead style={{ backgroundColor: '#f8fafc', color: '#475569' }}>
                <tr>
                  <th className="ps-3 py-2">Staff Member</th>
                  <th className="py-2">Shift Timing</th>
                  <th className="py-2">Punch In</th>
                  <th className="py-2">Punch Out</th>
                  <th className="py-2">Status</th>
                  <th className="text-end pe-3 py-2">Total Working Hours</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={i}>
                    <td className="ps-3">
                      <div className="d-flex align-items-center gap-2">
                        <img 
                          src={`/static/dashboard/assets/images/users/avatar-${(i % 3) + 1}.jpg`} 
                          alt="" 
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #e2e8f0' }}
                          onError={(e) => { e.target.src = '/static/dashboard/assets/images/users/user-dummy-img.jpg'; }}
                        />
                        <div>
                          <div className="fw-bold text-dark">{r.staff}</div>
                          <small className="text-muted">{r.role}</small>
                        </div>
                      </div>
                    </td>
                    <td className="text-muted">{r.shift}</td>
                    <td className="fw-semibold text-dark">{r.punchIn}</td>
                    <td className="fw-semibold text-dark">{r.punchOut}</td>
                    <td>
                      <span className={`badge ${r.status === 'On Time' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="text-end pe-3 fw-bold text-primary">{r.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/**
 * ════════════════════════════════════════════════════════════
 * 8. JOBS & CAREERS
 * ════════════════════════════════════════════════════════════
 */
export function DashboardJobs() {
  const [jobs, setJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('cp_jobs_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 'job-1', title: 'Real Estate Sales Consultant', dept: 'Direct Sales', location: 'Kharadi Office', vacancies: 4, applicants: 28, salary: '₹ 35,000 + Inc', status: 'Active' },
      { id: 'job-2', title: 'Telecalling & CRM Executive', dept: 'Customer Relations', location: 'Lohegaon Office', vacancies: 6, applicants: 45, salary: '₹ 25,000 + Inc', status: 'Active' },
      { id: 'job-3', title: 'Digital Marketing Specialist', dept: 'Marketing', location: 'Pune HQ', vacancies: 2, applicants: 19, salary: '₹ 45,000', status: 'Interviewing' },
      { id: 'job-4', title: 'Property Legal & Agreement Officer', dept: 'Legal & RERA', location: 'Pune HQ', vacancies: 1, applicants: 8, salary: '₹ 55,000', status: 'Active' }
    ];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [alertMsg, setAlertMsg] = useState('');
  const [newJob, setNewJob] = useState({ title: '', dept: 'Direct Sales', location: 'Pune HQ', vacancies: 2, salary: '₹ 30,000', status: 'Active' });

  const showAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(''), 3000);
  };

  const saveToStorage = (updated) => {
    setJobs(updated);
    try {
      localStorage.setItem('cp_jobs_list', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddJob = (e) => {
    e.preventDefault();
    if (!newJob.title) return;
    const item = { ...newJob, id: `job-${Date.now()}`, applicants: 0 };
    const updated = [...jobs, item];
    saveToStorage(updated);
    setShowAddModal(false);
    setNewJob({ title: '', dept: 'Direct Sales', location: 'Pune HQ', vacancies: 2, salary: '₹ 30,000', status: 'Active' });
    showAlert('✓ Job position posted successfully!');
  };

  const handleUpdateJob = (e) => {
    e.preventDefault();
    if (!editingJob) return;
    const updated = jobs.map(j => (j.id === editingJob.id || j.title === editingJob.title) ? editingJob : j);
    saveToStorage(updated);
    setEditingJob(null);
    showAlert('✓ Job opening updated successfully!');
  };

  const handleDeleteJob = (job) => {
    if (window.confirm(`Are you sure you want to delete job opening "${job.title}"?`)) {
      const updated = jobs.filter(j => j !== job && j.id !== job.id);
      saveToStorage(updated);
      showAlert('✓ Job position removed successfully.');
    }
  };

  return (
    <DashboardLayout>
      {alertMsg && (
        <div className="alert alert-success d-flex align-items-center justify-content-between py-2 px-3 mb-3 border-0 shadow-sm" style={{ backgroundColor: '#10b981', color: '#fff', borderRadius: '8px', fontSize: '13.5px', fontWeight: '600' }}>
          <span>{alertMsg}</span>
          <button onClick={() => setAlertMsg('')} className="btn-close btn-close-white" style={{ fontSize: '10px' }}></button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>Job Openings &amp; Recruitment ({jobs.length})</h4>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Master &gt; Jobs &amp; Applications &gt; Open Positions</span>
        </div>
        <button 
          onClick={() => setShowAddModal(true)} 
          className="btn btn-sm" 
          style={{ backgroundColor: '#00b894', color: '#fff', fontWeight: '600' }}
        >
          <i className="ri-add-line me-1"></i> + Post New Job
        </button>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: '8px' }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
              <thead style={{ backgroundColor: '#f8fafc', color: '#475569' }}>
                <tr>
                  <th className="ps-3 py-2">Position Title</th>
                  <th className="py-2">Department</th>
                  <th className="py-2">Location</th>
                  <th className="py-2">Open Vacancies</th>
                  <th className="py-2">Candidates Applied</th>
                  <th className="py-2">Salary Package</th>
                  <th className="py-2">Status</th>
                  <th className="text-end pe-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j, i) => (
                  <tr key={j.id || i}>
                    <td className="ps-3 fw-bold text-dark">{j.title}</td>
                    <td className="text-muted">{j.dept}</td>
                    <td>📍 {j.location}</td>
                    <td className="fw-semibold">{j.vacancies} Positions</td>
                    <td>
                      <Link to="/dashboard/jobs/applications" className="badge bg-primary-subtle text-primary text-decoration-none">
                        {j.applicants || 0} Applicants &rarr;
                      </Link>
                    </td>
                    <td className="fw-bold text-dark">{j.salary}</td>
                    <td>
                      <span className={`badge ${j.status === 'Active' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {j.status}
                      </span>
                    </td>
                    <td className="text-end pe-3">
                      <div className="d-inline-flex gap-1">
                        <button 
                          onClick={() => setEditingJob({ ...j })}
                          className="btn btn-sm btn-outline-primary"
                          title="Edit Job"
                        >
                          <i className="ri-pencil-line"></i> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteJob(j)}
                          className="btn btn-sm btn-light border text-danger"
                          title="Delete Job"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Job Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '100%', maxWidth: '480px', padding: '24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="modal-title fw-bold text-dark m-0">+ Post New Job Opening</h5>
              <button onClick={() => setShowAddModal(false)} className="btn-close"></button>
            </div>
            <form onSubmit={handleAddJob}>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Position Title*</label>
                <input type="text" required className="form-control form-control-sm" placeholder="e.g. Senior Area Sales Manager" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
              </div>
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Department*</label>
                  <input type="text" required className="form-control form-control-sm" placeholder="Sales / Marketing" value={newJob.dept} onChange={e => setNewJob({...newJob, dept: e.target.value})} />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Location*</label>
                  <input type="text" required className="form-control form-control-sm" placeholder="Pune HQ" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
                </div>
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Open Vacancies</label>
                  <input type="number" min="1" className="form-control form-control-sm" value={newJob.vacancies} onChange={e => setNewJob({...newJob, vacancies: parseInt(e.target.value) || 1})} />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Salary Range</label>
                  <input type="text" className="form-control form-control-sm" placeholder="₹ 35,000 + Inc" value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-sm btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-sm btn-success" style={{ backgroundColor: '#00b894', borderColor: '#00b894' }}>Post Position</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {editingJob && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '100%', maxWidth: '480px', padding: '24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="modal-title fw-bold text-dark m-0">✏️ Edit Job Position</h5>
              <button onClick={() => setEditingJob(null)} className="btn-close"></button>
            </div>
            <form onSubmit={handleUpdateJob}>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Position Title*</label>
                <input type="text" required className="form-control form-control-sm" value={editingJob.title} onChange={e => setEditingJob({...editingJob, title: e.target.value})} />
              </div>
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Department*</label>
                  <input type="text" required className="form-control form-control-sm" value={editingJob.dept} onChange={e => setEditingJob({...editingJob, dept: e.target.value})} />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Location*</label>
                  <input type="text" required className="form-control form-control-sm" value={editingJob.location} onChange={e => setEditingJob({...editingJob, location: e.target.value})} />
                </div>
              </div>
              <div className="row g-2 mb-3">
                <div className="col-4">
                  <label className="form-label small fw-bold mb-1">Open Vacancies</label>
                  <input type="number" min="1" className="form-control form-control-sm" value={editingJob.vacancies} onChange={e => setEditingJob({...editingJob, vacancies: parseInt(e.target.value) || 1})} />
                </div>
                <div className="col-4">
                  <label className="form-label small fw-bold mb-1">Salary Range</label>
                  <input type="text" className="form-control form-control-sm" value={editingJob.salary} onChange={e => setEditingJob({...editingJob, salary: e.target.value})} />
                </div>
                <div className="col-4">
                  <label className="form-label small fw-bold mb-1">Status</label>
                  <select className="form-select form-select-sm" value={editingJob.status} onChange={e => setEditingJob({...editingJob, status: e.target.value})}>
                    <option value="Active">Active</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setEditingJob(null)} className="btn btn-sm btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-sm btn-success" style={{ backgroundColor: '#00b894', borderColor: '#00b894' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

/**
 * ════════════════════════════════════════════════════════════
 * 9. JOB CANDIDATE APPLICATIONS
 * ════════════════════════════════════════════════════════════
 */
export function DashboardApplications() {
  const [applicants, setApplicants] = useState([
    { name: 'Sanjay Deshmukh', role: 'Real Estate Sales Consultant', phone: '+91 9823456789', email: 'sanjay.d@gmail.com', exp: '4 Years (Pune Real Estate)', ctc: '₹ 4.5 LPA', date: 'Oct 4, 2026', status: 'Shortlisted' },
    { name: 'Megha Kulkarni', role: 'Telecalling Specialist', phone: '+91 9712345678', email: 'megha.k@outlook.com', exp: '2 Years (CRM Calling)', ctc: '₹ 3.0 LPA', date: 'Oct 3, 2026', status: 'Interviewed' },
    { name: 'Aniket Shinde', role: 'Digital Marketing Specialist', phone: '+91 9988112233', email: 'aniket.ads@gmail.com', exp: '3 Years (Meta & Google Ads)', ctc: '₹ 5.5 LPA', date: 'Oct 1, 2026', status: 'Under Review' },
    { name: 'Pooja Raut', role: 'Property Legal Officer', phone: '+91 9123456780', email: 'pooja.law@gmail.com', exp: '5 Years (MahaRERA)', ctc: '₹ 6.5 LPA', date: 'Sep 29, 2026', status: 'Shortlisted' }
  ]);

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>Job Applications &amp; Candidate CVs (48)</h4>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Master &gt; Jobs &amp; Applications &gt; Applications</span>
        </div>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: '8px' }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
              <thead style={{ backgroundColor: '#f8fafc', color: '#475569' }}>
                <tr>
                  <th className="ps-3 py-2">Applicant Name</th>
                  <th className="py-2">Applied Role</th>
                  <th className="py-2">Contact Details</th>
                  <th className="py-2">Experience</th>
                  <th className="py-2">Current CTC</th>
                  <th className="py-2">Status</th>
                  <th className="text-end pe-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((a, i) => (
                  <tr key={i}>
                    <td className="ps-3">
                      <div className="d-flex align-items-center gap-2">
                        <img 
                          src={`/static/dashboard/assets/images/users/avatar-${(i % 3) + 1}.jpg`} 
                          alt="" 
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #e2e8f0' }}
                          onError={(e) => { e.target.src = '/static/dashboard/assets/images/users/user-dummy-img.jpg'; }}
                        />
                        <div className="fw-bold text-dark">{a.name}</div>
                      </div>
                    </td>
                    <td className="fw-semibold text-primary">{a.role}</td>
                    <td>
                      <div>{a.phone}</div>
                      <small className="text-muted">{a.email}</small>
                    </td>
                    <td className="text-muted">{a.exp}</td>
                    <td className="fw-semibold">{a.ctc}</td>
                    <td>
                      <span className={`badge ${a.status === 'Shortlisted' ? 'bg-success' : 'bg-info'}`}>{a.status}</span>
                    </td>
                    <td className="text-end pe-3">
                      <a href={`tel:${a.phone}`} className="btn btn-sm btn-light border text-success me-1" title="Call Candidate">
                        <i className="ri-phone-line"></i>
                      </a>
                      <button className="btn btn-sm btn-light border text-primary">Resume</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/**
 * ════════════════════════════════════════════════════════════
 * 10. MEDIA & GALLERY HUB (Matching 8 Live Albums)
 * ════════════════════════════════════════════════════════════
 */
export function DashboardMedia() {
  const [activeAlbum, setActiveAlbum] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [galleryImages, setGalleryImages] = useCrmCollection('mediaGallery', [
    { title: 'Diwali Festive Banner', album: 'Project', src: '/media/dashboard/images/gallery/1000162207.jpg' },
    { title: 'Collector NA Plots 70L Offer', album: 'Project', src: '/media/dashboard/images/gallery/1000607247.jpg' },
    { title: 'Lodha Kharadi Premium', album: 'Designing', src: '/media/dashboard/images/gallery/AddText_11-08-07.17.24.jpg' },
    { title: 'Palladium Dhanori View', album: 'Photography', src: '/media/dashboard/images/gallery/Palladium_qp5ZpJM.jpg' },
    { title: 'XXL 2 Bed Homes 58.99L', album: 'Designing', src: '/media/dashboard/images/gallery/WhatsApp_Image_2024-04-08_at_2.54.28_PM.jpeg' },
    { title: 'Book Home Bag Goods Offer', album: 'Events', src: '/media/dashboard/images/gallery/WhatsApp_Image_2025-09-20_at_2.30.53_PM.jpeg' },
    { title: 'Festive Easy Pay Banner', album: 'Project', src: '/media/dashboard/images/gallery/WhatsApp_Image_2025-09-20_at_2.37.32_PM.jpeg' },
    { title: '7% Assured Rental ROI', album: 'Development', src: '/media/dashboard/images/gallery/WhatsApp_Image_2025-09-20_at_2.48.58_PM.jpeg' },
    { title: 'Navratri Special Offer', album: 'Events', src: '/media/dashboard/images/gallery/WhatsApp_Image_2025-09-25_at_2.30.14_PM.jpeg' },
    { title: '2 & 3 BHK 99 Lakh Kharadi', album: 'Project', src: '/media/dashboard/images/gallery/IMG-20250121-WA0002.jpg' },
    { title: 'Collector NA Bungalows', album: 'Development', src: '/media/dashboard/images/gallery/IMG-20250306-WA0006.jpg' },
    { title: 'Actual Ready Flat Photos', album: 'Photography', src: '/media/dashboard/images/gallery/IMG-20240301-WA0000.jpg' },
    { title: 'Lohegaon Plot Master Layout', album: 'Development', src: '/media/dashboard/images/gallery/banner_plots.png' },
    { title: 'Dubai Luxury Investment', album: 'Designing', src: '/media/dashboard/images/gallery/banner_dubai.png' },
    { title: 'Residential Elevation View 1', album: 'Photography', src: '/media/dashboard/images/gallery/hero_slide_1.png' },
    { title: 'Residential Elevation View 2', album: 'Photography', src: '/media/dashboard/images/gallery/hero_slide_2.png' }
  ]);

  const [newMedia, setNewMedia] = useState({ name: '', album: 'Project' });

  const filtered = activeAlbum === 'All' ? galleryImages : galleryImages.filter(g => g.album.toLowerCase() === activeAlbum.toLowerCase());

  const handleAddMedia = (e) => {
    e.preventDefault();
    if (!newMedia.name) return;
    setGalleryImages([
      { title: newMedia.name, album: newMedia.album, src: '/media/dashboard/images/gallery/1000607247.jpg' },
      ...galleryImages
    ]);
    setShowAddModal(false);
  };

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>Gallery</h4>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Others &gt; Media / Gallery &gt; Albums &amp; Property Banners</span>
        </div>
        <button 
          onClick={() => setShowAddModal(true)} 
          className="btn btn-sm" 
          style={{ backgroundColor: '#00b894', color: '#fff', fontWeight: '600' }}
        >
          <i className="ri-add-line me-1"></i> Add New Media
        </button>
      </div>

      {/* Media Grid */}
      <div className="row g-3">
        {filtered.map((img, i) => (
          <div className="col-xl-3 col-lg-4 col-md-6" key={i}>
            <div className="card border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '8px' }}>
              <div style={{ height: '170px', backgroundColor: '#f1f5f9', position: 'relative' }}>
                <img 
                  src={img.src} 
                  alt="" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#f1f5f9"/><text x="50%" y="50%" fill="#94a3b8" font-family="sans-serif" font-size="28" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>')}`;
                  }}
                />
                <span className="badge bg-dark bg-opacity-75 position-absolute top-0 end-0 m-2" style={{ fontSize: '10px' }}>
                  500x500 Px
                </span>
              </div>
              <div className="card-body p-2 d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold text-dark" style={{ fontSize: '12.5px' }}>{img.title}</div>
                  <small className="text-primary">{img.album}</small>
                </div>
                <button 
                  onClick={() => setGalleryImages(galleryImages.filter((_, idx) => idx !== i))}
                  className="btn btn-sm btn-light border text-danger"
                  title="Delete Media"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '100%', maxWidth: '480px', padding: '24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="modal-title fw-bold text-dark m-0">+ Upload New Media</h5>
              <button onClick={() => setShowAddModal(false)} className="btn-close"></button>
            </div>
            <form onSubmit={handleAddMedia}>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Select Media Album*</label>
                <select className="form-select form-select-sm" value={newMedia.album} onChange={e => setNewMedia({...newMedia, album: e.target.value})}>
                  <option value="Project">Project</option>
                  <option value="Designing">Designing</option>
                  <option value="Photography">Photography</option>
                  <option value="Development">Development</option>
                  <option value="Events">Events</option>
                  <option value="Functions">Functions</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold mb-1">Media Title / Name*</label>
                <input type="text" required className="form-control form-control-sm" placeholder="Enter media title" value={newMedia.name} onChange={e => setNewMedia({...newMedia, name: e.target.value})} />
              </div>
              <div className="p-3 border rounded bg-light text-center mb-3">
                <i className="ri-upload-cloud-2-line text-primary fs-2"></i>
                <div className="small fw-bold mt-1">Upload Photo / Banner</div>
                <small className="text-muted">Standard 500x500 Px or 1920x800 Px</small>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-sm btn-secondary">Close</button>
                <button type="submit" className="btn btn-sm btn-success" style={{ backgroundColor: '#00b894', borderColor: '#00b894' }}>Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

/**
 * ════════════════════════════════════════════════════════════
 * 11. WEBSITE SLIDERS (Hero Slide Carousel Manager)
 * ════════════════════════════════════════════════════════════
 */
export function DashboardSliders() {
  const [slides, setSlides] = useState(() => {
    try {
      const saved = localStorage.getItem('cp_sliders_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 1, title: 'Collector N A plots, 4 BHK bungalows starting 70 L only', sub: 'Find new & featured property located in your local city', img: '/media/dashboard/images/gallery/1000607247.jpg', status: 'Active' },
      { id: 2, title: '7 % Assured Rental ROI', sub: 'Commercial spaces & retail shops in high density zones', img: '/media/dashboard/images/gallery/WhatsApp_Image_2025-09-20_at_2.48.58_PM.jpeg', status: 'Active' },
      { id: 3, title: 'Festive Easy Pay Offer', sub: '10:90 Developer Payment Plan with Zero EMI till possession', img: '/media/dashboard/images/gallery/WhatsApp_Image_2025-09-20_at_2.37.32_PM.jpeg', status: 'Active' },
      { id: 4, title: 'Navratri Festival Offer', sub: 'Special festive gold coin on spot booking confirmation', img: '/media/dashboard/images/gallery/WhatsApp_Image_2025-09-25_at_2.30.14_PM.jpeg', status: 'Active' },
      { id: 5, title: 'Book A Home Bag The Goods', sub: 'White goods worth ₹2 Lakhs free with every luxury apartment', img: '/media/dashboard/images/gallery/WhatsApp_Image_2025-09-20_at_2.30.53_PM.jpeg', status: 'Active' },
      { id: 6, title: 'Collector N A Bungalow plots', sub: 'Clear title NA plots with ready water and electricity connections', img: '/media/dashboard/images/gallery/IMG-20250306-WA0006.jpg', status: 'Active' },
      { id: 7, title: '2 & 3 BHK 99 Lakh* At Kharadi Riverside', sub: 'Riverside scenic views with 40+ lifestyle amenities', img: '/media/dashboard/images/gallery/IMG-20250121-WA0002.jpg', status: 'Active' },
      { id: 8, title: 'Celebrate Diwali with your Dream Home', sub: 'Exclusive festive rates across Dhanori and Lohegaon projects', img: '/media/dashboard/images/gallery/1000162207.jpg', status: 'Active' }
    ];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [alertMsg, setAlertMsg] = useState('');
  const [newSlide, setNewSlide] = useState({ title: '', sub: '', img: '/media/dashboard/images/gallery/1000607247.jpg', status: 'Active' });

  const showAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(''), 3000);
  };

  const saveToStorage = (updated) => {
    setSlides(updated);
    try {
      localStorage.setItem('cp_sliders_list', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSlide = (e) => {
    e.preventDefault();
    if (!newSlide.title) return;
    const item = {
      id: Date.now(),
      title: newSlide.title,
      sub: newSlide.sub || 'Find verified property in Pune',
      img: newSlide.img || '/media/dashboard/images/gallery/1000607247.jpg',
      status: newSlide.status
    };
    const updated = [item, ...slides];
    saveToStorage(updated);
    setShowAddModal(false);
    setNewSlide({ title: '', sub: '', img: '/media/dashboard/images/gallery/1000607247.jpg', status: 'Active' });
    showAlert('✓ New website slider added successfully!');
  };

  const handleUpdateSlide = (e) => {
    e.preventDefault();
    if (!editingSlide) return;
    const updated = slides.map(s => s.id === editingSlide.id ? editingSlide : s);
    saveToStorage(updated);
    setEditingSlide(null);
    showAlert('✓ Website slider updated successfully!');
  };

  const handleDeleteSlide = (id) => {
    if (window.confirm('Are you sure you want to delete this slider banner?')) {
      const updated = slides.filter(item => item.id !== id);
      saveToStorage(updated);
      showAlert('✓ Slider banner removed.');
    }
  };

  return (
    <DashboardLayout>
      {alertMsg && (
        <div className="alert alert-success d-flex align-items-center justify-content-between py-2 px-3 mb-3 border-0 shadow-sm" style={{ backgroundColor: '#10b981', color: '#fff', borderRadius: '8px', fontSize: '13.5px', fontWeight: '600' }}>
          <span>{alertMsg}</span>
          <button onClick={() => setAlertMsg('')} className="btn-close btn-close-white" style={{ fontSize: '10px' }}></button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>Website Hero Sliders ({slides.length})</h4>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Others &gt; Sliders &gt; Homepage Carousel Banners</span>
        </div>
        <button 
          onClick={() => setShowAddModal(true)} 
          className="btn btn-sm" 
          style={{ backgroundColor: '#00b894', color: '#fff', fontWeight: '600' }}
        >
          <i className="ri-add-line me-1"></i> + Add New Slider
        </button>
      </div>

      <div className="row g-3">
        {slides.map(s => (
          <div className="col-xl-4 col-md-6" key={s.id}>
            <div className="card border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '8px' }}>
              <div style={{ height: '160px', backgroundColor: '#e2e8f0' }}>
                <img src={s.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = '/media/dashboard/images/gallery/1000607247.jpg'; }} />
              </div>
              <div className="card-body p-3 d-flex flex-column">
                <h6 className="fw-bold text-dark mb-1">{s.title}</h6>
                <p className="text-muted small mb-3">{s.sub}</p>
                <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                  <span className={`badge ${s.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>{s.status}</span>
                  <div className="d-flex gap-1">
                    <button onClick={() => setEditingSlide({ ...s })} className="btn btn-sm btn-light border text-primary">
                      <i className="ri-pencil-line"></i> Edit
                    </button>
                    <button onClick={() => handleDeleteSlide(s.id)} className="btn btn-sm btn-light border text-danger">
                      <i className="ri-delete-bin-line"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Slider Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '100%', maxWidth: '480px', padding: '24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="modal-title fw-bold text-dark m-0">+ Add Website Slider</h5>
              <button onClick={() => setShowAddModal(false)} className="btn-close"></button>
            </div>
            <form onSubmit={handleAddSlide}>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Headline Title*</label>
                <input type="text" required className="form-control form-control-sm" placeholder="e.g. 2 & 3 BHK 99 Lakh* At Kharadi" value={newSlide.title} onChange={e => setNewSlide({...newSlide, title: e.target.value})} />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Subtitle Description</label>
                <input type="text" className="form-control form-control-sm" placeholder="e.g. Riverside Scenic Views" value={newSlide.sub} onChange={e => setNewSlide({...newSlide, sub: e.target.value})} />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold mb-1">Status</label>
                <select className="form-select form-select-sm" value={newSlide.status} onChange={e => setNewSlide({...newSlide, status: e.target.value})}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-sm btn-secondary">Close</button>
                <button type="submit" className="btn btn-sm btn-success" style={{ backgroundColor: '#00b894', borderColor: '#00b894' }}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Slider Modal */}
      {editingSlide && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '100%', maxWidth: '480px', padding: '24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="modal-title fw-bold text-dark m-0">✏️ Edit Website Slider</h5>
              <button onClick={() => setEditingSlide(null)} className="btn-close"></button>
            </div>
            <form onSubmit={handleUpdateSlide}>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Headline Title*</label>
                <input type="text" required className="form-control form-control-sm" value={editingSlide.title} onChange={e => setEditingSlide({...editingSlide, title: e.target.value})} />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Subtitle Description</label>
                <input type="text" className="form-control form-control-sm" value={editingSlide.sub} onChange={e => setEditingSlide({...editingSlide, sub: e.target.value})} />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold mb-1">Status</label>
                <select className="form-select form-select-sm" value={editingSlide.status} onChange={e => setEditingSlide({...editingSlide, status: e.target.value})}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setEditingSlide(null)} className="btn btn-sm btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-sm btn-success" style={{ backgroundColor: '#00b894', borderColor: '#00b894' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

/**
 * ════════════════════════════════════════════════════════════
 * 12. WEBSITE OFFERS & MARQUEE
 * ════════════════════════════════════════════════════════════
 */
export function DashboardOffers() {
  const [marqueeText, setMarqueeText] = useState(() => {
    try {
      const saved = localStorage.getItem('cp_marquee_text');
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return '********NO BROKERAGE********BOTTOM RATE POLICY********FREE SITE VISIT********BOTTOM RATE GUARANTEE***HOLI FESTIVAL OFFER: WHITE GOODS WORTH RS 2 LACS ABSOLUTELY FREE**********100% LOAN OFFER AVAILABLE**********';
  });

  const [offers, setOffers] = useState(() => {
    try {
      const saved = localStorage.getItem('cp_offers_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 1, tag: 'FESTIVE PROMO', color: 'bg-warning text-dark', title: 'White Goods Worth ₹2 Lacs Free', desc: 'Applicable on every 2 & 3 BHK flat booking confirmation this festive month.' },
      { id: 2, tag: 'FINANCE OFFER', color: 'bg-success text-white', title: '100% Home Loan Assistance with 0% Processing Fee', desc: 'Pre-approved loan desk tied up with HDFC Bank, SBI, and ICICI Bank in Pune.' }
    ];
  });

  const [saved, setSaved] = useState(false);
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [newOffer, setNewOffer] = useState({ tag: 'SPECIAL PROMO', title: '', desc: '' });

  const handleSaveMarquee = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('cp_marquee_text', marqueeText);
    } catch (err) {
      console.error(err);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAddOffer = (e) => {
    e.preventDefault();
    if (!newOffer.title) return;
    const item = { id: Date.now(), tag: newOffer.tag, color: 'bg-primary text-white', title: newOffer.title, desc: newOffer.desc };
    const updated = [...offers, item];
    setOffers(updated);
    try {
      localStorage.setItem('cp_offers_list', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    setShowAddOfferModal(false);
    setNewOffer({ tag: 'SPECIAL PROMO', title: '', desc: '' });
  };

  const handleDeleteOffer = (id) => {
    const updated = offers.filter(o => o.id !== id);
    setOffers(updated);
    try {
      localStorage.setItem('cp_offers_list', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>Website Offers &amp; Ticker</h4>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Others &gt; Website Offer &gt; Marquee Announcement</span>
        </div>
        <button 
          onClick={() => setShowAddOfferModal(true)} 
          className="btn btn-sm" 
          style={{ backgroundColor: '#00b894', color: '#fff', fontWeight: '600' }}
        >
          <i className="ri-add-line me-1"></i> + Add Promo Card
        </button>
      </div>

      {saved && (
        <div className="alert alert-success py-2 mb-3 small fw-bold">
          ✓ Marquee text updated and saved successfully!
        </div>
      )}

      {/* Top Header Marquee Editor */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '8px' }}>
        <div className="card-body p-3">
          <h6 className="fw-bold mb-2 text-dark">Top Header Live Marquee Ticker:</h6>
          <div className="p-3 rounded mb-3" style={{ backgroundColor: '#fdf2f8', border: '1px solid #f472b6', color: '#9d174d', fontWeight: '600', fontSize: '13px' }}>
            <marquee>{marqueeText}</marquee>
          </div>
          <form onSubmit={handleSaveMarquee}>
            <div className="mb-3">
              <label className="form-label small fw-bold mb-1">Edit Marquee Text</label>
              <textarea rows="3" className="form-control" value={marqueeText} onChange={e => setMarqueeText(e.target.value)}></textarea>
            </div>
            <button type="submit" className="btn btn-sm btn-primary fw-bold">Save Marquee Ticker</button>
          </form>
        </div>
      </div>

      {/* Offer Cards */}
      <div className="row g-3">
        {offers.map(o => (
          <div className="col-md-6" key={o.id}>
            <div className="card border-0 shadow-sm p-3 bg-white h-100" style={{ borderRadius: '8px' }}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className={`badge ${o.color}`}>{o.tag}</span>
                <button onClick={() => handleDeleteOffer(o.id)} className="btn btn-sm btn-link text-danger p-0 text-decoration-none">
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
              <h6 className="fw-bold text-dark mb-1">{o.title}</h6>
              <p className="text-muted small mb-0">{o.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Offer Modal */}
      {showAddOfferModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '100%', maxWidth: '450px', padding: '24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="modal-title fw-bold text-dark m-0">+ Add Promo Offer</h5>
              <button onClick={() => setShowAddOfferModal(false)} className="btn-close"></button>
            </div>
            <form onSubmit={handleAddOffer}>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Offer Tag</label>
                <input type="text" className="form-control form-control-sm" placeholder="e.g. DIWALI SPECIAL" value={newOffer.tag} onChange={e => setNewOffer({...newOffer, tag: e.target.value})} />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Headline Title*</label>
                <input type="text" required className="form-control form-control-sm" placeholder="e.g. Gold Coin On Spot Booking" value={newOffer.title} onChange={e => setNewOffer({...newOffer, title: e.target.value})} />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold mb-1">Offer Description</label>
                <textarea rows="2" className="form-control form-control-sm" placeholder="Details of offer..." value={newOffer.desc} onChange={e => setNewOffer({...newOffer, desc: e.target.value})}></textarea>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setShowAddOfferModal(false)} className="btn btn-sm btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-sm btn-success" style={{ backgroundColor: '#00b894', borderColor: '#00b894' }}>Save Offer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

/**
 * ════════════════════════════════════════════════════════════
 * 13. CLIENT REVIEWS & TESTIMONIALS
 * ════════════════════════════════════════════════════════════
 */
export function DashboardReviews() {
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('cp_reviews_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 1, name: 'Rahul Sharma', rating: 5, date: 'Oct 2, 2026', prop: 'Lodha Kharadi 3BHK', text: 'Great experience buying flat through Sai Reality with 0% brokerage! Fast paperwork and transparent deals.' },
      { id: 2, name: 'Priya Patel', rating: 5, date: 'Sep 28, 2026', prop: 'Ganga Newtown Dhanori', text: 'Free site visit arranged instantly. Team helped get fast home loan sanction without any processing fee.' },
      { id: 3, name: 'Amit Deshmukh', rating: 5, date: 'Sep 25, 2026', prop: 'Bramha F-Residences Wagholi', text: 'Genuine property paperwork and direct developer discounts. Highly recommended for Pune buyers.' }
    ];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [newRev, setNewRev] = useState({ name: '', prop: '', text: '', rating: 5 });

  const saveToStorage = (updated) => {
    setReviews(updated);
    try {
      localStorage.setItem('cp_reviews_list', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newRev.name || !newRev.text) return;
    const item = {
      id: Date.now(),
      name: newRev.name,
      prop: newRev.prop || 'Pune Property',
      text: newRev.text,
      rating: newRev.rating,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    const updated = [item, ...reviews];
    saveToStorage(updated);
    setShowAddModal(false);
    setNewRev({ name: '', prop: '', text: '', rating: 5 });
  };

  const handleUpdateReview = (e) => {
    e.preventDefault();
    if (!editingReview) return;
    const updated = reviews.map(r => r.id === editingReview.id ? editingReview : r);
    saveToStorage(updated);
    setEditingReview(null);
  };

  const handleDeleteReview = (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      const updated = reviews.filter(item => item.id !== id);
      saveToStorage(updated);
    }
  };

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>Client Reviews &amp; Testimonials ({reviews.length})</h4>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Others &gt; Reviews &gt; Google Rating 4.9/5.0</span>
        </div>
        <button onClick={() => window.location.reload()} className="btn btn-sm btn-light border me-2">
          <i className="ri-refresh-line me-1"></i> Refresh
        </button>
        <button 
          onClick={() => setShowAddModal(true)} 
          className="btn btn-sm" 
          style={{ backgroundColor: '#00b894', color: '#fff', fontWeight: '600' }}
        >
          <i className="ri-add-line me-1"></i> Add New Review
        </button>
      </div>

      <div className="row g-3">
        {reviews.map((r, i) => (
          <div className="col-md-4" key={r.id}>
            <div className="card border-0 shadow-sm p-3 bg-white h-100" style={{ borderRadius: '8px' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center gap-2">
                  <img 
                    src={`/static/dashboard/assets/images/users/avatar-${(i % 3) + 1}.jpg`} 
                    alt="" 
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                    onError={(e) => { e.target.src = '/static/dashboard/assets/images/users/user-dummy-img.jpg'; }}
                  />
                  <div className="fw-bold text-dark">{r.name}</div>
                </div>
                <div className="text-warning small">{'★'.repeat(r.rating || 5)}</div>
              </div>
              <small className="text-primary fw-semibold mb-2 d-block">📍 {r.prop}</small>
              <p className="text-muted small mb-3">"{r.text}"</p>
              <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                <small className="text-muted">{r.date}</small>
                <div className="d-flex gap-2">
                  <button onClick={() => setEditingReview({ ...r })} className="btn btn-sm btn-link text-primary p-0 text-decoration-none">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteReview(r.id)} className="btn btn-sm btn-link text-danger p-0 text-decoration-none">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '100%', maxWidth: '450px', padding: '24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="modal-title fw-bold text-dark m-0">+ Add Client Review</h5>
              <button onClick={() => setShowAddModal(false)} className="btn-close"></button>
            </div>
            <form onSubmit={handleAddReview}>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Customer Full Name*</label>
                <input type="text" required className="form-control form-control-sm" placeholder="e.g. Vikas Sharma" value={newRev.name} onChange={e => setNewRev({...newRev, name: e.target.value})} />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Property Name</label>
                <input type="text" className="form-control form-control-sm" placeholder="e.g. Lodha Kharadi" value={newRev.prop} onChange={e => setNewRev({...newRev, prop: e.target.value})} />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Rating (1 to 5 Stars)</label>
                <select className="form-select form-select-sm" value={newRev.rating} onChange={e => setNewRev({...newRev, rating: parseInt(e.target.value)})}>
                  <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                  <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                  <option value="3">⭐⭐⭐ 3 Stars</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold mb-1">Review Content*</label>
                <textarea rows="3" required className="form-control form-control-sm" placeholder="Enter review..." value={newRev.text} onChange={e => setNewRev({...newRev, text: e.target.value})}></textarea>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-sm btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-sm btn-success" style={{ backgroundColor: '#00b894', borderColor: '#00b894' }}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '100%', maxWidth: '450px', padding: '24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="modal-title fw-bold text-dark m-0">✏️ Edit Client Review</h5>
              <button onClick={() => setEditingReview(null)} className="btn-close"></button>
            </div>
            <form onSubmit={handleUpdateReview}>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Customer Full Name*</label>
                <input type="text" required className="form-control form-control-sm" value={editingReview.name} onChange={e => setEditingReview({...editingReview, name: e.target.value})} />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Property Name</label>
                <input type="text" className="form-control form-control-sm" value={editingReview.prop} onChange={e => setEditingReview({...editingReview, prop: e.target.value})} />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Rating</label>
                <select className="form-select form-select-sm" value={editingReview.rating} onChange={e => setEditingReview({...editingReview, rating: parseInt(e.target.value)})}>
                  <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                  <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                  <option value="3">⭐⭐⭐ 3 Stars</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold mb-1">Review Content*</label>
                <textarea rows="3" required className="form-control form-control-sm" value={editingReview.text} onChange={e => setEditingReview({...editingReview, text: e.target.value})}></textarea>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setEditingReview(null)} className="btn btn-sm btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-sm btn-success" style={{ backgroundColor: '#00b894', borderColor: '#00b894' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

/**
 * ════════════════════════════════════════════════════════════
 * 14. CONTACT DETAILS SETTINGS (Matching live site form)
 * ════════════════════════════════════════════════════════════
 */
export function DashboardContact() {
  const [saved, setSaved] = useState(false);
  const [contactData, setContactData] = useState(() => {
    try {
      const stored = localStorage.getItem('cp_contact_info');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return {
      whatsapp: '+91 9222445513',
      phone: '+91 9320072003',
      email: 'support@certifiedproperties.in',
      siteEmail: 'raj@sairealty.in',
      address: 'Lohegaon - Dhanori Road, Lohegaon, Pune',
      cityPincode: 'Pune Maharashtra 411047',
      mapsUrl: 'https://goo.gl/maps/6SbWMzuEHDD4YmdV7',
      copyrightYear: '2026',
      companyName: 'Certified Properties / Sai Reality',
      reservedBy: 'Phenoware Pvt Ltd'
    };
  });

  const handleSaveContact = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('cp_contact_info', JSON.stringify(contactData));
    } catch (err) {
      console.error(err);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>User Details &amp; Contact Settings</h4>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Others &gt; Contact Details</span>
        </div>
      </div>

      {saved && (
        <div className="alert alert-success py-2 mb-3 small fw-bold">
          ✓ Contact settings successfully updated and saved!
        </div>
      )}

      <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: '8px', maxWidth: '850px' }}>
        <form onSubmit={handleSaveContact}>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label small fw-bold mb-1">Whatsapp Number*</label>
              <input type="text" required className="form-control form-control-sm" value={contactData.whatsapp} onChange={e => setContactData({...contactData, whatsapp: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold mb-1">Phone Number*</label>
              <input type="text" required className="form-control form-control-sm" value={contactData.phone} onChange={e => setContactData({...contactData, phone: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold mb-1">Email Address*</label>
              <input type="email" required className="form-control form-control-sm" value={contactData.email} onChange={e => setContactData({...contactData, email: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold mb-1">Your Site Email*</label>
              <input type="email" required className="form-control form-control-sm" value={contactData.siteEmail} onChange={e => setContactData({...contactData, siteEmail: e.target.value})} />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-8">
              <label className="form-label small fw-bold mb-1">Office Address*</label>
              <input type="text" required className="form-control form-control-sm" value={contactData.address} onChange={e => setContactData({...contactData, address: e.target.value})} />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold mb-1">City &amp; Pincode*</label>
              <input type="text" required className="form-control form-control-sm" value={contactData.cityPincode} onChange={e => setContactData({...contactData, cityPincode: e.target.value})} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold mb-1">Google Maps Location URL*</label>
            <input type="text" required className="form-control form-control-sm" value={contactData.mapsUrl} onChange={e => setContactData({...contactData, mapsUrl: e.target.value})} />
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="form-label small fw-bold mb-1">Copy Right Year*</label>
              <input type="text" required className="form-control form-control-sm" value={contactData.copyrightYear} onChange={e => setContactData({...contactData, copyrightYear: e.target.value})} />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold mb-1">Company Name*</label>
              <input type="text" required className="form-control form-control-sm" value={contactData.companyName} onChange={e => setContactData({...contactData, companyName: e.target.value})} />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold mb-1">Reserved By*</label>
              <input type="text" required className="form-control form-control-sm" value={contactData.reservedBy} onChange={e => setContactData({...contactData, reservedBy: e.target.value})} />
            </div>
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-sm btn-primary fw-bold px-4">
              Updates
            </button>
            <button type="button" onClick={() => setContactData({ whatsapp: '+91 9222445513', phone: '+91 9320072003', email: 'support@certifiedproperties.in', siteEmail: 'raj@sairealty.in', address: 'Lohegaon - Dhanori Road, Lohegaon, Pune', cityPincode: 'Pune Maharashtra 411047', mapsUrl: 'https://goo.gl/maps/6SbWMzuEHDD4YmdV7', copyrightYear: '2026', companyName: 'Certified Properties', reservedBy: 'Phenoware Pvt Ltd' })} className="btn btn-sm btn-light border px-3">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

/**
 * ════════════════════════════════════════════════════════════
 * 15. USERS SEQUENCE (Round-Robin Allocation)
 * ════════════════════════════════════════════════════════════
 */
export function DashboardAnalytics() {
  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>Google Analytics &amp; Web Traffic</h4>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Others &gt; Google Analytics (G-NN6GLPYL3R)</span>
        </div>
      </div>

      <div className="card border-0 shadow-sm p-4 bg-white mb-3" style={{ borderRadius: '8px' }}>
        <h6 className="fw-bold mb-2 text-dark">Installed Google Tag Manager ID:</h6>
        <div className="p-2 border rounded bg-light font-monospace text-primary fw-bold mb-3" style={{ fontSize: '13px', width: 'fit-content' }}>
          G-NN6GLPYL3R
        </div>

        <div className="row g-3 text-center">
          <div className="col-md-4">
            <div className="p-3 border rounded bg-light">
              <small className="text-muted fw-bold d-block text-uppercase" style={{ fontSize: '11px' }}>MONTHLY UNIQUE VISITORS</small>
              <h3 className="fw-bold my-1 text-dark">24,850</h3>
              <small className="text-success fw-bold">&uarr; 14.2% Growth</small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 border rounded bg-light">
              <small className="text-muted fw-bold d-block text-uppercase" style={{ fontSize: '11px' }}>INQUIRY CONVERSION RATE</small>
              <h3 className="fw-bold my-1 text-success">4.82%</h3>
              <small className="text-muted">Direct WhatsApp &amp; Forms</small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 border rounded bg-light">
              <small className="text-muted fw-bold d-block text-uppercase" style={{ fontSize: '11px' }}>TOP AUDIENCE REGION</small>
              <h3 className="fw-bold my-1 text-primary">Pune &amp; Mumbai</h3>
              <small className="text-muted">Maharashtra IT Corridors</small>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/**
 * ════════════════════════════════════════════════════════════
 * 17. MY ACCOUNT (Matching live site overview, documents)
 * ════════════════════════════════════════════════════════════
 */
// Others > Google Analytics: the tracking code the public website uses
export function DashboardGCode() {
  const [code, setCode] = useState(() => localStorage.getItem('cp_gcode') || '');
  const [saved, setSaved] = useState(false);
  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0 fw-bold text-uppercase" style={{ fontSize: '15px', color: '#495057' }}>Google Analytics Code</h4>
        <span style={{ fontSize: '12px', color: '#64748b' }}>Others &gt; Google Analytics</span>
      </div>
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <form onSubmit={(e) => { e.preventDefault(); localStorage.setItem('cp_gcode', code); setSaved(true); setTimeout(() => setSaved(false), 2500); }}>
            <div className="col-lg-6 mb-4 mt-2">
              <label className="form-label">Google Analytics Code <span className="text-danger">*</span></label>
              <textarea className="form-control" rows="7" placeholder="Code" required value={code} onChange={(e) => setCode(e.target.value)}></textarea>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <button className="btn btn-primary" type="submit"><i className="ri-save-line me-1"></i> Updates</button>
              {saved && <span className="text-success" style={{ fontSize: '13px' }}>Saved</span>}
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export function DashboardHelp() {
  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>Help &amp; Support Desk</h4>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Support &gt; Help</span>
        </div>
      </div>

      <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: '8px' }}>
        <h6 className="fw-bold text-dark mb-2">Direct Technical Assistance:</h6>
        <p className="text-muted small mb-3">For CRM configuration queries, WhatsApp automation setup, or bug reports, contact our engineers:</p>
        <div className="d-flex gap-3 flex-wrap">
          <div className="p-3 border rounded bg-light">
            <small className="text-muted d-block fw-bold">Technical Helpline</small>
            <strong className="text-primary">+91 9222445513</strong>
          </div>
          <div className="p-3 border rounded bg-light">
            <small className="text-muted d-block fw-bold">Technical Email</small>
            <strong className="text-primary">support@certifiedproperties.in</strong>
          </div>
          <div className="p-3 border rounded bg-light">
            <small className="text-muted d-block fw-bold">Developer Support</small>
            <strong className="text-success">Phenoware Pvt. Ltd.</strong>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
