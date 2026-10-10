import re

jsx_file = r'frontend\src\pages\LeadsDashboard.jsx'
with open(jsx_file, 'r', encoding='utf-8') as f:
    content = f.read()

bad_str = r'''                      value={lead.assignedTo}
                      onChange={(e) =>
                      <option value="">Select Assigned User</option>'''

good_str = r'''                      value={lead.assignedTo}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLeads(prev => prev.map(item => item.id === lead.id ? { ...item, assignedTo: val } : item));
                      }}
                      style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', color: '#334155', backgroundColor: '#fff', outline: 'none' }}
                    >
                      <option value="">Select Assigned User</option>'''

if bad_str in content:
    content = content.replace(bad_str, good_str)
    with open(jsx_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed table select syntax!")
else:
    print("Could not find bad str!")
