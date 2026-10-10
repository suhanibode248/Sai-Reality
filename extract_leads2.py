import re
import json

file_path = 'fetched_leads.html'
with open(file_path, 'r', encoding='utf-8') as f:
    html = f.read()

tbody_match = re.search(r'<tbody class="list form-check-all">(.*?)</tbody>', html, re.DOTALL)
leads = []
if tbody_match:
    tbody = tbody_match.group(1)
    
    # Split by <tr
    rows = tbody.split('<tr')
    for row in rows[1:]: # skip first empty split
        row = '<tr' + row
        if '</tr>' not in row:
            continue
            
        tds = re.findall(r'<td[^>]*>(.*?)</td>', row, re.DOTALL)
        if len(tds) < 10:
            continue
            
        # tds[0] = Lead ID
        id_str = re.sub(r'<[^>]+>', '', tds[0]).strip()
        
        # tds[1] = Name
        name_str = tds[1]
        name = re.sub(r'<[^>]+>', '', name_str).replace('Created Date:', '').strip()
        # extract date if possible
        date_match = re.search(r'<span[^>]*><small>Created Date:\s*</small>(.*?)</span>', name_str, re.DOTALL)
        created_date = date_match.group(1).strip() if date_match else ''
        name_only = name.split('\n')[0].strip()
        
        # tds[2] = Phone
        phone_str = tds[2]
        phone_match = re.search(r'href="tel:(.*?)"', phone_str)
        phone = phone_match.group(1) if phone_match else ''
        
        # tds[3] = Status
        status_str = tds[3]
        status_badge = re.search(r'<span class="badge[^>]*>(.*?)<i', status_str, re.DOTALL)
        status = status_badge.group(1).strip() if status_badge else 'NEW LEAD'
        sdate_match = re.search(r'</small>(.*?)</span>', status_str, re.DOTALL)
        status_date = sdate_match.group(1).strip() if sdate_match else ''
        
        # tds[4] = Budget
        budget = re.sub(r'<[^>]+>', '', tds[4]).strip()
        
        # tds[5] = Intent
        intent = re.sub(r'<[^>]+>', '', tds[5]).strip()
        
        # tds[6] = Note
        note_str = tds[6]
        note_text = re.sub(r'<a.*?Read More</a>', '', note_str, flags=re.DOTALL|re.IGNORECASE)
        note = re.sub(r'<[^>]+>', '', note_text).strip()
        
        # tds[7] = Looking For
        looking = re.sub(r'<[^>]+>', '', tds[7]).strip()
        
        # tds[8] = Source
        source = re.sub(r'<[^>]+>', '', tds[8]).strip()
        
        # tds[9] = Assigned To
        assigned = re.sub(r'<[^>]+>', '', tds[9]).strip()
        if not assigned: assigned = 'Admin'
        
        lead = {
            'id': id_str,
            'name': name_only,
            'createdDate': created_date,
            'phone': phone,
            'status': status.upper(),
            'statusDate': status_date,
            'budget': budget,
            'intent': intent.upper(),
            'note': note,
            'lookingFor': looking,
            'source': source,
            'assignedTo': assigned
        }
        leads.append(lead)

print("Parsed leads:", len(leads))

jsx_file = r'frontend\src\pages\LeadsDashboard.jsx'
with open(jsx_file, 'r', encoding='utf-8') as f:
    jsx_content = f.read()

leads_json_str = json.dumps(leads, indent=4)

pattern = r'(const \[leads, setLeads\] = useState\(\[)(.*?)(\]\);)'
new_jsx = re.sub(pattern, r'\1\n' + leads_json_str[1:-1].replace('\\', '\\\\') + r'\n\3', jsx_content, flags=re.DOTALL)

tab_counts_pattern = r'(const tabCounts = {).*?(};)'
tab_counts_replacement = r'''\1
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
  \2'''
new_jsx = re.sub(tab_counts_pattern, tab_counts_replacement, new_jsx, flags=re.DOTALL)

with open(jsx_file, 'w', encoding='utf-8') as f:
    f.write(new_jsx)
print("Updated LeadsDashboard.jsx with real data")
