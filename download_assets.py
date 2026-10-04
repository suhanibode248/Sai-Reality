import os
import re
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor

public_dir = 'frontend/public'
html_files = [os.path.join(public_dir, f) for f in os.listdir(public_dir) if f.endswith('.html')]

# Regex to find all hotlinked static and media assets
pattern = r'https://certifiedproperties\.in/(static|media)/([a-zA-Z0-9_/\.\-%\?&=]+)'

assets_to_download = set()

print("Scanning HTML files for assets...")
for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    matches = re.finditer(pattern, content)
    for match in matches:
        full_url = match.group(0)
        folder = match.group(1) # 'static' or 'media'
        path_part = match.group(2)
        assets_to_download.add((full_url, folder, path_part))

print(f"Found {len(assets_to_download)} unique assets to download.")

def download_asset(asset_tuple):
    full_url, folder, path_part = asset_tuple
    
    # Strip query params for file saving
    path_no_query = path_part.split('?')[0]
    decoded_path = urllib.parse.unquote(path_no_query)
    
    # Local path: frontend/public/media/images/1.jpg
    # Convert forward slashes to os specific separators
    normalized_path = os.path.normpath(decoded_path)
    local_disk_path = os.path.join(public_dir, folder, normalized_path)
    
    os.makedirs(os.path.dirname(local_disk_path), exist_ok=True)
    
    if os.path.exists(local_disk_path):
        return # Already downloaded
        
    try:
        req = urllib.request.Request(full_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as response:
            with open(local_disk_path, 'wb') as f:
                f.write(response.read())
        print(f"Downloaded: {decoded_path}")
    except Exception as e:
        print(f"Failed to download {full_url}: {e}")

# Download in parallel
print("Downloading assets (this may take a while)...")
with ThreadPoolExecutor(max_workers=10) as executor:
    executor.map(download_asset, assets_to_download)

print("Patching HTML files to use local assets...")
for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    def replacer(match):
        folder = match.group(1)
        path_part = match.group(2)
        return f'/{folder}/{path_part}'
        
    new_content = re.sub(pattern, replacer, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

print("All assets downloaded and HTML files patched successfully!")
