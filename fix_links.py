import os

files = [
    'frontend/src/pages/Home.jsx',
    'frontend/public/properties.html',
    'frontend/public/about.html',
    'frontend/public/services.html',
    'frontend/public/contact.html'
]

for file in files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace href="index.html" with href="/home"
        content = content.replace('href="index.html"', 'href="/home"')
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {file}')
