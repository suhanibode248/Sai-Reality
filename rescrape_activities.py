import requests
from bs4 import BeautifulSoup
import json

s = requests.Session()

# 1. Login
login_url = 'https://certifiedproperties.in/dashboard/user-login/?next=/dashboard/leads/all/'
r = s.get(login_url)
soup = BeautifulSoup(r.text, 'html.parser')
csrf = soup.find('input', {'name': 'csrfmiddlewaretoken'})['value']

payload = {
    'csrfmiddlewaretoken': csrf,
    'username': 'admin@email.com',
    'password': 'Cap%65h@3412^',
    'next': '/dashboard/leads/all/'
}
s.post('https://certifiedproperties.in/dashboard/user-login/', data=payload, headers={'Referer': login_url})

# Load the previously saved list to save time
with open('full_leads_data.json', 'r', encoding='utf-8') as f:
    leads_list = json.load(f)

# Re-scrape just the activities
for lead in leads_list:
    if lead.get('detail_url'):
        try:
            r_det = s.get(lead['detail_url'])
            s_det = BeautifulSoup(r_det.text, 'html.parser')
            
            timeline_div = s_det.find('div', class_='profile-timeline')
            activities = []
            if timeline_div:
                for acc in timeline_div.find_all('div', class_='accordion-item'):
                    title_div = acc.find('h6')
                    title = title_div.get_text(strip=True) if title_div else 'Activity'
                    
                    small_text = acc.find('small', class_='text-muted')
                    subtitle = small_text.get_text(strip=True) if small_text else ''
                    
                    body = acc.find('div', class_='accordion-body')
                    desc = ''
                    if body:
                        desc_ps = body.find_all('p')
                        desc = ' | '.join([p.get_text(" ", strip=True) for p in desc_ps])
                    
                    activities.append({
                        'title': title,
                        'subtitle': subtitle,
                        'desc': desc
                    })
            lead['activities'] = activities
        except Exception as e:
            pass

with open('full_leads_data.json', 'w', encoding='utf-8') as f:
    json.dump(leads_list, f, indent=4)

print("Re-scraped activities!")
