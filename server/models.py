# server/models.py (SQLAlchemy Version)
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

# SQLAlchemy model for the 'stores' table
class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    location = Column(String)

    # This creates the one-to-many relationship
    items = relationship("Item", back_populates="store")

# SQLAlchemy model for the 'items' table
class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Float)
    
    store_id = Column(Integer, ForeignKey("stores.id"))
    store = relationship("Store", back_populates="items")