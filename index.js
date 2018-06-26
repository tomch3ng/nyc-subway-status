'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = "amzn1.ask.skill.8fcd2dcd-cb76-436b-83e2-cb05e9458484";

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'NYC Subway Status',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, what\'s the status of the F train? ... Now, what can I help you with?",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s - Status of the %s train',
            NORMAL_SERVICE_MESSAGE : 'The %s train is running normally.',
            HELP_MESSAGE: "You can say tell me the status of the F train, for example, or you can say exit... What can I help you with?",
            HELP_REPROMPT: "What can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            STATUS_REPEAT_MESSAGE: 'Try saying repeat.',
            STATUS_NOT_FOUND_REPROMPT: 'What else can I help with?',
        },
    },
}

const handlers = {
    'LaunchRequest': function () {
        console.log("LaunchRequest triggered for " + lineName);
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'SubwayStatusIntent': function () {
        const lineSlot = this.event.request.intent.slots.SubwayLine;
        let lineName;

        if (lineSlot && lineSlot.value) {
            lineName = lineSlot.value.toLowerCase();
        }

        console.log("SubwayStatusIntent triggered for " + lineName);

        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), lineName);
        const lineStatus = this.t('NORMAL_SERVICE_MESSAGE', lineName);

        console.log("lineStatus defined as " + lineStatus);
        
        if (lineStatus) {
            this.attributes.speechOutput = lineStatus;
            this.attributes.repromptSpeech = this.t('STATUS_REPEAT_MESSAGE');
            this.emit(':askWithCard', lineStatus, this.attributes.repromptSpeech, cardTitle, lineStatus);
        } else {
            let speechOutput = this.t('STATUS_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('STATUS_NOT_FOUND_REPROMPT');
            if (lineName) {
                speechOutput += this.t('STATUS_NOT_FOUND_WITH_ITEM_NAME', lineName);
            } else {
                speechOutput += this.t('STATUS_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'Unhandled': function () {
        console.log("Unhandled intent");
        
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
