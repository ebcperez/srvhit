const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const users = require('./user')
const Schema = mongoose.Schema

//auxilary object to store 'jobs' attributes
var job = {
    position: {
        type: String
    },
    description: {
        type: String
    },
    tags: {
        type: [String]
    },
    deadline: {
        type: String
    },
    jobType: {
        type: String
    }
}

const BusinessSchema = new Schema({ 

    account_type: String,
    enabled: Boolean,
    created: String,
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String
    },
    contact_info: {
        email: {
             type: String,
             unique: true
        },
        phone: {
            type: String
        },
        websites: {
            type: [String]
        },
        preference: {
            type: String
        }
    },

    //Personal profile details
    about: {
        location: {
            address: {
                type: String
            },
            city: {
                type: String
            },
            zipcode: {
                type: String
            },
        },
        companySize: {
            type: Number
        },
        industry: {
            type: String
        },
        text: {
            type: String
        }
        //low priority
        /*photo: {

        }*/
   },

   bookmarks: {
       type: [String]
   },

   //job postings
   jobs: {
        type: [job]
   }
})

var Business = module.exports = mongoose.model('Business', BusinessSchema, 'users')

//create new business document in database
module.exports.createBusiness = (newBusiness, callback) => {
    //hashes password in database
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newBusiness.password, salt, function(err, hash) {
            newBusiness.password = hash
            newBusiness.save(callback)
        });
    });
}

//find by business in database by name
module.exports.getBusinessByName = (name, callback) => {
    let query = {username: name}
    Business.findOne(query, callback)
}

//find by business id
module.exports.getBusinessById = (id, callback) => {
    Business.findById(id, callback)
}

//compares password in database for validation
module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) throw err
        callback(null, isMatch)
    });
}