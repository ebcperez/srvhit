//handles admin registration
const express = require('express')
const router = express.Router()
const expressValidator = require('express-validator')
const mongoose = require('mongoose')

const Admin = require('../models/admin')

//admin dashboard
router.get('/', (req, res) => {
    User.find({}, 'username contact_info account_type company_name', (err, docs) => {
        if (err) throw err
        res.send('admin/dashboard')
    })
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