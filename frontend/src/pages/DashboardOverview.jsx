import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const DashboardOverview = () => {

  const leads = [
    { id: '#VL25000355', name: 'Alex Smith', phone: '+(256) 245451 441', location: 'New York, USA', date: '03 Oct, 2026', status: 'New Lead' },
    { id: '#VL25000356', name: 'Jansh Brown', phone: '+(256) 245451 442', location: 'London, UK', date: '04 Oct, 2026', status: 'In Followup' },
    { id: '#VL25000357', name: 'Ayaan Clerk', phone: '+(256) 245451 443', location: 'Pune, India', date: '05 Oct, 2026', status: 'Converted' },
  ];

  return (
    <DashboardLayout>
      <div className="container-fluid p-0">
        
        <div className="row">
          
          {/* Main Content Column */}
          <div className="col">
            <div className="h-100">
              
              {/* Header */}
              <div className="row mb-3 pb-1">
                <div className="col-12">
                  <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                    <div className="flex-grow-1">
                      <h4 className="fs-16 mb-1">Dashboard</h4>
                      <p className="text-muted mb-0">Welcome back, admin.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5 Metric Cards Row */}
              <div className="row">
                {/* 1 */}
                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card card-animate border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-4">
                        <div className="flex-grow-1 overflow-hidden">
                          <p className="text-uppercase fw-medium text-muted text-truncate mb-0">Total Visitor</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-end justify-content-between">
                        <div>
                          <h4 className="fs-22 fw-semibold ff-secondary mb-0">0</h4>
                        </div>
                        <div className="avatar-sm flex-shrink-0">
                          <span className="avatar-title" style={{ backgroundColor: 'rgba(247, 184, 75, 0.18)', borderRadius: '4px' }}>
                            <i className="ri-team-line" style={{ fontSize: '24px', color: '#f7b84b' }}></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2 */}
                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card card-animate border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-4">
                        <div className="flex-grow-1 overflow-hidden">
                          <p className="text-uppercase fw-medium text-muted text-truncate mb-0">Total Leads</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-end justify-content-between">
                        <div>
                          <h4 className="fs-22 fw-semibold ff-secondary mb-3">0</h4>
                          <a href="/dashboard/leads/all/" className="text-decoration-underline text-muted" style={{ fontSize: '13px' }}>View all leads</a>
                        </div>
                        <div className="avatar-sm flex-shrink-0">
                          <span className="avatar-title" style={{ backgroundColor: 'rgba(10, 179, 156, 0.18)', borderRadius: '4px' }}>
                            <i className="ri-file-list-3-line" style={{ fontSize: '24px', color: '#0ab39c' }}></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3 */}
                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card card-animate border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-4">
                        <div className="flex-grow-1 overflow-hidden">
                          <p className="text-uppercase fw-medium text-muted text-truncate mb-0">Total Properties</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-end justify-content-between">
                        <div>
                          <h4 className="fs-22 fw-semibold ff-secondary mb-3">0</h4>
                          <a href="/dashboard/properties" className="text-decoration-underline text-muted" style={{ fontSize: '13px' }}>View all Properties</a>
                        </div>
                        <div className="avatar-sm flex-shrink-0">
                          <span className="avatar-title" style={{ backgroundColor: 'rgba(41, 156, 219, 0.18)', borderRadius: '4px' }}>
                            <i className="ri-home-4-line" style={{ fontSize: '24px', color: '#299cdb' }}></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4 */}
                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card card-animate border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-4">
                        <div className="flex-grow-1 overflow-hidden">
                          <p className="text-uppercase fw-medium text-muted text-truncate mb-0">Total Projects</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-end justify-content-between">
                        <div>
                          <h4 className="fs-22 fw-semibold ff-secondary mb-3">0</h4>
                          <a href="/dashboard/projects" className="text-decoration-underline text-muted" style={{ fontSize: '13px' }}>See details</a>
                        </div>
                        <div className="avatar-sm flex-shrink-0">
                          <span className="avatar-title" style={{ backgroundColor: 'rgba(64, 81, 137, 0.18)', borderRadius: '4px' }}>
                            <i className="ri-building-line" style={{ fontSize: '24px', color: '#405189' }}></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5 */}
                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card card-animate border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-4">
                        <div className="flex-grow-1 overflow-hidden">
                          <p className="text-uppercase fw-medium text-muted text-truncate mb-0">Users / Staff</p>
                        </div>
                        <div className="flex-shrink-0">
                          <h5 className="text-success fs-14 mb-0">+0.00 %</h5>
                        </div>
                      </div>
                      <div className="d-flex align-items-end justify-content-between">
                        <div>
                          <h4 className="fs-22 fw-semibold ff-secondary mb-3">0</h4>
                          <a href="#!" className="text-decoration-underline text-muted" style={{ fontSize: '13px' }}>See all users</a>
                        </div>
                        <div className="avatar-sm flex-shrink-0">
                          <span className="avatar-title" style={{ backgroundColor: 'rgba(240, 101, 72, 0.18)', borderRadius: '4px' }}>
                            <i className="ri-user-line" style={{ fontSize: '24px', color: '#f06548' }}></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sales | Leads Funnel Chart */}
              <div className="row">
                <div className="col-xl-12 mb-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header border-0 align-items-center d-flex bg-transparent pb-0 pt-3">
                      <h4 className="card-title mb-0 flex-grow-1 fw-semibold text-muted" style={{ fontSize: '15px' }}>Sales | Leads Funnel</h4>
                      <div>
                        <button className="btn btn-soft-primary btn-sm me-2" type="button" style={{ backgroundColor: 'rgba(64, 81, 137, 0.1)', color: '#405189' }}>
                          1Y Data - 2026
                        </button>
                        <a className="btn btn-soft-secondary btn-sm" href="#!" style={{ backgroundColor: 'rgba(135, 138, 153, 0.1)', color: '#878a99' }}>
                          <i className="ri-filter-3-line align-bottom me-1"></i> Date Filter
                        </a>
                      </div>
                    </div>

                    <div className="card-header p-0 border-0 bg-light mt-3">
                      <div className="row g-0 text-center">
                        <div className="col-6 col-sm-3">
                          <div className="p-3 border border-dashed border-start-0">
                            <h5 className="mb-1"><span className="counter-value">0</span></h5>
                            <p className="text-muted mb-0" style={{ fontSize: '13px' }}>New Leads</p>
                          </div>
                        </div>
                        <div className="col-6 col-sm-3">
                          <div className="p-3 border border-dashed border-start-0">
                            <h5 className="mb-1"><span className="counter-value">0</span></h5>
                            <p className="text-muted mb-0" style={{ fontSize: '13px' }}>In Followup</p>
                          </div>
                        </div>
                        <div className="col-6 col-sm-3">
                          <div className="p-3 border border-dashed border-start-0">
                            <h5 className="mb-1"><span className="counter-value">0</span></h5>
                            <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Converted</p>
                          </div>
                        </div>
                        <div className="col-6 col-sm-3">
                          <div className="p-3 border border-dashed border-start-0 border-end-0">
                            <h5 className="mb-1 text-success"><span className="counter-value">0</span> %</h5>
                            <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Conversion Ratio</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card-body p-0 pb-2">
                      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#878a99' }}>
                        [ Chart Placeholder - ApexCharts ]
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Leads Table */}
              <div className="row">
                <div className="col-xl-12 mb-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header align-items-center d-flex bg-transparent border-bottom-0 pb-0 pt-3">
                      <h4 className="card-title mb-0 flex-grow-1 fw-semibold text-muted" style={{ fontSize: '15px' }}>Recent Leads</h4>
                      <div className="flex-shrink-0">
                        <a className="btn btn-soft-info btn-sm" href="#!" style={{ backgroundColor: 'rgba(41, 156, 219, 0.1)', color: '#299cdb' }}>
                          <i className="ri-file-list-3-line align-middle me-1"></i> View All Leads
                        </a>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive table-card">
                        <table className="table table-borderless table-centered align-middle table-nowrap mb-0" style={{ fontSize: '13px' }}>
                          <thead className="table-light text-muted">
                            <tr>
                              <th>Lead ID</th>
                              <th>Name</th>
                              <th>Phone</th>
                              <th>Location</th>
                              <th>Create Date</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {leads.map((l, i) => (
                              <tr key={i}>
                                <td><a href="#!" className="fw-medium text-primary text-decoration-none">{l.id}</a></td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0 me-2">
                                      <div className="avatar-xs rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: '25px', height: '25px', color: '#405189' }}>
                                        {l.name.charAt(0)}
                                      </div>
                                    </div>
                                    <div className="flex-grow-1">{l.name}</div>
                                  </div>
                                </td>
                                <td>{l.phone}</td>
                                <td>{l.location}</td>
                                <td>{l.date}</td>
                                <td>
                                  <span className={`badge ${l.status === 'New Lead' ? 'bg-success' : l.status === 'In Followup' ? 'bg-warning' : 'bg-primary'}`}>
                                    {l.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-auto layout-rightside-col d-none d-xl-block" style={{ width: '300px' }}>
            
            {/* Notification 1 */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-soft-info text-info rounded-circle fs-4" style={{ backgroundColor: 'rgba(41, 156, 219, 0.1)', color: '#299cdb' }}>
                      <i className="ri-notification-3-line"></i>
                    </span>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="mb-1" style={{ fontSize: '14px' }}>Unread notifications</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '12px' }}>You have 2 unread messages</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification 2 */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-soft-warning text-warning rounded-circle fs-4" style={{ backgroundColor: 'rgba(247, 184, 75, 0.1)', color: '#f7b84b' }}>
                      <i className="ri-mail-unread-line"></i>
                    </span>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="mb-1" style={{ fontSize: '14px' }}>Unread notifications</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '12px' }}>Weekly report is ready</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body text-center p-4">
                <img src="https://placehold.co/100x100?text=Empty" alt="" height="80" className="mb-3" style={{ borderRadius: '50%' }} />
                <h5 className="mb-1" style={{ fontSize: '15px' }}>Notifications not found !</h5>
                <p className="text-muted mb-0" style={{ fontSize: '13px' }}>You have caught up with all notifications.</p>
              </div>
            </div>

            {/* Invite */}
            <div className="card border-0 shadow-sm bg-primary text-white text-center">
              <div className="card-body p-4" style={{ backgroundColor: '#405189', borderRadius: '4px' }}>
                <h5 className="text-white mb-3" style={{ fontSize: '16px' }}>Invite New User</h5>
                <p className="text-white-50 mb-4" style={{ fontSize: '13px' }}>Add a new team member to your dashboard</p>
                <button type="button" className="btn btn-light w-100">Invite Now</button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardOverview;
