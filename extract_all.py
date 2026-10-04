import urllib.request
import re
import os
import time

pages = {
    'https://certifiedproperties.in/': 'home_clone.html',
    'https://certifiedproperties.in/services': 'services.html',
    'https://certifiedproperties.in/about-us': 'about.html',
    'https://certifiedproperties.in/contact-us': 'contact.html',
    'https://certifiedproperties.in/properties/Plots/': 'properties_plots.html',
    'https://certifiedproperties.in/properties/Residentials/': 'properties_residentials.html',
    'https://certifiedproperties.in/properties/Commercials/': 'properties_commercials.html',
    'https://certifiedproperties.in/career': 'career.html'
}

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

for url, filename in pages.items():
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
    except Exception as e:
        print(f"Failed to fetch {url}: {e}")
        continue
    
    # Hotlinking
    html = html.replace('"/static/', '"https://certifiedproperties.in/static/')
    html = html.replace("'\/static/", "'https://certifiedproperties.in/static/")
    html = html.replace('"/media/', '"https://certifiedproperties.in/media/')
    
    # Emails
    html = html.replace('support@certifiedproperties.in', 'support@saireality.in')
    
    # Logos
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
    
    # Fix Navigation Links
    # Note: Replace exactly to avoid matching partials.
    html = html.replace('href="/"', 'href="/home_clone.html"')
    html = html.replace('href="/services"', 'href="/services.html"')
    html = html.replace('href="/about-us"', 'href="/about.html"')
    html = html.replace('href="/contact-us"', 'href="/contact.html"')
    html = html.replace('href="/properties/Plots/"', 'href="/properties_plots.html"')
    html = html.replace('href="/properties/Residentials/"', 'href="/properties_residentials.html"')
    html = html.replace('href="/properties/Commercials/"', 'href="/properties_commercials.html"')
    html = html.replace('href="/career"', 'href="/career.html"')
    
    # Inject Login script
    html = html.replace('</body>', login_script)
    
    out_path = os.path.join('frontend/public', filename)
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Successfully processed and saved {filename}")
    
    time.sleep(1) # Be nice to the server

print("All secondary pages extracted successfully!")
