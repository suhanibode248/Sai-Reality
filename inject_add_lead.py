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


jsx_file = r'frontend\src\pages\LeadsDashboard.jsx'
with open(jsx_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 2. Inject into Add Lead Modal
# It should be placed right above {/* Select Project */}
add_lead_assigned_to = f'''{{/* Assigned To */}}
                  <div>
                    <label style={{{{ display: 'block', fontSize: '12.5px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}}}>Assigned To <span style={{{{color: '#ef4444'}}}}>*</span></label>
                    <select required name="assignedTo" style={{{{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', backgroundColor: '#fff', color: '#334155' }}}}>
{options_html}                    </select>
                  </div>
                  
                  {{/* Select Project */}}'''

content = content.replace('{/* Select Project */}', add_lead_assigned_to, 1)

# 3. Inject into Filter Bar
# Pattern:
#          <select 
#            value={filters.assignedTo}
#            onChange={(e) => setFilters(prev => ({...prev, assignedTo: e.target.value}))}
#            style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', backgroundColor: '#fff', color: '#334155' }}
#          >
#            <option value="All">All Users</option>
#            <option value="Admin">Admin</option>
#            <option value="Sales Team">Sales Team</option>
#          </select>

filter_options_html = options_html.replace('                      <option value="">Select Assigned User</option>\n                      <option value="assigntoall">Assign to all</option>', '                      <option value="All">All Users</option>')
filter_pattern = r'(<select\s+value={filters\.assignedTo}.*?>)(.*?)(</select>)'

match = re.search(filter_pattern, content, re.DOTALL)
if match:
    content = content[:match.start(2)] + "\n" + filter_options_html + "          " + content[match.end(2):]

with open(jsx_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Injected into Add Lead and Filter bar successfully!")
