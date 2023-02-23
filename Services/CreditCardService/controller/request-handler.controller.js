const { json2xml } = require('xml-js');
const validator = require('xsd-schema-validator');
const path = require('path');
const fs = require('fs');
var parseString = require('xml2js').parseString;
const dataDir = path.join(__dirname, '..', 'DB', 'cards.xml');
var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;

function getParamSOAPRequest(request) {
  var {
    'soapenv:envelope': {
      'soapenv:body': { param: param },
    },
  } = request;
  return param;
}

function convertJSToXML(data) {
  const json = JSON.stringify(data);
  const xml = json2xml(json, { compact: true, spaces: 4 });
  return xml;
}

function validateAccordingSchema(schema, xml, callback) {
  validator.validateXML(String(xml), schema, function (err, result) {
    if (err) {
      callback(err.message);
    } else {
      callback();
    }
  });
}

function BalanceDeduction(param, callback) {
  var minus = Number(param['credit-card-request']['balance-deduction']);
  var comingCardNumber = param['credit-card-request']['card-number'];
  var newBalance = -100000;

  fs.readFile(dataDir, 'utf-8', function (err, data) {
    var customerConfig = new DOMParser().parseFromString(data);
    customerConfig;
    var cardNumbers = customerConfig.getElementsByTagName('card-number');
    var balances = customerConfig.getElementsByTagName('balance');

    for (let index = 0; index < cardNumbers.length; index++) {
      var cardNumber = cardNumbers[index].childNodes[0].data;
      if (cardNumber === comingCardNumber) {
        var balance = balances[index].childNodes[0].data;
        if (balance > minus) {
          newBalance = balance - minus;
          balances[index].childNodes[0].data = `${newBalance}`;
          callback();
        } else {
          callback('request refused');
        }
      }
    }

    var xmlString = new XMLSerializer().serializeToString(customerConfig);
    console.log(xmlString);
    fs.access(dataDir, (error) => {
      if (!error) {
        fs.unlink(dataDir, function (error) {
          if (error) console.error('Error Occured:', error);
          console.log('File deleted!');
          fs.writeFile(dataDir, xmlString, { flag: 'a+' }, (err) => {});
        });
      } else {
        console.error('Error Occured:', error);
      }
    });
  });
}

module.exports = {
  getParamSOAPRequest,
  convertJSToXML,
  validateAccordingSchema,
  BalanceDeduction,
};
