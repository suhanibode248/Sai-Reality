import React, { useState } from 'react';
import useCrmCollection from '../hooks/useCrmCollection';
import DashboardLayout from '../components/DashboardLayout';

const DashboardJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobs, setJobs] = useCrmCollection('jobs', [
    {
      id: '1',
      title: 'We are hiring for: Telecalling | Digital Marketing | Sales Executive',
      category: 'Marketing and Sales',
      createdDate: 'Jan. 31, 2026',
      location: 'Lohgaon',
      openings: 11,
      isActive: true
    },
    {
      id: '2',
      title: 'Web Development Intern',
      category: 'Software Engineering frontend backend Development',
      createdDate: 'April 23, 2024',
      location: 'Lohgaon',
      openings: 2,
      isActive: true
    },
    {
      id: '3',
      title: 'Opening for Sales & Marketing Executive, Telecalling Executive job',
      category: 'Marketing and Sales',
      createdDate: 'Oct. 18, 2023',
      location: 'Lohgaon',
      openings: 8,
      isActive: false
    }
  ]);

  const [newJob, setNewJob] = useState({
    title: '', category: '', location: '', openings: ''
  });

  const handleRefresh = (e) => {
    e.preventDefault();
    window.location.reload();
  };

  const toggleJobActive = (id) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, isActive: !j.isActive } : j));
  };

  const handleAddJob = (e) => {
    e.preventDefault();
    setJobs([{
      id: Math.random().toString(),
      title: newJob.title,
      category: newJob.category,
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      location: newJob.location,
      openings: parseInt(newJob.openings) || 1,
      isActive: true
    }, ...jobs]);
    setShowAddModal(false);
    setNewJob({ title: '', category: '', location: '', openings: '' });
  };

  const handleEditJob = (e) => {
    e.preventDefault();
    setJobs(jobs.map(j => j.id === editingJob.id ? editingJob : j));
    setEditingJob(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      setJobs(jobs.filter(j => j.id !== id));
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="container-fluid p-0">
        
        {/* Page Title */}
        <div className="row mb-3 pb-1">
          <div className="col-12">
            <div className="d-flex align-items-lg-center flex-lg-row flex-column justify-content-between">
              <h4 className="fs-16 mb-1 text-uppercase fw-semibold" style={{ color: '#495057' }}>JOBS</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0" style={{ backgroundColor: 'transparent', padding: 0 }}>
                  <li className="breadcrumb-item"><a href="#!" style={{ color: '#495057', textDecoration: 'none' }}>Account</a></li>
                  <li className="breadcrumb-item active" style={{ color: '#74788d' }}>Jobs & Applications</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <div className="row g-2 align-items-center">
              <div className="col-sm-6 col-md-4">
                <div className="search-box position-relative">
                  <input 
                    className="form-control shadow-sm" 
                    placeholder="Search for name, tasks, projects or something..." 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '35px', borderRadius: '4px', border: '1px solid #ced4da' }}
                  />
                  <i className="ri-search-line search-icon position-absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#878a99' }}></i>
                </div>
              </div>
              <div className="col-sm-auto ms-auto">
                <div className="list-grid-nav hstack gap-2 d-flex flex-wrap">
                  <button onClick={handleRefresh} className="btn btn-light add-btn shadow-sm" style={{ backgroundColor: '#f3f6f9', border: '1px solid #e2e8f0', color: '#495057', fontSize: '13px', padding: '6px 12px' }}>
                    <i className="ri-restart-line me-1"></i> Refresh
                  </button>
                  <button onClick={() => setShowAddModal(true)} className="btn btn-success shadow-sm" style={{ backgroundColor: '#0ab39c', borderColor: '#0ab39c', fontSize: '13px', padding: '6px 12px' }}>
                    <i className="ri-add-fill me-1 align-bottom"></i> Add New Job
                  </button>
                  <a href="/dashboard/applications" className="btn btn-info add-btn shadow-sm" style={{ backgroundColor: '#299cdb', borderColor: '#299cdb', color: '#fff', textDecoration: 'none', fontSize: '13px', padding: '6px 12px' }}>
                    <i className="ri-file-list-3-line align-bottom me-1"></i> Applications
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="team-list list-view-filter row m-0">
              {filteredJobs.length === 0 ? (
                <div className="col-12 text-center py-5">
                  <i className="ri-briefcase-line text-muted" style={{ fontSize: '40px' }}></i>
                  <h5 className="mt-2 text-muted">No Jobs Found</h5>
                </div>
              ) : (
                filteredJobs.map(job => (
                  <div className="col-12 mb-2 px-0" key={job.id}>
                    <div className="card team-box shadow-sm border m-0" style={{ borderRadius: '4px', borderColor: '#e2e8f0' }}>
                      <div className="card-body py-3 px-4">
                        <div className="row align-items-center">
                          
                          {/* Title & Category */}
                          <div className="col-lg-4 col-md-5">
                            <h5 className="fs-14 mb-1 text-dark fw-medium">{job.title}</h5>
                            <p className="text-muted mb-0" style={{ fontSize: '11px', color: '#878a99' }}>{job.category}</p>
                          </div>
                          
                          {/* Date Created */}
                          <div className="col-lg-2 col-md-3 text-center border-end border-dashed" style={{ borderColor: '#e2e8f0' }}>
                            <h5 className="fs-13 mb-1 text-dark fw-medium">{job.createdDate}</h5>
                            <p className="text-muted mb-0" style={{ fontSize: '11px' }}>
                              <i className="ri-calendar-2-line align-bottom me-1"></i> Created Date
                            </p>
                          </div>
                          
                          {/* Location */}
                          <div className="col-lg-2 col-md-2 text-center border-end border-dashed" style={{ borderColor: '#e2e8f0' }}>
                            <h5 className="fs-13 mb-1 text-dark fw-medium">{job.location}</h5>
                            <p className="text-muted mb-0" style={{ fontSize: '11px' }}>
                              <i className="ri-map-pin-line align-bottom me-1"></i> Location
                            </p>
                          </div>

                          {/* Openings */}
                          <div className="col-lg-2 col-md-2 text-center border-end border-dashed" style={{ borderColor: '#e2e8f0' }}>
                            <h5 className="fs-13 mb-1 text-dark fw-medium">{job.openings}</h5>
                            <p className="text-muted mb-0" style={{ fontSize: '11px' }}>
                              <i className="ri-team-line align-bottom me-1"></i> Total Openings
                            </p>
                          </div>
                          
                          {/* Status & Actions */}
                          <div className="col-lg-2 col-md-12 d-flex align-items-center justify-content-between px-4 mt-3 mt-lg-0">
                            <div className="form-check form-switch m-0 p-0 d-flex align-items-center">
                              <input 
                                className="form-check-input m-0 me-2" 
                                type="checkbox" 
                                role="switch" 
                                checked={job.isActive} 
                                onChange={() => toggleJobActive(job.id)} 
                                style={{ width: '32px', height: '16px', cursor: 'pointer', backgroundColor: job.isActive ? '#405189' : '#e2e8f0', borderColor: job.isActive ? '#405189' : '#e2e8f0' }}
                              />
                              <span style={{ fontSize: '11px', fontWeight: '600', color: '#495057' }}>
                                {job.isActive ? 'ACTIVE' : 'INACTIVE'}
                              </span>
                            </div>
                            <div className="d-flex gap-2">
                               <a href="#!" className="text-danger" onClick={(e) => { e.preventDefault(); handleDelete(job.id); }}><i className="ri-delete-bin-fill fs-14"></i></a>
                               <a href="#!" className="text-primary" onClick={(e) => { e.preventDefault(); setEditingJob(job); }}><i className="ri-pencil-fill fs-14" style={{ color: '#405189' }}></i></a>
                            </div>
                          </div>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        
        {/* Edit Job Modal */}
        {editingJob && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: '#fff', width: '800px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
              
              <div className="modal-header p-3 bg-white border-bottom d-flex justify-content-between align-items-center">
                <h5 className="modal-title m-0 d-flex align-items-center fw-semibold text-dark" style={{ fontSize: '16px' }}>
                  <i className="ri-pencil-fill align-bottom me-2 text-dark"></i> Edit Job
                </h5>
                <button onClick={() => setEditingJob(null)} className="btn-close" style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#878a99' }}>&times;</button>
              </div>

              <div className="modal-body p-4 overflow-auto">
                <form onSubmit={handleEditJob}>
                  <div className="row g-3">
                    <div className="col-lg-12">
                      <label className="form-label text-muted" style={{ fontSize: '12px', fontWeight: '500' }}>Job Title <span className="text-danger">*</span></label>
                      <input className="form-control" type="text" required value={editingJob.title} onChange={(e) => setEditingJob({...editingJob, title: e.target.value})} />
                    </div>
                    <div className="col-lg-6">
                      <label className="form-label text-muted" style={{ fontSize: '12px', fontWeight: '500' }}>Category <span className="text-danger">*</span></label>
                      <input className="form-control" type="text" required value={editingJob.category} onChange={(e) => setEditingJob({...editingJob, category: e.target.value})} />
                    </div>
                    <div className="col-lg-6">
                      <label className="form-label text-muted" style={{ fontSize: '12px', fontWeight: '500' }}>Location <span className="text-danger">*</span></label>
                      <input className="form-control" type="text" required value={editingJob.location} onChange={(e) => setEditingJob({...editingJob, location: e.target.value})} />
                    </div>
                    <div className="col-lg-6">
                      <label className="form-label text-muted" style={{ fontSize: '12px', fontWeight: '500' }}>Total Openings <span className="text-danger">*</span></label>
                      <input className="form-control" type="number" required value={editingJob.openings} onChange={(e) => setEditingJob({...editingJob, openings: e.target.value})} />
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-top text-end bg-white" style={{ position: 'sticky', bottom: 0 }}>
                    <button type="button" onClick={() => setEditingJob(null)} className="btn btn-light me-2" style={{ backgroundColor: '#f3f6f9', color: '#495057', border: 'none' }}>Close</button>
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#0ab39c', borderColor: '#0ab39c' }}>Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}


        {/* Add Job Modal */}
        {showAddModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: '#fff', width: '800px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
              
              <div className="modal-header p-3 bg-white border-bottom d-flex justify-content-between align-items-center">
                <h5 className="modal-title m-0 d-flex align-items-center fw-semibold text-dark" style={{ fontSize: '16px' }}>
                  <i className="ri-briefcase-line align-bottom me-2 text-dark"></i> Add New Job
                </h5>
                <button onClick={() => setShowAddModal(false)} className="btn-close" style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#878a99' }}>&times;</button>
              </div>

              <div className="modal-body p-4 overflow-auto">
                <form onSubmit={handleAddJob}>
                  <div className="row g-3">
                    <div className="col-lg-12">
                      <label className="form-label text-muted" style={{ fontSize: '12px', fontWeight: '500' }}>Job Title <span className="text-danger">*</span></label>
                      <input className="form-control" type="text" placeholder="Enter job title" required value={newJob.title} onChange={(e) => setNewJob({...newJob, title: e.target.value})} />
                    </div>
                    <div className="col-lg-6">
                      <label className="form-label text-muted" style={{ fontSize: '12px', fontWeight: '500' }}>Category <span className="text-danger">*</span></label>
                      <input className="form-control" type="text" placeholder="Enter job category" required value={newJob.category} onChange={(e) => setNewJob({...newJob, category: e.target.value})} />
                    </div>
                    <div className="col-lg-6">
                      <label className="form-label text-muted" style={{ fontSize: '12px', fontWeight: '500' }}>Location <span className="text-danger">*</span></label>
                      <input className="form-control" type="text" placeholder="Job locations" required value={newJob.location} onChange={(e) => setNewJob({...newJob, location: e.target.value})} />
                    </div>
                    <div className="col-lg-6">
                      <label className="form-label text-muted" style={{ fontSize: '12px', fontWeight: '500' }}>Total Openings <span className="text-danger">*</span></label>
                      <input className="form-control" type="number" placeholder="Enter total openings" required value={newJob.openings} onChange={(e) => setNewJob({...newJob, openings: e.target.value})} />
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-top text-end bg-white" style={{ position: 'sticky', bottom: 0 }}>
                    <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-light me-2" style={{ backgroundColor: '#f3f6f9', color: '#495057', border: 'none' }}>Close</button>
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#0ab39c', borderColor: '#0ab39c' }}>Add Job</button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default DashboardJobs;
