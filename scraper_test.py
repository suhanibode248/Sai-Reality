import requests
from bs4 import BeautifulSoup
import json
import time

s = requests.Session()

# 1. Get CSRF token
login_url = 'https://certifiedproperties.in/dashboard/user-login/?next=/dashboard/leads/all/'
r = s.get(login_url)
soup = BeautifulSoup(r.text, 'html.parser')
csrf_input = soup.find('input', {'name': 'csrfmiddlewaretoken'})
if not csrf_input:
    print("No CSRF token found on login page!")
else:
    csrf = csrf_input['value']
    print(f"CSRF: {csrf}")
    
    # 2. Login
    payload = {
        'csrfmiddlewaretoken': csrf,
        'username': 'admin@email.com',
        'password': 'Cap%65h@3412^',
        'next': '/dashboard/leads/all/'
    }
    
    # Check what the actual login POST url is (usually the same as the GET login_url)
    r_post = s.post('https://certifiedproperties.in/dashboard/user-login/', data=payload, headers={'Referer': login_url})
    print(f"Login POST status: {r_post.status_code}")
    
    # 3. Check if we are on leads page
    r_leads = s.get('https://certifiedproperties.in/dashboard/leads/all/')
    print(f"Leads page status: {r_leads.status_code}")
    
    with open('scraper_test.html', 'w', encoding='utf-8') as f:
        f.write(r_leads.text)
        
    soup_leads = BeautifulSoup(r_leads.text, 'html.parser')
    tbody = soup_leads.find('tbody', class_='list form-check-all')
    if tbody:
        links = []
        for row in tbody.find_all('tr')[:3]: # Just first 3 to test
            a_tag = row.find('a')
            if a_tag and 'href' in a_tag.attrs:
                links.append(a_tag['href'])
                
        print(f"Found links: {links}")
        
        # 4. Visit the first link
        if links:
            detail_url = 'https://certifiedproperties.in' + links[0]
            print(f"Visiting {detail_url}")
            r_detail = s.get(detail_url)
            with open('scraper_detail_test.html', 'w', encoding='utf-8') as f:
                f.write(r_detail.text)
            print("Saved detail page!")
