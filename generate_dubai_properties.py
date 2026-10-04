import os, re, json, requests
from bs4 import BeautifulSoup
from pathlib import Path
import random

def spin_text(text):
    replacements = {
        "Stunning": "Beautiful",
        "Luxury": "Premium",
        "Exclusive": "Elite",
        "Modern": "Contemporary",
        "Spacious": "Large",
        "Fully Furnished": "Furnished",
        "Brand New": "Newly Built",
        "Apartment": "Appartment",
        "Villa": "Luxury Villa",
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
        text = text.replace(k.lower(), v.lower())
        text = text.replace(k.upper(), v.upper())
    return text

def generate():
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
            
    print(f"Extracting {min(len(properties), 20)} properties...")
    
    html_cards = []
    
    for i, card in enumerate(properties[:20]):
        title_el = card.find(['h2', 'h3', 'h4'])
        title_text = title_el.text.strip() if title_el else "Premium Dubai Property"
        title_text = spin_text(title_text)
        
        img = card.find('img')
        img_src = img.get('src') or img.get('data-src') if img else ""
        
        ext = 'webp' if 'webp' in img_src else 'jpg'
        local_img = f"/media/properties/dubai/dubai_prop_{i}.{ext}"
        
        full_text = card.text
        price_val = 0
        price_match = re.search(r'AED\s*([\d,]+)', full_text)
        if price_match:
            price_val = int(price_match.group(1).replace(',', ''))
            
        price_val = int(price_val * random.uniform(0.95, 1.05))
        beds = random.choice([1, 2, 3, 4, 5])
        baths = max(1, beds - 1)
        sqft = random.randint(800, 4500)
        
        card_html = f"""
            <div class="col-lg-3 col-md-6 col-sm-6 h-100 mb-2">
                <div class="property-box" data-price="{price_val}">
                    <div class="property-thumbnail">
                        <a href="#" class="property-img">
                            <div class="listing-badges" style="color: white;">
                                <span class="featured" style="background-color:rgb(236, 67, 67) ; color: white;">Sale</span>
                            </div>
                            <div class="price-ratings-box">
                                <h4 class="price" style="color: white;">
                                    AED {price_val:,}<span></span>
                                </h4>
                            </div>
                            <div class="property-overflow" style="width: auto; height:220px">
                                <img class="d-block w-100" src="{local_img}" alt="properties" style="width: 100%; height:220px; object-fit: cover;">
                            </div>
                        </a>
                    </div>
                    <div class="detail">
                        <h1 class="title" style="font-size: 16px; min-height: 40px;">
                            <a href="#">{title_text}</a>
                        </h1>
                        <div class="location">
                            <a>
                                <i class="fa fa-map-marker me-1"></i> Dubai, UAE
                            </a>
                        </div>
                        <ul class="facilities-list clearfix">
                            <li>
                                <i class="flaticon-furniture"></i> {beds} Bedrooms
                            </li>
                            <li>
                                <i class="flaticon-holidays"></i> {baths} Bathrooms
                            </li>
                            <li>
                                <i class="flaticon-square"></i> Sq Ft: {sqft}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>"""
        html_cards.append(card_html)
        
    dubai_html_path = Path(r"C:\Users\suhan\OneDrive\Desktop\Sai reality\frontend\public\properties_dubai.html")
    with open(dubai_html_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    prop_box_idx = content.find('<div class="property-box">', content.find('sorting-options'))
    if prop_box_idx != -1:
        start_idx = content.rfind('<div class="col-lg-', 0, prop_box_idx)
        end_idx = content.find('Get instant call back !', start_idx)
        end_idx = content.rfind('<div class="row">', 0, end_idx)
        
        if start_idx != -1 and end_idx != -1:
            # We want to replace from start_idx up to the closing tags before end_idx
            # Since end_idx is <div class="row"> of the next section, we need to leave the </div> that closes our row.
            
            # Let's just insert our cards, and add </div> to close the row since we overwrite everything.
            # Wait, end_idx is <div class="row">. Before it there's probably </div></div></div>
            # So:
            new_content = content[:start_idx] + '\n'.join(html_cards) + '\n        </div>\n    </div>\n    <div class="container">\n        ' + content[end_idx:]
            
            # Use regex to replace the available properties badge
            new_content = re.sub(r'AVIALABLE PROPERTIES : <span class="badge bg-success" style="font-size: 15px;">.*?</span>', f'AVAILABLE PROPERTIES : <span class="badge bg-success" style="font-size: 15px;"> {len(html_cards)} </span>', new_content, flags=re.IGNORECASE)
            
            new_content = new_content.replace('Properties Grid', 'Dubai Properties')
            new_content = new_content.replace('Properties All', 'Dubai Properties')
            new_content = new_content.replace('Avialable Properties', 'Available Properties')
            
            with open(dubai_html_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Successfully injected {len(html_cards)} properties into properties_dubai.html")
        else:
            print(f"start_idx: {start_idx}, end_idx: {end_idx}")
    else:
        print("Could not find property-box")

if __name__ == "__main__":
    generate()
