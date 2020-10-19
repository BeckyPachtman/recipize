var mongoose = require('mongoose')

var userCreate = new mongoose.Schema({
    createUserFName:{
        type: String,
        trim: true
    },
    createUserLName:{
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    password: String
})

module.exports = mongoose.model('create', userCreate)