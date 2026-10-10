import re

file_path = r'frontend\src\pages\LeadsDashboard.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the th checkbox properly
th_pattern = r'<\s*th\s+style={{ padding: \'12px 10px\', width: \'35px\' }}\s*>.*?<\s*/th\s*>'
content = re.sub(th_pattern, '', content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed checkbox removal")
