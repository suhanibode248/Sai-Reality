import json
from bs4 import BeautifulSoup
import re

with open('fetched_leads.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

tbody = soup.find('tbody', class_='list form-check-all')
leads = []

if tbody:
    rows = tbody.find_all('tr')
    for row in rows:
        tds = row.find_all('td')
        if len(tds) < 10:
            continue
            
        try:
            # 1. ID
            id_str = tds[0].get_text(strip=True)
            
            # 2. Name & Date
            name_cell = tds[1]
            name_a = name_cell.find('strong')
            name = name_a.get_text(strip=True) if name_a else name_cell.get_text(strip=True).split('\n')[0]
            
            date_span = name_cell.find('span', class_='text-muted')
            created_date = date_span.get_text(strip=True).replace('Created Date:', '').strip() if date_span else ''
            
            # 3. Phone
            phone_cell = tds[2]
            phone_a = phone_cell.find('a', href=re.compile(r'tel:'))
            phone = phone_a['href'].replace('tel:', '') if phone_a else phone_cell.get_text(strip=True)
            
            # 4. Status
            status_cell = tds[3]
            status_span = status_cell.find('span', class_='badge')
            status = status_span.get_text(strip=True) if status_span else 'NEW LEAD'
            
            sdate_span = status_cell.find('span', class_='text-muted')
            sdate = sdate_span.get_text(strip=True) if sdate_span else ''
            sdate = re.sub(r'.*?Date:\s*', '', sdate)
            
            # 5. Budget
            budget = tds[4].get_text(strip=True)
            
            # 6. Intent
            intent = tds[5].get_text(strip=True)
            
            # 7. Note
            note_cell = tds[6]
            # remove read more
            for a in note_cell.find_all('a'):
                a.decompose()
            note = note_cell.get_text(strip=True)
            
            # 8. Looking For
            lookingFor = tds[7].get_text(strip=True)
            
            # 9. Source
            source = tds[8].get_text(strip=True)
            
            # 10. Assigned To
            assigned = tds[9].get_text(strip=True)
            if not assigned:
                assigned = "Admin"
                
            lead = {
                'id': id_str,
                'name': name,
                'createdDate': created_date,
                'phone': phone,
                'status': status.upper(),
                'statusDate': sdate,
                'budget': budget,
                'intent': intent.upper(),
                'note': note,
                'lookingFor': lookingFor,
                'source': source,
                'assignedTo': assigned
            }
            leads.append(lead)
        except Exception as e:
            print(f"Error parsing row: {e}")

print(f"Successfully parsed {len(leads)} leads using bs4!")

# Now rewrite LeadsDashboard.jsx with the parsed data
jsx_file = r'frontend\src\pages\LeadsDashboard.jsx'
with open(jsx_file, 'r', encoding='utf-8') as f:
    jsx_content = f.read()

# Make sure we don't accidentally match the wrong thing, so let's find the exact block
# const [leads, setLeads] = useState([ ... ]);
import re
pattern = r'(const \[leads,\s*setLeads\]\s*=\s*useState\(\[)(.*?)(\]\);)'
leads_json_str = json.dumps(leads, indent=4)
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
