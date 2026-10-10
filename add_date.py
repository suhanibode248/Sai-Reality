import re

jsx_file = r'frontend\src\pages\LeadsDashboard.jsx'
with open(jsx_file, 'r', encoding='utf-8') as f:
    content = f.read()

name_div = r'<div>{lead\.name}</div>'
name_div_replacement = r'''<div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{lead.name}</span>
                        <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', fontWeight: 'normal' }}>Created Date: {lead.createdDate}</span>
                      </div>'''
content = re.sub(name_div, name_div_replacement, content)

with open(jsx_file, 'w', encoding='utf-8') as f:
    f.write(content)
print("Added created date!")
