const express = require('express'),
mongoose = require('mongoose')
app = express();

/*
This function adds a new user to the database.
Before it does so it checks if this user already exists.
*/

//PhotoUpload.single('attachProfilePhoto'),
app.post('/createUser',  function(req, res){
    var userCreate = {firstName, lastName, email, password} =  req.body

    if(!firstName || !lastName || !email || !password){
        var errMsg = `<style> .modal{opacity: 1; visibility: visible;}
                    .forms .formWrapper:nth-child(2){  display: none; }
                    .forms .formWrapper:nth-child(3){  display: flex; } </style>
                    <strong class="errMsg">please fill in all fields</strong>
                    <script> document.getElementById('SignUpBtnWrpr').classList.add('active')
                    document.getElementById('loginBtnWrpr').classList.remove('active')
                    document.getElementById('loginErr').innerHTML = ""; </script> `
        res.render('index', {
            errMsg: errMsg,
            files: ''
        });             
    }else{
        create.findOne({
            email: req.body.email
        }).then((user) => {
            if(user){
                var errMsg = `<style> .modal{opacity: 1; visibility: visible;}
                            .forms .formWrapper:nth-child(2){  display: none; }
                            .forms .formWrapper:nth-child(3){  display: flex; } </style>
                            <strong class="errMsg">This user already exists, log in or choose a different email</strong>
                            <script> document.getElementById('SignUpBtnWrpr').classList.add('active')
                            document.getElementById('loginBtnWrpr').classList.remove('active')
                            document.getElementById('loginErr').innerHTML = ""; </script> `

                gfs.files.find().toArray(function(err, files){
                    if(!files || files.length === 0){
                        res.render('index', {
                            errMsg: errMsg,
                            files: false
                        })
                    }else{
                        files.map(function(file){
                            if(file.contentType === 'image.png' || file.contentType === 'image/jpeg'){
                                file.isImage = true
                            }else{
                                file.isImage = false
                            }
                        })
                        res.render('index', {
                            errMsg: errMsg,
                            files: files
                        });
                    }
                })
            }else{
                create.create(userCreate, function(err){
                    if(err){
                        console.log(err);
                    }
                    res.redirect('/');
                })
            }
        })

    }
})