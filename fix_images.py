import os, re, json, requests
from bs4 import BeautifulSoup
from pathlib import Path

def download_images_and_fix_links():
    save_dir = Path(r"C:\Users\suhan\OneDrive\Desktop\Sai reality\frontend\public\media\properties\dubai")
    save_dir.mkdir(parents=True, exist_ok=True)
    
    with open(r"C:\Users\suhan\.gemini\antigravity\brain\e1f759aa-36ae-4c3a-af58-c4820f7f5499\.system_generated\steps\1346\content.md", "r", encoding="utf-8") as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, 'html.parser')
    
    properties = []
    price_elements = soup.find_all(string=lambda t: t and 'AED' in t)
    for p_el in price_elements:
        parent = p_el.parent
        for _ in range(5):
            if parent.name == 'a' or (parent.has_attr('class') and any('card' in c for c in parent.get('class', []))):
                break
            if parent.parent:
                parent = parent.parent
        if parent not in properties:
            properties.append(parent)
            
    print(f"Downloading images for {min(len(properties), 20)} properties...")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
    }
    
    for i, card in enumerate(properties[:20]):
        img = card.find('img')
        img_src = img.get('src') or img.get('data-src') if img else ""
        
        if img_src:
            if not img_src.startswith('http'):
                if img_src.startswith('//'):
                    img_src = 'https:' + img_src
            
            try:
                res = requests.get(img_src, headers=headers, timeout=10)
                if res.status_code == 200:
                    ext = 'webp' if 'webp' in img_src else 'jpg'
                    filename = f"dubai_prop_{i}.{ext}"
                    filepath = os.path.join(save_dir, filename)
                    with open(filepath, 'wb') as f:
                        f.write(res.content)
                    print(f"Downloaded {filename}")
            except Exception as e:
                print(f"Failed to download image {i}: {e}")

    # Now let's fix the href="#" to be a generic placeholder or detail page
    dubai_html_path = Path(r"C:\Users\suhan\OneDrive\Desktop\Sai reality\frontend\public\properties_dubai.html")
    with open(dubai_html_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Replace href="#" with href="/properties_dubai.html" for now so it doesn't just jump to the top
    # Or even better, just remove the href so it doesn't jump, or link to contact.html
    new_content = content.replace('href="#"', 'href="/contact.html"')
    
    with open(dubai_html_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print("Fixed links.")

if __name__ == "__main__":
    download_images_and_fix_links()
