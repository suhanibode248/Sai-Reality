import urllib.request
import urllib.parse
import re
import os
import time

base_url = 'https://certifiedproperties.in'
visited = set()
queue = ['/']
MAX_PAGES = 5000

def url_to_filename(path):
    if path == '/' or path == '':
        return 'home_clone.html'
    # Strip query parameters for the filename
    path = path.split('?')[0].split('#')[0]
    path = path.strip('/')
    path = urllib.parse.unquote(path)
    # Replace weird characters with underscores
    path = re.sub(r'[^a-zA-Z0-9]+', '_', path)
    return path.lower() + '.html'

def process_html(html):
    # Hotlink assets FIRST so they don't get matching in the href regex
    html = html.replace('"/static/', '"https://certifiedproperties.in/static/')
    html = html.replace("'\/static/", "'https://certifiedproperties.in/static/")
    html = html.replace('"/media/', '"https://certifiedproperties.in/media/')
    
    # Apply email change
    html = html.replace('support@certifiedproperties.in', 'support@saireality.in')
    
    # Apply logo changes
    html = re.sub(
        r'<img[^>]*src=[\'"][^\'"]*logo1\.jpeg[\'"][^>]*>',
        '<img src="/logo.png" style="height: 85px; width: auto; object-fit: contain;" alt="Sai Reality Logo">',
        html,
        flags=re.IGNORECASE | re.DOTALL
    )
    html = re.sub(
        r'<img[^>]*src=[\'"][^\'"]*logo-3\.png[\'"][^>]*>',
        '<img src="/logo.png" style="height: 70px; width: auto; object-fit: contain;" alt="Sai Reality Logo">',
        html,
        flags=re.IGNORECASE | re.DOTALL
    )
    
    # Inject login script safely before </body>
    login_script = """
<script>
document.addEventListener('click', function(e) {
    const target = e.target.closest('a');
    if (target) {
        const text = target.innerText.toLowerCase();
        const href = target.getAttribute('href');
        if (text.includes('login') || (href && href.includes('login'))) {
            e.preventDefault();
            window.parent.postMessage('go_to_login', '*');
        }
    }
});
</script>
</body>
"""
    if '</body>' in html:
        html = html.replace('</body>', login_script)
    else:
        html += login_script
        
    return html

def rewrite_links(html):
    internal_links = set()
    
    def replacer(match):
        href = match.group(1)
        # Exclude assets that might have slipped through
        if href.startswith('/static/') or href.startswith('/media/') or href.startswith('/admin/'):
            return f'href="{href}"'
            
        base_href = href.split('?')[0].split('#')[0]
        if base_href not in visited and base_href not in queue:
            # Don't queue raw files
            if not base_href.lower().endswith(('.pdf', '.jpg', '.png', '.jpeg', '.mp4', '.zip')):
                internal_links.add(base_href)
                
        # Rewrite to local HTML file
        filename = url_to_filename(href)
        return f'href="/{filename}"'

    html = re.sub(r'href=[\'\"](/[^\'\"]*)[\'\"]', replacer, html)
    return html, internal_links

public_dir = 'frontend/public'
os.makedirs(public_dir, exist_ok=True)

while queue:
    if len(visited) >= MAX_PAGES:
        print(f"Reached maximum page limit of {MAX_PAGES}. Stopping crawl.")
        break
        
    current_path = queue.pop(0)
    if current_path in visited:
        continue
        
    visited.add(current_path)
    
    # Safely encode the URL for fetching
    safe_path = urllib.parse.quote(current_path, safe='/?&=')
    url = base_url + safe_path
    print(f"[{len(visited)}/{MAX_PAGES}] Crawling: {current_path}")
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            if not response.headers.get_content_type().startswith('text/html'):
                continue
            html = response.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Failed to fetch {url}: {e}")
        continue
        
    html = process_html(html)
    html, new_links = rewrite_links(html)
    
    for link in new_links:
        if link not in visited and link not in queue:
            queue.append(link)
            
    # Save the file
    filename = url_to_filename(current_path)
    out_path = os.path.join(public_dir, filename)
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
        
    time.sleep(0.3)

print(f"Spider finished! Successfully downloaded and patched {len(visited)} pages.")
