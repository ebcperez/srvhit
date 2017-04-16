const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const users = require('./user')
const Schema = mongoose.Schema

const StudentSchema = new Schema({ 

    account_type: String,
    username: {
        type: String,
        unique: true,
    },
    account_id: {
        type: Schema.Types.ObjectId
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
    },

    //Personal profile details
    about: {
        name: {
            first: {
                type: String
            },
            last: {
                type: String
            },
        },
        location: {
            /*address: {
                type: String
            },*/
            city: {
                type: String
            },
            zipcode: {
                type: String
            },
        },
        text: {
            type: String
        },
        //low priority
        photo: {
            //type: 
        },
   },
   
   experience: {
        //Something with the tags
        languages: {
            type: [String] 
        },
        tools: {
            type: [String]
        },
        work_experience: {
            type: [String]
        },
   },
   
   //Information on Students education
   education: {
        school: {
            type: String
        },
        degree: {
            type: String
        },
        graduation: {
            type: Number
        },
   }
})

var Student = module.exports = mongoose.model('Student', StudentSchema, 'users')

module.exports.createUser = (newStudent, callback) => {
    //hashes password in database
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newStudent.password, salt, function(err, hash) {
            newStudent.password = hash
            newStudent.save(callback)
        });
    });
}

//find by username in database
module.exports.getUserByUsername = (username, callback) => {
    let query = {username: username}
    Student.findOne(query, callback)
}

//find by user id
module.exports.getUserById = (id, callback) => {
    Student.findById(id, callback)
}

//compares password in database for validation
module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) throw err
        callback(null, isMatch)
    });
}