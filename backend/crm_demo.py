"""
Local demo CRM: Leads, Properties and notifications backed by JSON files in backend/data/.
Nothing here talks to any external website. Sample data is generated on first use.
"""
import csv
import io
import json
import os
import random
import re
import threading
from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import APIRouter
from fastapi.responses import Response
from pydantic import BaseModel

router = APIRouter()

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
PROPERTY_IMAGE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend", "public", "media", "dashboard", "images", "property")
PAGE_SIZE = 20
_lock = threading.Lock()


def _load(name, seed_fn):
    path = os.path.join(DATA_DIR, f"{name}.json")
    with _lock:
        try:
            with open(path, encoding="utf-8") as f:
                return json.load(f)
        except FileNotFoundError:
            items = seed_fn()
            _save_unlocked(name, items)
            return items


def _save_unlocked(name, items):
    os.makedirs(DATA_DIR, exist_ok=True)
    path = os.path.join(DATA_DIR, f"{name}.json")
    with open(path + ".tmp", "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False)
    os.replace(path + ".tmp", path)


def _save(name, items):
    with _lock:
        _save_unlocked(name, items)


def fmt_date(d: datetime, with_time=True):
    month = d.strftime("%B")
    month = {"January": "Jan.", "February": "Feb.", "August": "Aug.", "September": "Sept.", "October": "Oct.",
             "November": "Nov.", "December": "Dec."}.get(month, month)
    text = f"{month} {d.day}, {d.year}"
    if with_time:
        hour = d.hour % 12 or 12
        text += f", {hour}:{d.minute:02d} {'a.m.' if d.hour < 12 else 'p.m.'}"
    return text


# ──────────────────────────────────────────────
# Leads
# ──────────────────────────────────────────────
STATUSES = {
    # status: (label shown before the date, badge colour)
    "NEW LEAD": ("NewLead", "#299cdb"),
    "NOT CONNECTED": ("NotConnect", "chocolate"),
    "IN PROGRESS": ("InProgress", "maroon"),
    "SV SCHEDULED": ("SV-Scheduled", "darkmagenta"),
    "SV COMPLETED": ("SV-Completed", "green"),
    "EOI COMPLETED": ("EOI-Completed", "teal"),
    "BOOKINGS IN PROGRESS": ("BookingsInProgress", "darkkhaki"),
    "BOOKING COMPLETED": ("BookingCompleted", "sandybrown"),
    "DEAD LEAD": ("DeadLead", "#f06548"),
}
FILTER_STATUS = {  # values used by the Filters / Download forms
    "New Lead": "NEW LEAD", "Not Connected": "NOT CONNECTED", "In Progress": "IN PROGRESS",
    "SV Scheduled": "SV SCHEDULED", "EOI Completed": "EOI COMPLETED", "Bookings In Progress": "BOOKINGS IN PROGRESS",
    "Booking Completed": "BOOKING COMPLETED", "Dead Lead": "DEAD LEAD", "SV Completed": "SV COMPLETED",
}
STAFF = ["poojamourya_5 Pooja Mourya", "aartid_7 Aarti Dodmani", "harshl_9 Harsh Londhe", "rajb_10 Raj Bansode",
         "adeshg_13 Adesh Garkal", "vikrante_14 Vikrant Endal", "prajakta_21 Prajakta Rathod", "snehaz_39 Sneha Zirpe"]
SOURCES = ["Facebook Ads", "Google Ads", "Referance", "Landing Page", "99Acres", "Magicbricks", "Housing",
           "Company Website", "Whatsapp", "just_dial", "Tele Calling", "Youtube", "OLX", "Other"]
LOOKING_FOR = ["Buy New Property", "Property on Rent", "Property on Loan"]
FIRST = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Pooja", "Rohan", "Anjali", "Sagar", "Neha", "Kiran", "Aditya",
         "Shreya", "Nikhil", "Kavya", "Manish", "Ritu", "Suresh", "Divya", "Akash", "Meera", "Tejas", "Swati", "Omkar"]
