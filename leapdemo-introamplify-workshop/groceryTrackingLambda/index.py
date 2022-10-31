import json
import os
from getItem import getItem
from createItem import createItem
from updateItem import updateItem
from deleteItem import deleteItem
  
tableName = os.environ['STORAGE_GROCERYTABLE_NAME']

def handler(event, context):
  print('received event:')
  print(event)
  response = ''

  if (event["httpMethod"] == 'GET')  :
    message = 'This is GET function'
    response = getItem(event,tableName)
  elif (event["httpMethod"] == 'POST'):
    requestBody = json.loads(event["body"])
    message = 'This is POST function'
    response = createItem(requestBody,tableName)
  elif (event["httpMethod"] == 'PUT'):
    message = 'This is PUT function'
    requestBody = json.loads(event["body"])
    response = updateItem(requestBody,tableName)
  elif (event["httpMethod"] == 'DELETE'):
    message = 'This is DELETE function'
    requestBody = json.loads(event["body"])
    response = deleteItem(requestBody,tableName)


  return response
