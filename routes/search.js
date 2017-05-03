//handles admin registration
const express = require('express')
const router = express.Router()
const expressValidator = require('express-validator')
const mongoose = require('mongoose')

const Admin = require('../models/admin')
const Student = require('../models/student')
const Business = require('../models/business')
const User = require('../models/user')

//displays user accounts
router.get('/', ensureAuthenticated, (req, res) => {
    //if business, display students
    if (req.user.account_type === 'business') {
        Student.find({'account_type': 'student'}, (err, docs) => {
            if (err) throw err
            else {
                res.render('business/business_search', {users: docs})
            }
        })
    }
    //if student, display businesses
    if (req.user.account_type === 'student') {
        Business.find({'account_type': 'business'}, (err, docs) => {
            if (err) throw err
            else {
                res.render('student/student_search', {users: docs})
            }
        })
    }
    //if admin, display all
    if (req.user.account_type === 'admin') {
        User.find({}, (err, docs) => {
            if (err) throw err
            res.render('admin/admin_search', {users: docs})
        })
    }
})

//filter student search results
router.post('/student/filter', (req, res) => {
    Business.find({'about.location.zipcode': req.body.zipcode}, (err, docs) => {
        if (err) throw err
        res.render('student/student_search', {docs})
    })
})

//filter business search results
router.post('/business/filter', (req, res) => {
    Student.find({'about.location.zipcode': req.body.zipcode}, (err, docs) => {
        if (err) throw err
        res.render('business/business_search', {docs})
    })
})

//filter admin database results
router.post('/admin_filter', (req, res) => {
    User.find({'account_type': req.body.filter}, (err, docs) => {
        if (err) throw err
        res.render('admin/admin_search', {users: docs})
    })
})

//look at profile
router.get('/profile', (req, res) => {
    res.render('search/profile_view')
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