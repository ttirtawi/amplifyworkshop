import json
import boto3
from botocore.exceptions import ClientError
import uuid
from validateRequest import validateRequest
dynamodb = boto3.resource('dynamodb')

def deleteItem(requestBody,tableName):
    print(requestBody)
    table = dynamodb.Table(tableName)

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
        query = requestBody['query']

        if query == 'GROCERYITEM':
            grocery_id = grocery_id + requestBody['grocery_index']

        try:
            response = table.delete_item(
                Key={
                    'PK': 'USER#'+username,
                    'SK': query + '#' + grocery_date + '#' + grocery_id
                },
                ConditionExpression="PK = :val3 and SK = :val4",
                ExpressionAttributeValues={
                    ':val3': 'USER#'+username,
                    ':val4': query + '#' + grocery_date + '#' + grocery_id
                }
            )
            msg = 'Data has been deleted'
            responseCode = 200
        except ClientError as err:
            print(err)
            responseCode = 500
            msg = "Failed to delete the data "
    else:
        responseCode = 400
        msg = "Invalid request format"

    body = {
        "message": msg
    }
    response = {
        "statusCode": responseCode,
        "body": json.dumps(body),
        "headers": {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
        }
    }
    return response
