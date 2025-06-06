# server/pydantic_models.py
from pydantic import BaseModel
from typing import List

# This file now holds the models used for API requests and responses.
# The SQLAlchemy models in models.py define the database tables.

class RequestedItem(BaseModel):
    name: str
    quantity: int

class CalculationRequest(BaseModel):
    items: List[RequestedItem]

class CalculationResponse(BaseModel):
    store_name: str
    total_cost: float