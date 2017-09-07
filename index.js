'use strict';
var Alexa = require('alexa-sdk');

var APP_ID = "amzn1.ask.skill.8fcd2dcd-cb76-436b-83e2-cb05e9458484";

var SKILL_NAME = "NYC Subway Status";
var GET_STATUS_MESSAGE = "The status of the F train is: ";
var HELP_MESSAGE = "You can say tell me the status of the F train, or, you can say exit... What can I help you with?";
var HELP_REPROMPT = "What can I help you with?";
var STOP_MESSAGE = "Goodbye!";

//=========================================================================================================================================
//Editing anything below this line might break your skill.  
//=========================================================================================================================================
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('SubwayStatusIntent');
    },
    'SubwayStatusIntent': function () {
        var lineStatus = "Good";
        var speechOutput = GET_STATUS_MESSAGE + lineStatus;
        this.emit(':tellWithCard', speechOutput, SKILL_NAME, lineStatus);
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    }
};