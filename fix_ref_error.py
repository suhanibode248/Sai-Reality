import re

jsx_file = r'frontend\src\pages\LeadsDashboard.jsx'
with open(jsx_file, 'r', encoding='utf-8') as f:
    content = f.read()

# We need to move `tabCounts` to after `const [leads, setLeads] = useState([...]);`
# First, let's extract tabCounts
tab_counts_pattern = r'(const tabCounts = \{.*?\};)'
tab_match = re.search(tab_counts_pattern, content, flags=re.DOTALL)
if tab_match:
    tab_counts_str = tab_match.group(1)
    
    # Remove tabCounts from its original position
    content = content.replace(tab_counts_str, '')
    
    # Now find the end of the leads useState
    # Since it's a huge JSON, we can just find where it ends.
    # It ends with `    },\n    {\n ... }\n  ]);`
    # Let's just find `const [leads, setLeads] = useState([` and the matching `]);`
    leads_start_idx = content.find('const [leads, setLeads] = useState([')
    
    # Find the next `  ]);` after leads_start_idx
    leads_end_idx = content.find('  ]);', leads_start_idx) + 5
    
    # Insert tabCounts right after leads declaration
    content = content[:leads_end_idx] + '\n\n  ' + tab_counts_str + '\n' + content[leads_end_idx:]

with open(jsx_file, 'w', encoding='utf-8') as f:
    f.write(content)
print("Moved tabCounts to fix ReferenceError!")
