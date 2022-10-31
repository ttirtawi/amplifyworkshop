import json
import boto3
from botocore.exceptions import ClientError
import uuid
client = boto3.client('dynamodb')

def createItem(requestBody,tableName):
    print("This is createItem function")
    msg = ''
    responseCode = 200
    response = ''
    print(requestBody)
    if requestBody["grocery_budget"] and requestBody["username"] and requestBody["grocery_date"]:
        username = requestBody['username']
        grocery_date = requestBody["grocery_date"]
        grocery_id = str(uuid.uuid4())
        grocery_budget = requestBody["grocery_budget"]

        # Create grocery_budget record should be only once per incoming request
        try:
            response = client.put_item(
                TableName=tableName,
                Item={
                    'PK': {'S': 'USER#'+username},
                    'SK': {'S': 'GROCERYBUDGET#'+grocery_date+'#'+grocery_id},
                    'username': {'S': username},
                    'grocery_id': {'S': grocery_id},
                    'grocery_date': {'S': grocery_date},
                    'grocery_budget': {'S': grocery_budget}
                }
            )
            responseCode = 200
            msg = "Data has been stored succesfully"
        except ClientError as err:
            print(err)
            responseCode = 500
            msg = "Failed to save the data"

        if requestBody['grocery']:
            # Create grocery record, loop through the grocery object
            counter = 1
            for item in requestBody["grocery"]:
                grocery_name = item['grocery_name']
                grocery_cost = item['grocery_cost']
                grocery_qty = item['grocery_qty']

                try:
                    response = client.put_item(
                        TableName=tableName,
                        Item={
                            'PK': {'S': 'USER#'+username},
                            'SK': {'S': 'GROCERYITEM#'+grocery_date+'#'+grocery_id+str(counter)},
                            'username': {'S': username},
                            'grocery_id': {'S': grocery_id},
                            'grocery_date': {'S': grocery_date},
                            'grocery_name': {'S': grocery_name},
                            'grocery_qty': {'S': grocery_qty},
                            'grocery_cost': {'S': grocery_cost}
                        }
                    )
                    responseCode = 200
                    msg = "Data has been stored succesfully"
                    counter = counter + 1
                except ClientError as err:
                    print(err)
                    responseCode = 500
                    msg = "Failed to save the data"
    else:
        responseCode = 400
        msg = "Invalid request"    
    
    response = {
        "statusCode": responseCode,
        "body": json.dumps({"message": msg}),
        "headers": {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Credentials': 'true',
        }
    }
    return response