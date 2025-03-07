const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Hello! How can I assist in your dental emergency?';
        return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).getResponse();
    }
};

const EmergencyIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
               Alexa.getIntentName(handlerInput.requestEnvelope) === 'EmergencyIntent';
    },
    handle(handlerInput) {
        const speechText = 'What is the patient’s weight?';
        return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);
        return handlerInput.responseBuilder.speak("Sorry, I didn’t understand that.").getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(LaunchRequestHandler, EmergencyIntentHandler)
    .addErrorHandlers(ErrorHandler)
    .lambda();
