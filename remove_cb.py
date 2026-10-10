import re

jsx_file = r'frontend\src\pages\LeadsDashboard.jsx'
with open(jsx_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove thead checkbox
thead_cb_start = content.find('<th style={{ padding: \'12px 10px\', width: \'35px\' }}>')
if thead_cb_start != -1:
    thead_cb_end = content.find('</th>', thead_cb_start) + 5
    content = content[:thead_cb_start] + content[thead_cb_end:]

# Remove tbody checkbox
tbody_cb_start = content.find('<td style={{ padding: \'12px 10px\' }}>\n                      <input \n                        type="checkbox"')
if tbody_cb_start != -1:
    tbody_cb_end = content.find('</td>', tbody_cb_start) + 5
    content = content[:tbody_cb_start] + content[tbody_cb_end:]

with open(jsx_file, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed checkboxes!")
