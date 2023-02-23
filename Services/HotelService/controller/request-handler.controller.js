const { json2xml } = require('xml-js');
const validator = require('xsd-schema-validator');
const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, '..', 'DB', 'rooms.xml');
const reservationsDir = path.join(__dirname, '..', 'DB', 'bookedRooms.xml');
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

function getAllRooms(callback) {
  fs.readFile(dataDir, 'utf8', function (err, data) {
    if (!err) {
      callback(data);
    } else {
      console.log(err);
      callback();
    }
  });
}

function generateRoomReservation(xml) {
  fs.readFile(reservationsDir, 'utf-8', function (err, data) {
    var customerConfig = new DOMParser().parseFromString(data);
    customerConfig;

    var ticket = new DOMParser().parseFromString(xml);

    var username =
      ticket.getElementsByTagName('username')[0].childNodes[0].data;

    var price = ticket.getElementsByTagName('price')[0].childNodes[0].data;

    var passportNumber =
      ticket.getElementsByTagName('passport-number')[0].childNodes[0].data;

    var periodDate = ticket.getElementsByTagName('period')[0];

    var from = periodDate.getElementsByTagName('from')[0].childNodes[0].data;
    var to = periodDate.getElementsByTagName('to')[0].childNodes[0].data;

    var roomType =
      ticket.getElementsByTagName('room-type')[0].childNodes[0].data;

    var qualifyingRates =
      ticket.getElementsByTagName('qualifying-rates')[0].childNodes[0].data;

    console.log('username ', username);
    console.log('passportNumber ', passportNumber);
    console.log('from ', from);
    console.log('to ', to);

    console.log('roomType ', roomType);
    console.log('qualifyingRates ', qualifyingRates);

    var bookTag = customerConfig.createElement('book');
    customerConfig.getElementsByTagName('reservations')[0].appendChild(bookTag);

    // append username info
    var usernameTag = customerConfig.createElement('username');
    var usernameValue = customerConfig.createTextNode(username);
    usernameTag.appendChild(usernameValue);

    // append price info
    var priceTag = customerConfig.createElement('price');
    var priceValue = customerConfig.createTextNode(price);
    priceTag.appendChild(priceValue);

    // append passportNumberTag info
    var passportNumberTag = customerConfig.createElement('passport-number');
    var passportNumberValue = customerConfig.createTextNode(passportNumber);
    passportNumberTag.appendChild(passportNumberValue);

    var periodTag = customerConfig.createElement('period');

    var fromTag = customerConfig.createElement('from');
    var toTag = customerConfig.createElement('to');

    var fromValue = customerConfig.createTextNode(from);
    var toValue = customerConfig.createTextNode(to);

    fromTag.appendChild(fromValue);
    toTag.appendChild(toValue);
    periodTag.appendChild(fromTag);
    periodTag.appendChild(toTag);

    // roomType
    var roomTypeTag = customerConfig.createElement('roomType');
    var roomTypeValue = customerConfig.createTextNode(roomType);
    roomTypeTag.appendChild(roomTypeValue);

    // qualifyingRates
    var qualifyingRatesTag = customerConfig.createElement('qualifyingRates');
    var qualifyingRatesValue = customerConfig.createTextNode(qualifyingRates);
    qualifyingRatesTag.appendChild(qualifyingRatesValue);

    var l = customerConfig.getElementsByTagName('book').length;

    customerConfig.getElementsByTagName('book')[l - 1].appendChild(usernameTag);
    customerConfig
      .getElementsByTagName('book')
      [l - 1].appendChild(passportNumberTag);
    customerConfig.getElementsByTagName('book')[l - 1].appendChild(priceTag);

    customerConfig.getElementsByTagName('book')[l - 1].appendChild(periodTag);
    customerConfig.getElementsByTagName('book')[l - 1].appendChild(roomTypeTag);
    customerConfig
      .getElementsByTagName('book')
      [l - 1].appendChild(qualifyingRatesTag);

    var xmlString = new XMLSerializer().serializeToString(customerConfig);
    console.log(xmlString);
    fs.access(reservationsDir, (error) => {
      if (!error) {
        fs.unlink(reservationsDir, function (error) {
          if (error) console.error('Error Occured:', error);
          console.log('File deleted!');
          fs.writeFile(reservationsDir, xmlString, { flag: 'a+' }, (err) => {});
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
  getAllRooms,
  generateRoomReservation,
};
