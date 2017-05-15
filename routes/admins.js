//handles admin registration
const express = require('express')
const router = express.Router()
const expressValidator = require('express-validator')
const mongoose = require('mongoose')

const Admin = require('../models/admin')
const User = require('../models/user')

//admin dashboard
router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard_admin')
})

//disable account
router.post('/disable', (req, res) => {
    let account = req.body.email
    User.findOneAndUpdate(
        {
            'contact_info.email': account
        },
        {
            $set: {
                'enabled': false
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
        }
    )
    res.redirect('/search')
})

//get register view
router.get('/register_admin', (req, res) => {
    res.render('admin/register_admin')
})

//post admin registration form
router.post('/register_admin', (req, res) => {
    let username = req.body.username
    let phone = req.body.phone
    let email = req.body.email
    let password = req.body.password
    let password2 = req.body.password2

    //validation
    req.checkBody('phone', 'Phone is required.').notEmpty()
    req.checkBody('email', 'Email is required.').notEmpty()
    req.checkBody('email', 'Email is not valid.').isEmail()
    req.checkBody('password', 'Password is required.').notEmpty()
    req.checkBody('password2', 'Passwords do not match.').equals(req.body.password)

    //rerender page with errors
    let errors = req.validationErrors()
    if (errors) {
        res.render('admin/register_admin', {
            errors: errors
        })
    } else {
        //else create new admin
        let newAdmin = new Admin({
            username: username,
            contact_info: {
                email: email, 
                phone: phone,
            },
            password: password,
            account_type: 'admin'
        })
        Admin.createAdmin(newAdmin, (err, admin) => {
            if (err) throw err
            console.log(admin)
        })
        req.flash('success_msg', 'Admin successfully registered.')
        res.redirect('/user/login')
    }
})

module.exports = router