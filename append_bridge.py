import os

append_str = '''
# ---------------------------------------------
# LIVE DATA BRIDGE (Proxy for certifiedproperties.in)
# ---------------------------------------------
from scraper import get_scraper

@app.get("/api/bridge/leads")
def get_live_leads(page: int = 1):
    try:
        scraper = get_scraper()
        leads = scraper.get_leads(page=page)
        return {"status": "success", "data": leads}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/bridge/leads/{lead_id}")
def get_live_lead_details(lead_id: str):
    try:
        scraper = get_scraper()
        details = scraper.get_lead_details(lead_id)
        return {"status": "success", "data": details}
    except Exception as e:
        return {"status": "error", "message": str(e)}

'''

with open('backend/main.py', 'a', encoding='utf-8') as f:
    f.write(append_str)

print("Appended Bridge endpoints to main.py")
