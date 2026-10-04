import os, re
from pathlib import Path

def add_nav():
    public_dir = Path(r"C:\Users\suhan\OneDrive\Desktop\Sai reality\frontend\public")
    count = 0
    
    # 1. Main Navbar
    pattern1 = re.compile(r'(<li class="nav-item dropdown(?: active)?">\s*<a class="nav-link dropdown-toggle" href="/properties_plots\.html">\s*Plot\s*</a>\s*</li>)', re.IGNORECASE)
    dubai_li = r'\1\n                        <li class="nav-item dropdown active">\n                            <a class="nav-link dropdown-toggle" href="/properties_dubai.html">\n                                Dubai Properties\n                            </a>\n                        </li>'
    
    # 2. Mobile Navbar
    pattern2 = re.compile(r'(<li><a href="/properties_plots\.html">Plot</a></li>)', re.IGNORECASE)
    dubai_mob = r'\1\n                            <li><a href="/properties_dubai.html">Dubai Properties</a></li>'

    # 3. Footer or other menus with "- Plots"
    pattern3 = re.compile(r'(<li><a href="/properties_plots\.html" class="">-\s*Plots\s*</a></li>)', re.IGNORECASE)
    dubai_foot = r'\1\n                    <li><a href="/properties_dubai.html" class="">- Dubai Properties </a></li>'

    for root, dirs, files in os.walk(public_dir):
        for f in files:
            if f.endswith('.html'):
                filepath = os.path.join(root, f)
                with open(filepath, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                orig = content
                
                if "Dubai Properties" not in content:
                    content = pattern1.sub(dubai_li, content)
                    content = pattern2.sub(dubai_mob, content)
                    content = pattern3.sub(dubai_foot, content)
                    
                    if content != orig:
                        with open(filepath, 'w', encoding='utf-8') as file:
                            file.write(content)
                        count += 1
    print(f"Updated {count} HTML files.")

if __name__ == "__main__":
    add_nav()
