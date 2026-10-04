import urllib.request
import re
import os

url = 'https://certifiedproperties.in/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response:
    html = response.read().decode('utf-8')

# Extract head
head_match = re.search(r'<head>(.*?)</head>', html, re.DOTALL | re.IGNORECASE)
head_content = head_match.group(1) if head_match else ''
head_content = head_content.replace('"/static/', '"https://certifiedproperties.in/static/')
head_content = head_content.replace("'\/static/", "'https://certifiedproperties.in/static/")
head_content = head_content.replace('"/media/', '"https://certifiedproperties.in/media/')

# We need to build the React index.html
react_index_html = f"""<!DOCTYPE html>
<html lang="en">
  <head>
    {head_content}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
"""

# Extract body
body_match = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL | re.IGNORECASE)
body_content = body_match.group(1) if body_match else ''

# Replace asset paths in body
body_content = body_content.replace('"/static/', '"https://certifiedproperties.in/static/')
body_content = body_content.replace("'\/static/", "'https://certifiedproperties.in/static/")
body_content = body_content.replace('"/media/', '"https://certifiedproperties.in/media/')

# Apply logo changes!
# The original logos are /static/website/img/logos/logo1.jpeg and logo-3.png
body_content = re.sub(
    r'<img src="https://certifiedproperties.in/static/website/img/logos/logo1.jpeg".*?>',
    '<img src="/logo.png" style="height: 85px; width: auto; object-fit: contain;" alt="Sai Reality Logo">',
    body_content,
    flags=re.IGNORECASE
)
body_content = re.sub(
    r'<img src="https://certifiedproperties.in/static/website/img/logos/logo-3.png".*?>',
    '<img src="/logo.png" style="height: 70px; width: auto; object-fit: contain;" alt="Sai Reality Logo">',
    body_content,
    flags=re.IGNORECASE
)

# Extract scripts from body
scripts = re.findall(r'<script.*?>.*?</script>', body_content, re.DOTALL | re.IGNORECASE)

# Remove scripts from body_content so they don't execute or cause issues in innerHTML
for script in scripts:
    body_content = body_content.replace(script, '')

# We will write the scripts to a separate JS file or load them dynamically
# Actually, if we put them in index.html, they might run before React mounts Home.
# Let's put them in index.html, but wrapped in a function that Home.jsx can call!
scripts_combined = "\n".join(scripts)
react_index_html = react_index_html.replace('</body>', f"""
    <div id="vanilla-scripts" style="display:none;">
    {scripts_combined}
    </div>
    <script>
      window.initVanillaScripts = function() {{
         // We must execute these scripts. Since innerHTML scripts don't run, 
         // we clone them and append to body.
         const container = document.getElementById('vanilla-scripts');
         const scriptTags = container.querySelectorAll('script');
         
         const loadScript = (index) => {{
             if(index >= scriptTags.length) return;
             const oldScript = scriptTags[index];
             const newScript = document.createElement('script');
             if (oldScript.src) {{
                 newScript.src = oldScript.src;
                 newScript.onload = () => loadScript(index + 1);
                 newScript.onerror = () => loadScript(index + 1);
                 document.body.appendChild(newScript);
             }} else {{
                 newScript.textContent = oldScript.textContent;
                 document.body.appendChild(newScript);
                 loadScript(index + 1);
             }}
         }};
         
         if(!window.scriptsInitialized) {{
             window.scriptsInitialized = true;
             loadScript(0);
         }}
      }};
    </script>
</body>
""")

with open('frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(react_index_html)

# Create Home.jsx using dangerouslySetInnerHTML
# Escape backticks and $ for template literal
safe_body_content = body_content.replace('`', '\\`').replace('$', '\\$')

# Hook up the login button to React Router
# The login link in original is probably href="/login/" or similar
# Let's just use React's onClick delegation for any a tag with "Login"
home_jsx = f"""import React, {{ useEffect, useRef }} from 'react';
import {{ useNavigate }} from 'react-router-dom';
import styles from './Home.module.css';

function Home() {{
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {{
    // Trigger external scripts
    if (window.initVanillaScripts) {{
        window.initVanillaScripts();
    }}

    // Intercept login links
    const handleLinkClick = (e) => {{
        const target = e.target.closest('a');
        if (target) {{
            const text = target.innerText.toLowerCase();
            const href = target.getAttribute('href');
            if (text.includes('login') || (href && href.includes('login'))) {{
                e.preventDefault();
                sessionStorage.removeItem('cp_logged_in');
                sessionStorage.removeItem('cp_user');
                navigate('/login');
            }}
        }}
    }};
    
    const container = containerRef.current;
    if (container) {{
        container.addEventListener('click', handleLinkClick);
    }}
    
    return () => {{
        if (container) {{
            container.removeEventListener('click', handleLinkClick);
        }}
    }};
  }}, [navigate]);

  return (
    <div 
        ref={{containerRef}} 
        dangerouslySetInnerHTML={{{{ __html: `{safe_body_content}` }}}} 
    />
  );
}}

export default Home;
"""

with open('frontend/src/pages/Home.jsx', 'w', encoding='utf-8') as f:
    f.write(home_jsx)

print("Extraction and setup complete!")
