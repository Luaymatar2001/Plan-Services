const { json2xml } = require('xml-js');
const validator = require('xsd-schema-validator');
const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, '..', 'DB', 'cars.xml');
const reservationsDir = path.join(__dirname, '..', 'DB', 'rentedCars.xml');
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
      console.log('error in xml according to schema validation', err);
      callback(err);
    } else {
      console.log('validated  done');
      callback();
    }
  });
}

function getAllCars(callback) {
  fs.readFile(dataDir, 'utf8', function (err, data) {
    if (!err) {
      callback(data);
    } else {
      console.log(err);
      callback();
    }
  });
}

function generateCarReservation(xml) {
  fs.readFile(reservationsDir, 'utf-8', function (err, data) {
    var customerConfig = new DOMParser().parseFromString(data);
    customerConfig;

    var ticket = new DOMParser().parseFromString(xml);

    var username =
      ticket.getElementsByTagName('username')[0].childNodes[0].data;

    var passportNumber =
      ticket.getElementsByTagName('passport-number')[0].childNodes[0].data;

    var price = ticket.getElementsByTagName('price')[0].childNodes[0].data;

    var rateCode =
      ticket.getElementsByTagName('rate-code')[0].childNodes[0].data;

    var promotionalDescription = ticket.getElementsByTagName(
      'promotional-description'
    )[0].childNodes[0].data;

    var travelDistanceType = ticket.getElementsByTagName(
      'travel-distance-type'
    )[0].childNodes[0].data;

    var passengerNumber =
      ticket.getElementsByTagName('passenger-number')[0].childNodes[0].data;

    var guestReservationType = ticket.getElementsByTagName(
      'guest-reservation-type'
    )[0].childNodes[0].data;

    var periodDate = ticket.getElementsByTagName('period')[0];

    var from = periodDate.getElementsByTagName('rent')[0].childNodes[0].data;
    var to = periodDate.getElementsByTagName('return')[0].childNodes[0].data;

    console.log('passengerNumber ', passengerNumber);

    var bookTag = customerConfig.createElement('book');

    customerConfig.getElementsByTagName('reservations')[0].appendChild(bookTag);

    var preferences = ticket.getElementsByTagName('preferences')[0];

    var carType =
      preferences.getElementsByTagName('car-type')[0].childNodes[0].data;
    var specialEquipment =
      preferences.getElementsByTagName('special-equipment')[0].childNodes[0]
        .data;

    // append username info
    var usernameTag = customerConfig.createElement('username');
    var usernameValue = customerConfig.createTextNode(username);
    usernameTag.appendChild(usernameValue);

    // append passport-number info
    var passportNumberTag = customerConfig.createElement('passport-number');
    var passportNumberValue = customerConfig.createTextNode(passengerNumber);
    passportNumberTag.appendChild(passportNumberValue);

    // append price info
    var priceTag = customerConfig.createElement('price');
    var priceValue = customerConfig.createTextNode(price);
    priceTag.appendChild(priceValue);

    // append rate-code info
    var rateCodeTag = customerConfig.createElement('rate-code');
    var rateCodeValue = customerConfig.createTextNode(rateCode);
    rateCodeTag.appendChild(rateCodeValue);

    // append promotional-description info
    var promotionalDescriptionTag = customerConfig.createElement(
      'promotional-description'
    );
    var promotionalDescriptionValue = customerConfig.createTextNode(
      promotionalDescription
    );
    promotionalDescriptionTag.appendChild(promotionalDescriptionValue);

    // guest-reservation-type

    var guestReservationTypeTag = customerConfig.createElement(
      'guest-reservation-type'
    );
    var guestReservationTypeValue =
      customerConfig.createTextNode(guestReservationType);
    guestReservationTypeTag.appendChild(guestReservationTypeValue);

    /////  periodTag

    var periodTag = customerConfig.createElement('period');

    var goingTag = customerConfig.createElement('rent');
    var goingValue = customerConfig.createTextNode(from);

    var returningTag = customerConfig.createElement('return');
    var returningValue = customerConfig.createTextNode(to);

    goingTag.appendChild(goingValue);
    returningTag.appendChild(returningValue);

    periodTag.appendChild(goingTag);
    periodTag.appendChild(returningTag);

    // travel-distance-type
    var travelDistanceTypeTag = customerConfig.createElement(
      'travel-distance-type'
    );
    var travelDistanceTypeValue =
      customerConfig.createTextNode(travelDistanceType);
    travelDistanceTypeTag.appendChild(travelDistanceTypeValue);

    // passportNumberTag

    var passengerNumberTag = customerConfig.createElement('passenger-number');
    var passengerNumberValue = customerConfig.createTextNode(passengerNumber);
    passengerNumberTag.appendChild(passengerNumberValue);

    // preferencesTag

    var preferencesTag = customerConfig.createElement('preferences');

    var airlineTag = customerConfig.createElement('car-type');
    var airlineValue = customerConfig.createTextNode(carType);

    var flightTypeTag = customerConfig.createElement('special-equipment');
    var flightTypeValue = customerConfig.createTextNode(specialEquipment);

    airlineTag.appendChild(airlineValue);
    flightTypeTag.appendChild(flightTypeValue);

    preferencesTag.appendChild(airlineTag);
    preferencesTag.appendChild(flightTypeTag);

    var l = customerConfig.getElementsByTagName('book').length;
    customerConfig.getElementsByTagName('book')[l - 1].appendChild(usernameTag);
    customerConfig
      .getElementsByTagName('book')
      [l - 1].appendChild(passportNumberTag);
    customerConfig.getElementsByTagName('book')[l - 1].appendChild(priceTag);
    customerConfig.getElementsByTagName('book')[l - 1].appendChild(rateCodeTag);
    customerConfig
      .getElementsByTagName('book')
      [l - 1].appendChild(promotionalDescriptionTag);

    customerConfig
      .getElementsByTagName('book')
      [l - 1].appendChild(guestReservationTypeTag);

    customerConfig.getElementsByTagName('book')[l - 1].appendChild(periodTag);
    customerConfig
      .getElementsByTagName('book')
      [l - 1].appendChild(travelDistanceTypeTag);

    customerConfig
      .getElementsByTagName('book')
      [l - 1].appendChild(passengerNumberTag);

    customerConfig
      .getElementsByTagName('book')
      [l - 1].appendChild(preferencesTag);

    /* 


    
    var periodTag = customerConfig.createElement('period');

    var goingTag = customerConfig.createElement('rent');
    var goingValue = customerConfig.createTextNode(from);

    var returningTag = customerConfig.createElement('return');
    var returningValue = customerConfig.createTextNode(to);

    goingTag.appendChild(goingValue);
    returningTag.appendChild(returningValue);

    periodTag.appendChild(goingTag);
    periodTag.appendChild(returningTag);





    var preferencesTag = customerConfig.createElement('preferences');

    var airlineTag = customerConfig.createElement('car-type');
    var airlineValue = customerConfig.createTextNode(going);

    var flightTypeTag = customerConfig.createElement('special-equipment');
    var flightTypeValue = customerConfig.createTextNode(returning);

    airlineTag.appendChild(airlineValue);
    flightTypeTag.appendChild(flightTypeValue);

    preferencesTag.appendChild(airlineTag);
    preferencesTag.appendChild(flightTypeTag);


    
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
    customerConfig.getElementsByTagName('book')[l - 1].appendChild(periodTag);
    customerConfig.getElementsByTagName('book')[l - 1].appendChild(roomTypeTag);
    customerConfig
      .getElementsByTagName('book')
      [l - 1].appendChild(qualifyingRatesTag);

      


*/
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
  getAllCars,
  generateCarReservation,
};
