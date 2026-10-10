import re
import json

jsx_file = r'frontend\src\pages\LeadsDashboard.jsx'
with open(jsx_file, 'r', encoding='utf-8') as f:
    content = f.read()

with open('full_leads_data.json', 'r', encoding='utf-8') as f:
    leads_list = json.load(f)

leads_json_str = json.dumps(leads_list, indent=4)
pattern = r'(const \[leads,\s*setLeads\]\s*=\s*useState\(\[)(.*?)(\]\);)'

def repl(m):
    return m.group(1) + '\n' + leads_json_str[1:-1] + '\n' + m.group(3)

content = re.sub(pattern, repl, content, flags=re.DOTALL)

with open(jsx_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed JSON array with lambda!")