LAST = ["Sharma", "Patil", "Deshmukh", "Kulkarni", "Joshi", "Pawar", "Shinde", "Jadhav", "More", "Gaikwad",
        "Kale", "Bhosale", "Mehta", "Iyer", "Verma", "Naik"]
NOTES = ["Looking for 2 BHK near Kharadi, budget flexible", "Call back in the evening", "Wants site visit this weekend",
         "Interested in ready possession only", "Broker - not interested", "Asked for brochure on WhatsApp",
         "Needs home loan support", "Budget too low for current projects", "Prefers Wagholi or Lohegaon",
         "Visited site, discussing with family", "Not reachable, try again tomorrow", "Looking for 1 RK on rent"]
TAB_STATUS = {
    "new": ["NEW LEAD"], "followups": ["IN PROGRESS", "NOT CONNECTED"], "siteVisits": ["SV SCHEDULED"],
    "svCompleted": ["SV COMPLETED"], "bookingInprogress": ["BOOKINGS IN PROGRESS"],
    "bookings": ["BOOKING COMPLETED", "EOI COMPLETED"], "dead": ["DEAD LEAD"],
}


def _make_activity(when, staff, status, note):
    return {"title": f"{status.title()} by {staff.split(' ', 1)[1]}", "subtitle": fmt_date(when), "desc": f"Activity Note : {note}"}


def _seed_leads():
    rnd = random.Random(42)
    now = datetime.now().replace(second=0, microsecond=0)
    weights = [30, 10, 12, 14, 6, 3, 4, 3, 8]
    leads = []
    for i in range(240):
        created = now - timedelta(days=rnd.randint(0, 400), hours=rnd.randint(0, 23), minutes=rnd.randint(0, 59))
        status = rnd.choices(list(STATUSES), weights)[0]
        staff = rnd.choice(STAFF)
        next_fu = now + timedelta(days=rnd.randint(-10, 15), hours=rnd.randint(-6, 6))
        note = rnd.choice(NOTES)
        followups = [f"{rnd.choice(STAFF).split(' ')[0]} -> {fmt_date(created + timedelta(days=d))}" for d in sorted(rnd.sample(range(1, 60), rnd.randint(0, 4)))]
        leads.append({
            "id": str(2022000000 + 1000 + i), "pk": str(1000 + i),
            "name": f"{rnd.choice(FIRST)} {rnd.choice(LAST)}",
            "createdDate": fmt_date(created), "createdAt": created.isoformat(),
            "phone": f"9{rnd.randint(100000000, 999999999)}",
            "email": "", "location": rnd.choice(["Kharadi", "Wagholi", "Viman Nagar", "Lohegaon", "Dhanori", "Hadapsar"]),
            "status": status, "statusDate": fmt_date(next_fu), "nextFollowup": next_fu.isoformat(),
            "budget": rnd.choice(["45 L Rs.", "60 L Rs.", "75 L Rs.", "1 Cr Rs.", "1.5 Cr Rs.", "25000 Rs.", "0 Rs."]),
            "intent": rnd.choice(["NEW", "COLD LEAD", "WARM LEAD", "HOT LEAD"]),
            "note": note[:28] + ".." if len(note) > 30 else note, "fullNote": note,
            "lookingFor": rnd.choice(LOOKING_FOR), "source": rnd.choice(SOURCES),
            "assignedTo": staff.split("_")[0], "assignedOptions": [staff.split(" ")[0]] + [s.split(" ")[0] for s in STAFF if s != staff],
            "followups": followups,
            "activities": [_make_activity(created + timedelta(days=k + 1), rnd.choice(STAFF), status, rnd.choice(NOTES)) for k in range(rnd.randint(0, 3))],
        })
    leads.sort(key=lambda l: l["createdAt"], reverse=True)
    return leads


