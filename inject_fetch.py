import re

jsx_file = r'frontend\src\pages\LeadsDashboard.jsx'
with open(jsx_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the static initial state with an empty array and add useEffect to fetch page 1
# Actually, let's fetch a few pages or just page 1 for now to test.
pattern_state = r'(const \[leads,\s*setLeads\]\s*=\s*useState\(\[)(.*?)(\]\);)'

def repl_state(m):
    return "const [leads, setLeads] = useState([]);\n  const [isLoading, setIsLoading] = useState(false);\n  useEffect(() => {\n    setIsLoading(true);\n    fetch('http://localhost:8000/api/bridge/leads?page=1')\n      .then(res => res.json())\n      .then(data => {\n        if(data.status === 'success') setLeads(data.data);\n        setIsLoading(false);\n      });\n  }, []);"

content = re.sub(pattern_state, repl_state, content, flags=re.DOTALL)

# Now, we need to find where showLeadDetailModal is used and add the on-demand fetch.
# The user clicks the lead ID: onClick={() => setShowLeadDetailModal(lead)}
# Let's change that to fetch details first.
pattern_click = r'onClick={\(\) => setShowLeadDetailModal\(lead\)}'
repl_click = r'''onClick={() => {
                          setShowLeadDetailModal({...lead, loadingDetails: true});
                          fetch(`http://localhost:8000/api/bridge/leads/${lead.id}`)
                            .then(res => res.json())
                            .then(data => {
                                if(data.status === 'success') {
                                    setShowLeadDetailModal({...lead, customerDetails: data.data.customerDetails, activities: data.data.activities, loadingDetails: false});
                                    // Also update the main leads array so we cache it
                                    setLeads(prev => prev.map(l => l.id === lead.id ? {...l, customerDetails: data.data.customerDetails, activities: data.data.activities} : l));
                                }
                            });
                      }}'''
content = content.replace(pattern_click, repl_click)

# Also in the full screen modal, we should show a loading state if loadingDetails is true
pattern_modal_content = r'(<h4 style={{ margin: \'0 0 20px 0\', fontSize: \'16px\', color: \'#1e293b\' }}>About Customer</h4>)'
repl_modal_content = r'''{showLeadDetailModal.loadingDetails && <div style={{padding: '20px', textAlign: 'center', color: '#64748b'}}>Loading full details from live server...</div>}
                {!showLeadDetailModal.loadingDetails && (
                  <>
                    \1'''
content = content.replace(pattern_modal_content, repl_modal_content)

# Close the fragment before the modal closes
pattern_modal_close = r'(</div>\s*</div>\s*</div>\s*</div>\s*)}'
repl_modal_close = r'</>\n                )\n              }\n            \1}'
content = content.replace(pattern_modal_close, repl_modal_close)

with open(jsx_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated LeadsDashboard.jsx for bridge integration")
