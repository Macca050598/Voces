const Alexa = require('ask-sdk-core');

// Dictionary mapping symptoms to medical emergencies
const SYMPTOM_MAPPING = {
    // Adrenal crisis
    "collapse": "adrenal crisis",
    "pallor": "adrenal crisis",
    "cold skin": "adrenal crisis",
    "clammy skin": "adrenal crisis",
    "hypotension": "adrenal crisis",
    "dizziness": "adrenal crisis",
    "vomiting": "adrenal crisis",
    "diarrhea": "adrenal crisis",
    
    // Anaphylaxis
    "sudden onset": "anaphylaxis",
    "urticaria": "anaphylaxis",
    "angioedema": "anaphylaxis",
    "flushing": "anaphylaxis",
    "respiratory distress": "anaphylaxis",
    "stridor": "anaphylaxis",
    "wheeze": "anaphylaxis",
    "hoarseness": "anaphylaxis",
    "tachycardia": "anaphylaxis",
    
    // Asthma
    "breathlessness": "asthma",
    "expiratory wheeze": "asthma",
    "inability to complete sentences": "asthma",
    "cyanosis": "asthma",
    
    // Cardiac Emergencies
    "chest pain": "cardiac emergency",
    "discomfort": "cardiac emergency",
    "pressure": "cardiac emergency",
    "squeezing": "cardiac emergency",
    "heaviness": "cardiac emergency",
    "pain spreading": "cardiac emergency",
    "sweaty": "cardiac emergency",
    "light-headed": "cardiac emergency",
    
    // Epileptic seizures
    "seizure": "epileptic seizure",
    "rigidity": "epileptic seizure",
    "jerking": "epileptic seizure",
    "noisy breathing": "epileptic seizure",
    "tongue bitten": "epileptic seizure",
    "frothing": "epileptic seizure",
    "incontinence": "epileptic seizure",
    
    // Hypoglycaemia
    "shaking": "hypoglycaemia",
    "trembling": "hypoglycaemia",
    "slurred speech": "hypoglycaemia",
    "sweating": "hypoglycaemia",
    "blurred vision": "hypoglycaemia",
    "tiredness": "hypoglycaemia",
    "lethargy": "hypoglycaemia",
    "confusion": "hypoglycaemia",
    "aggression": "hypoglycaemia",
    
    // Red Flag Sepsis
    "deterioration": "red flag sepsis",
    "abnormal physiology": "red flag sepsis",
    "high heart rate": "red flag sepsis",
    "high respiratory rate": "red flag sepsis",
    "low oxygen": "red flag sepsis",
    "mottled": "red flag sepsis",
    "ashen": "red flag sepsis",
    "cyanotic": "red flag sepsis",
    "not passed urine": "red flag sepsis",
    
    // Stroke
    "facial weakness": "stroke",
    "arm weakness": "stroke",
    "speech problems": "stroke",
    
    // Syncope
    "faint": "syncope",
    "dizzy": "syncope",
    "light headed": "syncope",
    "slow pulse": "syncope",
    "low bp": "syncope"
};

