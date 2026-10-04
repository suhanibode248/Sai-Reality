import os
import re

public_dir = 'frontend/public'
html_files = [os.path.join(public_dir, f) for f in os.listdir(public_dir) if f.endswith('.html')]

# Regex to match <img ... src="/..." ... >
pattern = r'<img([^>]*)src=[\'"](/[^\'"]+)[\'"]([^>]*)>'

count_fixed = 0

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    def replacer(match):
        global count_fixed
        before = match.group(1)
        src = match.group(2)
        after = match.group(3)
        
        path_no_query = src.split('?')[0]
        local_path = os.path.join(public_dir, path_no_query.lstrip('/'))
        
        # If the image was NOT successfully downloaded, replace it with the Sai Reality logo
        if not os.path.exists(local_path):
            count_fixed += 1
            return f'<img{before}src="/logo.png"{after}>'
        
        return match.group(0)

    new_content = re.sub(pattern, replacer, content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

print(f"Fixed {count_fixed} broken images across all pages.")
