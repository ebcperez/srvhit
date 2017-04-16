const express = require('express')
const router = express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const expressValidator = require('express-validator')
const mongoose = require('mongoose')
const Handlebars = require('express-handlebars')

const app = express()

const Student = require('../models/student')
const User = require('../models/user')

//.edu email validator
app.use(expressValidator({
 customValidators: {
    eduEmail: function(email) {
        return email.substring(email.length-4, email.length+1) === '.edu'
    }
 }
}))

//get register view
router.get('/register_student', (req, res) => {
    res.render('talent/register_student')
})

//renders dashboard based on account type of user
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('talent/dashboard_student', {user: req.user})
})
//passed into function above as parameter
//prevents user from accessing dashboard if not logged in
function ensureAuthenticated(req, res, next) {
    console.log(req)
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/students/login')
    }
}

//post student registration form
router.post('/register_student', (req, res) => {
    let first_name = req.body.first_name
    let last_name = req.body.last_name
    let email = req.body.email
    let website1 = req.body.website1
    let city = req.body.city
    let zipcode = req.body.postalcode
    let username = req.body.username
    let password = req.body.password
    let password2 = req.body.password2

    //validation
    req.checkBody('first_name', 'First name is required.').notEmpty()
    req.checkBody('last_name', 'Last name is required.').notEmpty()
    req.checkBody('email', 'Email is required.').notEmpty()
    req.checkBody('email', 'Email is not valid.').isEmail()
    req.checkBody('email', 'Email must be .edu.').eduEmail()
    req.checkBody('city', 'City is required.').notEmpty()
    req.checkBody('postalcode', 'Postal Code is required.').notEmpty()
    req.checkBody('username', 'Name is required.').notEmpty()
    req.checkBody('password', 'Password is required.').notEmpty()
    req.checkBody('password2', 'Passwords do not match.').equals(req.body.password)

    //rerender page with errors
    let errors = req.validationErrors()
    if (errors) {
        res.render('register_student', {
            errors: errors
        })
    } else {
        //else create new user
        let newStudent = new Student({
            about: {
                name: {
                    first: first_name,
                    last: last_name,
                }
            },
            location: {
                city: city,
                zipcode: zipcode
            },
            contact_info: {email: email, websites: [website1]},
            username: username,
            password: password,
            account_type: 'student'
        })
        Student.createUser(newStudent, (err, student) => {
            if (err) throw err
            console.log(student)
        })
        req.flash('success_msg', 'You have successfully registered.')
        res.redirect('/students/login')
    }
})
//log in authentication
passport.use(new LocalStrategy(
    function(username, password, done) {
        Student.getUserByUsername(username, function(err, student) {
            if (err) throw err
            //if username not found in database
            if (!student) {
                return done(null, false, {message: 'Unknown User'})
            }
            Student.comparePassword(password, student.password, function(err, isMatch) {
                if (err) throw err
                if (isMatch) {
                    return done(null, student)
                } else {
                    return done(null, false, {message: 'Invalid password'})
                }
            })
        })
    }
))

passport.serializeUser(function(student, done) {
    done(null, student.id);
});

passport.deserializeUser(function(id, done) {
    Student.getUserById(id, function(err, student) {
        done(err, student);
    });
});
//redirects user to dashboard if logged in succesfully, log in page is rerendered otherwise
router.post('/login', passport.authenticate('local', {successRedirect: '/students/dashboard', failureRedirect: '/students/login', failureFlash: true}), 
    function(req, res) {
        res.redirect('/')
    }
)
router.get('/logout', function(req, res) {
    req.logout()
    req.flash('success_msg', 'You are logged out.')
    res.redirect('/students/login')
})

module.exports = router