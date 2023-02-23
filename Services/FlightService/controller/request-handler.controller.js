var { json2xml } = require('xml-js');
var validator = require('xsd-schema-validator');
const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, '..', 'DB', 'flights.xml');
const reservationsDir = path.join(__dirname, '..', 'DB', 'tickets.xml');
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

function getAllFlights(callback) {
  fs.readFile(dataDir, 'utf8', function (err, data) {
    if (!err) {
      callback(data);
    } else {
      console.log(err);
      callback();
    }
  });
}

function generateFlightReservation(xml) {
  fs.readFile(reservationsDir, 'utf-8', function (err, data) {
    var customerConfig = new DOMParser().parseFromString(data);
    customerConfig;

    var ticket = new DOMParser().parseFromString(xml);

    var username =
      ticket.getElementsByTagName('username')[0].childNodes[0].data;
    var passportNumber =
      ticket.getElementsByTagName('passport-number')[0].childNodes[0].data;
    var price = ticket.getElementsByTagName('price')[0].childNodes[0].data;
    var addresses = ticket.getElementsByTagName('addresses')[0];

    var startingCity =
      addresses.getElementsByTagName('starting-city')[0].childNodes[0].data;
    var destination =
      addresses.getElementsByTagName('destination')[0].childNodes[0].data;
    var period = ticket.getElementsByTagName('period')[0];

    var going = period.getElementsByTagName('going')[0].childNodes[0].data;
    var returning =
      period.getElementsByTagName('returning')[0].childNodes[0].data;

    var passengerType = ticket.getElementsByTagName('passenger-type')[0];
    for (
      let index = 0;
      index < passengerType.getElementsByTagName('type').length;
      index++
    ) {
      var element =
        passengerType.getElementsByTagName('type')[index].childNodes[0].data;
      console.log(`pt ${element}`);
    }

    var passengerNumber =
      ticket.getElementsByTagName('passenger-number')[0].childNodes[0].data;

    var connectingCities = ticket.getElementsByTagName('connecting-cities')[0];
    for (
      let index = 0;
      index < connectingCities.getElementsByTagName('city').length;
      index++
    ) {
      var element =
        connectingCities.getElementsByTagName('city')[index].childNodes[0].data;
      console.log(`c ${element}`);
    }

    var preferences = ticket.getElementsByTagName('preferences')[0];
    var airline =
      preferences.getElementsByTagName('airline')[0].childNodes[0].data;
    var flightType =
      preferences.getElementsByTagName('flight-type')[0].childNodes[0].data;

    console.log(`airline ${airline}`);
    console.log(`flightType ${flightType}`);
    var bookTag = customerConfig.createElement('book');

    customerConfig.getElementsByTagName('reservations')[0].appendChild(bookTag);

    // append username info
    var usernameTag = customerConfig.createElement('username');
    var usernameValue = customerConfig.createTextNode(username);
    usernameTag.appendChild(usernameValue);

    // append passportNumber info
    var passportNumberTag = customerConfig.createElement('passport-number');
    var passportNumberValue = customerConfig.createTextNode(passportNumber);
    passportNumberTag.appendChild(passportNumberValue);

    // append price info
    var priceTag = customerConfig.createElement('price');
    var priceValue = customerConfig.createTextNode(price);
    priceTag.appendChild(priceValue);

    // append addresses info

    var addressesTag = customerConfig.createElement('addresses');

    var startingCityTag = customerConfig.createElement('starting-city');
    var startingCityValue = customerConfig.createTextNode(startingCity);

    var destinationTag = customerConfig.createElement('destination');
    var destinationValue = customerConfig.createTextNode(destination);

    startingCityTag.appendChild(startingCityValue);
    destinationTag.appendChild(destinationValue);

    addressesTag.appendChild(startingCityTag);
    addressesTag.appendChild(destinationTag);

    // append addresses info

    var periodTag = customerConfig.createElement('period');

    var goingTag = customerConfig.createElement('going');
    var goingValue = customerConfig.createTextNode(going);

    var returningTag = customerConfig.createElement('returning');
    var returningValue = customerConfig.createTextNode(returning);

    goingTag.appendChild(goingValue);
    returningTag.appendChild(returningValue);

    periodTag.appendChild(goingTag);
    periodTag.appendChild(returningTag);

    // passenger-number appending

    var passengerNumberTag = customerConfig.createElement('passenger-number');
    var passengerNumberValue = customerConfig.createTextNode(passengerNumber);
    passengerNumberTag.appendChild(passengerNumberValue);

    // preferencesTag

    var preferencesTag = customerConfig.createElement('preferences');

    var airlineTag = customerConfig.createElement('airline');
    var airlineValue = customerConfig.createTextNode(going);

    var flightTypeTag = customerConfig.createElement('flight-type');
    var flightTypeValue = customerConfig.createTextNode(returning);

    airlineTag.appendChild(airlineValue);
    flightTypeTag.appendChild(flightTypeValue);

    preferencesTag.appendChild(airlineTag);
    preferencesTag.appendChild(flightTypeTag);

    //  passengerTypeTag
    var passengerTypeTag = customerConfig.createElement('passenger-type');

    var passengerTypes = ticket.getElementsByTagName('passenger-type')[0];
    for (
      let index = 0;
      index < passengerTypes.getElementsByTagName('type').length;
      index++
    ) {
      var element =
        passengerTypes.getElementsByTagName('type')[index].childNodes[0].data;

      var typeTag = customerConfig.createElement('type');
      var typeValue = customerConfig.createTextNode(element);
      typeTag.appendChild(typeValue);
      passengerTypeTag.appendChild(typeTag);
    }

    var l = customerConfig.getElementsByTagName('book').length;

    customerConfig.getElementsByTagName('book')[l - 1].appendChild(usernameTag);
    customerConfig
      .getElementsByTagName('book')
      [l - 1].appendChild(passportNumberTag);

    customerConfig.getElementsByTagName('book')[l - 1].appendChild(priceTag);

    customerConfig
      .getElementsByTagName('book')
      [l - 1].appendChild(addressesTag);

    customerConfig.getElementsByTagName('book')[l - 1].appendChild(periodTag);

    customerConfig
      .getElementsByTagName('book')
      [l - 1].appendChild(passengerNumberTag);
    customerConfig
      .getElementsByTagName('book')
      [l - 1].appendChild(preferencesTag);

    customerConfig
      .getElementsByTagName('book')
      [l - 1].appendChild(passengerTypeTag);

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
  getAllFlights,
  generateFlightReservation,
};
