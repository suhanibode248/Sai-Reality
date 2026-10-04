import os
import re

public_dir = 'frontend/public'
html_files = [os.path.join(public_dir, f) for f in os.listdir(public_dir) if f.endswith('.html')]

# Remove the <div id="ph-icon">...</div> and <div id="wp-icon">...</div> blocks
pattern_ph = r'<div class="conatiner my-4 mx-4" id="ph-icon">.*?</div>'
pattern_wp = r'<div class="conatiner my-4 mx-4" id="wp-icon">.*?</div>'

count_fixed = 0

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    new_content = re.sub(pattern_ph, '', content, flags=re.DOTALL)
    new_content = re.sub(pattern_wp, '', new_content, flags=re.DOTALL)
    
    if new_content != content:
        count_fixed += 1
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

print(f"Removed old floating icons from {count_fixed} HTML files.")
