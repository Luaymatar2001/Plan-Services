const path = require('path');
const express = require('express');
const {
  convertJSToXML,
  getParamSOAPRequest,
  validateAccordingSchema,
  BalanceDeduction,
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

app.post('/card-validation', function (req, res) {
  res.header('Content-Type', 'application/xml');
  var param = getParamSOAPRequest(req.body);
  var xml = convertJSToXML(param);
  validateAccordingSchema(
    path.join(__dirname, 'Schema', 'credit-card-request.xsd'),
    xml,
    (errorMessage) => {
      if (errorMessage) {
        console.log('request is not valid according to schema', errorMessage);
        return res
          .status(400)
          .send({ error: 'request is not valid according to schema' });
      } else {
        BalanceDeduction(param, (err) => {
          if (!err) {
            return res.status(200).send(`<message>OK</message>`);
          } else {
            return res.status(400).send(`<message>${err}</message>`);
          }
        });
      }
    }
  );
});

app.listen(3003, () => {
  console.log('CreditCardServer started on port : 3003');
});
