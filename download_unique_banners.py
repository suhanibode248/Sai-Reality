import requests
import json
import os
from bs4 import BeautifulSoup
import time

def fetch_image_pexels(query, filename):
    url = f"https://www.pexels.com/search/{query.replace(' ', '%20')}/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
    }
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            # Pexels usually has script tags with initial state containing image URLs
            # Let's just find the first high res image link in the HTML
            img_tags = soup.find_all('img')
            for img in img_tags:
                src = img.get('src')
                if src and 'images.pexels.com/photos/' in src:
                    # Remove query params to get higher res, or replace auto with something big
                    # e.g., ?auto=compress&cs=tinysrgb&w=800
                    high_res_url = src.split('?')[0] + "?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
                    
                    img_data = requests.get(high_res_url, headers=headers).content
                    save_path = os.path.join(r"C:\Users\suhan\OneDrive\Desktop\Sai reality\frontend\public\media\dashboard\images\gallery", filename)
                    with open(save_path, 'wb') as f:
                        f.write(img_data)
                    print(f"Downloaded {filename} for query '{query}'")
                    return True
        print(f"Failed to find image for {query}")
        return False
    except Exception as e:
        print(f"Error for {query}: {e}")
        return False

if __name__ == "__main__":
    queries = {
        "luxury modern architecture building": "banner_projects.png",
        "luxury modern apartment living room": "banner_properties.png",
        "green land plot aerial nature": "banner_plots.png",
        "dubai skyline burj khalifa": "banner_dubai.png",
        "real estate agent handshake": "banner_services.png",
        "modern office business team": "banner_about.png",
        "customer service headset call center": "banner_contact.png",
        "happy diverse employees working": "banner_career.png",
        "giving house keys hands close up": "banner_submit.png"
    }
    
    for query, filename in queries.items():
        fetch_image_pexels(query, filename)
        time.sleep(2)  # be nice
