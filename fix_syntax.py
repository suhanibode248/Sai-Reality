import re

jsx_file = r'frontend\src\pages\LeadsDashboard.jsx'
with open(jsx_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the broken fetch call
broken_fetch = r'fetch\(http://localhost:8000/api/bridge/leads/\)'
fixed_fetch = r'fetch(`http://localhost:8000/api/bridge/leads/${lead.id}`)'
content = re.sub(broken_fetch, fixed_fetch, content)

# Also fix the weird success string if it's broken
content = content.replace(r"data.status === \'success\'", r"data.status === 'success'")
content = content.replace(r'data.status === \\\'success\\\'', r"data.status === 'success'")
content = content.replace(r"data.status === \'success\\'", r"data.status === 'success'")
content = content.replace(r"data.status === \'success'", r"data.status === 'success'")

with open(jsx_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed backticks!")
