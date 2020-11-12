var mongoose = require('mongoose')

var userCreate = new mongoose.Schema({
    createUserFName:{
        type: String,
        trim: true,
        //required: true
    },
    createUserLName:{
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
    },
    profilephoto: {
        data: Buffer,
        contentType: String
    }
})

module.exports = mongoose.model('create', userCreate)