import os
import re

file_path = 'frontend/public/home_clone.html'
if os.path.exists(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Replace logo1.jpeg (top logo)
    html = re.sub(
        r'<img[^>]*src=[\'"][^\'"]*logo1\.jpeg[\'"][^>]*>',
        '<img src="/logo.png" style="height: 85px; width: auto; object-fit: contain;" alt="Sai Reality Logo">',
        html,
        flags=re.IGNORECASE | re.DOTALL
    )
    
    # Replace logo-3.png (navbar logo)
    html = re.sub(
        r'<img[^>]*src=[\'"][^\'"]*logo-3\.png[\'"][^>]*>',
        '<img src="/logo.png" style="height: 70px; width: auto; object-fit: contain;" alt="Sai Reality Logo">',
        html,
        flags=re.IGNORECASE | re.DOTALL
    )
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print('Logos fixed!')
