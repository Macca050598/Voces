const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("Hello! What emergency can I assist you with?")
            .reprompt("What emergency can I assist you with?")
            .getResponse();
    }
};

const EmergencyIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
               Alexa.getIntentName(handlerInput.requestEnvelope) === 'EmergencyIntent';
    },
    handle(handlerInput) {
        const emergencyType = Alexa.getSlotValue(handlerInput.requestEnvelope, 'emergencyType');

        if (!emergencyType) {
            return handlerInput.responseBuilder
                .speak("I didn't catch that. What emergency are you dealing with?")
                .reprompt("What emergency are you dealing with?")
                .getResponse();
        }

        // Save the emergency type and set the conversation state
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.emergencyType = emergencyType;
        sessionAttributes.awaitingResponse = "conscious"; // Set to await consciousness response
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder
            .speak(`Okay, suspected ${emergencyType}. Is the patient conscious?`)
            .reprompt("Is the patient conscious?")
            .getResponse();
    }
};
// Yes Intent handler - Handling Yes responses dynamically
const YesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
               Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const awaitingResponse = sessionAttributes.awaitingResponse;

        if (awaitingResponse === "conscious") {
            // Proceed with chest pain question after "Yes" response to consciousness
            sessionAttributes.awaitingResponse = "chestPain"; // Now we're asking about chest pain
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

            return handlerInput.responseBuilder
                .speak("Okay, since the patient is conscious, are they experiencing chest pain?")
                .reprompt("Are they experiencing chest pain?")
                .getResponse();
        } else if (awaitingResponse === "chestPain") {
            // Proceed with shortness of breath question after "Yes" response to chest pain
            sessionAttributes.awaitingResponse = "shortnessOfBreath"; // We're now asking about shortness of breath
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

            return handlerInput.responseBuilder
                .speak("Okay, since they are experiencing chest pain, are they also experiencing shortness of breath?")
                .reprompt("Are they experiencing shortness of breath?")
                .getResponse();
        } else if (awaitingResponse === "shortnessOfBreath") {
            // Handle any follow-up questions after "Yes" response to shortness of breath
            return handlerInput.responseBuilder
                .speak("Stay calm. If the patient is having difficulty breathing, help them sit upright. Is there any other symptom they have?")
                .reprompt("Is there any other symptom they have?")
                .getResponse();
        }

        // Default if we don't know what they're answering to
        return handlerInput.responseBuilder
            .speak("I didn't understand that. Can you repeat?")
            .reprompt("Can you repeat?")
            .getResponse();
    }
};

// No Intent handler - Handling No responses dynamically
const NoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
               Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const awaitingResponse = sessionAttributes.awaitingResponse;

        if (awaitingResponse === "conscious") {
            // Proceed with unconscious patient response
            return handlerInput.responseBuilder
                .speak("If the patient is unconscious, call 999 immediately and begin CPR if necessary. Do you need CPR instructions?")
                .reprompt("Do you need CPR instructions?")
                .getResponse();
        } else if (awaitingResponse === "chestPain") {
            // Chest pain isn't a symptom, proceed to shortness of breath
            return handlerInput.responseBuilder
                .speak("If they are not experiencing chest pain, monitor the patient closely. Are they experiencing any shortness of breath?")
                .reprompt("Are they experiencing any shortness of breath?")
                .getResponse();
        } else if (awaitingResponse === "shortnessOfBreath") {
            // Answer for no shortness of breath
            return handlerInput.responseBuilder
                .speak("If the patient is not experiencing shortness of breath, continue monitoring them closely. Is there any other symptom?")
                .reprompt("Is there any other symptom?")
                .getResponse();
        }

        // Default if we don't know what they're answering to
        return handlerInput.responseBuilder
            .speak("I didn't understand that. Can you repeat?")
            .reprompt("Can you repeat?")
            .getResponse();
    }
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
               Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("You can say things like 'the patient is having a heart attack' or 'the patient is choking'. What emergency are you dealing with?")
            .reprompt("What emergency are you dealing with?")
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
               (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent' ||
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("Goodbye!")
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak("Sorry, I didn't understand that. Can you repeat?")
            .reprompt("Can you repeat?")
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        EmergencyIntentHandler,
        YesIntentHandler,
        NoIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
