//handles student registration
const express = require('express')
const router = express.Router()
const expressValidator = require('express-validator')
const mongoose = require('mongoose')

const app = express()

const User = require('../models/user')

//render profile page of user
router.get('/:profile', (req, res) => {
    console.log('params: '+req.params.profile)
    User.findOne({'contact_info.email': req.params.profile}, (err, user) => {
        if (err) throw err
        res.render('search/profile_view', {user: user.toJSON()})
    })
})

module.exports = router
