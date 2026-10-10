import requests
from bs4 import BeautifulSoup
import json
import re

s = requests.Session()

# 1. Login
login_url = 'https://certifiedproperties.in/dashboard/user-login/?next=/dashboard/leads/all/'
r = s.get(login_url)
soup = BeautifulSoup(r.text, 'html.parser')
csrf_input = soup.find('input', {'name': 'csrfmiddlewaretoken'})
csrf = csrf_input['value']

payload = {
    'csrfmiddlewaretoken': csrf,
    'username': 'admin@email.com',
    'password': 'Cap%65h@3412^',
    'next': '/dashboard/leads/all/'
}
s.post('https://certifiedproperties.in/dashboard/user-login/', data=payload, headers={'Referer': login_url})

# 2. Get Leads list
r_leads = s.get('https://certifiedproperties.in/dashboard/leads/all/')
soup_leads = BeautifulSoup(r_leads.text, 'html.parser')
tbody = soup_leads.find('tbody', class_='list form-check-all')
leads_list = []

for row in tbody.find_all('tr')[:20]:
    tds = row.find_all('td')
    if len(tds) < 10: continue
    try:
        id_str = tds[0].get_text(strip=True)
        a_tag = tds[0].find('a')
        detail_url = 'https://certifiedproperties.in' + a_tag['href'] if a_tag else None
        
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
        
        assigned_select = tds[9].find('select')
        assigned = 'Admin'
        if assigned_select:
            options = assigned_select.find_all('option')
            if options and options[0].get_text(strip=True):
                assigned = options[0].get_text(strip=True).split('_')[0]
        
        leads_list.append({
            'id': id_str, 'name': name, 'createdDate': created_date, 'phone': phone,
            'status': status.upper(), 'statusDate': sdate, 'budget': budget,
            'intent': intent.upper(), 'note': note, 'lookingFor': lookingFor,
            'source': source, 'assignedTo': assigned,
            'detail_url': detail_url
        })
    except Exception as e:
        print(f"Error parsing row: {e}")

# 3. Scrape detail pages
for lead in leads_list:
    if lead.get('detail_url'):
        try:
            print(f"Scraping details for {lead['id']} ...")
            r_det = s.get(lead['detail_url'])
            s_det = BeautifulSoup(r_det.text, 'html.parser')
            
            # Left column Overview
            # We already have most fields, but let's see if we can extract "E-mail", "Alternat number", etc.
            # They are in <div><h6 class="fs-14 mb-0">something</h6></div> format.
            email = '-'
            alt_phone = '-'
            location = '-'
            
            text_details = s_det.find('div', id='textDetails')
            customer_details = {
                'purpose': '-', 'propertyType': '-', 'configurationsType': '-',
                'area': '-', 'fundingSource': '-', 'employmentType': '-',
                'facing': '-', 'age': '-', 'referredBy': '-',
                'gender': '-', 'annualIncome': '-'
            }
            if text_details:
                # Pairs of <p class="mb-1">Label</p><h6 class="text-truncate mb-0">Value</h6>
                for block in text_details.find_all('div', class_='flex-grow-1'):
                    p = block.find('p')
                    h6 = block.find('h6')
                    if p and h6:
                        label = p.get_text(strip=True).replace(':', '').strip().lower()
                        val = h6.get_text(strip=True)
                        if val == '': val = '-'
                        if 'purpose' in label: customer_details['purpose'] = val
                        elif 'property type' in label: customer_details['propertyType'] = val
                        elif 'configrations' in label or 'configurations' in label: customer_details['configurationsType'] = val
                        elif 'area' in label: customer_details['area'] = val
                        elif 'funding' in label: customer_details['fundingSource'] = val
                        elif 'employment' in label: customer_details['employmentType'] = val
                        elif 'facing' in label: customer_details['facing'] = val
                        elif 'age' in label: customer_details['age'] = val
                        elif 'referred' in label: customer_details['referredBy'] = val
                        elif 'gender' in label: customer_details['gender'] = val
                        elif 'annual' in label or 'income' in label: customer_details['annualIncome'] = val
            
            lead['customerDetails'] = customer_details
            
            # Followups timeline
            timeline_div = s_det.find('div', class_='profile-timeline')
            activities = []
            if timeline_div:
                for acc in timeline_div.find_all('div', class_='accordion-item'):
                    title_div = acc.find('h5')
                    title = title_div.get_text(strip=True) if title_div else 'Activity'
                    small_text = acc.find('p', class_='text-muted')
                    subtitle = small_text.get_text(strip=True) if small_text else ''
                    
                    body = acc.find('div', class_='accordion-body')
                    desc = ''
                    if body:
                        # Extract the inner text, keep simple structure
                        desc_ps = body.find_all('p')
                        desc = ' | '.join([p.get_text(" ", strip=True) for p in desc_ps])
                    
                    activities.append({
                        'title': title,
                        'subtitle': subtitle,
                        'desc': desc
                    })
            lead['activities'] = activities
            
        except Exception as e:
            print(f"Error scraping detail {lead['id']}: {e}")

with open('full_leads_data.json', 'w', encoding='utf-8') as f:
    json.dump(leads_list, f, indent=4)

print("Saved full data to full_leads_data.json")
