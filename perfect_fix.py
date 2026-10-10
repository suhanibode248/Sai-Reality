import json
import re
from bs4 import BeautifulSoup

# --- 1. Extract Real Leads ---
with open('fetched_leads.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')
tbody = soup.find('tbody', class_='list form-check-all')
leads = []
if tbody:
    for row in tbody.find_all('tr'):
        tds = row.find_all('td')
        if len(tds) < 10: continue
        try:
            id_str = tds[0].get_text(strip=True)
            name_cell = tds[1]
            name_a = name_cell.find('strong')
            name = name_a.get_text(strip=True) if name_a else name_cell.get_text(strip=True).split('\n')[0]
            date_span = name_cell.find('span', class_='text-muted')
            created_date = date_span.get_text(strip=True).replace('Created Date:', '').strip() if date_span else ''
            
            phone_cell = tds[2]
            phone_a = phone_cell.find('a', href=re.compile(r'tel:'))
            phone = phone_a['href'].replace('tel:', '') if phone_a else phone_cell.get_text(strip=True)
            
            status_cell = tds[3]
            status_span = status_cell.find('span', class_='badge')
            status = status_span.get_text(strip=True) if status_span else 'NEW LEAD'
            sdate_span = status_cell.find('span', class_='text-muted')
            sdate = sdate_span.get_text(strip=True) if sdate_span else ''
            sdate = re.sub(r'.*?Date:\s*', '', sdate)
            
            budget = tds[4].get_text(strip=True)
            intent = tds[5].get_text(strip=True)
            
            note_cell = tds[6]
            for a in note_cell.find_all('a'): a.decompose()
            note = note_cell.get_text(strip=True)
            
            lookingFor = tds[7].get_text(strip=True)
            source = tds[8].get_text(strip=True)
            assigned = tds[9].get_text(strip=True) or "Admin"
            
            leads.append({
                'id': id_str, 'name': name, 'createdDate': created_date, 'phone': phone,
                'status': status.upper(), 'statusDate': sdate, 'budget': budget,
                'intent': intent.upper(), 'note': note, 'lookingFor': lookingFor,
                'source': source, 'assignedTo': assigned
            })
        except: pass

