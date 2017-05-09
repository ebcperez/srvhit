//handles student registration
const express = require('express')
const router = express.Router()
const expressValidator = require('express-validator')
const mongoose = require('mongoose')

const app = express()

const Student = require('../models/student')

//dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('student/dashboard_student', {user: req.user.toJSON()})
})

//update profile
router.post('/update_profile', (req, res) => {
    let text = req.body.aboutText
    let skill = req.body.skill
    let language = req.body.language
    let workExp = req.body.workexp
    let education = {
        name: req.body.school,
        degree: req.body.degree,
        start: req.body.start,
        end: req.body.end
    }
    let updateId = req.user._id
    Student.getStudentById(updateId ,(err, user) => {
        //console.log(user.contact_info.email)
        Student.findOneAndUpdate(
            {
                'contact_info.email': user.contact_info.email
            },
            {
                $set: {
                    'about.text': text,
                    'about.location.city': req.body.city,
                    'about.location.zipcode': req.body.postalcode
                },
                $addToSet: {
                    'education': education,
                    'experience.skills': skill,
                    'experience.languages': language,
                    'experience.work_experience': workExp
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
    })
    res.redirect('/student/dashboard')
})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/user/login')
    }
}

//add bookmarks
router.post('/add_bookmark', (req, res) => {
    let bookmark = req.body.addBookmark
    Student.getStudentById(req.user._id ,(err, user) => {
        Student.findOneAndUpdate(
            {
                'contact_info.email': user.contact_info.email
            },
            {
                $addToSet: {
                    'bookmarks': bookmark
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
    })
    res.redirect('/search')
})

//delete bookmarks
router.get('/delete_bookmark/:email', (req, res) => {
    let bookmark = req.params.email
    console.log(bookmark)
    Student.getStudentById(req.user._id ,(err, user) => {
        Student.findOneAndUpdate(
            {
                'contact_info.email': user.contact_info.email
            },
            {
                $pull: {
                    'bookmarks': bookmark
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
    })
    res.redirect('/student/dashboard')
})

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
    res.render('student/register_student')
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
        res.render('student/register_student', {
            errors: errors
        })
    } else {
        //time created
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var hour = d.getHours();
        var minutes = d.getMinutes();
        var seconds = d.getSeconds();
        var year = d.getFullYear();
        var time = `${month}-${day}-${year} - ${hour}:${minutes}:${seconds}`
        console.log(`Account created on: ${time}`)
        //else create new user
        let newStudent = new Student({
            about: {
                name: {
                    first: first_name,
                    last: last_name,
                },
                location: {
                    city: city,
                    zipcode: zipcode
                },
            },
            contact_info: {
                email: email, 
                websites: [website1]
            },
            enabled: true,
            username: username,
            password: password,
            account_type: 'student',
            created: time
        })
        Student.createStudent(newStudent, (err, student) => {
            if (err) throw err
            console.log(student)
        })
        req.flash('success_msg', 'You have successfully registered.')
        res.redirect('/')
    }
})

module.exports = router