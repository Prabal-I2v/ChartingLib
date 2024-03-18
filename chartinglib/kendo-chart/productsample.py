import random
from datetime import datetime, timedelta

# Function to generate a random date within a range
def random_date(start_date, end_date):
    return start_date + timedelta(seconds=random.randint(0, int((end_date - start_date).total_seconds())))

# Define the base data model
base_data = {
    "ProductID": 10,
    "ProductName": "Ikura",
    "SupplierID": 4,
    "CategoryID": 8,
    "QuantityPerUnit": "12 - 200 ml jars",
    "UnitPrice": 31,
    "UnitsInStock": 31,
    "UnitsOnOrder": 0,
    "ReorderLevel": 0,
    "Discontinued": 'false',
    "Category": {
        "CategoryID": 8,
        "CategoryName": "Seafood",
        "Description": "Seaweed and fish"
    },
    "FirstOrderedOn": datetime(1996, 8, 5)
}

# Generate 100 rows
data_rows = []
for i in range(100):
    # Clone the base data
    row_data = base_data.copy()

    # Modify properties if needed (e.g., generate random dates)
    row_data["ProductID"] += i
    row_data["ProductName"] += "_" + str(i)
    row_data["UnitsInStock"] += i
    row_data["UnitsOnOrder"] += i
    row_data["FirstOrderedOn"] = random_date(datetime(1990, 1, 1), datetime.now())

    # Add the row to the list
    data_rows.append(row_data)

# Print the generated data
for row in data_rows:
    print(row)
