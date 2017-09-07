'use strict';

var http = require('http');
var xml2js = require('xml2js-parser');
var util = require('util');

var httpOptions = {
  host: 'web.mta.info',
  path: '/status/ServiceStatusSubway.xml',
  method: 'GET'
};

var xml2jsOptions = {  // options passed to xml2js parser
  explicitCharkey: false, // undocumented
  trim: false,            // trim the leading/trailing whitespace from text nodes
  normalize: false,       // trim interior whitespace inside text nodes
  explicitRoot: false,    // return the root node in the resulting object?
  emptyTag: null,         // the default value for empty nodes
  explicitArray: true,    // always put child nodes in an array
  ignoreAttrs: true,     // ignore attributes, only create text nodes
  mergeAttrs: false,      // merge attributes and child elements
  validator: null         // a callable validator
};
var parser = new xml2js.Parser(xml2jsOptions);


//exports.handler = (event, context, callback) => {  
  var req = http.request(httpOptions);
  req.on('response', res => {
    var body = '';
    res.on('data', chunk => {
      body += chunk;
    });
    res.on('end', function() {
      parser.parseString(body, (err, result) => {
        if (err) console.log(err);
        var situations = result.ServiceDelivery[0].SituationExchangeDelivery[0].Situations[0].PtSituationElement;
        console.log(util.inspect(situations, false, null));
        var lineStatus = "Good!";
        //callback(null, lineStatus);
      });
    });
});
  req.on('error', err => { console.log('REQUEST ERROR: ' + err); })
  req.end();
//}