# server/seed.py
from faker import Faker
from database import SessionLocal, engine
import models
import random

# Create all the tables in the database
models.Base.metadata.create_all(bind=engine)

# Get a new database session
db = SessionLocal()

# Initialize Faker
fake = Faker()

# Let's clean up old data first
db.query(models.Item).delete()
db.query(models.Store).delete()
db.commit()

# --- Create Fictitious Data ---
print("Seeding database with fictitious data...")

common_items = [
    "milk", "eggs", "bread", "chicken", "apples", "bananas", "cereal", "cheese",
    "rice", "pasta", "tomatoes", "onions", "potatoes", "coffee", "lettuce"
]

for _ in range(5):  # Create 5 stores
    store_name = fake.company() + " Market"
    store_location = fake.street_address()
    
    new_store = models.Store(name=store_name, location=store_location)
    db.add(new_store)
    db.commit()
    db.refresh(new_store)

    # Add 10-15 random items to each store
    for item_name in random.sample(common_items, k=random.randint(10, 15)):
        new_item = models.Item(
            name=item_name,
            price=round(random.uniform(1.50, 15.00), 2),
            store_id=new_store.id
        )
        db.add(new_item)

db.commit()
print("Database seeding complete!")

# Close the session
db.close()