import os
import re
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor

public_dir = 'frontend/public'
css_files = []
for root, dirs, files in os.walk(os.path.join(public_dir, 'static', 'website', 'css')):
    for file in files:
        if file.endswith('.css'):
            css_files.append(os.path.join(root, file))
            
for root, dirs, files in os.walk(os.path.join(public_dir, 'static', 'website', 'fonts')):
    for file in files:
        if file.endswith('.css'):
            css_files.append(os.path.join(root, file))

print(f"Found {len(css_files)} CSS files.")

assets_to_download = set()

# CSS url() can be url("path"), url('path'), or url(path)
pattern = r'url\([\'"]?(.*?)[\'"]?\)'

for filepath in css_files:
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    matches = re.findall(pattern, content)
    for match in matches:
        # Ignore data URIs
        if match.startswith('data:'):
            continue
            
        # URL is relative to the CSS file
        # e.g. from /static/website/fonts/bootstrap-icons/bootstrap-icons.css
        # match = "./fonts/bootstrap-icons.woff2"
        # We need to construct the absolute URL on certifiedproperties.in
        
        # Determine the CSS file's URL path
        # filepath: frontend/public/static/website/fonts/bootstrap-icons/bootstrap-icons.css
        # css_path: /static/website/fonts/bootstrap-icons/bootstrap-icons.css
        css_path = '/' + filepath.replace('\\', '/').split('frontend/public/')[1]
        
        # Resolve the relative path
        resolved_url = urllib.parse.urljoin(f'https://certifiedproperties.in{css_path}', match)
        
        # We only want to download it if it's on the same domain
        if resolved_url.startswith('https://certifiedproperties.in/'):
            # The local save path
            local_path = resolved_url.replace('https://certifiedproperties.in', public_dir)
            # Remove query string for saving
            local_path = local_path.split('?')[0].split('#')[0]
            # Unquote for safe file path
            local_path = urllib.parse.unquote(local_path)
            
            # Normalize slashes
            local_path = os.path.normpath(local_path)
            
            assets_to_download.add((resolved_url, local_path))

print(f"Found {len(assets_to_download)} CSS assets to download.")

def download_asset(asset_tuple):
    full_url, local_disk_path = asset_tuple
    
    os.makedirs(os.path.dirname(local_disk_path), exist_ok=True)
    
    if os.path.exists(local_disk_path):
        return # Already downloaded
        
    try:
        req = urllib.request.Request(full_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            with open(local_disk_path, 'wb') as f:
                f.write(response.read())
        print(f"Downloaded CSS asset: {full_url}")
    except Exception as e:
        pass # Some might intentionally 404, that's fine.

with ThreadPoolExecutor(max_workers=10) as executor:
    executor.map(download_asset, assets_to_download)

print("CSS Assets finished downloading.")
