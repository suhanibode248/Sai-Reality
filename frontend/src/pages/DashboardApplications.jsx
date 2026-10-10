import React, { useState } from 'react';
import useCrmCollection from '../hooks/useCrmCollection';
import DashboardLayout from '../components/DashboardLayout';

const DashboardApplications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [applications, setApplications] = useCrmCollection('applications', [
    { id: '#APL00143', name: 'Govind Kumar', phone: '+91 9325451025', jobTitle: 'Opening for Sales & Marketing Executive, Telecalling Executive job', date: 'Sept. 30, 2026' },
    { id: '#APL00142', name: 'Kaif Shaikh', phone: '+91 7264886608', jobTitle: 'Opening for Sales & Marketing Executive, Telecalling Executive job', date: 'Sept. 27, 2026' },
    { id: '#APL00141', name: 'Deepak Kumar', phone: '+91 8766562627', jobTitle: 'Opening for Sales & Marketing Executive, Telecalling Executive job', date: 'Sept. 17, 2026' },
    { id: '#APL00140', name: 'Vishwajit', phone: '+91 8766916745', jobTitle: 'Opening for Sales & Marketing Executive, Telecalling Executive job', date: 'Sept. 3, 2026' },
    { id: '#APL00139', name: 'RATHOD ARVIND', phone: '+91 9108508885', jobTitle: 'Opening for Sales & Marketing Executive, Telecalling Executive job', date: 'Sept. 2, 2026' },
    { id: '#APL00138', name: 'Dnyaneshwari Khandve', phone: '+91 8180002247', jobTitle: 'Opening for Sales & Marketing Executive, Telecalling Executive job', date: 'Aug. 19, 2026' },
    { id: '#APL00137', name: 'Aarti Dabhekar', phone: '+91 7796597031', jobTitle: 'Opening for Sales & Marketing Executive, Telecalling Executive job', date: 'Aug. 18, 2026' },
    { id: '#APL00136', name: 'Keshav panditarao sawant', phone: '+91 7410185304', jobTitle: 'Opening for Sales & Marketing Executive, Telecalling Executive job', date: 'Aug. 14, 2026' },
  ]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      setApplications(applications.filter(a => a.id !== id));
    }
  };

  const filtered = applications.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="container-fluid p-0">
        
        {/* Page Title */}
        <div className="row mb-3 pb-1">
          <div className="col-12">
            <div className="d-flex align-items-lg-center flex-lg-row flex-column justify-content-between">
              <h4 className="fs-16 mb-1 text-uppercase fw-semibold" style={{ color: '#495057' }}>JOB APPLICATIONS</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0" style={{ backgroundColor: 'transparent', padding: 0 }}>
                  <li className="breadcrumb-item"><a href="#!" style={{ color: '#495057', textDecoration: 'none' }}>Master</a></li>
                  <li className="breadcrumb-item active" style={{ color: '#74788d' }}>Jobs Applications</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="card shadow-sm border-0">
              <div className="card-header border-bottom bg-transparent pt-3 pb-3">
                <div className="row align-items-center">
                  <div className="col-sm-4">
                    <div className="search-box position-relative">
                      <input 
                        className="form-control search shadow-sm" 
                        placeholder="Search for..." 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '35px', borderRadius: '4px', border: '1px solid #ced4da' }}
                      />
                      <i className="ri-search-line search-icon position-absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#878a99' }}></i>
                    </div>
                  </div>
                  <div className="col-sm-auto ms-auto text-end">
                    <span className="fw-medium" style={{ color: '#0ab39c', fontSize: '13px' }}>Count: {filtered.length}</span>
                  </div>
                </div>
              </div>

              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table align-middle table-nowrap table-hover mb-0" style={{ borderCollapse: 'collapse' }}>
                    <thead className="table-light text-muted">
                      <tr style={{ height: '45px', borderBottom: '1px solid #e2e8f0' }}>
                        <th scope="col" style={{ fontSize: '12px', fontWeight: '600' }}>ID</th>
                        <th scope="col" style={{ fontSize: '12px', fontWeight: '600' }}>Name</th>
                        <th scope="col" style={{ fontSize: '12px', fontWeight: '600' }}>Phone</th>
                        <th scope="col" style={{ fontSize: '12px', fontWeight: '600' }}>Job Title</th>
                        <th scope="col" style={{ fontSize: '12px', fontWeight: '600' }}>Applications Date</th>
                        <th scope="col" style={{ fontSize: '12px', fontWeight: '600' }}>Resume</th>
                        <th scope="col" style={{ fontSize: '12px', fontWeight: '600' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(app => (
                        <tr key={app.id} style={{ height: '55px', borderBottom: '1px solid #f3f6f9' }}>
                          <td><span className="text-primary fw-medium" style={{ fontSize: '12px' }}>{app.id}</span></td>
                          <td><span className="text-dark" style={{ fontSize: '12px' }}>{app.name}</span></td>
                          <td><span className="text-muted" style={{ fontSize: '12px' }}>{app.phone}</span></td>
                          <td><span className="text-muted" style={{ fontSize: '12px' }}>{app.jobTitle}</span></td>
                          <td><span className="text-muted" style={{ fontSize: '12px' }}>{app.date}</span></td>
                          <td>
                            <a href="#!" onClick={(e) => {
                              e.preventDefault();
                              const text = `Resume\n\nName: ${app.name}\nPhone: ${app.phone}\nApplied for: ${app.jobTitle}\nDate: ${app.date}\n`;
                              const link = document.createElement('a');
                              link.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
                              link.download = `resume-${String(app.name).replace(/\s+/g, '-')}.txt`;
                              link.click();
                              URL.revokeObjectURL(link.href);
                            }} className="text-primary text-decoration-none" style={{ fontSize: '12px' }}>Download</a>
                          </td>
                          <td>
                            <a href="#!" className="text-danger" onClick={(e) => { e.preventDefault(); handleDelete(app.id); }}>
                              <i className="ri-delete-bin-fill fs-14"></i>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filtered.length === 0 && (
                    <div className="text-center py-5">
                      <p className="text-muted">No applications found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default DashboardApplications;
