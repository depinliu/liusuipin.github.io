import csv
import json


# Function to convert a CSV to JSON
# Takes the file paths as arguments
def make_json(csvFilePath, jsonFilePath):

    # create a dictionary
    data = []

    # Open a csv reader called DictReader
    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)

        # Convert each row into a dictionary 
        # and add it to data
        for row in csvReader:
            # Assuming a column named 'No' to
            # be the primary key
            #key = rows['No']
            row["lvl"] = int(row["lvl"])
            row["balo"] = float(row["balo"])
            row["bal"] = float(row["bal"])
            row["seq"] = int(row["seq"])
            if row["pid"] == "":
                row.pop("pid", None)
            data.append(row)

    # Open a json writer, and use the json.dumps() 
    # function to dump data
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4))

# Driver Code

# Decide the two file paths according to your 
# computer system
csvFilePath = r'/lisoft/hris/www/gacc/db/COA2021.csv'
jsonFilePath = r'/lisoft/hris/www/gacc/db/COA2021.json'

# Call the make_json function
make_json(csvFilePath, jsonFilePath)
