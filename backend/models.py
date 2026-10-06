from sqlalchemy import Column, Integer, String, DateTime, func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=True)
    phone = Column(String(30), nullable=True)
    role = Column(String(50), default="Tenant")  # 'Landlord', 'Tenant', 'Admin'

    # Landlord specific fields
    property_type = Column(String(100), nullable=True)
    num_properties = Column(String(50), nullable=True)
    location = Column(String(100), nullable=True)
    purpose = Column(String(50), nullable=True)

    # Tenant specific fields
    looking_for = Column(String(50), nullable=True)
    budget = Column(String(100), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    phone = Column(String(30), nullable=False)
    email = Column(String(150), nullable=True)
    visit_date = Column(String(50), nullable=True)
    property_name = Column(String(200), nullable=False)
    budget = Column(String(100), nullable=True)
    status = Column(String(50), default="New")  # 'New', 'Contacted', 'Converted', 'Closed'
    notes = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

