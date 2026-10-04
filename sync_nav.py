import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    idx_content = f.read()

topbar_match = re.search(r'<!-- TOP BAR -->.*?<!-- NAVBAR -->', idx_content, re.DOTALL)
navbar_match = re.search(r'<!-- NAVBAR -->.*?</nav>', idx_content, re.DOTALL)

if topbar_match and navbar_match:
    topbar = topbar_match.group(0)
    navbar = navbar_match.group(0)
    
    files = ['properties.html', 'about.html', 'services.html', 'contact.html']
    for file in files:
        if not os.path.exists(file): continue
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace topbar
        content = re.sub(r'<!-- TOP BAR -->.*?<!-- NAVBAR -->', topbar, content, flags=re.DOTALL)
        # Replace navbar
        content = re.sub(r'<!-- NAVBAR -->.*?</nav>', navbar, content, flags=re.DOTALL)
        
        # In footer, replace 'Certified Properties' with logo if needed
        content = re.sub(r'Certified <span>Properties</span>', '<img src="images/logo.png" alt="Sai Reality Logo" style="height: 70px;">', content)
        content = re.sub(r'"Means certified properties"', '', content)
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {file}')
else:
    print('Could not find sections in index.html')
