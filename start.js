const express = require('express');

const app = express();

//process.env.HOME
//process.env.SESSION_SECRET

module.exports = app
  .use(express.static(__dirname + '/public'))
  .get('/', (req, res, next) => res.render('index'))
  .get('/github', (req, res, next) => res.redirect('https://github.com/luisamiranda/solus'))
  .get('/', (err, req, res, next) => console.error(err))
  .listen(process.env.PORT || 5050, (req, res, next) => console.log('solus listening 5050'));