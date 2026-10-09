import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const DashboardDailyReport = () => {
  
  const [period, setPeriod] = useState('may');
  const [staff, setStaff] = useState('admin@email.com');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const allReportData = [
    { date: '2026-05-12', staffId: 'admin@email.com', calls: 45, callsPercent: '90%', siteVisits: 5, note: 'Follow up tomorrow' },
    { date: '2026-05-15', staffId: 'rajvardhansalve4377@gmail.com', calls: 38, callsPercent: '76%', siteVisits: 3, note: 'Customer asked for layout' },
    { date: '2026-05-18', staffId: 'aartidodmani282002@gmail.com', calls: 50, callsPercent: '100%', siteVisits: 8, note: 'Excellent performance' },
    { date: '2026-06-02', staffId: 'admin@email.com', calls: 20, callsPercent: '40%', siteVisits: 1, note: 'Half day leave' },
    { date: '2026-06-10', staffId: 'aartidodmani282002@gmail.com', calls: 42, callsPercent: '84%', siteVisits: 4, note: 'Good leads' },
    { date: '2026-04-25', staffId: 'rajvardhansalve4377@gmail.com', calls: 55, callsPercent: '100%', siteVisits: 6, note: 'Site visit confirmed' },
  ];

  // Initialize on first render
  React.useEffect(() => {
    handleSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    
    let result = allReportData;
    
    // Filter by staff
    if (staff) {
      result = result.filter(r => r.staffId === staff);
    }

    // Filter by exact date range if provided
    if (fromDate && toDate) {
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
                        <td className="p-3 text-muted">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardDailyReport;
