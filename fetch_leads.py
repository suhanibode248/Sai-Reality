import requests
import re

url_login = 'https://certifiedproperties.in/dashboard/user-login/'
url_leads = 'https://certifiedproperties.in/dashboard/leads/all/'

session = requests.Session()

# Get login page to extract CSRF token
response = session.get(url_login)
csrf_token_match = re.search(r'name="csrfmiddlewaretoken" value="([^"]+)"', response.text)
if csrf_token_match:
    csrf_token = csrf_token_match.group(1)
else:
    print("Failed to find CSRF token")
    exit(1)

# Login
login_data = {
    'csrfmiddlewaretoken': csrf_token,
    'username': 'admin@email.com',
    'password': 'Cap%65h@3412^'
}

headers = {'Referer': url_login}
res_post = session.post(url_login, data=login_data, headers=headers)
print("Login status code:", res_post.status_code)

res_leads = session.get(url_leads)
with open('fetched_leads.html', 'w', encoding='utf-8') as f:
    f.write(res_leads.text)
print("Leads fetched, len:", len(res_leads.text))
