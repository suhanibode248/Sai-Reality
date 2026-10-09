with open(r'c:\Suhani\Suhani Projects\Sai reality new\frontend\src\pages\DashboardAttendance.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# Find any backslash
matches = re.finditer(r'\\', text)
for m in matches:
    start = max(0, m.start() - 20)
    end = min(len(text), m.end() + 20)
    print("Found backslash context:", text[start:end])
