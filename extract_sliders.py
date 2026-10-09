with open('website_slider.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Look for slider items or list elements
from bs4 import BeautifulSoup
soup = BeautifulSoup(text, 'html.parser')
cards = soup.find_all('div', class_='card')
print(f"Found {len(cards)} cards")
if len(cards) > 0:
    for c in cards:
        print(c.prettify()[:500])
        print("---")
