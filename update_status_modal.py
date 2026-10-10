import re

jsx_file = r'frontend\src\pages\LeadsDashboard.jsx'
with open(jsx_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the existing showStatusModal render code
old_status_modal = r'''{/* Right Side Status Panel */}
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
                  <select name="status" 
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setLeads(prev => prev.map(l => l.id === showStatusModal.id ? {...l, status: newStatus} : l));
                    }}
                    value={showStatusModal.status}
                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', color: '#334155' }}
                  >
                    <option value="NEW LEAD">NEW LEAD</option>
                    <option value="HOT LEAD">HOT LEAD</option>
                    <option value="WARM LEAD">WARM LEAD</option>
                    <option value="COLD LEAD">COLD LEAD</option>
                    <option value="SV SCHEDULED">SV SCHEDULED</option>
                    <option value="SV COMPLETED">SV COMPLETED</option>
                    <option value="NOT INTERESTED">NOT INTERESTED</option>
                  </select>
                </div>
              </div>
              <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
                <button onClick={() => setShowStatusModal(null)} style={{ flex: 1, padding: '10px 0', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                <button onClick={() => setShowStatusModal(null)} style={{ flex: 1, padding: '10px 0', backgroundColor: '#0ab39c', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Save Status</button>
              </div>
            </div>
          </div>
        )}'''

new_status_modal = r'''{/* Right Side Status Panel (Full Form) */}
        {showStatusModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
            <div style={{ backgroundColor: '#fff', width: '450px', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 25px rgba(0,0,0,0.1)' }}>
              
              {/* Header */}
              <div style={{ padding: '20px', backgroundColor: '#edebeb', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h5 style={{ margin: 0, fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>Add Lead Followup</h5>
                <button onClick={() => setShowStatusModal(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}>&times;</button>
              </div>

              {/* Body */}
              <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
                
                <h5 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                  <span style={{ color: '#6c757d', fontWeight: 'normal' }}>Name :</span> &nbsp;{showStatusModal.name}
                </h5>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Select Status */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#212529', marginBottom: '8px', fontWeight: '500' }}>Select Status <span style={{ color: '#dc3545' }}>*</span></label>
                    <select name="status" 
                      defaultValue={showStatusModal.status === "NEW LEAD" ? "New Lead" : showStatusModal.status === "SV SCHEDULED" ? "SV Scheduled" : showStatusModal.status}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', color: '#212529' }}
                    >
                      <option value="New Lead">New Lead</option>
                      <option value="Not Connected">Not Connected</option>
                      <option value="In Progress">In Progress</option>
                      <option value="SV Scheduled">SV Scheduled</option>
                      <option value="SV Completed">SV Completed</option>
                      <option value="EOI Completed">EOI Completed</option>
                      <option value="Bookings In Progress">Bookings In Progress</option>
                      <option value="Booking Completed">Booking Completed</option>
                      <option value="Dead Lead">Dead Lead</option>
                    </select>
                  </div>

                  {/* Assigned To */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#212529', marginBottom: '8px', fontWeight: '500' }}>Assigned To <span style={{ color: '#dc3545' }}>*</span></label>
                    <select name="status" defaultValue={showStatusModal.assignedTo || ""} style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', color: '#212529' }}>
                      <option value="">Select Assigned User</option>
                      <option value="assigntoall">Assign to all</option>
                      <option style={{ backgroundColor: 'rgba(137, 43, 226, 0.123)' }} value="1:group">Sales - group</option>
                      <option style={{ backgroundColor: 'rgba(137, 43, 226, 0.123)' }} value="2:group">Rent - group</option>
                      <option style={{ backgroundColor: 'rgba(137, 43, 226, 0.123)' }} value="3:group">Buy - group</option>
                      <option value="poojamourya205">poojamourya205_5 Pooja Arvind Prasad Mourya</option>
                      <option value="aartidodmani282002">aartidodmani282002_7 Aarti Davallpa Dodmani</option>
                      <option value="suhanigaikwad1914">suhanigaikwad1914_28 Suhani Gautam Gaikwad</option>
                    </select>
                  </div>

                  {/* Select Intent */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#212529', marginBottom: '8px', fontWeight: '500' }}>Select Intent <span style={{ color: '#dc3545' }}>*</span></label>
                    <select name="status" defaultValue={showStatusModal.intent === "COLD LEAD" ? "Cold" : showStatusModal.intent === "HOT LEAD" ? "Hot" : showStatusModal.intent === "WARM LEAD" ? "Warm" : "New"} style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', color: '#212529' }}>
                      <option value="New">New</option>
                      <option value="Cold">Cold</option>
                      <option value="Warm">Warm</option>
                      <option value="Hot">Hot</option>
                    </select>
                  </div>

                  {/* Looking For */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#212529', marginBottom: '8px', fontWeight: '500' }}>Looking For <span style={{ color: '#dc3545' }}>*</span></label>
                    <select name="status" defaultValue={showStatusModal.lookingFor || "Buy New Property"} style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', color: '#212529' }}>
                      <option value="Buy New Property">Buy New Property</option>
                      <option value="Property on Rent">Property on Rent</option>
                      <option value="Home Loan">Home Loan</option>
                    </select>
                  </div>

                  {/* Comment/Note/Remark */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#212529', marginBottom: '8px', fontWeight: '500' }}>Comment/ Note/ Remark <span style={{ color: '#dc3545' }}>*</span></label>
                    <textarea 
                      placeholder="Enter any followup comments" 
                      rows="3" 
                      style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', color: '#212529', boxSizing: 'border-box' }}
                    ></textarea>
                  </div>

                  {/* Voice Note */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#212529', marginBottom: '8px', fontWeight: '500' }}>Voice Note/ Remark</label>
                    <input type="file" style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', color: '#212529', marginBottom: '10px' }} />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #ced4da', borderRadius: '4px', backgroundColor: '#f8f9fa', cursor: 'pointer' }}>Start Recording</button>
                      <button style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #ced4da', borderRadius: '4px', backgroundColor: '#f8f9fa', cursor: 'pointer' }}>Stop Recording</button>
                    </div>
                  </div>

                  {/* Select Project */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#212529', marginBottom: '8px', fontWeight: '500' }}>Select Project</label>
                    <select name="status" multiple style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', color: '#212529', height: '100px' }}>
                      <option value="55">Nivasa Ananya</option>
                      <option value="54">Nivasa Enchante</option>
                      <option value="53">Virndavan height</option>
                      <option value="51">MAHINDRA CODENAME CROWN</option>
                      <option value="49">Shikpkaar developers</option>
                      <option value="47">Purvankara keshav nager</option>
                      <option value="44">Kohinoor Riverdale</option>
                    </select>
                  </div>

                  {/* Next Followup Date & Time */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#212529', marginBottom: '8px', fontWeight: '500' }}>Select Date & Time for next followup <span style={{ color: '#dc3545' }}>*</span></label>
                    <input type="datetime-local" style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', color: '#212529', boxSizing: 'border-box' }} />
                  </div>

                  {/* Upload Image/Photo */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#212529', marginBottom: '8px', fontWeight: '500' }}>Upload Image/ Photo</label>
                    <input type="file" multiple style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', color: '#212529', boxSizing: 'border-box' }} />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '15px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px', backgroundColor: '#fff' }}>
                <button onClick={() => setShowStatusModal(null)} style={{ flex: 1, padding: '10px 0', backgroundColor: '#f8f9fa', color: '#212529', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Reset</button>
                <button onClick={() => {
                  // In a real app this would submit the form data and update the lead status
                  const statusDropdown = document.querySelector('select[name="status"]');
                  if(statusDropdown) {
                     setLeads(prev => prev.map(l => l.id === showStatusModal.id ? {...l, status: statusDropdown.value.toUpperCase()} : l));
                  }
                  setShowStatusModal(null);
                }} style={{ flex: 1, padding: '10px 0', backgroundColor: '#198754', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Update</button>
              </div>
            </div>
          </div>
        )}'''

if old_status_modal in content:
    content = content.replace(old_status_modal, new_status_modal)
else:
    print("Could not find old status modal!")

with open(jsx_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Status Modal!")
