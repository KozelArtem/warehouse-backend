const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path}`);
  next();
});

app.use(routes);

http.createServer(app).listen(process.env.PORT || 3000, () => {
  console.log(`Server started at ${3000}`);
});
