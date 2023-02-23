const path = require('path');
const express = require('express');
const {
  convertJSToXML,
  getParamSOAPRequest,
  validateAccordingSchema,
  getAllCars,
  generateCarReservation,
} = require('./controller/request-handler.controller');

var cors = require('cors');

const app = express();
app.use(cors());

const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
// Valid XML string

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

app.post('/rent-car', function (req, res) {
  res.header('Content-Type', 'application/xml');
  var param = getParamSOAPRequest(req.body);
  var xml = convertJSToXML(param);
  validateAccordingSchema(
    path.join(__dirname, 'Schema', 'book-car.xsd'),
    xml,
    (errorMessage) => {
      if (errorMessage) {
        console.log('request is not valid according to schema', errorMessage);
        return res
          .status(400)
          .send({ error: 'request is not valid according to schema' });
      } else {
        generateCarReservation(xml);
        console.log('request is valid according to schema');
        return res.status(200).send({ hi: true });
      }
    }
  );
});

app.post('/cars', (req, res) => {
  getAllCars((data) => {
    if (data) {
      console.log(data);
      return res.status(200).send(data);
    } else {
      return res.status(400).send('<error>!<error>');
    }
  });
});

app.listen(3001, () => {
  console.log('CarRentingServer started on port : 3001');
});
