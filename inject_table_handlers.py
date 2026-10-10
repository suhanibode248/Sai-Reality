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
            options_html += f'                      <option style={{{{ backgroundColor: "rgba(137, 43, 226, 0.123)" }}}} value="{val}">{text}</option>\n'
        else:
            options_html += f'                      <option value="{val}">{text}</option>\n'

# 2. Inject into LeadsDashboard.jsx in the MAIN TABLE
jsx_file = r'frontend\src\pages\LeadsDashboard.jsx'
with open(jsx_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern for the main table select
pattern = r'(<td style={{ padding: \'12px 10px\' }}>\s*<select[^>]*value={lead\.assignedTo}[^>]*>)(.*?)(</select>\s*</td>)'
match = re.search(pattern, content, re.DOTALL)
if match:
    new_content = content[:match.start(2)] + "\n" + options_html + "                    " + content[match.end(2):]
    with open(jsx_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Injected full handler list into main table successfully!")
else:
    print("Could not find handler dropdown in table!")
