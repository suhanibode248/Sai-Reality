import re

jsx_file = r'frontend\src\pages\LeadsDashboard.jsx'
with open(jsx_file, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import React, { useState, useRef } from 'react';", "import React, { useState, useRef, useEffect } from 'react';")

with open(jsx_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed import!")
