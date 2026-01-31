Table: users
Columns: 
- id (UUID, PK)
- email (Unique)
- role (customer | owner | driver)

Relationships:
- Owner -> Vehicles
- Customer -> Trips