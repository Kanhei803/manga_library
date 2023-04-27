const mongoose = require('mongoose');

// USER LIST SCHEMA
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 1
    },
    password: {
        type: String,
        required: true,
        minLength: 1
    },
    email: {
        type: String,
        required: true,
        minLength: 1
    },
    newsLetter: {
        type: Boolean,
        required: true,
    }
})

const UserSchema = mongoose.model('User', userSchema)
module.exports = UserSchema;