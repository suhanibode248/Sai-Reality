import os
import re
from pathlib import Path

def update_inner_banners():
    directory = Path(r"C:\Users\suhan\OneDrive\Desktop\Sai reality\frontend\public")
    
    page_to_image = {
        'projects_all.html': 'banner_projects.png',
        'properties_all.html': 'banner_properties.png',
        'plots.html': 'banner_plots.png',
        'properties_dubai.html': 'banner_properties.png',
        'services.html': 'banner_services.png',
        'about.html': 'banner_about.png',
        'contact.html': 'banner_contact.png',
        'career.html': 'banner_career.png',
        'submit_property.html': 'banner_submit.png'
    }
    
    for html_file, image_name in page_to_image.items():
        filepath = directory / html_file
        if not filepath.exists():
            print(f"Skipping {html_file}, does not exist.")
            continue
            
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Replace existing <div class="sub-banner"> with our inline style one.
            # Use regex to handle if there's already some style or extra spaces
            pattern = re.compile(r'<div\s+class="sub-banner"[^>]*>')
            
            style_string = f"""<div class="sub-banner" style="background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('media/dashboard/images/gallery/{image_name}') !important; background-position: top center !important; background-repeat: no-repeat !important; background-size: cover !important;">"""
            
            new_content = pattern.sub(style_string, content)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
                
            print(f"Updated banner in {html_file} -> {image_name}")
        except Exception as e:
            print(f"Error processing {html_file}: {e}")

if __name__ == "__main__":
    update_inner_banners()
