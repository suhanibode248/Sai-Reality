import re

file_path = r'frontend\src\pages\LeadsDashboard.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. State addition for showStatusModal
if 'const [showStatusModal, setShowStatusModal] = useState(null);' not in content:
    content = content.replace(
        "const [showFollowupModal, setShowFollowupModal] = useState(null);",
        "const [showFollowupModal, setShowFollowupModal] = useState(null);\n  const [showStatusModal, setShowStatusModal] = useState(null);"
    )

# 2. Remove Checkbox TH
th_checkbox_pattern = r'<\s*th\s+style={{ padding: \'12px 10px\', width: \'35px\' }}\s*>\s*<\s*input\s*type="checkbox"[^>]*>\s*<\s*/th\s*>'
content = re.sub(th_checkbox_pattern, '', content)

# 3. Remove Checkbox TD
td_checkbox_pattern = r'<\s*td\s+style={{ padding: \'12px 10px\' }}\s*>\s*<\s*input\s*type="checkbox"[^>]*>\s*<\s*/td\s*>'
content = re.sub(td_checkbox_pattern, '', content)

# 4. Extract Lead ID TH and remove it
th_leadid_pattern = r'(<\s*th\s+style={{ padding: \'12px 10px\', whiteSpace: \'nowrap\' }}\s*>\s*Lead ID\s*<i[^>]*><\/i>\s*<\/th>)'
lead_id_th_match = re.search(th_leadid_pattern, content)
if lead_id_th_match:
    lead_id_th = lead_id_th_match.group(1)
    content = content.replace(lead_id_th, '')
    # Insert before Action (Action might not have a TH, wait, let's check THs)

# Wait, what are the THs? Let's do it manually if possible, or just insert at the end of the tr
# Let's insert Lead ID TH before the end of the thead tr (wait, there's no Action TH in JSX? Let's check)

with open('update_leads_tmp.py', 'w') as f:
    f.write("Done")
