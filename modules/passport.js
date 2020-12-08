const bcrypt = require('bcryptjs'),
create = require('./userCreate'),
//express = require('express'),
//mongoose = require('mongoose'),
LocalStrategy = require('passport-local').Strategy


//app = express()

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'create.email', passwordField: 'create.password'}, (email, password, done) =>{
            //match user
            create.findOne({email})
            .then(user => {
                if(!user ||user.validatePassword(password)){
                    //console.log('no user');
                    return done(null, false, { errors: { 'email or password': 'is invalid' } })
                }

                //match password
                bcrypt.compare(password, create.password, (err, isMatch) =>{
                    if(err){
                        console.log(err);
                        throw err
                    } else if(isMatch){
                        console.log(user)
                        return done(null, user)
                    }else{
                        return done(null, false, console.log('password incorrect'))
                    }
                })
            })
        })
    )

    passport.serializeUser((user, done) =>{
        done(null, user.id)
    })

    passport.deserializeUser((id, done) =>{
         create.findById(id, (err, user) =>{
             done(err, user)
         })
    })
}

