import requests

url = "https://d3h330vgpwpjr8.cloudfront.net/x/property/PS-29072611/images/public/listings/images/42a7aed3-ff7a-4014-a9c1-e4a5973a4220/340x252/f71c64d3-6905-486f-815e-1006d2101403.webp"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}
try:
    res = requests.get(url, headers=headers, timeout=10)
    print("Status:", res.status_code)
    print("Content length:", len(res.content))
except Exception as e:
    print("Error:", e)
