import re

file_path = r'frontend\src\pages\LeadsDashboard.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove avatar image and add Created Date under Name
name_cell_pattern = r'(<\s*div\s+style={{ display: \'flex\', alignItems: \'flex-start\', gap: \'8px\', cursor: \'pointer\' }}\s+onClick={\(\) => setShowLeadDetailModal\(lead\)}\s*>)\s*<\s*img[^>]*>\s*(<\s*div\s*>\s*{lead\.name}\s*<\s*/div\s*>)\s*<\s*/div\s*>'

name_cell_replacement = r'''\1
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: '#0284c7', fontSize: '12.5px' }}>{lead.name}</span>
                        <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>Created Date: Oct. 4, 2024, 7:19 a.m.</span>
                      </div>
                    </div>'''
content = re.sub(name_cell_pattern, name_cell_replacement, content, flags=re.DOTALL)

# 2. Remove the Edit button from Action column
edit_btn_pattern = r'<\s*button[^>]*title="Edit Lead Details"[^>]*>.*?<\s*/button\s*>'
content = re.sub(edit_btn_pattern, '', content, flags=re.DOTALL)

# 3. Add "this is ids section for testing purpose" text above the tabs if not there
if "this is ids section for testing purpose" not in content:
    # Find the top area where tabs start
    # Usually around <div style={{ display: 'flex', gap: '2px'... for tabs
    tabs_container_pattern = r'(<\s*div\s+style={{ display: \'flex\', flexWrap: \'wrap\', gap: \'4px\', marginBottom: \'15px\' }}\s*>)'
    content = re.sub(tabs_container_pattern, r'<div style={{ fontSize: "14px", fontWeight: "500", color: "#334155", marginBottom: "10px" }}>this is ids section for testing purpose<br/><span style={{ fontSize: "12px", color: "#64748b" }}>2002 2</span></div>\n\1', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated to match screenshot!")
