import React, { useState } from 'react';
import useCrmCollection from '../hooks/useCrmCollection';
import DashboardLayout from '../components/DashboardLayout';

const DashboardAttendance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  
  const [attendanceRecords, setAttendanceRecords] = useCrmCollection('attendance', [
    { id: '1', date: 'Jan. 2, 2024', empCount: 13, presentCount: 1, absentCount: 12 },
    { id: '2', date: 'Sept. 1, 2023', empCount: 8, presentCount: 1, absentCount: 7 },
    { id: '3', date: 'Aug. 31, 2023', empCount: 7, presentCount: 1, absentCount: 6 },
    { id: '4', date: 'Aug. 25, 2023', empCount: 7, presentCount: 3, absentCount: 4 },
    { id: '5', date: 'Aug. 21, 2023', empCount: 7, presentCount: 4, absentCount: 3 },
    { id: '6', date: 'Aug. 10, 2023', empCount: 2, presentCount: 2, absentCount: 0 }
  ]);

  const [employees] = useState([
    { id: '1', name: 'Inamdar Mohammadkhalil Rajmohammad' },
    { id: '2', name: 'Pooja Arvind Prasad Mourya' },
    { id: '3', name: 'Aarti Davallpa Dodmani' },
    { id: '4', name: 'Harsh Vicky Londhe' },
    { id: '5', name: 'Raj Bansode' },
    { id: '6', name: 'Adesh Narayan Garkal' },
    { id: '7', name: 'Vikrant Shannkar Endal' },
    { id: '8', name: 'test' },
    { id: '9', name: 'Test 2' },
    { id: '10', name: 'Prajakata Gaurav Rathod' },
    { id: '11', name: 'Ashish Raju Waghmare' },
    { id: '12', name: 'Amar Khanderaya Jamadar' },
    { id: '13', name: 'Sanket Gajanan Nayak' }
  ]);

  const [newAttendance, setNewAttendance] = useState({
    date: '2024-01-02',
    presentMap: { '1': true } // Inamdar is present in screenshot
  });

  const [reportConfig, setReportConfig] = useState({
    dateRange: 'Current Month',
    from: '', to: '',
    reportType: 'Attendance Report',
    selectedUsers: employees.map(e => e.id)
  });

  const handleRefresh = (e) => {
    e.preventDefault();
    window.location.reload();
  };

  const handleTogglePresent = (empId) => {
    setNewAttendance(prev => ({
      ...prev,
      presentMap: {
        ...prev.presentMap,
        [empId]: !prev.presentMap[empId]
      }
    }));
  };

  const toggleUserReport = (empId) => {
    setReportConfig(prev => {
      const isSelected = prev.selectedUsers.includes(empId);
      if (isSelected) {
        return { ...prev, selectedUsers: prev.selectedUsers.filter(id => id !== empId) };
      } else {
        return { ...prev, selectedUsers: [...prev.selectedUsers, empId] };
      }
    });
  };

  const handleSubmitAttendance = (e) => {
    e.preventDefault();
    const presentCount = Object.values(newAttendance.presentMap).filter(v => v).length;
    const absentCount = employees.length - presentCount;
    
    const newRecord = {
      id: Math.random().toString(),
      date: new Date(newAttendance.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      empCount: employees.length,
      presentCount,
      absentCount
    };
    
    setAttendanceRecords([newRecord, ...attendanceRecords]);
    setShowAddModal(false);
    setNewAttendance({ date: new Date().toISOString().split('T')[0], presentMap: {} });
  };

  const showAttendanceDetails = (record) => {
    const lines = [`Date: ${record.date}`, `Employees: ${record.empCount}`, `Present: ${record.presentCount}`, `Absent: ${record.absentCount}`];
    if (record.present?.length) lines.push('', 'Present: ' + record.present.join(', '));
    if (record.absent?.length) lines.push('Absent: ' + record.absent.join(', '));
    window.alert(lines.join('\n'));
  };

  const filteredRecords = attendanceRecords.filter(r => 
    r.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="container-fluid p-0">
        
        {/* Page Title */}
        <div className="row mb-3 pb-1">
          <div className="col-12">
            <div className="d-flex align-items-lg-center flex-lg-row flex-column justify-content-between">
              <h4 className="fs-16 mb-1 text-uppercase fw-semibold" style={{ color: '#495057' }}>TRANSACTIONS</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0" style={{ backgroundColor: 'transparent', padding: 0 }}>
                  <li className="breadcrumb-item"><a href="#!" style={{ color: '#495057', textDecoration: 'none' }}>Finance & Account</a></li>
                  <li className="breadcrumb-item active" style={{ color: '#74788d' }}>Transaction</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="card shadow-sm border-0">
              <div className="card-header border-0 bg-transparent pt-4 pb-3">
                <div className="row g-4 align-items-center">
                  <div className="col-sm-3">
                    <div className="search-box position-relative">
                      <input 
                        className="form-control search shadow-sm" 
                        placeholder="Search for..." 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '35px', borderRadius: '4px' }}
                      />
                      <i className="ri-search-line search-icon position-absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#878a99' }}></i>
                    </div>
                  </div>
                  <div className="col-sm-auto ms-auto">
                    <div className="hstack gap-2 d-flex flex-wrap">
                      <button onClick={handleRefresh} className="btn btn-light add-btn shadow-sm" style={{ backgroundColor: '#f3f6f9', color: '#495057', border: '1px solid #e2e8f0' }}>
                        <i className="ri-restart-line me-1"></i> Refresh
                      </button>
                      <button onClick={() => setShowAddModal(true)} className="btn btn-success add-btn shadow-sm" style={{ backgroundColor: '#0ab39c', borderColor: '#0ab39c' }}>
                        <i className="ri-add-line align-bottom me-1"></i> Add Attendance
                      </button>
                      <button onClick={() => setShowReportsModal(true)} className="btn btn-info shadow-sm" type="button" style={{ backgroundColor: '#299cdb', borderColor: '#299cdb' }}>
                        <i className="ri-filter-3-line align-bottom me-1"></i> Reports
                      </button>
                      <a href="/dashboard/users" className="btn btn-primary add-btn shadow-sm" style={{ backgroundColor: '#405189', borderColor: '#405189', color: '#fff', textDecoration: 'none' }}>
                        <i className="ri-group-line align-bottom me-1"></i> Users Manager
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body pt-0">
                <div className="table-responsive table-card">
                  <table className="table align-middle table-nowrap table-hover" id="customerTable">
                    <thead className="table-light text-muted">
                      <tr style={{ height: '50px' }}>
                        <th scope="col" style={{ width: '25%' }}><i className="ri-calendar-2-line align-bottom me-1"></i> Date</th>
                        <th className="sort" style={{ width: '20%' }}><i className="ri-contacts-book-2-line align-bottom me-1"></i> Emp Count</th>
                        <th className="sort" style={{ width: '20%' }}><i className="ri-group-line align-bottom me-1"></i> Present Count</th>
                        <th className="sort" style={{ width: '20%' }}><i className="ri-group-line align-bottom me-1"></i> Absent Count</th>
                        <th className="sort" style={{ width: '15%' }}>View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map(record => (
                        <tr key={record.id} style={{ height: '60px' }}>
                          <td>
                            <a href="#!" onClick={(e) => { e.preventDefault(); showAttendanceDetails(record); }} className="fw-medium text-dark text-decoration-none" style={{ fontSize: '13px' }}>
                              {record.date}
                            </a>
                          </td>
                          <td>
                            <span className="text-dark fw-medium" style={{ fontSize: '13px' }}>{record.empCount}</span>
                          </td>
                          <td>
                            <span className="badge" style={{ backgroundColor: '#e8f7f4', color: '#0ab39c', padding: '6px 15px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                              {record.presentCount}
                            </span>
                          </td>
                          <td>
                            <span className="badge" style={{ backgroundColor: '#fde8e4', color: '#f06548', padding: '6px 15px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                              {record.absentCount}
                            </span>
                          </td>
                          <td>
                            <a href="#!" onClick={(e) => { e.preventDefault(); showAttendanceDetails(record); }} className="text-muted" title="View">
                              <i className="ri-eye-line fs-18"></i>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <div className="pagination-wrap hstack gap-2">
                    <label className="mt-2 text-muted me-2" style={{ fontSize: '12px' }}>Available leads 6</label>
                    <a className="page-item pagination-prev disabled text-muted text-decoration-none" href="#!" style={{ backgroundColor: '#f3f6f9', padding: '5px 12px', borderRadius: '4px', fontSize: '13px' }}>Previous</a>
                    <ul className="pagination listjs-pagination mb-0">
                      <li className="active"><a className="page" href="#!" style={{ backgroundColor: '#405189', color: 'white', padding: '5px 12px', borderRadius: '4px', textDecoration: 'none', fontSize: '13px' }}>1</a></li>
                    </ul>
                    <a className="page-item pagination-next disabled text-muted text-decoration-none" href="#!" style={{ backgroundColor: '#f3f6f9', padding: '5px 12px', borderRadius: '4px', fontSize: '13px' }}>Next</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Attendance Offcanvas */}
        {showAddModal && (
          <>
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99998 }} onClick={() => setShowAddModal(false)}></div>
            <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', backgroundColor: '#fff', zIndex: 99999, display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 15px rgba(0,0,0,0.1)' }}>
              
              <div className="offcanvas-header p-3 border-bottom d-flex justify-content-between align-items-center">
                <h5 className="m-0 d-flex align-items-center fw-semibold" style={{ fontSize: '15px', color: '#495057' }}>
                  <i className="ri-file-text-line fs-18 me-2 text-primary"></i> Attendance Records
                </h5>
                <button onClick={() => setShowAddModal(false)} className="btn-close" style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#878a99' }}>&times;</button>
              </div>

              <div className="offcanvas-body p-4 flex-grow-1 overflow-auto">
                <form onSubmit={handleSubmitAttendance}>
                  <div className="mb-4">
                    <label className="form-label fw-medium" style={{ fontSize: '12px', color: '#878a99' }}>Attendance Date <span className="text-danger">*</span></label>
                    <input type="date" className="form-control form-control-sm bg-light border-0" required value={newAttendance.date} onChange={(e) => setNewAttendance({...newAttendance, date: e.target.value})} style={{ padding: '8px 12px', color: '#495057' }} />
                  </div>
                  
                  <table className="table table-borderless align-middle mt-4">
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <th className="px-0 py-2" style={{ fontSize: '13px', color: '#495057', fontWeight: '600' }}>Emp Name</th>
                        <th className="px-0 py-2 text-end" style={{ fontSize: '13px', color: '#495057', fontWeight: '600' }}>Attendance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map(emp => {
                        const isPresent = !!newAttendance.presentMap[emp.id];
                        return (
                        <tr key={emp.id} style={{ borderBottom: '1px solid #f3f6f9' }}>
                          <td className="px-0 py-3" style={{ fontSize: '12px', color: '#405189', lineHeight: '1.4' }}>{emp.name} | {emp.name.split(' ')[0].toLowerCase()}_{emp.id}</td>
                          <td className="px-0 py-3 text-end">
                            <div className="d-flex flex-column align-items-end justify-content-center">
                              <span style={{ fontSize: '11px', color: '#495057', fontWeight: isPresent ? 'normal' : '600', marginBottom: '4px' }}>Absent</span>
                              <div className="form-check form-switch m-0 p-0" style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '2px' }}>
                                <input 
                                  className="form-check-input m-0" 
                                  type="checkbox" 
                                  role="switch" 
                                  checked={isPresent} 
                                  onChange={() => handleTogglePresent(emp.id)} 
                                  style={{ width: '32px', height: '16px', cursor: 'pointer', backgroundColor: isPresent ? '#405189' : '#e2e8f0', borderColor: isPresent ? '#405189' : '#e2e8f0' }}
                                />
                              </div>
                              <span style={{ fontSize: '11px', color: '#495057', fontWeight: isPresent ? '600' : 'normal', marginTop: '4px' }}>Present</span>
                            </div>
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>

                  <div className="mt-4 pt-3 text-end">
                    <button type="submit" className="btn btn-primary btn-sm px-4" style={{ backgroundColor: '#405189', borderColor: '#405189' }}>Save</button>
                  </div>
                </form>
              </div>

            </div>
          </>
        )}

        {/* Reports Offcanvas */}
        {showReportsModal && (
          <>
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99998 }} onClick={() => setShowReportsModal(false)}></div>
            <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', backgroundColor: '#fff', zIndex: 99999, display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 15px rgba(0,0,0,0.1)' }}>
              
              <div className="offcanvas-header p-3 border-bottom d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f3f6f9' }}>
                <h5 className="m-0 d-flex align-items-center fw-semibold text-dark" style={{ fontSize: '15px' }}>Attendance Reports</h5>
                <button onClick={() => setShowReportsModal(false)} className="btn-close" style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#878a99' }}>&times;</button>
              </div>

              <div className="offcanvas-body p-4 flex-grow-1 overflow-auto" style={{ '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#878a99' } }}>
                <h6 style={{ fontSize: '11px', fontWeight: '600', color: '#878a99', textTransform: 'uppercase', marginBottom: '15px' }}>Select Month Or Date Range</h6>
                
                <div className="d-flex mb-3 gap-4">
                  <div className="form-check form-radio-primary">
                    <input className="form-check-input" type="radio" name="reportDateRange" id="r_currentMonth" checked={reportConfig.dateRange === 'Current Month'} onChange={() => setReportConfig({...reportConfig, dateRange: 'Current Month'})} style={{ borderColor: '#405189' }} />
                    <label className="form-check-label" htmlFor="r_currentMonth" style={{ fontSize: '12px', color: '#212529' }}>Current Month</label>
                  </div>
                  <div className="form-check form-radio-primary">
                    <input className="form-check-input" type="radio" name="reportDateRange" id="r_selectDate" checked={reportConfig.dateRange === 'Select Date Range'} onChange={() => setReportConfig({...reportConfig, dateRange: 'Select Date Range'})} />
                    <label className="form-check-label" htmlFor="r_selectDate" style={{ fontSize: '12px', color: '#212529' }}>Select Date Range</label>
                  </div>
                </div>

                <div className="row g-2 align-items-center mb-2">
                  <div className="col-auto">
                    <label style={{ fontSize: '12px', width: '35px', marginBottom: 0, color: '#495057' }}>From</label>
                  </div>
                  <div className="col">
                    <input type="date" className="form-control form-control-sm bg-light" disabled={reportConfig.dateRange !== 'Select Date Range'} value={reportConfig.from} onChange={(e) => setReportConfig({...reportConfig, from: e.target.value})} style={{ color: '#878a99' }} />
                  </div>
                </div>
                <div className="row g-2 align-items-center mb-4">
                  <div className="col-auto">
                    <label style={{ fontSize: '12px', width: '35px', marginBottom: 0, color: '#495057' }}>To</label>
                  </div>
                  <div className="col">
                    <input type="date" className="form-control form-control-sm bg-light" disabled={reportConfig.dateRange !== 'Select Date Range'} value={reportConfig.to} onChange={(e) => setReportConfig({...reportConfig, to: e.target.value})} style={{ color: '#878a99' }} />
                  </div>
                </div>

                <div className="d-flex mb-4 gap-4">
                  <div className="form-check form-radio-primary">
                    <input className="form-check-input" type="radio" name="reportType" id="r_attendance" checked={reportConfig.reportType === 'Attendance Report'} onChange={() => setReportConfig({...reportConfig, reportType: 'Attendance Report'})} style={{ borderColor: '#405189' }} />
                    <label className="form-check-label" htmlFor="r_attendance" style={{ fontSize: '12px', color: '#212529' }}>Attendance Report</label>
                  </div>
                  <div className="form-check form-radio-primary">
                    <input className="form-check-input" type="radio" name="reportType" id="r_salary" checked={reportConfig.reportType === 'Salary Report'} onChange={() => setReportConfig({...reportConfig, reportType: 'Salary Report'})} />
                    <label className="form-check-label" htmlFor="r_salary" style={{ fontSize: '12px', color: '#212529' }}>Salary Report</label>
                  </div>
                </div>

                <h6 style={{ fontSize: '11px', fontWeight: '600', color: '#878a99', textTransform: 'uppercase', marginBottom: '15px' }}>Users</h6>
                
                <div className="row">
                  {employees.map(emp => (
                    <div className="col-6 mb-3" key={emp.id}>
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id={`usr_${emp.id}`}
                          checked={reportConfig.selectedUsers.includes(emp.id)}
                          onChange={() => toggleUserReport(emp.id)}
                          style={{ backgroundColor: reportConfig.selectedUsers.includes(emp.id) ? '#405189' : 'transparent', borderColor: reportConfig.selectedUsers.includes(emp.id) ? '#405189' : '#ced4da' }}
                        />
                        <label className="form-check-label" htmlFor={`usr_${emp.id}`} style={{ fontSize: '11px', color: '#405189', lineHeight: '1.3', cursor: 'pointer' }}>
                          {emp.name}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  );
};

export default DashboardAttendance;
