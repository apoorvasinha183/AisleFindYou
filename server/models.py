# server/models.py
from pydantic import BaseModel
from typing import List

# --- Core Data Structures ---

# Represents a single item in a store's inventory (price per unit)
class Item(BaseModel):
    name: str
    price: float

# Represents a store with its inventory
class Store(BaseModel):
    id: int
    name: str
    items: List[Item]


# --- API Request/Response Models ---

# Represents an item in the user's grocery list, WITH quantity
class RequestedItem(BaseModel):
    name: str
    quantity: int

# The structure of the request body for the /calculate endpoint
class CalculationRequest(BaseModel):
    items: List[RequestedItem]

# The structure of the response from the /calculate endpoint
class CalculationResponse(BaseModel):
    store_name: str
    total_cost: float