def validateRequest(request):
    mandatoryItems = request["mandatoryItems"]
    requestBody = request["requestBody"]
    validate = True
    for item in mandatoryItems:
        if item not in requestBody:
            responseCode = 400
            msg = "Invalid request"
            validate = False
    return validate