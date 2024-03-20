# Sample data
sample_data = {
    "ProductID": 1,
    "ProductName": "Chai",
    "SupplierID": 1,
    "CategoryID": 1,
    "AductName": "Chai",
    "SutulierID": 1,
    "randomID": 1,
    "BierID": 1,
    "zrandomID": 1,
    "BiryuirID": 1,
    "QuantityPerUnit": "10 boxes x 20 bags",
    "UnitPrice": 18.0000,
    "UnitsInStock": 39,
    "UnitsOnOrder": 0,
    "ReorderLevel": 10,
    "Discontinued": False,
    "Category": {
        "CategoryID": 1,
        "CategoryName": "Beverages",
        "Description": "Soft drinks, coffees, teas, beers, and ales"
    }
}

# Function to generate 200 rows of data
def generate_data():
    data = []
    for i in range(1, 301):  # Generating 200 rows
        new_data = sample_data.copy()  # Create a copy of the sample data
        new_data["ProductID"] = i  # Update ProductID for each row
        data.append(new_data)  # Append the new row to the data list
    return data

# Generate 200 rows of data
generated_data = generate_data()

# Print the generated data
for row in generated_data:
    print(row,',')
