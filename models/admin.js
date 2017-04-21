const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const users = require('./user')
const Schema = mongoose.Schema

const AdminSchema = new Schema({

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
    }
})

var Admin = module.exports = mongoose.model('Admin', AdminSchema, 'users')

//create new admin document in database
module.exports.createAdmin = (newAdmin, callback) => {
    //hashes password in database
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newAdmin.password, salt, function(err, hash) {
            newAdmin.password = hash
            newAdmin.save(callback)
        }); 
    });
}

//find the admin in the database by name
module.exports.getAdminByName = (name, callback) => {
    let query = {username: username}
    Admin.findOne(query, callback)
}

//find admin by unique id
module.exports.getAdminById = (id, callback) => {
    Admin.findByID(id, callback)
}

//compare password in database for validation
module.exports.comparePassword = (candidatePassword, has, callback) => {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) throw err
        callback(null, isMatch)
    });
}