//handles admin registration
const express = require('express')
const router = express.Router()
const expressValidator = require('express-validator')
const mongoose = require('mongoose')

const Admin = require('../models/admin')
const Student = require('../models/student')
const Business = require('../models/business')

//displays user accounts
router.get('/', ensureAuthenticated, (req, res) => {
    //if business, display students
    if (req.user.account_type === 'business') {
        Student.find({'account_type': 'student'}, 'username contact_info account_type tags', (err, docs) => {
            if (err) throw err
            else {
                res.render('search/search_results', {users: docs})
            }
        })
    }
    //if student, display businesses
    if (req.user.account_type === 'student') {
        Business.find({'account_type': 'business'}, 'company_name contact_info account_type', (err, docs) => {
            if (err) throw err
            else {
                res.render('search/search_results', {users: docs})
            }
        })
    }
})

//passed into function above as parameter
//prevents user from accessing search if not logged in
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/user/login')
    }
}

//admin dashboard
router.post('/', (req, res) => {
    res.send('filtered')
})

module.exports = router