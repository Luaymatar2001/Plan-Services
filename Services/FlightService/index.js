const path = require('path');
const express = require('express');

const {
  convertJSToXML,
  getParamSOAPRequest,
  validateAccordingSchema,
  getAllFlights,
  generateFlightReservation,
} = require('./controller/request-handler.controller');
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
// Valid XML string

const app = express();

var cors = require('cors');
app.use(cors());

app.use(
  bodyParser.xml({
    limit: '1MB',
    xmlParseOptions: {
      normalize: true,
      normalizeTags: true,
      explicitArray: false,
    },
  })
);

app.post('/book-flight', function (req, res) {
  res.header('Content-Type', 'application/xml');
  var param = getParamSOAPRequest(req.body);
  var xml = convertJSToXML(param);
  validateAccordingSchema(
    path.join(__dirname, 'Schema', 'book-flight.xsd'),
    xml,
    (errorMessage) => {
      if (errorMessage) {
        console.log('request is not valid according to schema', errorMessage);
        return res
          .status(400)
          .send({ error: 'request is not valid according to schema' });
      } else {
        generateFlightReservation(xml);
        console.log('request is valid according to schema');
        return res.status(200).send({ hi: true });
      }
    }
  );
});

app.post('/flights', (req, res) => {
  getAllFlights((data) => {
    if (data) {
      console.log(data);
      return res.status(200).send(data);
    } else {
      return res.status(400).send('<error>!<error>');
    }
  });
});

app.listen(3000, () => {
  console.log('FlightServer started on port : 3000');
});
