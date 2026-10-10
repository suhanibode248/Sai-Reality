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
            
            # Use original date string logic or just leave it empty if missing
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
            
            # Assigned To parsing
            assigned_select = tds[9].find('select')
            assigned = 'Admin'
            if assigned_select:
                options = assigned_select.find_all('option')
                if options and options[0].get_text(strip=True):
                    assigned_raw = options[0].get_text(strip=True)
                    # Clean up 'poojamourya205_5' to 'poojamourya205'
                    assigned = assigned_raw.split('_')[0]
            
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


# Fix tabCounts
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
    
    leads_idx = content.find('const [leads, setLeads] = useState([')
    leads_end_idx = content.find(']);', leads_idx) + 3
    content = content[:leads_end_idx] + '\n\n  ' + new_tab_counts + '\n' + content[leads_end_idx:]


# --- 3. UI Modifications (Carefully) ---
# A) Remove Checkboxes
th_checkbox = r'<\s*th\s+style={{ padding: \'12px 10px\', width: \'35px\' }}\s*>.*?<\s*/th\s*>'
content = re.sub(th_checkbox, '', content, flags=re.DOTALL)

td_checkbox = r'<\s*td\s+style={{ padding: \'12px 10px\' }}\s*>\s*<\s*input\s+type="checkbox".*?/>\s*<\s*/td\s*>'
content = re.sub(td_checkbox, '', content, flags=re.DOTALL)

# B) Remove dummy avatars and add createdDate
avatar_pattern = r'<\s*img[^>]*src={`/static/dashboard/assets/images/users/avatar-.*?/>'
content = re.sub(avatar_pattern, '', content, flags=re.DOTALL)

# Let's format the name to show createdDate underneath
name_td_pattern = r'(<\s*td[^>]*>)\s*(<\s*div[^>]*>)\s*<\s*div\s*>\s*\{lead\.name\}\s*<\s*/div\s*>\s*<\s*/div\s*>\s*<\s*/td\s*>'
name_td_replacement = r'''\1
                      <div style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => setShowLeadDetailModal(lead)}>
                        <span>{lead.name}</span>
                        <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>Created Date: {lead.createdDate}</span>
                      </div>
                    </td>'''
content = re.sub(name_td_pattern, name_td_replacement, content, flags=re.DOTALL)

# C) Move Lead ID to the end (before Action)
# Find the Lead ID header
th_id_pattern = r'(<\s*th[^>]*>Lead ID.*?<\s*/th\s*>)'
th_id_match = re.search(th_id_pattern, content, flags=re.DOTALL)
if th_id_match:
    th_id_str = th_id_match.group(1)
    content = content.replace(th_id_str, '')
    # Insert before Action header
    th_action_pattern = r'(<\s*th[^>]*>Action.*?<\s*/th\s*>)'
    content = re.sub(th_action_pattern, th_id_str + r'\n                \1', content, count=1, flags=re.DOTALL)

# Find the Lead ID body td
td_id_pattern = r'(<\s*td[^>]*>\s*<\s*span[^>]*>\s*\{lead\.id\}\s*<\s*/span\s*>\s*<\s*/td\s*>)'
td_id_match = re.search(td_id_pattern, content, flags=re.DOTALL)
if td_id_match:
    td_id_str = td_id_match.group(1)
    content = content.replace(td_id_str, '')
    
    # Insert before Action td
    td_action_pattern = r'(<\s*td[^>]*>\s*<\s*div[^>]*>\s*<\s*button[^>]*>\s*<i className="ri-pencil-line"></i>.*?<\s*/td\s*>)'
    content = re.sub(td_action_pattern, td_id_str + r'\n                  \1', content, flags=re.DOTALL)

# D) Status clickable right modal
# Find the status td (it contains a select)
td_status_pattern = r'<\s*td[^>]*>\s*<\s*div[^>]*>\s*<\s*select.*?<\s*/select\s*>\s*<\s*small[^>]*>.*?<\s*/small\s*>\s*<\s*/div\s*>\s*<\s*/td\s*>'
td_status_replacement = r'''<td style={{ padding: '12px 10px' }}>
                      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '3px' }}>
                        <span 
                          onClick={() => setShowStatusModal(lead)}
                          style={{ backgroundColor: '#0284c7', color: '#fff', fontSize: '11px', fontWeight: '600', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                        >
                          {lead.status} <i className="ri-pencil-line"></i>
                        </span>
                        <small style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap' }}>
                          Date: {lead.statusDate}
                        </small>
                      </div>
                    </td>'''
content = re.sub(td_status_pattern, td_status_replacement, content, flags=re.DOTALL)

# E) Remove Edit button from Action column (just keep Delete)
td_action_buttons = r'(<\s*button[^>]*onClick={\(\) => setEditingLead\(lead\)}.*?>.*?<\s*/button\s*>)'
content = re.sub(td_action_buttons, '', content, flags=re.DOTALL)


# F) Append Right Status Modal
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

print("Exact match applied without touching CSS!")
