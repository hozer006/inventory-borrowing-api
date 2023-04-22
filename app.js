const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");


// require('dotenv').config();

const app = express();

let corsOption = {
  credentials: true,
  origin: ["http://localhost:8081"],
};

app.use(cors(corsOption));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const routes =  require ("./routes/routes");
routes(app);
app.get('/', (req, res) => {
  res.send('Hello user, welcome to Book management Application');
});

app.all('*', (req, res) => {
  res.status(200).send('Oooooops, wrong endpoint!');
});

module.export = app;