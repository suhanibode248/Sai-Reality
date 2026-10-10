import re

file_path = r'frontend\src\pages\LeadsDashboard.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. State addition for showStatusModal (if not there)
if 'const [showStatusModal, setShowStatusModal] = useState(null);' not in content:
    content = content.replace(
        "const [showFollowupModal, setShowFollowupModal] = useState(null);",
        "const [showFollowupModal, setShowFollowupModal] = useState(null);\n  const [showStatusModal, setShowStatusModal] = useState(null);"
    )

# 2. Modify Table Headers (thead -> tr)
# Let's extract the header row
thead_match = re.search(r'(<tr style={{ backgroundColor: \'#f8fafc\', borderBottom: \'1px solid #e2e8f0\', textAlign: \'left\', fontWeight: \'600\', color: \'#475569\' }}>)(.*?)(</tr>)', content, re.DOTALL)
if thead_match:
    prefix = thead_match.group(1)
    headers = thead_match.group(2)
    suffix = thead_match.group(3)
    
    # Remove checkbox
    headers = re.sub(r'<\s*th\s+style={{ padding: \'12px 10px\', width: \'35px\' }}\s*>\s*<\s*input[^>]*>\s*<\s*/th\s*>', '', headers, flags=re.DOTALL)
    
    # Extract Lead ID
    lead_id_pattern = r'(<\s*th\s+style={{ padding: \'12px 10px\', whiteSpace: \'nowrap\' }}\s*>\s*Lead ID\s*<i[^>]*></i>\s*</th>)'
    lead_id_match = re.search(lead_id_pattern, headers)
    if lead_id_match:
        lead_id_th = lead_id_match.group(1)
        headers = headers.replace(lead_id_th, '')
        
        # We need an Action header
        action_th = '<th style={{ padding: \'12px 10px\', whiteSpace: \'nowrap\' }}>Action</th>'
        
        headers = headers + '\n                ' + lead_id_th + '\n                ' + action_th + '\n              '
    
    content = content[:thead_match.start()] + prefix + headers + suffix + content[thead_match.end():]


# 3. Modify Table Row (tbody -> tr)
td_checkbox_pattern = r'(<\s*td\s+style={{ padding: \'12px 10px\' }}\s*>\s*<\s*input\s+type="checkbox"[^>]*>\s*<\s*/td\s*>)'
td_leadid_pattern = r'({\s*/\*\s*Lead ID\s*\*/\s*}\s*<\s*td\s+style={{ padding: \'12px 10px\', fontWeight: \'600\', color: \'#1e293b\' }}\s*>\s*<span[^>]*>\s*{lead\.id}\s*</span>\s*</td>)'
td_action_pattern = r'({\s*/\*\s*Action\s*\*/\s*}\s*<\s*td\s+style={{ padding: \'12px 10px\' }}\s*>\s*<div\s+style={{ display: \'flex\', alignItems: \'center\', gap: \'4px\' }}\s*>.*?</button>\s*</div>\s*</td>)'

content = re.sub(td_checkbox_pattern, '', content, flags=re.DOTALL)

td_leadid_match = re.search(td_leadid_pattern, content, flags=re.DOTALL)
if td_leadid_match:
    td_leadid = td_leadid_match.group(1)
    content = content.replace(td_leadid, '')
    
    td_action_match = re.search(td_action_pattern, content, flags=re.DOTALL)
    if td_action_match:
        td_action = td_action_match.group(1)
        content = content.replace(td_action, td_leadid + '\n                  ' + td_action)


# 4. Make Status clickable to open right panel
# Currently it's a select dropdown:
status_select_pattern = r'<select\s+value={lead\.status}\s+onChange={\(e\) => changeLeadStatus\(lead\.id, e\.target\.value\)}\s+style={{ backgroundColor: \'#0284c7\', border: \'none\', color: \'#fff\', fontSize: \'11px\', fontWeight: \'600\', padding: \'3px 8px\', borderRadius: \'4px\', cursor: \'pointer\', outline: \'none\' }}\s*>\s*(<option[^>]*>.*?</option>\s*)+\s*</select>'

status_clickable = r'''<span 
                        onClick={() => setShowStatusModal(lead)}
                        style={{ backgroundColor: '#0284c7', color: '#fff', fontSize: '11px', fontWeight: '600', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        {lead.status} <i className="ri-pencil-line"></i>
                      </span>'''

content = re.sub(status_select_pattern, status_clickable, content, flags=re.DOTALL)


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated leads table layout successfully!")
