import os
from pathlib import Path

def inject_modern_theme():
    directory = Path(r"C:\Users\suhan\OneDrive\Desktop\Sai reality\frontend\public")
    css_link = '    <link rel="stylesheet" type="text/css" href="/css/modern_theme.css">\n'
    
    html_files = list(directory.rglob("*.html"))
    count = 0
    
    for filepath in html_files:
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            if 'modern_theme.css' not in content:
                # Find closing </head> and inject before it
                idx = content.find('</head>')
                if idx != -1:
                    new_content = content[:idx] + css_link + content[idx:]
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    count += 1
        except Exception as e:
            print(f"Error processing {filepath}: {e}")
            
    print(f"Successfully injected modern_theme.css into {count} files.")

if __name__ == "__main__":
    inject_modern_theme()