# --- 2. Patch LeadsDashboard.jsx ---
jsx_file = r'frontend\src\pages\LeadsDashboard.jsx'
with open(jsx_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Add showStatusModal state
if 'const [showStatusModal, setShowStatusModal]' not in content:
    content = content.replace("const [showFollowupModal, setShowFollowupModal] = useState(null);",
                              "const [showFollowupModal, setShowFollowupModal] = useState(null);\n  const [showStatusModal, setShowStatusModal] = useState(null);")

# Inject real data
leads_json_str = json.dumps(leads, indent=4)
pattern = r'(const \[leads,\s*setLeads\]\s*=\s*useState\(\[)(.*?)(\]\);)'
content = re.sub(pattern, r'\1\n' + leads_json_str[1:-1].replace('\\', '\\\\') + r'\n\3', content, flags=re.DOTALL)

# Move tabCounts BELOW leads
tab_counts_pattern = r'(const tabCounts = \{.*?\};)'
tab_match = re.search(tab_counts_pattern, content, flags=re.DOTALL)
if tab_match:
    tab_counts_str = tab_match.group(1)
    content = content.replace(tab_counts_str, '')
    
    new_tab_counts = '''const tabCounts = {
    all: leads.length,
    new: leads.filter(l => l.status.includes("NEW")).length,
    followups: leads.filter(l => l.status.includes("FOLLOWUP")).length,
    siteVisits: leads.filter(l => l.status.includes("SITE VISIT")).length,
    svCompleted: leads.filter(l => l.status.includes("COMPLETED")).length,
    bookingInprogress: leads.filter(l => l.status.includes("INPROGRESS")).length,
    bookings: leads.filter(l => l.status.includes("BOOKING")).length,
    pending: 0,
    todayPending: 0,
    dead: leads.filter(l => l.status.includes("DEAD")).length,
    duplicate: 0
  };'''
    
    # insert right after leads definition
    # find where leads ends
    leads_idx = content.find('const [leads, setLeads] = useState([')
    leads_end_idx = content.find(']);', leads_idx) + 3
    
    content = content[:leads_end_idx] + '\n\n  ' + new_tab_counts + '\n' + content[leads_end_idx:]


# --- 3. Fix Table Layout ---

# Replace the thead TR block
# We remove checkbox, ensure Lead ID is first.
thead_pattern = r'(<tr style={{ backgroundColor: \'#f8fafc\', borderBottom: \'1px solid #e2e8f0\', textAlign: \'left\', fontWeight: \'600\', color: \'#475569\' }}>)(.*?)(</tr>)'
thead_replacement = r'''\1
                <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>Lead ID <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
                <th style={{ padding: '12px 10px', minWidth: '220px', fontWeight: 'bold' }}>Name <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
                <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>Phone <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
                <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>Status <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
                <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>Budget <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
                <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>Intent <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
                <th style={{ padding: '12px 10px', minWidth: '160px', fontWeight: 'bold' }}>Note <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
                <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>Looking For <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
                <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>Source <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
                <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>Assigned To <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
                <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>Next Followup <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
                <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>Action <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
              \3'''
content = re.sub(thead_pattern, thead_replacement, content, flags=re.DOTALL)


# Replace the tbody inner row
# We will match from `<tr key={lead.id}...>` to `</tr>` entirely.
tbody_row_pattern = r'(<tr key={lead\.id}[^>]*>)(.*?)(</tr>)'
tbody_row_replacement = r'''\1
                  {/* Lead ID */}
                  <td style={{ padding: '12px 10px', fontWeight: '700', color: '#1e3a8a' }}>
                    <span style={{ cursor: 'pointer', color: '#0284c7' }} onClick={() => setShowLeadDetailModal(lead)}>
                      {lead.id}
                    </span>
                  </td>

                  {/* Name (no avatar, with createdDate) */}
                  <td style={{ padding: '12px 10px', color: '#1e3a8a', fontWeight: '600', lineHeight: 1.4 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => setShowLeadDetailModal(lead)}>
                      <span style={{ color: '#0284c7', fontSize: '13px' }}>{lead.name}</span>
                      <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', fontWeight: 'normal' }}>Created Date: {lead.createdDate}</span>
                    </div>
                  </td>

                  {/* Phone */}
                  <td style={{ padding: '12px 10px' }}>
                    <a href={`tel:${lead.phone}`} style={{ textDecoration: 'none' }} title={`Call ${lead.phone}`}>
                      <div style={{ width: '38px', height: '36px', backgroundColor: '#334155', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
                        <i className="ri-whatsapp-line" style={{ fontSize: '13px', color: '#22c55e' }}></i>
                        <span style={{ fontSize: '9px', fontWeight: 'bold' }}>P</span>
                      </div>
                    </a>
                  </td>

                  {/* Status (Clickable to open right modal) */}
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '3px' }}>
                      <span 
                        onClick={() => setShowStatusModal(lead)}
                        style={{ backgroundColor: '#0284c7', color: '#fff', fontSize: '11px', fontWeight: '600', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        {lead.status}
                      </span>
                      <small style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap' }}>
                        Date: {lead.statusDate}
                      </small>
                    </div>
                  </td>

                  {/* Budget */}
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>{lead.budget}</span>
                  </td>

                  {/* Intent */}
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{ backgroundColor: '#e0f2fe', color: '#0284c7', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>{lead.intent}</span>
                  </td>

                  {/* Note */}
                  <td style={{ padding: '12px 10px', fontSize: '12px', color: '#334155' }}>
                    {lead.note} <span style={{ color: '#0284c7', cursor: 'pointer', fontWeight: '500' }} onClick={() => setShowLeadDetailModal(lead)}>Read More</span>
                  </td>

                  {/* Looking For */}
                  <td style={{ padding: '12px 10px', color: '#64748b' }}>{lead.lookingFor || '-'}</td>

                  {/* Source */}
                  <td style={{ padding: '12px 10px', color: '#334155', fontWeight: '500' }}>{lead.source}</td>

                  {/* Assigned To */}
                  <td style={{ padding: '12px 10px' }}>
                    <select 
                      value={lead.assignedTo}
                      onChange={(e) => { const val = e.target.value; setLeads(prev => prev.map(item => item.id === lead.id ? { ...item, assignedTo: val } : item)); }}
                      style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', color: '#334155', backgroundColor: '#fff', outline: 'none' }}
                    >
                      <option value="Admin">Admin</option>
                      <option value={lead.assignedTo}>{lead.assignedTo}</option>
                    </select>
                  </td>

                  {/* Next Followup Button */}
                  <td style={{ padding: '12px 10px' }}>
                    <button onClick={() => setShowFollowupModal(lead)} style={{ backgroundColor: '#0ea5e9', border: 'none', color: '#fff', fontSize: '12px', fontWeight: '600', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                      See Followups <i className="ri-arrow-down-s-line"></i>
                    </button>
                  </td>

                  {/* Action (Delete only) */}
                  <td style={{ padding: '12px 10px' }}>
                    <button onClick={() => { if (window.confirm(`Are you sure you want to delete lead #${lead.id}?`)) { setLeads(leads.filter(l => l.id !== lead.id)); } }} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '16px', cursor: 'pointer', padding: '3px' }} title="Delete Lead">
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </td>
              \3'''
# We only want to replace the first row match (which is the main one).
content = re.sub(tbody_row_pattern, tbody_row_replacement, content, count=1, flags=re.DOTALL)


# --- 4. Testing section text ---
tabs_container_pattern = r'(<\s*div\s+style={{ display: \'flex\', flexWrap: \'wrap\', gap: \'4px\', marginBottom: \'15px\' }}\s*>)'
content = re.sub(tabs_container_pattern, r'<div style={{ fontSize: "14px", fontWeight: "500", color: "#334155", marginBottom: "10px" }}>this is ids section for testing purpose<br/><span style={{ fontSize: "12px", color: "#64748b" }}>2002 2</span></div>\n\1', content)


# --- 5. Status Right Panel Modal ---
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
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    setLeads(prev => prev.map(l => l.id === showStatusModal.id ? {...l, status: newStatus} : l));
                  }}
                  value={showStatusModal.status}
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', color: '#334155' }}
                >
                  <option value="NEW LEAD">NEW LEAD</option>
                  <option value="IN FOLLOWUP">IN FOLLOWUP</option>
                  <option value="SITE VISIT">SITE VISIT</option>
                  <option value="SV SCHEDULED">SV SCHEDULED</option>
                  <option value="SV COMPLETED">SV COMPLETED</option>
                  <option value="BOOKING INPROGRESS">BOOKING INPROGRESS</option>
                  <option value="BOOKINGS/ EOI">BOOKINGS/ EOI</option>
                  <option value="DEAD LEAD">DEAD LEAD</option>
                </select>
              </div>
            </div>
            <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowStatusModal(null)} style={{ flex: 1, padding: '10px 0', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => setShowStatusModal(null)} style={{ flex: 1, padding: '10px 0', backgroundColor: '#0ab39c', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Save Status</button>
            </div>
          </div>
        </div>
      )}
'''
if "Right Side Status Panel" not in content:
    content = content.replace("</DashboardLayout>", status_modal_jsx + "\n    </DashboardLayout>")

with open(jsx_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Perfect fix applied!")
