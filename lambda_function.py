import json

def lambda_handler(event, context):
    """Handles Alexa requests"""
    if event['request']['type'] == "LaunchRequest":
        return respond("Hello! How can I assist in your dental emergency?")

    elif event['request']['type'] == "IntentRequest":
        intent_name = event['request']['intent']['name']
        
        if intent_name == "EmergencyIntent":
            return respond("What is the patient's weight?")
    
    return respond("Sorry, I didn't understand that.")

def respond(text):
    return {
        "version": "1.0",
        "response": {
            "outputSpeech": {
                "type": "PlainText",
                "text": text
            },
            "shouldEndSession": False
        }
    }
