//handles log in authentication and page accesss
const express = require('express')
const router = express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const expressValidator = require('express-validator')
const mongoose = require('mongoose')
const Handlebars = require('express-handlebars')

const app = express()

const User = require('../models/user')
const Student = require('../models/student')
const Business = require('../models/business')
const Admin = require('../models/admin')

//login
router.get('/login', (req, res) => {
    res.render('login')
})
//renders dashboard based on account type of user
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    if (req.user.account_type === 'business') {
        res.redirect('/business/dashboard')
    } 
    if (req.user.account_type === 'student') {
        res.redirect('/student/dashboard')
    }
    if (req.user.admin) {
        //render admin page with database documents
        User.find({}, 'name username address contact_info account_type', (err, docs) => {
            if (err) throw err
            else {
                res.render('admin', {docs})
            }
        })
    }
})
//passed into function above as parameter
//prevents user from accessing dashboard if not logged in
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/user/login')
    }
}
//log in authentication
passport.use(new LocalStrategy(function(username, password, done) {
    //check account type
    Student.getStudentByUsername(username, function(err, student) {
        if (err) throw err
        //if username not found in student database look in business database
        if (!student) {
            Business.getBusinessByName(username, function(err, business) {
                if (err) throw err
                //if username not found in database check the admin database
                if (!business) {
                    Admin.getAdminByName(username, function(err, admin) {
                        if (err) throw err
                        //if username not found in database return error message
                        if (!admin) {
                            return done(null, false, {message: 'Unknown User'})
                        }
                        Admin.comparePassword(password, admin.password, function(err, isMatch) {
                            if (err) throw err
                            if (isMatch) {
                                return done(null, admin)
                            } else {
                                return done(null, false, {message: 'Invalid password'})
                            }
                        })
                    })
                }    
                Business.comparePassword(password, business.password, function(err, isMatch) {
                    if (err) throw err
                    if (isMatch) {
                        return done(null, business)
                    } else {
                        return done(null, false, {message: 'Invalid password'})
                    }
                })
            })
        } else {
            //compare passwords
            Student.comparePassword(password, student.password, function(err, isMatch) {
                if (err) throw err
                if (isMatch) {
                    return done(null, student)
                } else {
                    return done(null, false, {message: 'Invalid password'})
                }
            })
        }
    })
}))

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    //check account type
    if(Student.findById(id)) {
        //console.log('Found Student!')
        Student.getStudentById(id, function(err, user) {
            done(err, user);
        });
    } else if(Business.findById(id)) {
        //console.log('Found business!')
        Business.getBusinessById(id, function(err, user) {
            done(err, user);
        });
    } else if(Admin.findById(id)) {
        //console.log('Found Admin!')
        Admin.getAdminById(id, function(err, user) {
            done(err, user);
        });
    }
    
});

//redirects user to dashboard if logged in succesfully, log in page is rerendered otherwise
router.post('/login', passport.authenticate('local', {successRedirect: '/user/dashboard', failureRedirect: '/user/login', failureFlash: true}), 
    function(req, res) {
        res.redirect('/')
    }
)

router.get('/logout', function(req, res) {
    req.logout()
    req.flash('success_msg', 'You are logged out.')
    res.redirect('/user/login')
})

module.exports = router