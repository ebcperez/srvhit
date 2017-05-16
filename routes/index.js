//homepage
const express = require('express')
const router = express.Router()
const passport = require('passport')

//get homepage
router.get('/', function(req, res) {
    res.render('index')
});

Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
    if( lvalue!=rvalue ) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});

module.exports = router
