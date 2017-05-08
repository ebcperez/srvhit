const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const users = require('./user')
const Schema = mongoose.Schema

var school = {
    name: {
        type: String
    },
    degree: {
        type: String
    },
    start: {
        type: Number
    },
    end: {
        type: Number
    }
}

const StudentSchema = new Schema({ 

    account_type: String,
    enabled: Boolean,
    created: String,
    username: {
        type: String,
        unique: true,
    },
    account_id: {
        type: Schema.Types.ObjectId,
        unique: true
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
        skills: {
            type: [String]
        },
        work_experience: {
            type: [String]
        },
   },

   bookmarks: {
       type: [String]
   },
   
   //Information on Students education
   education: {
        type: [school]
   }
})
/*
//text indexes for text search
StudentSchema.index({
        'about.name.first': 'text', 
        'education.degree': 'text', 
        'tags': 'text',
        'about.location.zipcode': 'text',
        'username': 'text'
})*/

var Student = module.exports = mongoose.model('Student', StudentSchema, 'users')

module.exports.createStudent = (newStudent, callback) => {
    //hashes password in database
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newStudent.password, salt, function(err, hash) {
            newStudent.password = hash
            newStudent.save(callback)
        });
    });
}

//find by username in database
module.exports.getStudentByUsername = (username, callback) => {
    let query = {username: username}
    Student.findOne(query, callback)
}

//find by user id
module.exports.getStudentById = (id, callback) => {
    Student.findById(id, callback)
}

//compares password in database for validation
module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) throw err
        callback(null, isMatch)
    });
}