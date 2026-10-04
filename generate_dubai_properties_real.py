import os, re, json, requests
from bs4 import BeautifulSoup
from pathlib import Path

def get_real_properties():
    save_dir = Path(r"C:\Users\suhan\OneDrive\Desktop\Sai reality\frontend\public\media\properties\dubai")
    save_dir.mkdir(parents=True, exist_ok=True)
    
    with open("page_data.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        
    hits = data['result']['serverData']['data']['hits']
    
    print(f"Extracting {len(hits)} properties from JSON...")
    
    html_cards = []
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
    }
    
    count = 0
    for i, prop in enumerate(hits[:20]):
        title_text = prop.get('slug', '').replace('-', ' ').title()
        if not title_text:
            title_text = prop.get('building', 'Dubai Property')
            
        price_val = prop.get('price', 0)
        beds = prop.get('bedroom', 1)
        baths = prop.get('bathroom', 1)
        sqft = prop.get('floorarea_max', 0)
        if sqft == 0:
            sqft = prop.get('floorarea_min', 800)
            
        location = prop.get('display_address', 'Dubai, UAE')
            
        images = prop.get('images', [])
        img_src = ""
        if images:
            img_src = images[0].get('464x312') or images[0].get('340x252') or list(images[0].values())[0]
            
        local_img = "/static/images/placeholder.jpg"
        if img_src:
            try:
                res = requests.get(img_src, headers=headers, timeout=10)
                if res.status_code == 200:
                    ext = 'webp' if 'webp' in img_src else 'jpg'
                    filename = f"dubai_real_prop_{i}.{ext}"
                    filepath = os.path.join(save_dir, filename)
                    with open(filepath, 'wb') as f:
                        f.write(res.content)
                    local_img = f"/media/properties/dubai/{filename}"
            except Exception as e:
                print(f"Failed to download image {i}: {e}")
        
        # Link logic - let's create a placeholder for viewing property
        # So they can click it! We will just link to a generic detail page that we can create or /contact.html
        prop_link = "/property_details_dubai.html"
        
        card_html = f"""
            <div class="col-lg-3 col-md-6 col-sm-6 h-100 mb-2">
                <div class="property-box" data-price="{price_val}">
                    <div class="property-thumbnail">
                        <a href="{prop_link}" class="property-img">
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
                            <a href="{prop_link}">{title_text}</a>
                        </h1>
                        <div class="location">
                            <a>
                                <i class="fa fa-map-marker me-1"></i> {location}
                            </a>
                        </div>
                        <ul class="facilities-list clearfix">
                            <li>
                                <i class="flaticon-furniture"></i> {beds} Beds
                            </li>
                            <li>
                                <i class="flaticon-holidays"></i> {baths} Baths
                            </li>
                            <li>
                                <i class="flaticon-square"></i> SqFt: {sqft}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>"""
        html_cards.append(card_html)
        count += 1
        
    dubai_html_path = Path(r"C:\Users\suhan\OneDrive\Desktop\Sai reality\frontend\public\properties_dubai.html")
    with open(dubai_html_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    prop_box_idx = content.find('<div class="property-box"', content.find('sorting-options'))
    if prop_box_idx != -1:
        start_idx = content.rfind('<div class="col-lg-', 0, prop_box_idx)
        end_idx = content.find('Get instant call back !', start_idx)
        end_idx = content.rfind('<div class="row">', 0, end_idx)
        
        if start_idx != -1 and end_idx != -1:
            new_content = content[:start_idx] + '\n'.join(html_cards) + '\n        </div>\n    </div>\n    <div class="container">\n        ' + content[end_idx:]
            new_content = re.sub(r'AVAILABLE PROPERTIES : <span class="badge bg-success" style="font-size: 15px;">.*?</span>', f'AVAILABLE PROPERTIES : <span class="badge bg-success" style="font-size: 15px;"> {count} </span>', new_content, flags=re.IGNORECASE)
            
            with open(dubai_html_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Successfully injected {count} real properties into properties_dubai.html")
        else:
            print(f"start_idx: {start_idx}, end_idx: {end_idx}")
    else:
        print("Could not find property-box")

if __name__ == "__main__":
    get_real_properties()
