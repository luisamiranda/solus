const express = require('express');

const app = express();

module.exports = app
  .use(express.static(__dirname + '/public'))
  .get('/', (req, res, next) => res.render('index'))
  .get('/', (err, req, res, next) => console.error(err))
  .listen(5050, (req, res, next) => console.log('solus listening 5050'))