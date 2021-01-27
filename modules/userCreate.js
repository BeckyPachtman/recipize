var mongoose = require('mongoose')

var userCreate = new mongoose.Schema({
    firstName:{
        type: String,
        trim: true,
    },
    lastName:{
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
    }
})

module.exports = mongoose.model('create', userCreate)