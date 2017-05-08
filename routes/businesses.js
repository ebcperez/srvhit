//handles business registration
const express = require('express')
const router = express.Router()
const expressValidator = require('express-validator')
const mongoose = require('mongoose')

const app = express()

const Business = require('../models/business')

//dashboard
router.get('/dashboard', (req, res) => {
    res.render('business/dashboard_business', {user: req.user.toJSON()})
})

//update profile
router.post('/update_profile', (req, res) => {
    let text = req.body.aboutText
    let job = {
        position: req.body.position,
        jobType: req.body.jobType,
        description: req.body.description,
        deadline: req.body.deadline,
        tags: [req.body.tags]
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
                    'about.location.address': req.body.address,
                    'about.location.city': req.body.city,
                    'about.location.zipcode': req.body.postalcode,
                    'about.industry': req.body.industry,
                    'about.companySize': req.body.size,
                },
                $addToSet: {
                    'jobs': job
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

//add bookmarks
router.post('/add_bookmark', (req, res) => {
    let bookmark = req.body.addBookmark
    Business.getBusinessById(req.user._id ,(err, user) => {
        Business.findOneAndUpdate(
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
    Business.getBusinessById(req.user._id ,(err, user) => {
        Business.findOneAndUpdate(
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
    res.redirect('/business/dashboard')
})

//get register view
router.get('/register_business', (req, res) => {
    res.render('business/register_business')
})

app.use(expressValidator({
    customValidators: {
       validZipcode: function(zipcode) {
           let temp = zipcode.substring(0, 3)
           if(temp === '952' || temp === '953' || temp === '955' || temp === '956' || temp === '957' || temp === '958' || temp === '959') {
               return true;    
           } else { 
               return false;
           }
        }    
    }
}))

//post business registration form
router.post('/register_business', (req, res) => {
    let name = req.body.username
    let phone = req.body.phone
    let email = req.body.email
    let website1 = req.body.website1
    let preference = req.body.preference
    let address = req.body.address
    let city = req.body.city
    let zipcode = req.body.zipcode
    let industry = req.body.industry
    let size = req.body.size
    let password = req.body.password
    let password2 = req.body.password2

    console.log(zipcode)

    //validation
    req.checkBody('username', 'Company name is required.').notEmpty()
    req.checkBody('phone', 'Phone is required.').notEmpty()
    req.checkBody('email', 'Email is required.').notEmpty()
    req.checkBody('email', 'Email is not valid.').isEmail()
    req.checkBody('address', 'Address is required.').notEmpty()
    req.checkBody('city', 'City is required.').notEmpty()
    req.checkBody('zipcode', 'Zipcode is required.').notEmpty()
    req.checkBody('zipcode', 'Zipcode not in the Sacramento Region').validZipcode()
    req.checkBody('industry', 'Industry is required.').notEmpty()
    req.checkBody('size', 'Company size is required.').notEmpty()
    req.checkBody('password', 'Password is required.').notEmpty()
    req.checkBody('password2', 'Passwords do not match.').equals(req.body.password)

    //rerender page with errors
    let errors = req.validationErrors()
    if (errors) {
        res.render('business/register_business', {
            errors: errors
        })
    } else {
        //else create new user
        let newBusiness = new Business({
            about: {
                location: {
                    address: address,
                    city: city,
                    zipcode: zipcode,
                },
                industry: industry,
                companySize: size
            },
            contact_info: {
                email: email, 
                websites: [website1], 
                phone: phone, 
                preference: preference
            },
            username: name,
            password: password,
            account_type: 'business'
        })
        Business.createBusiness(newBusiness, (err, business) => {
            if (err) throw err
            console.log(business)
        })
        req.flash('success_msg', 'You have successfully registered.')
        res.redirect('/user/login')
    }
})

module.exports = router