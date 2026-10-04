import os

file_path = 'frontend/public/home_clone.html'
if os.path.exists(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    html = html.replace('href="/"', 'href="/home_clone.html"')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print('Fixed home links!')
