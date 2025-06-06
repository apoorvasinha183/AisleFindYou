# server/main.py (Refactored Version)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import all our models from the new models.py file
from models import Store, Item, CalculationRequest, CalculationResponse

# --- Mock Database (This remains here for now) ---
mock_db: list[Store] = [
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
    CORSMiddleware, allow_origins=origins, allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

# --- API Endpoints ---
@app.get("/api/stores", response_model=list[Store])
def get_stores():
    return mock_db

@app.post("/api/calculate", response_model=CalculationResponse)
def calculate_best_store(request: CalculationRequest):
    """
    Receives a list of items with quantities and calculates the cheapest store.
    """
    best_store_info = {"name": "No store found", "cost": float('inf')}

    for store in mock_db:
        current_store_cost = 0
        items_found_in_this_store = 0
        store_inventory = {item.name: item.price for item in store.items}

        # The core logic is now updated to handle quantity!
        for requested_item in request.items:
            if requested_item.name in store_inventory:
                # NEW: Multiply price by quantity
                item_cost = store_inventory[requested_item.name] * requested_item.quantity
                current_store_cost += item_cost
                items_found_in_this_store += 1
        
        if items_found_in_this_store > 0 and current_store_cost < best_store_info["cost"]:
            best_store_info["name"] = store.name
            best_store_info["cost"] = current_store_cost
    
    return CalculationResponse(
        store_name=best_store_info["name"],
        total_cost=round(best_store_info["cost"], 2)
    )