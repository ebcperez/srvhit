const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    contact_info: {
        email: {
            type: String
        },
        phone: {
            type: String
        },
        website1: {
            type: String
        },
        website2: {
            type: String
        },
    },
    address: {
        type: String
    },
    name: {
        type: String
    },
    account_type: {
        type: String
    },
    about: {
        type: String
    },
    experience: {
        type: String
    },
    education: {
        type: String
    },
    admin: {
        type: Boolean
    }
})

var User = module.exports = mongoose.model('User', UserSchema)

module.exports.createUser = (newUser, callback) => {
    //hashes password in database
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash
            newUser.save(callback)
        });
    });
}

//find by username in database
module.exports.getUserByUsername = (username, callback) => {
    let query = {username: username}
    User.findOne(query, callback)
}

//find by user id
module.exports.getUserById = (id, callback) => {
    User.findById(id, callback)
}

//compares password in database for validation
module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) throw err
        callback(null, isMatch)
    });
}