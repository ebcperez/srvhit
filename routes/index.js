//homepage
const express = require('express')
const router = express.Router()
const passport = require('passport')

//get homepage
router.get('/', function(req, res) {
    res.render('index')
});

Handlebars.registerHelper("if", function(conditional, options) {
  if (options.hash.desired === options.hash.type) {
    options.fn(this);
  } else {
    options.inverse(this);
  }
});

module.exports = router