def _decorate(lead):
    label, color = STATUSES.get(lead["status"], ("", "#299cdb"))
    return {**lead, "statusLabel": label, "statusColor": color}


def _leads():
    return _load("leads", _seed_leads)


def _is_pending(lead, now):
    return lead["status"] != "DEAD LEAD" and datetime.fromisoformat(lead["nextFollowup"]) < now


def _tab_filter(tab, leads):
    now = datetime.now()
    if tab in TAB_STATUS:
        return [l for l in leads if l["status"] in TAB_STATUS[tab]]
    if tab == "pending":
        return [l for l in leads if _is_pending(l, now)]
    if tab == "todayPending":
        return [l for l in leads if _is_pending(l, now) and datetime.fromisoformat(l["nextFollowup"]).date() == now.date()]
    if tab == "duplicate":
        seen = {}
        for l in leads:
            seen[l["phone"]] = seen.get(l["phone"], 0) + 1
        return [l for l in leads if seen[l["phone"]] > 1]
    return leads


def _today_followups(leads):
    today = datetime.now().date()
    return [l for l in leads if l["status"] != "DEAD LEAD" and datetime.fromisoformat(l["nextFollowup"]).date() == today]


@router.get("/api/dashboard/leads")
def list_leads(tab: str = "all", page: int = 1):
    leads = _leads()
    counts = {t: len(_tab_filter(t, leads)) for t in
              ["all", "new", "followups", "siteVisits", "svCompleted", "bookingInprogress", "bookings", "pending", "todayPending", "dead", "duplicate"]}
    rows = _tab_filter(tab, leads)
    last_page = max(1, -(-len(rows) // PAGE_SIZE))
    page = min(max(page, 1), last_page)
    today = _today_followups(leads)
    return {
        "status": "success",
        "data": [_decorate(l) for l in rows[(page - 1) * PAGE_SIZE: page * PAGE_SIZE]],
        "counts": counts, "total": len(rows), "lastPage": last_page,
        "followupInfo": f"{today[0]['pk']} {len(today)}" if today else "",
        "bellCount": len(today),
    }


@router.get("/api/dashboard/leads/search")
def search_leads(q: str):
    q = q.strip().lower()
    rows = [l for l in _leads() if q in l["name"].lower() or q in l["phone"] or q in l["id"] or q in l["fullNote"].lower()]
    return {"status": "success", "data": [_decorate(l) for l in rows], "total": len(rows)}


class LeadsFilter(BaseModel):
    status: List[str] = []
    intent: List[str] = []
    lookingFor: List[str] = []
    leadSource: List[str] = []
    dateStatus: str = "allDate"
    fromDate: str = ""
    toDate: str = ""
    contentField: List[str] = []


def _apply_filter(f: LeadsFilter):
    statuses = {FILTER_STATUS.get(s, s.upper()) for s in f.status}
    intents = {i.upper() for i in f.intent}
    looking = {"Property on Loan" if x == "Property on Loan" else x for x in f.lookingFor}
    today = datetime.now().date()
    day = {"today": today, "yesterday": today - timedelta(days=1), "tomorrow": today + timedelta(days=1)}.get(f.dateStatus)
    out = []
    for l in _leads():
        if statuses and l["status"] not in statuses: continue
        if intents and not any(l["intent"].startswith(i) for i in intents): continue
        if looking and l["lookingFor"] not in looking: continue
        if f.leadSource and l["source"] not in f.leadSource: continue
        nf = datetime.fromisoformat(l["nextFollowup"]).date()
        if day and nf != day: continue
        if f.dateStatus == "dateRange":
            if f.fromDate and nf < datetime.fromisoformat(f.fromDate).date(): continue
            if f.toDate and nf > datetime.fromisoformat(f.toDate).date(): continue
        out.append(l)
    return out


@router.post("/api/dashboard/leads/filter")
def filter_leads(f: LeadsFilter):
    rows = _apply_filter(f)
    return {"status": "success", "data": [_decorate(l) for l in rows], "total": len(rows)}


@router.post("/api/dashboard/leads/download")
def download_leads(f: LeadsFilter):
    fields = {"createdDate": "createdDate", "status": "status", "name": "name", "phone": "phone", "intent": "intent",
              "comment": "fullNote", "lookingFor": "lookingFor", "source": "source", "nextFollowupByDateFilter": "statusDate"}
    cols = [c for c in f.contentField if c in fields] or list(fields)
    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(cols)
    for l in _apply_filter(f):
        w.writerow([l[fields[c]] for c in cols])
    return Response(content=buf.getvalue(), media_type="text/csv",
                    headers={"Content-Disposition": 'attachment; filename="leads-data.csv"'})


@router.get("/api/dashboard/leads/{pk}")
def lead_details(pk: str):
    lead = next((l for l in _leads() if l["pk"] == pk or l["id"] == pk), None)
    if not lead:
        return {"status": "error", "message": "Lead not found"}
    return {"status": "success", "data": {
        "customerDetails": lead.get("customerDetails") or {k: "-" for k in ["purpose", "propertyType", "configurationsType", "area", "fundingSource", "employmentType", "facing", "age", "referredBy", "gender", "annualIncome"]},
        "activities": lead.get("activities", []),
    }}


class LeadIn(BaseModel):
    name: str
    phone: str
    alt_phone: str = ""
    email: str = ""
    city: str = ""
    location: str = ""
    budget: str = ""
    lookingFor: str = "Buy New Property"
    source: str = "Other"
    note: str = ""


@router.post("/api/dashboard/leads")
def add_lead(body: LeadIn):
    leads = _leads()
    now = datetime.now().replace(second=0, microsecond=0)
    next_pk = max([int(l["pk"]) for l in leads] + [999]) + 1
    note = body.note or "New lead added"
    lead = {
        "id": str(2022000000 + next_pk), "pk": str(next_pk), "name": body.name, "phone": body.phone,
        "email": body.email, "location": body.location, "createdDate": fmt_date(now), "createdAt": now.isoformat(),
        "status": "NEW LEAD", "statusDate": fmt_date(now), "nextFollowup": now.isoformat(),
        "budget": f"{body.budget} Rs." if body.budget else "0 Rs.", "intent": "NEW",
        "note": note[:28] + ".." if len(note) > 30 else note, "fullNote": note,
        "lookingFor": body.lookingFor, "source": body.source, "assignedTo": "Admin",
        "assignedOptions": [s.split(" ")[0] for s in STAFF], "followups": [], "activities": [],
    }
    leads.insert(0, lead)
    _save("leads", leads)
    return {"status": "success", "data": _decorate(lead)}


class LeadUpdate(BaseModel):
    status: Optional[str] = None
    intent: Optional[str] = None
    lookingFor: Optional[str] = None
    assignedTo: Optional[str] = None
    comment: Optional[str] = None
    nextFollowup: Optional[str] = None
    customerDetails: Optional[dict] = None


@router.put("/api/dashboard/leads/{pk}")
def update_lead(pk: str, body: LeadUpdate):
    leads = _leads()
    lead = next((l for l in leads if l["pk"] == pk or l["id"] == pk), None)
    if not lead:
        return {"status": "error", "message": "Lead not found"}
    now = datetime.now().replace(second=0, microsecond=0)
    if body.status:
        lead["status"] = FILTER_STATUS.get(body.status, body.status.upper())
    if body.intent:
        lead["intent"] = body.intent.upper() if body.intent.upper() == "NEW" else f"{body.intent.upper()} LEAD"
    if body.lookingFor:
        lead["lookingFor"] = body.lookingFor
    if body.assignedTo:
        lead["assignedTo"] = body.assignedTo
        lead["assignedOptions"] = [body.assignedTo] + [o for o in lead.get("assignedOptions", []) if o != body.assignedTo]
    if body.nextFollowup:
        nf = datetime.fromisoformat(body.nextFollowup)
        lead["nextFollowup"] = nf.isoformat()
        lead["statusDate"] = fmt_date(nf)
        lead["followups"] = [f"Admin -> {fmt_date(nf)}"] + lead.get("followups", [])
    if body.comment:
        lead["fullNote"] = body.comment
        lead["note"] = body.comment[:28] + ".." if len(body.comment) > 30 else body.comment
    if body.customerDetails is not None:
        lead["customerDetails"] = body.customerDetails
    if body.status or body.comment:
        lead.setdefault("activities", []).insert(0, {"title": f"{lead['status'].title()} by Admin", "subtitle": fmt_date(now),
                                                     "desc": f"Activity Note : {body.comment or 'Status updated'}"})
    _save("leads", leads)
    return {"status": "success", "data": _decorate(lead)}


@router.delete("/api/dashboard/leads/{pk}")
def delete_lead(pk: str):
    leads = _leads()
    remaining = [l for l in leads if l["pk"] != pk and l["id"] != pk]
    _save("leads", remaining)
    return {"status": "success", "deleted": len(leads) - len(remaining)}


@router.get("/api/dashboard/notifications")
def notifications(period: str = "daily", staff: str = "", fromDate: str = "", toDate: str = ""):
    leads = _leads()
    today = datetime.now().date()
    def in_period(l):
        d = datetime.fromisoformat(l["nextFollowup"]).date()
        if period == "monthly": return d.year == today.year and d.month == today.month
        if period == "selectDate":
            return (not fromDate or d >= datetime.fromisoformat(fromDate).date()) and (not toDate or d <= datetime.fromisoformat(toDate).date())
        return d == today
    rows = [{"Name": l["name"], "Phone": l["phone"], "Nextfollowupdate": l["statusDate"], "Status": l["status"].title(),
             "Source": l["source"], "Comment": l["fullNote"], "Looking_for": l["lookingFor"], "Intent": l["intent"].title()}
            for l in leads if l["status"] != "DEAD LEAD" and in_period(l) and (not staff or staff == "admin@email.com" or l["assignedTo"] in staff)]
    return {"status": "success", "rows": rows,
            "periodOptions": [{"value": "daily", "label": "Daily"}, {"value": "monthly", "label": "Monthly"}, {"value": "selectDate", "label": "Select Date"}],
            "staffOptions": [{"value": "admin@email.com", "label": "admin@email.com"}] + [{"value": s.split("_")[0], "label": s.split(" ", 1)[1]} for s in STAFF]}


# ──────────────────────────────────────────────
# Properties
# ──────────────────────────────────────────────
PROPERTY_FILTERS = {
    "propertyType": ["For Sale", "For Rent", "For Lease"],
    "category": ["Residential Appartment", "Commercial Space & Office", "Commercial Shop", "Commercial Showroom", "Banglow", "Open Plot"],
    "city": ["Pune", "Mumbai", "bangalore", "Delhi"],
    "location": ["Dhanori", "Kharadi", "Lohgaon", "Wagholi", "Tingre Nagar", "Viman Nagar", "Chandan Nagar", "Yerawada",
                 "Keshav Nagar", "Hadapsar", "Hinjewadi", "Kalyani Nagar", "Wadgaon Sheri", "Vishrantwadi", "Mundhwa"],
    "bedroom": ["1BHK", "2BHK", "3BHK", "4BHK", "5BHK"],
}
SELLERS = [("Suresh Naware", "98XXXX1201"), ("Sneha Moghe", "98XXXX4410"), ("Vijay Shipalkar", "97XXXX5520"),
           ("Anita Kale", "99XXXX7731"), ("Ramesh Gupta", "90XXXX3302"), ("Kavita Rao", "88XXXX6615")]


def _local_property_images():
    try:
        files = sorted(f for f in os.listdir(PROPERTY_IMAGE_DIR) if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp")))
    except OSError:
        files = []
    return [f"/media/dashboard/images/property/{f}" for f in files]


def _seed_properties():
    rnd = random.Random(7)
    images = _local_property_images()
    now = datetime.now()
    props = []
    for i in range(48):
        ptype = rnd.choice(["For Sale", "For Rent", "For Rent", "For Sale", "For Lease"])
        category = rnd.choices(PROPERTY_FILTERS["category"], [10, 3, 2, 1, 2, 2])[0]
        bed = rnd.randint(1, 4) if category in ("Residential Appartment", "Banglow") else 0
        loc = rnd.choice(PROPERTY_FILTERS["location"])
        furnishing = rnd.choice(["Unfurnished", "Semi Furnished", "Fully Furnished"])
        title = (f"{bed} BHK {furnishing.lower()} flat {'for rent' if ptype == 'For Rent' else 'for sale'} in {loc}"
                 if bed else f"{category} {ptype.lower()} in {loc}")
        price = rnd.choice([12000, 15000, 18000, 22000, 27000, 35000]) if ptype != "For Sale" else rnd.choice([3500000, 4800000, 6500000, 8500000, 12000000])
        seller = rnd.choice(SELLERS)
        created = now - timedelta(days=rnd.randint(1, 500))
        imgs = rnd.sample(images, k=min(len(images), rnd.randint(0, 3))) if images and rnd.random() < 0.6 else []
        props.append({
            "id": str(900 - i), "title": title, "type": ptype, "category": category,
            "image": imgs[0] if imgs else "", "images": imgs,
            "views": str(rnd.randint(1000, 1500000)),
            "address": f"Plot {rnd.randint(1, 120)}, {rnd.choice(['Sai Park', 'Ganga Heights', 'Green Valley', 'Shanti Nagar', 'Royal Residency'])}, {loc}, Pune, 4110{rnd.randint(10, 99)}",
            "location": loc, "city": "Pune",
            "price": f"₹ {price}" + (" /Month" if ptype != "For Sale" else ""), "priceValue": price,
            "availableFrom": "None", "created": fmt_date(created, with_time=False),
            "phone": seller[1].replace("XXXX", str(rnd.randint(1000, 9999))), "seller": seller[0], "sellerEmail": "",
            "status": rnd.choice(["Published", "Draft", "Draft"]),
            "bedroom": f"{bed}BHK" if bed else "", "bathroom": str(max(1, bed - rnd.randint(0, 1))) if bed else "1",
            "area": f"{rnd.choice([450, 650, 800, 1050, 1350, 2000])} sqft",
            "description": f"{title}. Close to schools, IT parks and the airport. {rnd.choice(['Family preferred.', 'Ready possession.', 'Negotiable price.', 'Covered parking available.'])}",
            "features": {"Built Year": str(rnd.randint(2008, 2025)), "Transaction": rnd.choice(["New", "Resale"]),
                         "Facing": rnd.choice(["East", "West", "North", "South"]), "Furnishing": furnishing},
            "amenities": rnd.sample(["Lift", "Parking", "Security", "Gym", "Swimming Pool", "Club House", "Garden", "Power Backup"], k=rnd.randint(0, 5)),
            "meta": {"Meta Title": "", "Meta Keywords": "", "Meta Description": ""},
        })
    return props


def _properties():
    return _load("properties", _seed_properties)


def _property_details(p):
    return {
        **p,
        "published": p["created"], "bedroom": p["bedroom"].replace("BHK", ""), "bedroomKey": p["bedroom"],
        "sellerInfo": {"Category": f"{p['category']} - {p['type']}", "Seller Name": p.get("seller", ""),
                       "Seller Phone": p.get("phone", ""), "Seller Email": p.get("sellerEmail", ""), "Address": p.get("address", "")},
    }


@router.get("/api/dashboard/properties")
def list_properties():
    props = _properties()
    return {"status": "success", "data": props, "total": len(props), "filterOptions": PROPERTY_FILTERS, "detailsLoaded": len(props)}


@router.get("/api/dashboard/properties/{pid}")
def property_details(pid: str):
    p = next((x for x in _properties() if x["id"] == pid), None)
    if not p:
        return {"status": "error", "message": "Property not found"}
    return {"status": "success", "data": _property_details(p)}


class PropertyIn(BaseModel):
    title: str
    type: str = "For Sale"
    category: str = "Residential Appartment"
    location: str = ""
    city: str = "Pune"
    address: str = ""
    price: float = 0
    bedroom: str = ""
    bathroom: str = ""
    area: str = ""
    seller: str = ""
    phone: str = ""
    status: str = "Draft"
    description: str = ""
    image: str = ""
    availableFrom: str = ""


def _apply_property(p, body: PropertyIn):
    p.update({
        "title": body.title, "type": body.type, "category": body.category, "location": body.location, "city": body.city,
        "address": body.address or ", ".join(x for x in [body.location, body.city] if x),
        "priceValue": body.price, "price": f"₹ {int(body.price) if body.price == int(body.price) else body.price}" + (" /Month" if body.type == "For Rent" else ""),
        "bedroom": body.bedroom, "bathroom": body.bathroom, "area": body.area, "seller": body.seller, "phone": body.phone,
        "status": body.status, "description": body.description, "availableFrom": body.availableFrom or "None",
    })
    if body.image:
        p["image"] = body.image
        p["images"] = [body.image] + [i for i in p.get("images", []) if i != body.image]
    return p


@router.post("/api/dashboard/properties")
def add_property(body: PropertyIn):
    props = _properties()
    new_id = str(max([int(p["id"]) for p in props] + [0]) + 1)
    p = _apply_property({"id": new_id, "views": "0", "created": fmt_date(datetime.now(), with_time=False), "images": [],
                         "image": "", "features": {}, "amenities": [], "meta": {"Meta Title": "", "Meta Keywords": "", "Meta Description": ""}}, body)
    props.insert(0, p)
    _save("properties", props)
    return {"status": "success", "data": p}


@router.put("/api/dashboard/properties/{pid}")
def update_property(pid: str, body: PropertyIn):
    props = _properties()
    p = next((x for x in props if x["id"] == pid), None)
    if not p:
        return {"status": "error", "message": "Property not found"}
    _apply_property(p, body)
    _save("properties", props)
    return {"status": "success", "data": p}


@router.delete("/api/dashboard/properties/{pid}")
def delete_property(pid: str):
    props = _properties()
    remaining = [p for p in props if p["id"] != pid]
    _save("properties", remaining)
    return {"status": "success", "deleted": len(props) - len(remaining)}


# ──────────────────────────────────────────────
# Dashboard summary (counts for the overview cards and sidebar badges)
# ──────────────────────────────────────────────
def _count_collection(name):
    try:
        with open(os.path.join(DATA_DIR, f"{name}.json"), encoding="utf-8") as f:
            return len(json.load(f))
    except (OSError, ValueError):
        return None


@router.get("/api/dashboard/summary")
def summary():
    leads = _leads()
    by_status = {}
    for l in leads:
        by_status[l["status"]] = by_status.get(l["status"], 0) + 1
    booked = by_status.get("BOOKING COMPLETED", 0) + by_status.get("EOI COMPLETED", 0)
    return {
        "status": "success",
        "leads": len(leads), "properties": len(_properties()),
        "projects": _count_collection("projects"), "users": _count_collection("users"),
        "visitors": 115455,
        "funnel": {"leads": len(leads), "siteVisits": by_status.get("SV SCHEDULED", 0) + by_status.get("SV COMPLETED", 0),
                   "bookings": booked, "conversion": round(booked * 100 / len(leads), 2) if leads else 0},
        "recentLeads": [{"id": l["id"], "name": l["name"], "phone": l["phone"], "location": l.get("location", ""),
                         "date": l["createdDate"], "status": l["status"].title()} for l in leads[:5]],
    }
