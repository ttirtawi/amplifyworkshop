import json
import boto3
from botocore.exceptions import ClientError
import uuid
from validateRequest import validateRequest
dynamodb = boto3.resource('dynamodb')

def updateItem(requestBody, tableName):
    print(requestBody)
    table = dynamodb.Table(tableName)
    msg = ''
    responseCode = 200
    response = ''

    # Validate all required fields
    mandatoryItems = ['username', 'grocery_id', 'grocery_date', 'query']
    temp = {
        "mandatoryItems": mandatoryItems,
        "requestBody": requestBody
    }
    validate = validateRequest(temp)

    if validate:
        username = requestBody['username']
        grocery_id = requestBody['grocery_id']
        grocery_date = requestBody['grocery_date']

        if requestBody['query'] == 'GROCERYBUDGET':
            grocery_budget = requestBody['grocery_budget']
            try:
                response = table.update_item(
                    Key={
                        'PK': 'USER#'+username,
                        'SK': 'GROCERYBUDGET#'+ grocery_date + '#' + grocery_id
                    },
                    ConditionExpression="PK = :val4 and SK = :val5",
                    UpdateExpression="SET #col1 = :val1",
                    ExpressionAttributeNames={
                        "#col1": "grocery_budget"
                    },
                    ExpressionAttributeValues={
                        ':val1': grocery_budget,
                        ':val4': 'USER#'+username,
                        ':val5': 'GROCERYBUDGET#'+ grocery_date + '#' + grocery_id
                    }
                )
                msg = 'Data has been updated'
                responseCode = 200
            except ClientError as err:
                print(err)
                responseCode = 500
                msg = "Failed to update the data "
        elif requestBody['query'] == 'GROCERYITEM':
            grocery_name = requestBody['grocery_name']
            grocery_qty = requestBody['grocery_qty']
            grocery_cost = requestBody['grocery_cost']
            grocery_index = requestBody['grocery_index']
            grocery_id = grocery_id + requestBody['grocery_index']

            try:
                response = table.update_item(
                    Key={
                        'PK': 'USER#'+username,
                        'SK': 'GROCERYITEM#'+ grocery_date + '#' + grocery_id
                    },
                    ConditionExpression="PK = :val4 and SK = :val5",
                    UpdateExpression="SET #col1 = :val1, #col2 = :val2, #col3 = :val3",
                    ExpressionAttributeNames={
                        "#col1": "grocery_name",
                        "#col2": "grocery_qty",
                        "#col3": "grocery_cost"
                    },
                    ExpressionAttributeValues={
                        ':val1': grocery_name,
                        ':val2': grocery_qty,
                        ':val3': grocery_cost,
                        ':val4': 'USER#'+username,
                        ':val5': 'GROCERYITEM#'+ grocery_date + '#' + grocery_id
                    }
                )
                msg = 'Data has been updated'
                responseCode = 200
            except ClientError as err:
                print(err)
                responseCode = 500
                msg = "Failed to update the data "
    else:
        responseCode = 400
        msg = "Invalid request format"

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
