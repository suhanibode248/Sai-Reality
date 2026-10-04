import json
from bs4 import BeautifulSoup

def extract_properties():
    with open(r"C:\Users\suhan\.gemini\antigravity\brain\e1f759aa-36ae-4c3a-af58-c4820f7f5499\.system_generated\steps\1346\content.md", "r", encoding="utf-8") as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Let's find all anchor tags that look like property links or divs
    # Or just look for elements that might contain prices, e.g. text containing "AED"
    
    properties = []
    
    # Often there's a specific class for property cards
    cards = soup.find_all('div', class_=lambda c: c and 'property' in c.lower() and 'card' in c.lower())
    if not cards:
        # fallback to finding by AED price
        price_elements = soup.find_all(text=lambda t: t and 'AED' in t)
        for p_el in price_elements:
            parent = p_el.parent
            for _ in range(5):
                if parent.name == 'a' or (parent.has_attr('class') and any('card' in c for c in parent.get('class', []))):
                    break
                if parent.parent:
                    parent = parent.parent
            if parent not in properties:
                properties.append(parent)
        cards = properties

    print(f"Found {len(cards)} possible cards.")
    
    for i, card in enumerate(cards[:5]):
        print(f"\n--- Card {i+1} ---")
        title = card.find(['h2', 'h3', 'h4'])
        title_text = title.text.strip() if title else "No Title"
        
        img = card.find('img')
        img_src = img.get('src') or img.get('data-src') if img else "No Image"
        
        print("Text:", card.text.strip()[:200])
        print("Image:", img_src)

if __name__ == "__main__":
    extract_properties()
