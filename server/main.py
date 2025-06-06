## server/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

# --- Data Models ---
# Pydantic models help with data validation and typing.
# This defines what an "Item" looks like.
class Item(BaseModel):
    name: str
    price: float

# This defines what a "Store" looks like.
class Store(BaseModel):
    id: int
    name: str
    items: List[Item] # A store has a list of items

# --- Mock Database ---
# For Phase 1, we'll hardcode our store and item data right here.
# Later, this will come from a real database.
mock_db: List[Store] = [
    Store(id=1, name="Kroger on Ponce", items=[
        Item(name="milk", price=3.50),
        Item(name="eggs", price=2.75),
        Item(name="bread", price=2.50),
        Item(name="chicken", price=8.99),
    ]),
    Store(id=2, name="Publix at Ansley Mall", items=[
        Item(name="milk", price=3.60),
        Item(name="eggs", price=2.50), # Cheaper eggs!
        Item(name="bread", price=2.80),
        Item(name="apples", price=4.20),
    ]),
    Store(id=3, name="Trader Joe's on Monroe", items=[
        Item(name="milk", price=3.75),
        Item(name="eggs", price=2.95),
        Item(name="bananas", price=1.99),
        Item(name="chicken", price=7.50), # Cheaper chicken!
    ]),
]

# --- FastAPI App Initialization ---
app = FastAPI()

origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---
@app.get("/api/stores", response_model=List[Store])
def get_stores():
    """This endpoint returns our entire list of stores and their inventories."""
    return mock_db 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/test")
def get_test_message():
    return {"message": "Hello from the FastAPI backend!"}

# This defines the structure of the data we expect from the frontend
class CalculationRequest(BaseModel):
    items: List[str]

# This defines the structure of the data we'll send back
class CalculationResponse(BaseModel):
    store_name: str
    total_cost: float


@app.post("/api/calculate", response_model=CalculationResponse)
def calculate_best_store(request: CalculationRequest):
    """
    Receives a list of item names and calculates which store
    is the cheapest for those items.
    """
    best_store_info = {
        "name": "No store found",
        "cost": float('inf') # Start with an infinitely high cost
    }

    # Loop through each store in our mock database
    for store in mock_db:
        current_store_cost = 0
        items_found = 0
        
        # Create a quick lookup map of items in the current store
        store_inventory = {item.name: item.price for item in store.items}

        # Loop through the items the user requested
        for requested_item in request.items:
            # If the store has the item, add its price to the current total
            if requested_item in store_inventory:
                current_store_cost += store_inventory[requested_item]
                items_found += 1
        
        # If we found at least one item and the cost is lower than our best so far...
        if items_found > 0 and current_store_cost < best_store_info["cost"]:
            # ...we have a new best store!
            best_store_info["name"] = store.name
            best_store_info["cost"] = current_store_cost
    
    # Format the final response
    return CalculationResponse(
        store_name=best_store_info["name"],
        total_cost=round(best_store_info["cost"], 2) # round to 2 decimal places
    )
