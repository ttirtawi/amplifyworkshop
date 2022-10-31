import json
import boto3
from botocore.exceptions import ClientError
client = boto3.client('dynamodb')

def queryDDB(PK, SK, tableName):
    response = client.query(
        TableName=tableName,
        ExpressionAttributeValues={
            ':v1': {
                'S': PK,
                },
            ':v2': {
                'S': SK
                }
            },
        KeyConditionExpression='PK = :v1 AND begins_with ( SK, :v2 )',
        ScanIndexForward=True, 
        )
    return response

def getItem(event,tableName):
    output1 = []
    output2 = []

    response1 = ''
    response2 = ''
    PK = ''
    SK1 = ''
    SK2 = ''
    mandatoryItems = ['username', 'query']
    validate = True
    for i in mandatoryItems:
        if i not in event["queryStringParameters"]:
            validate = False

    if validate:
        username = event["queryStringParameters"]["username"]
        query = event["queryStringParameters"]["query"]

        if query == "ALL":
            PK = 'USER#' + username
            SK1 = 'GROCERYBUDGET#'
            SK2 = 'GROCERYITEM#'
            response1 = queryDDB(PK, SK1, tableName)
            response2 = queryDDB(PK, SK2, tableName)
        elif query == "DATE" and event["queryStringParameters"]["grocery_date"]:
            grocery_date = event["queryStringParameters"]["grocery_date"]
            PK = 'USER#' + username
            SK1 = 'GROCERYBUDGET#' + grocery_date
            SK2 = 'GROCERYITEM#' + grocery_date
            response1 = queryDDB(PK, SK1, tableName)
            response2 = queryDDB(PK, SK2, tableName)
        elif query == "GROCERYBUDGET" and event["queryStringParameters"]["grocery_date"]:
            grocery_id = event["queryStringParameters"]["grocery_id"]
            grocery_date = event["queryStringParameters"]["grocery_date"]
            PK = 'USER#' + username
            SK1 = 'GROCERYBUDGET#' + grocery_date + '#' + grocery_id
            response1 = queryDDB(PK, SK1, tableName)
        elif query == "GROCERYITEM" and event["queryStringParameters"]["grocery_date"]:
            grocery_id = event["queryStringParameters"]["grocery_id"]
            grocery_date = event["queryStringParameters"]["grocery_date"]
            PK = 'USER#' + username
            SK2 = 'GROCERYITEM#' + grocery_date + '#' + grocery_id
            response2 = queryDDB(PK, SK2, tableName)
        else:
            PK= 'INVALID'
            
        if PK == 'INVALID':
            msg = 'Invalid request'
            responseCode = 400
        else:
            # process result for response1 GROCERYBUDGET
            if response1 and response1['Items']:
                for item in response1['Items']:
                    temp = {}
                    temp['grocery_id'] = item['grocery_id']['S']
                    temp['grocery_date'] = item['grocery_date']['S']
                    temp['grocery_budget'] = item['grocery_budget']['S']
                    temp['username'] = item['username']['S']
                    output1.append(temp)

            # process result for response2
            if response2 and response2['Items']:
                for item in response2['Items']:
                    temp = {}
                    sk = item['SK']['S'].split("#")[2]
                    index = sk.replace(item['grocery_id']['S'], '')
                    temp['grocery_id'] = item['grocery_id']['S']
                    temp['grocery_date'] = item['grocery_date']['S']
                    temp['grocery_name'] = item['grocery_name']['S']
                    temp['grocery_cost'] = item['grocery_cost']['S']
                    temp['grocery_qty'] = item['grocery_qty']['S']
                    temp['grocery_index'] = index
                    temp['username'] = item['username']['S']
                    output2.append(temp)

            if not output1 and not output2:
                responseCode = 404
                msg = 'Data not found'
            else:
                responseCode = 200
                msg = {
                        'grocerybudget': output1,
                        'groceryitem': output2
                        }
    else:
        msg = 'Invalid request'
        responseCode = 400

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
