import os
import urllib.request
import re

# 1. Restore frontend/index.html to its pure state
original_index = """<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Certified Properties | Real Estate in Pune</title>
    <meta name="description" content="Certified Properties – Your trusted real estate partner in Pune." />
    <!-- Font Awesome for icons (same as original project) -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
    />
    <!-- Google Fonts -->
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Open+Sans:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
"""
with open('frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(original_index)


# 2. Build home_clone.html
url = 'https://certifiedproperties.in/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response:
    html = response.read().decode('utf-8')

# Hotlink assets
html = html.replace('"/static/', '"https://certifiedproperties.in/static/')
html = html.replace("'\/static/", "'https://certifiedproperties.in/static/")
html = html.replace('"/media/', '"https://certifiedproperties.in/media/')

# Replace logos
html = re.sub(
    r'<img src="https://certifiedproperties.in/static/website/img/logos/logo1.jpeg".*?>',
    '<img src="/logo.png" style="height: 85px; width: auto; object-fit: contain;" alt="Sai Reality Logo">',
    html,
    flags=re.IGNORECASE
)
html = re.sub(
    r'<img src="https://certifiedproperties.in/static/website/img/logos/logo-3.png".*?>',
    '<img src="/logo.png" style="height: 70px; width: auto; object-fit: contain;" alt="Sai Reality Logo">',
    html,
    flags=re.IGNORECASE
)

# Intercept Login clicks
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
html = html.replace('</body>', login_script)

with open('frontend/public/home_clone.html', 'w', encoding='utf-8') as f:
    f.write(html)

# 3. Rewrite Home.jsx to use iframe
home_jsx = """import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Hide overflow on body to prevent double scrollbars
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    const handleMessage = (e) => {
        if (e.data === 'go_to_login') {
            sessionStorage.removeItem('cp_logged_in');
            sessionStorage.removeItem('cp_user');
            navigate('/login');
        }
    };
    window.addEventListener('message', handleMessage);
    
    return () => {
        window.removeEventListener('message', handleMessage);
        document.body.style.overflow = 'auto'; // Restore on unmount
    };
  }, [navigate]);

  return (
    <iframe 
        src="/home_clone.html" 
        style={{ width: '100vw', height: '100vh', border: 'none', margin: 0, padding: 0, display: 'block' }} 
        title="Sai Reality Homepage"
    />
  );
}

export default Home;
"""
with open('frontend/src/pages/Home.jsx', 'w', encoding='utf-8') as f:
    f.write(home_jsx)

print("Fix applied successfully!")
