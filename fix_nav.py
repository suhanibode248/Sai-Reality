import os

file_path = 'frontend/public/home_clone.html'
if os.path.exists(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    html = html.replace('href="/services"', 'href="/services.html"')
    html = html.replace('href="/about-us"', 'href="/about.html"')
    html = html.replace('href="/contact-us"', 'href="/contact.html"')
    html = html.replace('href="/properties/Plots/"', 'href="/properties.html?type=plot"')
    html = html.replace('href="/career"', 'href="#"')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print('Nav links fixed!')
