import re

jsx_file = r'frontend\src\pages\LeadsDashboard.jsx'
with open(jsx_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix the top of the file
if content.startswith('impo\n'):
    content = content[5:] # remove 'impo\n'

# 2. Extract tabCounts from the top
tab_counts_pattern = r'^\s*(const tabCounts = \{.*?\};\s*)rt React'
tab_match = re.search(tab_counts_pattern, content, flags=re.DOTALL)
if tab_match:
    tab_counts_str = tab_match.group(1)
    content = content.replace(tab_counts_str, '')
    content = content.replace('rt React', 'import React')
    
    # 3. Find the end of leads array correctly
    leads_start_idx = content.find('const [leads, setLeads] = useState([')
    leads_end_idx = content.find(']);', leads_start_idx) + 3
    
    content = content[:leads_end_idx] + '\n\n  ' + tab_counts_str.strip() + '\n' + content[leads_end_idx:]

with open(jsx_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed the file!")
