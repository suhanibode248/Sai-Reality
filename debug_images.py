import os, re, json, requests
from bs4 import BeautifulSoup
from pathlib import Path

def debug_images():
    with open(r"C:\Users\suhan\.gemini\antigravity\brain\e1f759aa-36ae-4c3a-af58-c4820f7f5499\.system_generated\steps\1346\content.md", "r", encoding="utf-8") as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, 'html.parser')
    
    properties = []
    price_elements = soup.find_all(string=lambda t: t and 'AED' in t)
    for p_el in price_elements:
        parent = p_el.parent
        for _ in range(5):
            if parent.name == 'a' or (parent.has_attr('class') and any('card' in c for c in parent.get('class', []))):
                break
            if parent.parent:
                parent = parent.parent
        if parent not in properties:
            properties.append(parent)
            
    print(f"Checking images for {min(len(properties), 20)} properties...")
    
    for i, card in enumerate(properties[:20]):
        img = card.find('img')
        img_src = img.get('src') or img.get('data-src') if img else ""
        print(f"Card {i} img_src: {img_src}")

if __name__ == "__main__":
    debug_images()
