import requests
from bs4 import BeautifulSoup
import json
import os
import re

url = "https://providentestate.com/buy/properties-for-sale/"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
}

try:
    with open("page_dump.txt", "r", encoding="utf-8") as f:
        html_content = f.read()
    
    # Try to extract the page data JSON
    match = re.search(r'window\.pageData\s*=\s*({.*?});', html_content)
    if match:
        data_str = match.group(1)
        data = json.loads(data_str)
        # We need to find the properties array within data
        # Often it's in data['result']['data'] or similar
        print(list(data.keys()))
        
        with open("page_data.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
            
        print("Wrote page_data.json")
    
except Exception as e:
    print(f"Error: {e}")
