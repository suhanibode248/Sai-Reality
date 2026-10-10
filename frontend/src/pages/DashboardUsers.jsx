import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCrmCollection from '../hooks/useCrmCollection';
import DashboardLayout from '../components/DashboardLayout';

const DashboardUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [users, setUsers] = useCrmCollection('users', [
    {
      id: '53',
      name: 'Sagar Mahadev Bachate',
      username: 'sagarabchate2004_53',
      role: 'Sales',
      createdDate: 'July 18, 2026',
      phone: '+91 8368263051',
      email: 'sagarabchate2004@gmail.com',
      isActive: false
    },
    {
      id: '52',
      name: 'Panchsheela Santosh Kamle',
      username: 'apachshilagade1991_52',
      role: 'Sales',
      createdDate: 'May 21, 2026',
      phone: '+91 9359733232',
      email: 'spachshilagade1991@gmail.com',
      isActive: false
    },
    {
      id: '51',
      name: 'Tejal Pavan badgujar',
      username: 'tejal2122badgujar_51',
      role: 'Sales',
      createdDate: 'May 11, 2026',
      phone: '+91 9270098850',
      email: 'tejal2122badgujar@gmail.com',
      isActive: false
    }
  ]);

  
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [newUser, setNewUser] = useState({
    name: '', phone: '', email: '', designation: '', role: 'Admin', address: '', city: '', password: '', group: '', salary: '', responsibilities: ''
  });

  
  const handleDownloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Name,Role,Phone,Email\n" 
      + users.map(u => `${u.name},${u.role},${u.phone},${u.email}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefresh = (e) => {
    e.preventDefault();
    window.location.reload();
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const id = Math.floor(Math.random() * 1000).toString();
    setUsers([{
      id,
      name: newUser.name,
      username: `${newUser.name.split(' ')[0].toLowerCase()}_${id}`,
      role: newUser.role,
      createdDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      phone: newUser.phone,
      email: newUser.email,
      isActive: true
    }, ...users]);
    setShowAddModal(false);
    setNewUser({ name: '', phone: '', email: '', designation: '', role: 'Admin', address: '', city: '', password: '', group: '', salary: '', responsibilities: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const toggleUserActive = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="container-fluid p-0">
        
        {/* Page Title */}
        <div className="row mb-3 pb-1">
          <div className="col-12">
            <div className="d-flex align-items-lg-center flex-lg-row flex-column justify-content-between">
              <h4 className="fs-16 mb-1 text-uppercase fw-semibold" style={{ color: '#495057' }}>Users & Roles</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0" style={{ backgroundColor: 'transparent', padding: 0 }}>
                  <li className="breadcrumb-item"><a href="#!" style={{ color: '#495057', textDecoration: 'none' }}>Account</a></li>
                  <li className="breadcrumb-item active" style={{ color: '#74788d' }}>Users & Roles</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <div className="row g-2 align-items-center">
              <div className="col-sm-4">
                <div className="search-box position-relative">
                  <input 
                    className="form-control" 
                    placeholder="Search for name, tasks, projects or something..." 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '35px', borderRadius: '4px' }}
                  />
                  <i className="ri-search-line search-icon position-absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#878a99' }}></i>
                </div>
              </div>
              <div className="col-sm-auto ms-auto">
                <div className="list-grid-nav hstack gap-2 d-flex flex-wrap">
                  <button onClick={handleRefresh} className="btn btn-light add-btn shadow-sm" style={{ backgroundColor: '#f3f6f9', border: '1px solid #e2e8f0', color: '#495057' }}>
                    <i className="ri-restart-line me-1"></i> Refresh
                  </button>
                  <button onClick={handleDownloadCSV} className="btn btn-warning add-btn shadow-sm" type="button" style={{ backgroundColor: '#f7b84b', borderColor: '#f7b84b', color: '#fff' }}>
                    <i className="ri-download-cloud-line align-bottom me-1"></i> Download CSV
                  </button>
                  <button onClick={() => setShowAddModal(true)} className="btn btn-success shadow-sm" style={{ backgroundColor: '#0ab39c', borderColor: '#0ab39c' }}>
                    <i className="ri-add-fill me-1 align-bottom"></i> Add Members
                  </button>
                  <a href="/dashboard/user-attendance" className="btn btn-info add-btn shadow-sm" style={{ backgroundColor: '#299cdb', borderColor: '#299cdb', color: '#fff', textDecoration: 'none' }}>
                    <i className="ri-file-list-line align-bottom me-1"></i> Attendance
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="team-list list-view-filter row m-0">
              {filteredUsers.length === 0 ? (
                <div className="col-12 text-center py-5">
                  <i className="ri-user-search-line text-muted" style={{ fontSize: '40px' }}></i>
                  <h5 className="mt-2 text-muted">No Users Found</h5>
                </div>
              ) : (
                filteredUsers.map(user => (
                  <div className="col-12 mb-3" key={user.id}>
                    <div className="card team-box shadow-sm border-0 m-0" style={{ borderRadius: '8px' }}>
                      <div className="card-body py-3 px-4">
                        <div className="row align-items-center">
                          
                          {/* Avatar & Name */}
                          <div className="col-lg-3 col-md-4 d-flex align-items-center">
                            <div className="avatar-sm flex-shrink-0 me-3">
                              <div className="avatar-title bg-light text-primary rounded-circle" style={{ width: '40px', height: '40px', fontSize: '18px' }}>
                                <i className="ri-user-line"></i>
                              </div>
                            </div>
                            <div className="team-content">
                              <h5 className="fs-14 mb-1 text-dark fw-semibold">{user.name}</h5>
                              <p className="text-muted mb-0" style={{ fontSize: '12px' }}>{user.username} | {user.role}</p>
                            </div>
                          </div>
                          
                          {/* Date Created */}
                          <div className="col-lg-2 col-md-3 text-center">
                            <h5 className="fs-13 mb-1 text-dark fw-medium">{user.createdDate}</h5>
                            <p className="text-muted mb-0" style={{ fontSize: '11px' }}>
                              <i className="ri-calendar-2-line align-bottom me-1"></i> Created Date
                            </p>
                          </div>
                          
                          {/* Phone */}
                          <div className="col-lg-2 col-md-2 text-center">
                            <h5 className="fs-13 mb-1 text-dark fw-medium">{user.phone}</h5>
                            <p className="text-muted mb-0" style={{ fontSize: '11px' }}>
                              <i className="ri-phone-line align-bottom me-1"></i> Phone
                            </p>
                          </div>
                          
                          {/* Email & Toggle */}
                          <div className="col-lg-3 col-md-3 d-flex align-items-center justify-content-center">
                            <div className="text-center me-3">
                              <h5 className="fs-13 mb-1 text-dark fw-medium">{user.email}</h5>
                              <p className="text-muted mb-0" style={{ fontSize: '11px' }}>
                                <i className="ri-mail-line align-bottom me-1"></i> Email
                              </p>
                            </div>
                            <div className="form-check form-switch m-0 p-0" style={{ display: 'flex', alignItems: 'center' }}>
                              <input 
                                className="form-check-input m-0" 
                                type="checkbox" 
                                role="switch" 
                                checked={user.isActive} 
                                onChange={() => toggleUserActive(user.id)} 
                                style={{ width: '35px', height: '18px', cursor: 'pointer' }}
                              />
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="col-lg-2 col-md-12 d-flex align-items-center justify-content-end gap-2 mt-3 mt-lg-0">
                            <button onClick={() => { setSelectedUser(user); setShowProfileModal(true); }} className="btn btn-sm btn-light d-flex align-items-center shadow-none" style={{ border: '1px solid #e2e8f0', color: '#495057', fontWeight: '500' }}>
                              <i className="ri-eye-line me-1 text-muted"></i> Quick View
                            </button>
                            <button onClick={() => handleDelete(user.id)} className="btn btn-sm btn-soft-danger px-2 py-1 shadow-none border-0" style={{ background: 'transparent' }}>
                              <i className="ri-delete-bin-fill text-danger fs-15"></i>
                            </button>
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

        
        {/* Quick View Profile Offcanvas */}
        {showProfileModal && selectedUser && (
          <>
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99998 }} onClick={() => setShowProfileModal(false)}></div>
            <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', backgroundColor: '#fff', zIndex: 99999, display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 15px rgba(0,0,0,0.1)' }}>
              
              <div className="profile-header position-relative" style={{ height: '120px', backgroundImage: 'url("https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80&w=1000")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' }}></div>
                <button onClick={() => setShowProfileModal(false)} style={{ position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', color: '#fff', fontSize: '24px', zIndex: 10 }}>&times;</button>
                <i className="ri-star-line" style={{ position: 'absolute', top: '15px', left: '15px', color: '#fff', fontSize: '18px', zIndex: 10 }}></i>
              </div>

              <div className="text-center" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
                <div className="avatar-lg mx-auto position-relative" style={{ width: '80px', height: '80px', borderRadius: '50%', padding: '4px', backgroundColor: '#fff' }}>
                  <div className="w-100 h-100 rounded-circle bg-light d-flex align-items-center justify-content-center text-primary" style={{ fontSize: '30px' }}>
                    <i className="ri-user-line"></i>
                  </div>
                  <div style={{ position: 'absolute', bottom: '0', right: '0', backgroundColor: '#f3f6f9', borderRadius: '50%', padding: '4px', border: '1px solid #e2e8f0' }}>
                    <i className="ri-image-line" style={{ fontSize: '10px', color: '#878a99' }}></i>
                  </div>
                </div>
                <h5 className="mt-3 mb-1 fw-semibold text-primary" style={{ fontSize: '16px' }}>{selectedUser.name}</h5>
                <p className="text-muted mb-2" style={{ fontSize: '12px' }}>Sales Executive | {selectedUser.role}</p>
                <div className="d-flex justify-content-center gap-2 mb-3">
                  <a href={`https://www.facebook.com/search/top?q=${encodeURIComponent(selectedUser.name)}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-primary" style={{ padding: '4px 10px', backgroundColor: '#e0e8ff', color: '#405189' }}><i className="ri-facebook-fill"></i></a>
                  <a href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(selectedUser.name)}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-info" style={{ padding: '4px 10px', backgroundColor: '#e0f4ff', color: '#299cdb' }}><i className="ri-linkedin-fill"></i></a>
                </div>
              </div>

              <div className="offcanvas-body px-4 py-0 flex-grow-1 overflow-auto">
                <div className="row text-center border-top border-bottom py-2" style={{ borderColor: '#e2e8f0', borderStyle: 'dashed' }}>
                  <div className="col-6 border-end" style={{ borderColor: '#e2e8f0', borderStyle: 'dashed' }}>
                    <h6 className="mb-1 fw-semibold text-dark" style={{ fontSize: '13px' }}>{selectedUser.createdDate}</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '11px' }}><i className="ri-calendar-event-line align-bottom"></i> Date Of Joining</p>
                  </div>
                  <div className="col-6">
                    <h6 className="mb-1 fw-semibold text-dark" style={{ fontSize: '13px' }}>None</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '11px' }}><i className="ri-calendar-event-line align-bottom"></i> Last Login</p>
                  </div>
                </div>

                <div className="mt-3">
                  <h6 className="text-muted text-uppercase fw-semibold mb-2" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>Responsibilities</h6>
                  <p className="text-dark" style={{ fontSize: '12px' }}>-</p>
                </div>

                <div className="mt-3">
                  <h6 className="text-muted text-uppercase fw-semibold mb-2" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>Location</h6>
                  <p className="text-dark" style={{ fontSize: '12px' }}>Flat no-202, Trimurti Heights, Oppsite Mahsoba Mandir, Karmabhumi Nagar, Lohegaon-411047 Pune</p>
                </div>

                <div className="row border-top py-3 mt-3" style={{ borderColor: '#e2e8f0', borderStyle: 'dashed' }}>
                  <div className="col-6 border-end" style={{ borderColor: '#e2e8f0', borderStyle: 'dashed' }}>
                    <h6 className="mb-1 fw-semibold text-dark" style={{ fontSize: '13px' }}>{selectedUser.phone}</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '11px' }}><i className="ri-phone-line align-bottom"></i> Phone</p>
                  </div>
                  <div className="col-6 ps-3">
                    <h6 className="mb-1 fw-semibold text-dark" style={{ fontSize: '13px', wordBreak: 'break-all' }}>{selectedUser.email}</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '11px' }}><i className="ri-mail-line align-bottom"></i> Email</p>
                  </div>
                </div>

                <div className="mt-3 border-top pt-3" style={{ borderColor: '#e2e8f0', borderStyle: 'dashed' }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="m-0 fw-semibold text-dark" style={{ fontSize: '14px' }}>File Manager</h6>
                    <label className="btn btn-sm btn-soft-info mb-0" style={{ backgroundColor: '#e0f4ff', color: '#299cdb', fontSize: '11px', cursor: 'pointer' }}>
                      <i className="ri-upload-cloud-2-line align-bottom me-1"></i> Upload Documents
                      <input type="file" multiple hidden onChange={(e) => {
                        const added = [...e.target.files].map(f => ({ name: f.name, date: new Date().toLocaleString('en-IN') }));
                        e.target.value = '';
                        const updated = { ...selectedUser, documents: [...(selectedUser.documents || []), ...added] };
                        setSelectedUser(updated);
                        setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
                      }} />
                    </label>
                  </div>

                  {(selectedUser.documents || []).length === 0 && (
                    <p className="text-muted mb-0" style={{ fontSize: '12px' }}>No documents uploaded yet.</p>
                  )}
                  {(selectedUser.documents || []).map((doc, i) => (
                    <div key={i} className="d-flex align-items-center p-2 mb-2" style={{ border: '1px solid white' }}>
                      <div className="avatar-sm flex-shrink-0">
                        <div className="avatar-title rounded bg-soft-danger text-danger" style={{ backgroundColor: '#ffeae8', color: '#f06548', padding: '10px', borderRadius: '4px' }}>
                          <i className="ri-file-pdf-line"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="mb-1 text-primary fw-medium" style={{ fontSize: '12px', color: '#405189' }}>{doc.name}</h6>
                        <p className="text-muted mb-0" style={{ fontSize: '11px' }}>{doc.date}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <a href="#!" className="text-danger" title="Delete document" onClick={(e) => {
                          e.preventDefault();
                          const updated = { ...selectedUser, documents: selectedUser.documents.filter((_, j) => j !== i) };
                          setSelectedUser(updated);
                          setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
                        }}><i className="ri-delete-bin-fill"></i></a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white border-top d-flex gap-2" style={{ position: 'sticky', bottom: 0 }}>
                <a href={`tel:${(selectedUser.phone || '').replace(/\s/g, '')}`} className="btn btn-light flex-grow-1" style={{ backgroundColor: '#f3f6f9', border: 'none', color: '#495057', fontSize: '13px', fontWeight: '500' }}>
                  <i className="ri-phone-line align-bottom me-1"></i> Make a Call
                </a>
                <button onClick={() => { setShowProfileModal(false); navigate(`/dashboard/users/${selectedUser.id}`); }} className="btn btn-primary flex-grow-1" style={{ backgroundColor: '#405189', borderColor: '#405189', fontSize: '13px', fontWeight: '500' }}>
                  <i className="ri-user-3-line align-bottom me-1"></i> View Profile
                </button>
              </div>

            </div>
          </>
        )}


        {/* Add Members Modal */}
        {showAddModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: '#fff', width: '800px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
              
              <div className="modal-header p-3 bg-white border-bottom d-flex justify-content-between align-items-center">
                <h5 className="modal-title m-0 d-flex align-items-center fw-semibold text-dark" style={{ fontSize: '16px' }}>
                  <i className="ri-user-add-line align-bottom me-2 text-dark"></i> Add New User
                </h5>
                <button onClick={() => setShowAddModal(false)} className="btn-close" style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#878a99' }}>&times;</button>
              </div>

              <div className="modal-body p-4 overflow-auto">
                <form onSubmit={handleAddUser}>
                  <div className="row g-3">
                    <div className="col-lg-12">
                      <label className="form-label text-muted" style={{ fontSize: '12px', fontWeight: '500' }}>Full Name <span className="text-danger">*</span></label>
                      <input className="form-control" type="text" placeholder="Enter full name" required value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
                    </div>
                    <div className="col-lg-6">
                      <label className="form-label text-muted" style={{ fontSize: '12px', fontWeight: '500' }}>Phone <span className="text-danger">*</span></label>
                      <input className="form-control" type="tel" maxLength="10" placeholder="Enter phone no" required value={newUser.phone} onChange={(e) => setNewUser({...newUser, phone: e.target.value})} />
                    </div>
                    <div className="col-lg-6">
                      <label className="form-label text-muted" style={{ fontSize: '12px', fontWeight: '500' }}>Email <span className="text-danger">*</span></label>
                      <input className="form-control" type="email" placeholder="Enter email" required value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
                    </div>
                    <div className="col-lg-6">
                      <label className="form-label text-muted" style={{ fontSize: '12px', fontWeight: '500' }}>Designation <span className="text-danger">*</span></label>
                      <input className="form-control" type="text" placeholder="Enter designation" required value={newUser.designation} onChange={(e) => setNewUser({...newUser, designation: e.target.value})} />
                    </div>
                    <div className="col-lg-6">
                      <label className="form-label text-muted" style={{ fontSize: '12px', fontWeight: '500' }}>Select Role <span className="text-danger">*</span></label>
                      <select className="form-select" required value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                        <option value="Admin">Admin</option>
                        <option value="Sales">Sales & Marketing</option>
                        <option value="Finance">Finance & Accounting</option>
                      </select>
                    </div>
                    <div className="col-lg-12">
                      <label className="form-label text-muted" style={{ fontSize: '12px', fontWeight: '500' }}>Address <span className="text-danger">*</span></label>
                      <input className="form-control" type="text" placeholder="Enter full name" required value={newUser.address} onChange={(e) => setNewUser({...newUser, address: e.target.value})} />
                    </div>
                    <div className="col-lg-6">
                      <label className="form-label text-muted" style={{ fontSize: '12px', fontWeight: '500' }}>City <span className="text-danger">*</span></label>
                      <input className="form-control" type="text" placeholder="City name" required value={newUser.city} onChange={(e) => setNewUser({...newUser, city: e.target.value})} />
                    </div>
                    <div className="col-lg-6">
                      <label className="form-label text-muted" style={{ fontSize: '12px', fontWeight: '500' }}>Password <span className="text-danger">*</span></label>
                      <input className="form-control" type="password" placeholder="Create password" required value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
                    </div>
                    <div className="col-lg-6">
                      <label className="form-label text-muted" style={{ fontSize: '12px', fontWeight: '500' }}>Select Group</label>
                      <select className="form-select" value={newUser.group} onChange={(e) => setNewUser({...newUser, group: e.target.value})}>
                        <option value="">---Select Group---</option>
                        <option value="Group A">Group A</option>
                        <option value="Group B">Group B</option>
                      </select>
                    </div>
                    <div className="col-lg-6">
                      <label className="form-label text-muted" style={{ fontSize: '12px', fontWeight: '500' }}>Salary</label>
                      <input className="form-control" type="text" placeholder="Salary" value={newUser.salary} onChange={(e) => setNewUser({...newUser, salary: e.target.value})} />
                    </div>
                    <div className="col-lg-12">
                      <label className="form-label text-muted" style={{ fontSize: '12px', fontWeight: '500' }}>Responsibilities (Optional)</label>
                      <textarea className="form-control" rows="4" placeholder="Describe the user's responsibilities" value={newUser.responsibilities} onChange={(e) => setNewUser({...newUser, responsibilities: e.target.value})}></textarea>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-top text-end bg-white" style={{ position: 'sticky', bottom: 0 }}>
                    <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-light me-2" style={{ backgroundColor: '#f3f6f9', color: '#495057', border: 'none' }}>Close</button>
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#0ab39c', borderColor: '#0ab39c' }}>Add User</button>
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

export default DashboardUsers;
