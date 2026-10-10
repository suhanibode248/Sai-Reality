import re
from bs4 import BeautifulSoup

# 1. Parse scraper_test.html for options
with open('scraper_test.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

handler_select = soup.find('select', {'name': 'handler'})
options_html = ""
if handler_select:
    for opt in handler_select.find_all('option'):
        val = opt.get('value', '')
        text = opt.get_text(strip=True)
        bg = opt.get('style', '')
        if bg:
            # e.g. style="background-color: rgba(137, 43, 226, 0.123);"
            options_html += f'                      <option style={{{{ backgroundColor: "rgba(137, 43, 226, 0.123)" }}}} value="{val}">{text}</option>\n'
        else:
            options_html += f'                      <option value="{val}">{text}</option>\n'

# 2. Inject into LeadsDashboard.jsx
jsx_file = r'frontend\src\pages\LeadsDashboard.jsx'
with open(jsx_file, 'r', encoding='utf-8') as f:
    content = f.read()

# The pattern I need to replace is everything inside the <select> for Assigned To
pattern = r'(<label style={{ display: \'block\', fontSize: \'13px\', color: \'#212529\', marginBottom: \'8px\', fontWeight: \'500\' }}>Assigned To.*?<select.*?>)(.*?)(</select>)'
match = re.search(pattern, content, re.DOTALL)
if match:
    new_content = content[:match.start(2)] + "\n" + options_html + "                    " + content[match.end(2):]
    with open(jsx_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Injected full handler list successfully!")
else:
    print("Could not find handler dropdown in JSX!")
