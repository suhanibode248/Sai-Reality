"""
Sai Reality — FastAPI Backend with PostgreSQL Integration
Endpoints:
  POST /login      — Authenticates user against PostgreSQL database
  POST /register   — Registers new user into PostgreSQL database
  GET  /home-data  — Returns home page content as JSON
  GET  /           — Health check endpoint
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from database import init_db, get_db
from models import User
from utils import hash_password, verify_password


# ──────────────────────────────────────────────
# Lifespan / Startup Setup
# ──────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables and default admin user on startup
    init_db()
    yield


# ──────────────────────────────────────────────
# App setup
# ──────────────────────────────────────────────
app = FastAPI(
    title="Sai Reality API",
    version="1.0.0",
    lifespan=lifespan
)

# Allow React dev server (localhost:5173) and production origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173",
                   "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────
# Request / Response models
# ──────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    success: bool
    message: str


class RegisterRequest(BaseModel):
    full_name: str
    phone: str
    email: str
    role: str                        # 'Landlord' | 'Tenant'
    password: str
    # Landlord-specific (optional)
    property_type: str | None = None
    num_properties: str | None = None
    location: str | None = None
    purpose: str | None = None
    # Tenant-specific (optional)
    looking_for: str | None = None
    budget: str | None = None


class RegisterResponse(BaseModel):
    success: bool
    message: str


class ServiceItem(BaseModel):
    icon: str
    title: str
    description: str


class StatItem(BaseModel):
    value: str
    label: str


class FeaturedProject(BaseModel):
    title: str
    location: str
    price: str
    area: str
    status: str


class HomeData(BaseModel):
    title: str
    subtitle: str
    description: str
    features: list[str]
    services: list[ServiceItem]
    stats: list[StatItem]
    featured_projects: list[FeaturedProject]
    contact: dict
    marquee_text: str


# ──────────────────────────────────────────────
# POST /login (PostgreSQL Integration)
# ──────────────────────────────────────────────
@app.post("/login", response_model=LoginResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """
    Accepts username or email, and password.
    Queries the database to verify user credentials.
    Returns clean JSON response without throwing 401 exceptions.
    """
    username_or_email = (credentials.username or "").strip()
    password = (credentials.password or "")

    if not username_or_email or not password:
        return LoginResponse(
            success=False,
            message="Please enter both username/email and password."
        )

    try:
        user = db.query(User).filter(
            (User.username == username_or_email) | (User.email == username_or_email)
        ).first()

        if user and verify_password(password, user.password_hash):
            return LoginResponse(
                success=True,
                message=f"Successfully logged in as {user.full_name or user.username}"
            )
    except SQLAlchemyError:
        pass

    # Default fallback check for admin / admin123
    if username_or_email == "admin" and password == "admin123":
        return LoginResponse(
            success=True,
            message="Successfully logged in as Administrator"
        )

    return LoginResponse(
        success=False,
        message="Invalid username or password. Please check your credentials."
    )


# ──────────────────────────────────────────────
# POST /register (PostgreSQL Integration)
# ──────────────────────────────────────────────
@app.post("/register", response_model=RegisterResponse)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    """
    Accepts registration data from the Register forms.
    Validates required fields, password length, phone length, and saves to database.
    Returns clean status responses without uncaught errors.
    """
    # Validation checks
    if not (data.full_name or "").strip():
        return RegisterResponse(success=False, message="Full name is required.")

    if not (data.email or "").strip() or "@" not in data.email:
        return RegisterResponse(success=False, message="A valid email address is required.")

    clean_phone = (data.phone or "").strip()
    if len(clean_phone) < 10:
        return RegisterResponse(success=False, message="Please enter a valid 10-digit phone number.")

    if not data.password or len(data.password) < 6:
        return RegisterResponse(success=False, message="Password must be at least 6 characters.")

    if data.role not in ("Landlord", "Tenant", "Admin"):
        return RegisterResponse(success=False, message="Invalid role selected.")

    email_clean = data.email.strip().lower()
    username_candidate = email_clean.split("@")[0]

    try:
        # Check if email is already registered
        existing_user = db.query(User).filter(
            (User.email == email_clean) | (User.username == username_candidate)
        ).first()

        if existing_user:
            return RegisterResponse(
                success=False,
                message=f"An account with email '{email_clean}' already exists. Please log in."
            )

        # Create new user in PostgreSQL / database
        new_user = User(
            username=username_candidate,
            email=email_clean,
            password_hash=hash_password(data.password),
            full_name=data.full_name.strip(),
            phone=clean_phone,
            role=data.role,
            property_type=data.property_type,
            num_properties=data.num_properties,
            location=data.location,
            purpose=data.purpose,
            looking_for=data.looking_for,
            budget=data.budget,
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return RegisterResponse(
            success=True,
            message=f"{data.role} account for {data.full_name} created successfully!"
        )

    except SQLAlchemyError as e:
        db.rollback()
        return RegisterResponse(
            success=False,
            message=f"Registration database error: {str(e)}"
        )


# ──────────────────────────────────────────────
# GET /home-data
# ──────────────────────────────────────────────
@app.get("/home-data", response_model=HomeData)
def get_home_data():
    """
    Returns all content needed by the React Home page.
    Data is based on the actual Sai Reality website content.
    """
    return HomeData(
        title="Sai Reality",
        subtitle="Your Trusted Real Estate Partner in Pune",
        description=(
            "With 7+ years of experience in developing and building plots, flats "
            "and commercial properties in Pune, we are a trusted name in real estate. "
            "No Brokerage · Bottom Rate Policy · Free Site Visit · 100% Loan Available."
        ),
        features=[
            "No Brokerage — Always",
            "Bottom Rate Guarantee",
            "Free Site Visit",
            "100% Loan Assistance",
            "Legal Documentation Support",
            "7+ Years of Trusted Experience",
        ],
        services=[
            ServiceItem(
                icon="fa-home",
                title="Buy Property",
                description=(
                    "Find your perfect home with our extensive listing of residential "
                    "and commercial properties across Pune."
                ),
            ),
            ServiceItem(
                icon="fa-key",
                title="Rent Property",
                description=(
                    "Discover great rental options that fit your lifestyle and budget, "
                    "from 1BHK to luxury apartments."
                ),
            ),
            ServiceItem(
                icon="fa-chart-line",
                title="Investment Advice",
                description=(
                    "Get expert guidance on lucrative real estate investments with "
                    "assured returns in Pune."
                ),
            ),
            ServiceItem(
                icon="fa-file-contract",
                title="Legal Assistance",
                description=(
                    "Complete legal documentation, registration support and property "
                    "verification services."
                ),
            ),
            ServiceItem(
                icon="fa-hand-holding-dollar",
                title="Home Loan",
                description=(
                    "100% loan offer available. We assist you in getting the best "
                    "home loan deals from top banks."
                ),
            ),
            ServiceItem(
                icon="fa-map-location-dot",
                title="Free Site Visit",
                description=(
                    "Schedule a free site visit to any property in Pune. "
                    "Our executives will guide you personally."
                ),
            ),
        ],
        stats=[
            StatItem(value="150+", label="Completed Projects"),
            StatItem(value="820+", label="Properties Listed"),
            StatItem(value="500+", label="Happy Customers"),
            StatItem(value="7+",   label="Years Experience"),
        ],
        featured_projects=[
            FeaturedProject(
                title="GS Crown Plaza Wagholi",
                location="Keshnand Wagholi, Pune 411047",
                price="₹20 L – 1.65 Cr",
                area="6.5 Acres",
                status="Featured",
            ),
            FeaturedProject(
                title="SB Patil (Bliss County)",
                location="Charholi, Pune 411014",
                price="₹35 L – 48 L",
                area="3.5 Acres",
                status="Ready",
            ),
            FeaturedProject(
                title="Future PNQ (NA Plotting)",
                location="Kunjirwadi, Pune 412201",
                price="₹29 L – 64 L",
                area="27 Acres",
                status="Under Construction",
            ),
            FeaturedProject(
                title="Vascon Tower of Ascend",
                location="Kharadi, Pune 411014",
                price="₹1.86 Cr – 10 Cr",
                area="1 Acre",
                status="Featured",
            ),
            FeaturedProject(
                title="Nirwana Life County",
                location="Lohegaon, Pune 411047",
                price="₹1.5 Cr – 2.5 Cr",
                area="5 Acres",
                status="Featured",
            ),
        ],
        contact={
            "phone1": "+91 9222445513",
            "phone2": "+91 9320072003",
            "email": "support@saireality.in",
            "address": "Lohegaon, Pune, Maharashtra, India",
            "whatsapp": "https://wa.me/919222445513",
        },
        marquee_text=(
            "⭐ NO BROKERAGE  |  BOTTOM RATE POLICY  |  FREE SITE VISIT  |  "
            "100% LOAN OFFER AVAILABLE  |  FESTIVE OFFER – WHITE GOODS WORTH ₹2 LACS FREE  ⭐"
        ),
    )


# ──────────────────────────────────────────────
# Health check
# ──────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "ok", "app": "Sai Reality API with PostgreSQL"}

