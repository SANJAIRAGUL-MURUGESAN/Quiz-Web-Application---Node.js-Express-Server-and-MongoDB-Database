const mongoose = require('mongoose');
const {db} = require('./mongoose.js')

const UserSchema = new mongoose.Schema({
    Username: {
        type : String,
        required: true
    },
    Password: {
        type : String,
        required: true
    },
    ConfirmPassword: {
        type : String,
        required : true
    },
    UserType: {
        type : String,
        required : true
    },
    Email: {
        type : String,
        required : true
    },
    Department: {
        type : String,
        required : true
    }
})

const questionSchema = new mongoose.Schema({
    Questions: {
        type : String,
        required : true
    },
    Options: [String],
    CorrectAnswer: {
        type : String,
        required : true
    }
})

module.exports = {
    User : db.model('User',UserSchema,'USER'),
    Questions : db.model('Questions',questionSchema,'QUESTION')
}