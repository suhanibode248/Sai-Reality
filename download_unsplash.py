import requests
import os

def download_images():
    urls = {
        "banner_projects.png": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80",
        "banner_properties.png": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80",
        "banner_plots.png": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80",
        "banner_dubai.png": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80",
        "banner_services.png": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80",
        "banner_about.png": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80",
        "banner_contact.png": "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1920&q=80",
        "banner_career.png": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80",
        "banner_submit.png": "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=1920&q=80"
    }
    
    save_dir = r"C:\Users\suhan\OneDrive\Desktop\Sai reality\frontend\public\media\dashboard\images\gallery"
    
    for filename, url in urls.items():
        try:
            print(f"Downloading {filename}...")
            res = requests.get(url, timeout=15)
            if res.status_code == 200:
                with open(os.path.join(save_dir, filename), 'wb') as f:
                    f.write(res.content)
                print(f"Success: {filename}")
            else:
                print(f"Failed {filename}: HTTP {res.status_code}")
        except Exception as e:
            print(f"Error {filename}: {e}")

if __name__ == "__main__":
    download_images()
