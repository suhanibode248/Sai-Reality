import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract body contents
body_match = re.search(r'<body>(.*?)<button id="backToTop"', html, re.DOTALL)
if not body_match:
    print("Could not find body")
    exit(1)

content = body_match.group(1)

# Basic HTML to JSX conversions
content = content.replace('class="', 'className="')
content = content.replace('for="', 'htmlFor="')
content = content.replace('tabindex="', 'tabIndex="')
content = content.replace('autocomplete="', 'autoComplete="')
content = content.replace('maxlength="', 'maxLength="')
content = content.replace('onmouseover="', 'onMouseOver="')
content = content.replace('onmouseout="', 'onMouseOut="')

# Close self-closing tags
content = re.sub(r'(<img[^>]*?)(?<!/)>', r'\1 />', content)
content = re.sub(r'(<input[^>]*?)(?<!/)>', r'\1 />', content)
content = re.sub(r'(<hr[^>]*?)(?<!/)>', r'\1 />', content)
content = re.sub(r'(<br[^>]*?)(?<!/)>', r'\1 />', content)
content = re.sub(r'(<source[^>]*?)(?<!/)>', r'\1 />', content)

# Convert styles: style="height: 85px;" -> style={{height: '85px'}}
def style_replacer(match):
    style_str = match.group(1)
    # just handle simple ones like "height: 85px;"
    # better yet, since we only have a few, we can manually replace known ones
    return match.group(0) # we will do it manually

# content = re.sub(r'style="([^"]+)"', style_replacer, content)
content = content.replace('style="height: 85px;"', 'style={{ height: "85px" }}')
content = content.replace('style="height: 70px;"', 'style={{ height: "70px" }}')
content = content.replace('style="background-image: url(images/hero-bg.jpg);"', 'style={{ backgroundImage: "url(images/hero-bg.jpg)" }}')
content = content.replace('style="background-color: #f7f9fb;"', 'style={{ backgroundColor: "#f7f9fb" }}')

# Fix inline JS in marquee
content = content.replace('onMouseOver="this.stop();"', 'onMouseOver={(e) => e.target.stop()}')
content = content.replace('onMouseOut="this.start();"', 'onMouseOut={(e) => e.target.start()}')

# Fix comments
content = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', content)

jsx_template = f"""import React, {{ useEffect }} from 'react';
import {{ useNavigate }} from 'react-router-dom';

function Home() {{
  const navigate = useNavigate();

  useEffect(() => {{
    // Dispatch an event to let main.js know to initialize components
    window.dispatchEvent(new Event('load'));
    
    // Setup logout override for React Router
    const logoutBtns = document.querySelectorAll('.logout-btn');
    const handleLogout = (e) => {{
        e.preventDefault();
        sessionStorage.removeItem('cp_logged_in');
        sessionStorage.removeItem('cp_user');
        navigate('/login');
    }};
    logoutBtns.forEach(btn => btn.addEventListener('click', handleLogout));
    
    return () => {{
        logoutBtns.forEach(btn => btn.removeEventListener('click', handleLogout));
    }};
  }}, [navigate]);

  return (
    <div className="home-wrapper">
      {content}
    </div>
  );
}}

export default Home;
"""

with open('frontend/src/pages/Home.jsx', 'w', encoding='utf-8') as f:
    f.write(jsx_template)

print("Converted to Home.jsx")
