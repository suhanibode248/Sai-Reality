import React, { useState } from 'react';
import useCrmCollection from '../hooks/useCrmCollection';
import DashboardLayout from '../components/DashboardLayout';

const DashboardDailyReport = () => {
  
  const [period, setPeriod] = useState('daily');
  const [staff, setStaff] = useState('admin@email.com');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const todayIso = new Date().toISOString().slice(0, 10);
  const [allReportData, setAllReportData] = useCrmCollection('dailyReports', [
    { id: 'r0', date: todayIso, staffId: 'admin@email.com', calls: 2, callsPercent: '1.33%', siteVisits: 0, note: '' },
    { id: 'r1', date: '2026-05-12', staffId: 'admin@email.com', calls: 45, callsPercent: '90%', siteVisits: 5, note: 'Follow up tomorrow' },
    { id: 'r2', date: '2026-05-15', staffId: 'rajvardhansalve4377@gmail.com', calls: 38, callsPercent: '76%', siteVisits: 3, note: 'Customer asked for layout' },
    { id: 'r3', date: '2026-05-18', staffId: 'aartidodmani282002@gmail.com', calls: 50, callsPercent: '100%', siteVisits: 8, note: 'Excellent performance' },
    { id: 'r4', date: '2026-06-02', staffId: 'admin@email.com', calls: 20, callsPercent: '40%', siteVisits: 1, note: 'Half day leave' },
    { id: 'r5', date: '2026-06-10', staffId: 'aartidodmani282002@gmail.com', calls: 42, callsPercent: '84%', siteVisits: 4, note: 'Good leads' },
    { id: 'r6', date: '2026-04-25', staffId: 'rajvardhansalve4377@gmail.com', calls: 55, callsPercent: '100%', siteVisits: 6, note: 'Site visit confirmed' },
  ]);
  const [notepad, setNotepad] = useState(null); // { id, note }

  const saveNote = () => {
    setAllReportData(prev => prev.map(r => (r.id === notepad.id ? { ...r, note: notepad.note } : r)));
    setFilteredData(prev => prev.map(r => (r.id === notepad.id ? { ...r, note: notepad.note } : r)));
    setNotepad(null);
  };

  // Initialize on first render
  React.useEffect(() => {
    handleSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allReportData]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    
    let result = allReportData;
    
    // Filter by staff
    if (staff) {
      result = result.filter(r => r.staffId === staff);
    }

    // Filter by exact date range if provided
    if (period === 'daily' && !(fromDate && toDate)) {
      result = result.filter(r => r.date === todayIso);
    } else if (period === 'monthly' && !(fromDate && toDate)) {
      result = result.filter(r => r.date.slice(0, 7) === todayIso.slice(0, 7));
    } else if (fromDate && toDate) {
      result = result.filter(r => r.date >= fromDate && r.date <= toDate);
    } else if (period !== 'daily' && period !== 'monthly') {
      // Very basic month text matching for dummy data purposes
      const monthMap = { 'january': '-01-', 'february': '-02-', 'march': '-03-', 'april': '-04-', 'may': '-05-', 'june': '-06-', 'july': '-07-', 'august': '-08-', 'september': '-09-', 'october': '-10-', 'november': '-11-', 'december': '-12-' };
      if (monthMap[period]) {
        result = result.filter(r => r.date.includes(monthMap[period]));
      }
    }

    setFilteredData(result);
  };
return (
    <DashboardLayout>
      <div className="container-fluid p-0">
        <br />
        <br />
        <div className="container mt-2">
          
          <form className="mb-5 d-flex justify-content-center" onSubmit={handleSearch}>
            <div className="d-flex align-items-center gap-4 flex-wrap">
              
              {/* Period Dropdown */}
              <div className="d-flex align-items-center gap-2">
                <i className="ri-calendar-todo-line text-muted" style={{ fontSize: '20px' }}></i>
                <select className="form-select form-select-sm shadow-sm" style={{ width: '120px', fontSize: '13px', borderRadius: '4px' }} value={period} onChange={(e) => setPeriod(e.target.value)}>
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                  <option value="january">January</option>
                  <option value="february">February</option>
                  <option value="march">March</option>
                  <option value="april">April</option>
                  <option value="may">May</option>
                  <option value="june">June</option>
                  <option value="july">July</option>
                  <option value="august">August</option>
                  <option value="september">September</option>
                  <option value="october">October</option>
                  <option value="november">November</option>
                  <option value="december">December</option>
                </select>
              </div>

              {/* Staff Dropdown */}
              <div className="d-flex align-items-center gap-2">
                <i className="ri-group-line text-muted" style={{ fontSize: '20px' }}></i>
                <select className="form-select form-select-sm shadow-sm" style={{ width: '130px', fontSize: '13px', borderRadius: '4px' }} value={staff} onChange={(e) => setStaff(e.target.value)}>
                  <option value="admin@email.com">admin@email.com</option>
                  <option value="rajvardhansalve4377@gmail.com">rajvardhansalve4377...</option>
                  <option value="aartidodmani282002@gmail.com">aartidodmani282002...</option>
                </select>
              </div>

              {/* From Date */}
              <div className="d-flex align-items-center gap-2">
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#495057', marginBottom: 0 }}>From:</label>
                <input type="date" className="form-control form-control-sm shadow-sm" style={{ width: '130px', fontSize: '13px', borderRadius: '4px', color: '#878a99' }} />
              </div>

              {/* To Date */}
              <div className="d-flex align-items-center gap-2">
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#495057', marginBottom: 0 }}>To:</label>
                <input type="date" className="form-control form-control-sm shadow-sm" style={{ width: '130px', fontSize: '13px', borderRadius: '4px', color: '#878a99' }} />
              </div>

              {/* Filter Button */}
              <div>
                <button type="submit" className="btn btn-sm px-4 shadow-sm" style={{ backgroundColor: '#405189', color: 'white', fontWeight: '500', borderRadius: '4px' }}>
                  Specific Report
                </button>
              </div>

            </div>
          </form>

          {/* Centered Title */}
          <div className="text-center mb-4">
            <h4 style={{ color: '#405189', fontSize: '22px', fontWeight: '500' }}>Daily Report</h4>
          </div>

          {/* Table */}
          <div className="card shadow-sm border-0 mt-4">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-bordered mb-0" style={{ fontSize: '13px' }}>
                  <thead style={{ backgroundColor: '#f8f9fa', color: '#212529', fontWeight: '600' }}>
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Staff ID</th>
                      <th className="p-3">Calls Count</th>
                      <th className="p-3">CallsCount%</th>
                      <th className="p-3">Site Visit Count</th>
                      <th className="p-3">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length === 0 && (
                      <tr><td colSpan="6" className="p-4 text-center text-muted">No report found for this period.</td></tr>
                    )}
                    {filteredData.map((row, index) => (
                      <tr key={index}>
                        <td className="p-3">{row.date}</td>
                        <td className="p-3">{row.staffId}</td>
                        <td className="p-3">{row.calls}</td>
                        <td className="p-3">
                          <span className="badge" style={{ backgroundColor: parseInt(row.callsPercent) >= 80 ? '#0ab39c' : parseInt(row.callsPercent) >= 50 ? '#f6b26b' : '#f06548' }}>
                            {row.callsPercent}
                          </span>
                        </td>
                        <td className="p-3">{row.siteVisits}</td>
                        <td className="p-3">
                          <button type="button" className="btn btn-primary btn-sm" onClick={() => setNotepad({ id: row.id, note: row.note || '' })} title={row.note || 'No note yet'}>
                            Open Notepad
                          </button>
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
      {notepad && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '60px' }}>
          <div className="modal-content bg-white rounded shadow" style={{ width: '100%', maxWidth: '500px' }}>
            <div className="modal-header p-3 border-bottom d-flex justify-content-between">
              <h5 className="modal-title">Notepad Editor</h5>
              <button type="button" className="btn-close" onClick={() => setNotepad(null)}></button>
            </div>
            <div className="modal-body p-3">
              <textarea className="form-control note-text" rows="10" placeholder="Write your notes here..." value={notepad.note} onChange={(e) => setNotepad(prev => ({ ...prev, note: e.target.value }))}></textarea>
            </div>
            <div className="modal-footer p-3 border-top d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => setNotepad(null)}>Close</button>
              <button type="button" className="btn btn-primary" onClick={saveNote}>Save</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardDailyReport;
