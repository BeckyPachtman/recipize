var mongoose = require('mongoose')

var userCreate = new mongoose.Schema({
    firstName:{
        type: String,
        trim: true,
        //required: true
    },
    lastName:{
        type: String,
        trim: true,
        //required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        //required: true
    },
    password: {
        type: String,
        //required: true
    }
})

module.exports = mongoose.model('create', userCreate)