// Management steps for each emergency
const MANAGEMENT = {
    "adrenal crisis": [
        "Call 999, state 'Addisonian crisis', SBAR",
        "Lie flat, administer oxygen 15 litres/min",
        "Patient's hydrocortisone emergency IM kit at hand: hydrocortisone 100mg IM"
    ],
    "anaphylaxis": [
        "Call 999, state 'Anaphylaxis', SBAR",
        "Lie flat, elevate legs (if breathing not impaired); administer oxygen 15 litres/min",
        "Administer adrenaline 500 micrograms IM (0.5ml of 1:1000)",
        "Repeat adrenaline at 5 minute intervals until an adequate response",
        "Paediatric doses of adrenaline: 6-12 yrs - 300 micrograms (0.3ml of 1:1000), > 12 yrs - 500 micrograms (0.5ml of 1:1000)"
    ],
    "asthma": [
        "Airway Breathing Circulation Disability Exposure",
        "Sit upright, if available, follow patient's personalised asthma action plan (PAAP)",
        "2 puffs (100 micrograms/puff) β2 bronchodilator, inhaler & spacer; repeat doses may be necessary",
        "Unsatisfactory/no response or if severe/life threatening: Call 999, SBAR",
        "While awaiting ambulance: oxygen 15 litres/min, β2 bronchodilator via spacer"
    ],
    "cardiac emergency": [
        "Call 999, state 'heart attack', SBAR",
        "If patient is conscious, ask if they are experiencing chest pain",
        "If patient is unconscious, begin CPR if available",
        "Make sure they're in a comfortable position (usually sitting up)",
        "GTN spray 400-800mcg (typically 1-2 activations) sub lingual",
        "Dispersible aspirin 300 mg to chew"
    ],
    "epileptic seizure": [
        "Airway Breathing Circulation Disability Exposure",
        "Safe environment: prevent injury, do not put anything into mouth, do not restrain",
        "Administer oxygen 15 litres/min; note timings of seizure",
        "Once jerking movements cease: recovery position",
        "If available, follow Patient's Treatment Plan; Call 999 if necessary, SBAR"
    ],
    "hypoglycaemia": [
        "Airway Breathing Circulation Disability Exposure",
        "Offer 15-20g quick acting carbohydrate e.g. 4-5 Glucotabs® or 1.5 - 2 tubes of Glucogel®",
        "If unconscious: Call 999, SBAR, recovery position, glucagon 1mg IM",
        "Once consciousness returns, offer oral carbohydrate",
        "If able, measure blood sugar to help confirm correct diagnosis"
    ],
    "red flag sepsis": [
        "Airway Breathing Circulation Disability Exposure",
        "Call 999, state 'Red Flag Sepsis', SBAR",
        "Oxygen 15 litres/min",
        "Ensure paramedics pre-alert as 'Red Flag Sepsis'"
    ],
    "stroke": [
        "Airway Breathing Circulation Disability Exposure",
        "Act FAST & call 999, SBAR",
        "Administer oxygen 15 litres/min",
        "Nil by mouth; appropriate position"
    ],
    "syncope": [
        "Airway Breathing Circulation Disability Exposure",
        "Lie flat, elevate legs & loosen tight clothing; oxygen? (not usually necessary)",
        "Once consciousness returns, offer glucose in water or sweet tea",
        "Slow recovery: consider alternative diagnosis; unresponsive: check signs of life"
    ]
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = "Hi! Do you know what emergency you're dealing with, or would you like to describe the symptoms?";
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const KnownEmergencyIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
               Alexa.getIntentName(handlerInput.requestEnvelope) === 'KnownEmergencyIntent';
    },
    handle(handlerInput) {
        const emergencyType = Alexa.getSlotValue(handlerInput.requestEnvelope, 'emergencyType');
        
        if (!emergencyType) {
            return handlerInput.responseBuilder
                .speak("I didn't catch the emergency type. Can you please repeat it?")
                .reprompt("What emergency are you dealing with?")
                .getResponse();
        }
        
        // Convert to lowercase for matching
        const emergencyLower = emergencyType.toLowerCase();
        
        // Check if we have management steps for this emergency
        if (MANAGEMENT[emergencyLower]) {
            const steps = MANAGEMENT[emergencyLower];
            const stepsText = steps.join(". ");
            
            const speakOutput = `For ${emergencyLower}, follow these steps: ${stepsText}`;
            
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt("Do you need me to repeat the steps?")
                .getResponse();
        } else {
            return handlerInput.responseBuilder
                .speak(`I don't have specific information for ${emergencyType}. Would you like to describe the symptoms instead?`)
                .reprompt("Would you like to describe the symptoms?")
                .getResponse();
        }
    }
};

const DescribeSymptomsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
               Alexa.getIntentName(handlerInput.requestEnvelope) === 'DescribeSymptomsIntent';
    },
    handle(handlerInput) {
        // Set state to indicate we're waiting for symptoms
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.state = 'awaiting_symptoms';
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        
        return handlerInput.responseBuilder
            .speak("Please describe the symptoms you're observing.")
            .reprompt("What symptoms is the patient showing?")
            .getResponse();
    }
};

const SymptomsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
               Alexa.getIntentName(handlerInput.requestEnvelope) === 'SymptomsIntent';
    },
    handle(handlerInput) {
        const symptomsText = Alexa.getSlotValue(handlerInput.requestEnvelope, 'symptoms');
        
        if (!symptomsText) {
            return handlerInput.responseBuilder
                .speak("I didn't catch the symptoms. Can you please describe them again?")
                .reprompt("What symptoms is the patient showing?")
                .getResponse();
        }
        
        // Convert to lowercase for matching
        const symptomsLower = symptomsText.toLowerCase();
        
        // Identify emergency based on symptoms
        const emergencyCounts = {};
        
        for (const symptom in SYMPTOM_MAPPING) {
            if (symptomsLower.includes(symptom)) {
                const emergency = SYMPTOM_MAPPING[symptom];
                emergencyCounts[emergency] = (emergencyCounts[emergency] || 0) + 1;
            }
        }
        
        if (Object.keys(emergencyCounts).length > 0) {
            // Find the emergency with the most matching symptoms
            let likelyEmergency = null;
            let maxCount = 0;
            
            for (const emergency in emergencyCounts) {
                if (emergencyCounts[emergency] > maxCount) {
                    maxCount = emergencyCounts[emergency];
                    likelyEmergency = emergency;
                }
            }
            
            const steps = MANAGEMENT[likelyEmergency];
            const stepsText = steps.join(". ");
            
            const speakOutput = `Based on the symptoms, this appears to be ${likelyEmergency}. Follow these steps: ${stepsText}`;
            
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt("Do you need me to repeat the steps?")
                .getResponse();
        } else {
            return handlerInput.responseBuilder
                .speak("I couldn't identify the emergency from those symptoms. Can you provide more details or specific symptoms?")
                .reprompt("What specific symptoms is the patient showing?")
                .getResponse();
        }
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
            .speak("I can help with dental medical emergencies. You can tell me what emergency you're dealing with, or describe the symptoms and I'll try to identify it.")
            .reprompt("Would you like to tell me the emergency type or describe the symptoms?")
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
        KnownEmergencyIntentHandler,
        DescribeSymptomsIntentHandler,
        SymptomsIntentHandler,
        YesIntentHandler,
        NoIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
