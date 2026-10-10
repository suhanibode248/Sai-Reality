import re
import json

file_path = 'fetched_leads.html'
with open(file_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Parse the table rows
tbody_match = re.search(r'<tbody class="list form-check-all">(.*?)</tbody>', html, re.DOTALL)
leads = []
if tbody_match:
    tbody = tbody_match.group(1)
    rows = re.findall(r'<tr>(.*?)</tr>', tbody, re.DOTALL)
    for row in rows:
        lead = {}
        
        # Lead ID
        id_match = re.search(r'<td class="id".*?>(.*?)</td>', row, re.DOTALL)
        if id_match:
            lead['id'] = re.sub(r'<[^>]+>', '', id_match.group(1)).strip()
        else:
            continue
            
        # Name
        name_match = re.search(r'<td class="name".*?>(.*?)</td>', row, re.DOTALL)
        if name_match:
            name_content = name_match.group(1)
            name_text = re.search(r'<h5[^>]*>(.*?)</h5>', name_content, re.DOTALL)
            date_text = re.search(r'<p[^>]*>.*?:\s*(.*?)</p>', name_content, re.DOTALL)
            lead['name'] = name_text.group(1).strip() if name_text else ''
            lead['createdDate'] = date_text.group(1).strip() if date_text else ''
            
        # Phone
        phone_match = re.search(r'<td class="phone".*?>(.*?)</td>', row, re.DOTALL)
        if phone_match:
            lead['phone'] = re.sub(r'<[^>]+>', '', phone_match.group(1)).strip()
            
        # Status
        status_match = re.search(r'<td class="status".*?>(.*?)</td>', row, re.DOTALL)
        if status_match:
            status_content = status_match.group(1)
            status_text = re.search(r'<span[^>]*>(.*?)</span>', status_content, re.DOTALL)
            status_date = re.search(r'<p[^>]*>.*?:\s*(.*?)</p>', status_content, re.DOTALL)
            lead['status'] = status_text.group(1).strip() if status_text else ''
            lead['statusDate'] = status_date.group(1).strip() if status_date else ''
            
        # Budget
        budget_match = re.search(r'<td class="budget".*?>(.*?)</td>', row, re.DOTALL)
        if budget_match:
            lead['budget'] = re.sub(r'<[^>]+>', '', budget_match.group(1)).strip()
            
        # Intent
        intent_match = re.search(r'<td class="intent".*?>(.*?)</td>', row, re.DOTALL)
        if intent_match:
            lead['intent'] = re.sub(r'<[^>]+>', '', intent_match.group(1)).strip()
            
        # Note
        note_match = re.search(r'<td class="note".*?>(.*?)</td>', row, re.DOTALL)
        if note_match:
            note_content = note_match.group(1)
            note_text = re.sub(r'<a.*?Read More</a>', '', note_content, flags=re.DOTALL)
            lead['note'] = re.sub(r'<[^>]+>', '', note_text).strip()
            
        # Looking For
        lookingFor_match = re.search(r'<td class="lookingFor".*?>(.*?)</td>', row, re.DOTALL)
        if lookingFor_match:
            lead['lookingFor'] = re.sub(r'<[^>]+>', '', lookingFor_match.group(1)).strip()
            
        # Source
        source_match = re.search(r'<td class="source".*?>(.*?)</td>', row, re.DOTALL)
        if source_match:
            lead['source'] = re.sub(r'<[^>]+>', '', source_match.group(1)).strip()
            
        # Assigned To
        assignedTo_match = re.search(r'<td class="assigned-to".*?>(.*?)</td>', row, re.DOTALL)
        if assignedTo_match:
            val = re.sub(r'<[^>]+>', '', assignedTo_match.group(1)).strip()
            lead['assignedTo'] = val if val else "Admin"
            
        leads.append(lead)

print("Parsed leads:", len(leads))

# Now inject into LeadsDashboard.jsx
jsx_file = r'frontend\src\pages\LeadsDashboard.jsx'
with open(jsx_file, 'r', encoding='utf-8') as f:
    jsx_content = f.read()

leads_json_str = json.dumps(leads, indent=4)

# Replace the initial state
pattern = r'(const \[leads, setLeads\] = useState\(\[)(.*?)(\]\);)'
new_jsx = re.sub(pattern, r'\1' + leads_json_str[1:-1].replace('\\', '\\\\') + r'\3', jsx_content, flags=re.DOTALL)

# Fix tab counts
tab_counts_pattern = r'(const tabCounts = {).*?(};)'
tab_counts_replacement = r'''\1
    all: leads.length,
    new: leads.filter(l => l.status === "NEW LEAD").length,
    followups: leads.filter(l => l.status === "IN FOLLOWUP").length,
    siteVisits: leads.filter(l => l.status === "SITE VISIT").length,
    svCompleted: leads.filter(l => l.status === "SV COMPLETED").length,
    bookingInprogress: leads.filter(l => l.status === "BOOKING INPROGRESS").length,
    bookings: leads.filter(l => l.status === "BOOKINGS/ EOI").length,
    pending: 0,
    todayPending: 0,
    dead: leads.filter(l => l.status === "DEAD LEAD").length,
    duplicate: 0
  \2'''
new_jsx = re.sub(tab_counts_pattern, tab_counts_replacement, new_jsx, flags=re.DOTALL)

with open(jsx_file, 'w', encoding='utf-8') as f:
    f.write(new_jsx)

print("Successfully injected all data into LeadsDashboard.jsx")
