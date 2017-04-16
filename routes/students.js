//handles student registration
const express = require('express')
const router = express.Router()
const expressValidator = require('express-validator')
const mongoose = require('mongoose')

const app = express()

const Student = require('../models/student')

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
        res.render('talent/register_student', {
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
        Student.createStudent(newStudent, (err, student) => {
            if (err) throw err
            console.log(student)
        })
        req.flash('success_msg', 'You have successfully registered.')
        res.redirect('/user/login')
    }
})

module.exports = router