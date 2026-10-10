import re

file_path = r'frontend\src\pages\LeadsDashboard.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

status_modal_jsx = r'''
      {/* Right Side Status Panel */}
      {showStatusModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div style={{ backgroundColor: '#fff', width: '400px', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 25px rgba(0,0,0,0.1)' }}>
            
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Update Status: #{showStatusModal.id}</h3>
              <button onClick={() => setShowStatusModal(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            </div>
            
            <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Current Status</label>
                <div style={{ padding: '10px', backgroundColor: '#f1f5f9', borderRadius: '4px', fontSize: '14px', color: '#334155', fontWeight: '600' }}>
                  {showStatusModal.status}
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Select New Status *</label>
                <select 
                  onChange={(e) => changeLeadStatus(showStatusModal.id, e.target.value)}
                  value={showStatusModal.status}
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', color: '#334155' }}
                >
                  <option value="NEW LEAD">NEW LEAD</option>
                  <option value="IN FOLLOWUP">IN FOLLOWUP</option>
                  <option value="SITE VISIT">SITE VISIT</option>
                  <option value="SV COMPLETED">SV COMPLETED</option>
                  <option value="BOOKING INPROGRESS">BOOKING INPROGRESS</option>
                  <option value="BOOKINGS/ EOI">BOOKINGS/ EOI</option>
                  <option value="DEAD LEAD">DEAD LEAD</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Status Note</label>
                <textarea 
                  rows="4" 
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', color: '#334155' }}
                  placeholder="Add a note about this status update..."
                ></textarea>
              </div>
            </div>

            <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setShowStatusModal(null)} 
                style={{ flex: 1, padding: '10px 0', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowStatusModal(null)} 
                style={{ flex: 1, padding: '10px 0', backgroundColor: '#0ab39c', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              >
                Save Status
              </button>
            </div>

          </div>
        </div>
      )}
'''

if "Right Side Status Panel" not in content:
    content = content.replace("</DashboardLayout>", status_modal_jsx + "\n    </DashboardLayout>")
    
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added right-side status modal JSX")
