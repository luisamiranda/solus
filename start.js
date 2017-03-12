const express = require('express');

const app = express();

module.exports = app
  .use(express.static(__dirname + '/public'))
  .get('/', (req, res, next) => res.render('index'))
  .listen(3000, (req, res, next) => console.log('listening 3000'))
