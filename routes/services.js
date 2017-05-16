//services
'use strict';
const nodemailer = require('nodemailer');
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const crypto = require('crypto')
const expressValidator = require('express-validator')
const bcrypt = require('bcryptjs')

const User = require('../models/user')

//forgot password
router.get('/forgot_password', function(req, res) {
    res.render('services/forgot_password')
})
//reset password
router.get('/reset_password/:email', function(req, res) {
    res.render('services/reset_password', {email: req.params.email})
})

//send mail with password reset link
router.post('/send_password', (req, res) => {
    console.log('https://srvhit.herokuapp.com/services/reset/' + req.body.email)
    var token
    crypto.randomBytes(20, function(err, buf) {
        token = buf.toString('hex')
    })
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'yahoo',
        auth: {
            user: 'teamjned@yahoo.com',
            pass: 'srvhit1234'
        }
    })
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"SRVHIT" <teamjned@yahoo.com>', // sender address
        to: req.body.email, // list of receivers
        subject: 'Reset Password', // Subject line
        text: 'https://srvhit.herokuapp.com/services/reset/' + req.body.email, // plain text body
    }
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response)
    })
    res.redirect('/services/forgot_password')
})

//reset password
router.post('/reset_password/:email', (req, res) => {
    let email = req.params.email
    let password1 = req.body.password1
    let password2 = req.body.password2
    console.log(password1)

    //check if password matches
    req.checkBody('password1', 'Password is required.').notEmpty()
    req.checkBody('password2', 'Passwords do not match.').equals(req.body.password1)

    //rerender page with errors
    let errors = req.validationErrors()
    if (errors) {
        res.render(`services/reset_password`, {
            errors: errors,
            email: req.params.email
        })
    } else {

        //hash new password
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password1, salt, function(err, hash) {
                password1 = hash
                User.findOneAndUpdate(
                {
                    'contact_info.email': email
                },
                {
                    $set: {
                        'password': password1
                    }
                },
                {
                    returnNewDocument: true
                },
                function(err, doc) {
                    if(err) console.log(err)
                    else {
                        console.log(doc)
                    }
                })
            res.redirect('/user/login')
            })
        })
        console.log(password1)
    }
})

module.exports = router