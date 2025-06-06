# server/main.py (Database-driven Version)
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import pydantic_models as pydantic # We'll create this file next
import models
from database import SessionLocal, engine
from sqlalchemy import func

# This command creates the database tables if they don't exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- CORS and Database Session Management ---
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware, allow_origins=origins, allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

# Dependency to get a DB session for each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API Endpoints using the Database ---
@app.post("/api/calculate", response_model=pydantic.CalculationResponse)
def calculate_best_store(request: pydantic.CalculationRequest, db: Session = Depends(get_db)):
    stores = db.query(models.Store).all()
    best_store_info = {"name": "No store found", "cost": float('inf')}

    for store in stores:
        current_store_cost = 0
        items_found = 0
        store_inventory = {item.name: item.price for item in store.items}

        for requested_item in request.items:
            if requested_item.name in store_inventory:
                item_cost = store_inventory[requested_item.name] * requested_item.quantity
                current_store_cost += item_cost
                items_found += 1
        
        if items_found > 0 and current_store_cost < best_store_info["cost"]:
            best_store_info["name"] = store.name
            best_store_info["cost"] = current_store_cost
    
    return pydantic.CalculationResponse(
        store_name=best_store_info["name"],
        total_cost=round(best_store_info["cost"], 2)
    )
# -- Autocomplete ---
@app.get("/api/items/autocomplete", response_model=list[str])
def autocomplete_items(query: str, db: Session = Depends(get_db)):
    """
    Provides a list of distinct item names that start with the user's query.
    This is case-insensitive.
    """
    if not query:
        return []

    # Query the database for distinct item names that match the query.
    # .ilike() provides case-insensitive matching.
    # We limit the results to 10 to avoid sending huge lists.
    search_query = f"{query}%"
    items = db.query(models.Item.name)\
              .filter(models.Item.name.ilike(search_query))\
              .distinct()\
              .limit(10)\
              .all()
    
    # The query returns a list of tuples, so we extract the first element of each tuple.
    return [item[0] for item in items] 