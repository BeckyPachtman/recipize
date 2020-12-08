const bodyParser = require('body-parser'),
    //cookieParser = require('cookie-parser'),
    bcrypt = require('bcryptjs'),
    create = require('./modules/userCreate'),
    express = require('express'),
    fs = require('fs'),
    Grid = require('gridfs-stream'), //GridFs Stream
    GridFsStorage = require('multer-gridfs-storage'), //GridFs
    LocalStrategy = require('passport-local').Strategy,
    methodOverride = require('method-override'),
    mongoose = require('mongoose'),
    //MongoDBSession = require('connect-mongodb-session')(session),
    multer = require('multer'),
    path = require('path'),
    passport = require('passport')
    recipe = require('./modules/recipe'),
    session = require('express-session'),
    //require('./modules/passport')(passport)
    app = express();

mongoose.connect('mongodb://localhost/recipize', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

/*--------------------------------------------------------------*/
var mongoURI = 'mongodb://localhost/recipize'
var conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let gfs;

conn.once('open', function(){
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('creates')
})

var storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if(err){
                    return reject(err)
                }
                const filename = buf.toString('hex') + path.extname(file.originalname)
                const fileInfo = {
                    filename: filename,
                    bucketName: 'creates'
                }
                resolve(fileInfo)
            })
        })
    },
    options: {
        useUnifiedTopology: true
    }
})

const PhotoUpload = multer({storage})

app.get('/photos/:filename', function(req, res){
    gfs.files.findOne({filename: req.params.filename}, function(err, file){
        if(!file || file.length === 0){
            res.send('no photos found')
        } 
        else if(file.contentType === 'image/png' || file.contentType === 'image/jpeg'){
            var readStream = gfs.createReadStream(file.filename);
            readStream.pipe(res)
        }else{
            res.send('not a photo')
        }
    })
})

/*----------------------------------------------------*/

passport.use(
    new LocalStrategy({usernameField: 'email', passwordField: 'password'}, (email, password, done) =>{
        //match user
        create.findOne({email:email})
        .then(user => {
            if(!user){
                //console.log('no user');
                return done(null, false, { message: 'email or password is invalid' })
            }

            //match password
            bcrypt.compare(password, user.password, (err, isMatch) =>{
                if(err) throw err;

                if(isMatch){
                    return done(null, user)
                }else{
                    return done(null, false, {message: 'Password incorrect'})
                }
            });
        })
        .catch(err => console.log(err))
    })
);

// passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'}, (email, password, done) =>{
//     create.findOne({email}, function(err, user){
//         if(!user){
//             return done(null, false, { errors: { 'email or password': 'is invalid' } })
//         }
//         else if(!user.validatePassword(password)){
//             //console.log('no user');
//             return done(null, false, { errors: { 'email or password': 'is invalid' } })
//         }
//         //match password
//         bcrypt.compare(password, create.password, (err, isMatch) =>{
//             if(err){
//                 console.log(err);
//                 throw err
//             } else if(isMatch){
//                 console.log(user)
//                 return done(null, user)
//             }else{
//                 return done(null, false, console.log('password incorrect'))
//             }
//         })
//      })

//     // function(username, password, done) {
//     //   create.findOne({ username: username }, function (err, user) {
//     //     if (err) {
//     //        console.log(err);
//     //         return done(err, {message: err})
//     //     }
//     //     if (!user) {
//     //       return done(null, false, { message: 'Incorrect username.' });
//     //     }
//     //     if (!user.validPassword(password)) {
//     //       return done(null, false, { message: 'Incorrect password.' });
//     //     }
//     //     return done(null, user);
//     //   });
//     // }

// }
// ));
   
passport.serializeUser( function(user, done){
    done(null, user.id)
})

passport.deserializeUser( function(id, done){
    create.findById(id, (err, user) =>{
        done(err, user)
    })
})

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use(express.static('public'))
app.use(session({
    secret: "cats",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 8*60*60*1000 }
}));
app.use(bodyParser.urlencoded({extended:false})) //changed from false to true to se if will make passport work, chnged back to false according to Travery
app.use(bodyParser.json()); 
app.use(methodOverride('_method'))
//app.use(cookieParser());
app.use(passport.initialize())
app.use(passport.session());

app.get('/', function(req, res){
    gfs.files.find().toArray(function(err, files){
        if(!files || files.length === 0){
            res.render('index', {
                errMsg: '',
                files: false,
                userName: ''
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
                errMsg: '',
                files: '',
                userName: ''
            });
        }
    })
})

const log = fs.createWriteStream('log.txt', {flags: 'a'});

app.get('/login', function(req, res){
    var errMsg = `  <style> .modal{opacity: 1; visibility: visible;} </style>`
    res.render('index', {errMsg: errMsg, files: '', userName: '' })
})


app.get('/loginAfterSignup', function(req, res){
    var errMsg = `<style> .modal{opacity: 1; visibility: visible;}
                    .errMsg{color: green; background: #1997002a;}
                    .forms .formWrapper:nth-child(3){  display: none; }</style>
                    <strong class="errMsg">Signup successfull, please log in</strong>
                    <script> document.getElementById('loginBtnWrpr').classList.add('active')
                    document.getElementById('SignUpBtnWrpr').classList.remove('active')
                    document.getElementById('signUpErr').innerHTML = ""; </script>`
    res.render('index', {errMsg: errMsg, files: '', userName: '' })
})

/*
This function adds a new user to the database.
Before it does so it checks if this user already exists.
*/

app.post('/createUser', PhotoUpload.single('attachProfilePhoto'), function(req, res){
    var userCreate = {firstName, lastName, email, password} =  req.body

    if(!firstName || !lastName || !email || !password){
        var errMsg =`<style> .modal{opacity: 1; visibility: visible;}
                    .forms .formWrapper:nth-child(2){display: none;}
                    .forms .formWrapper:nth-child(3){display: flex;} </style>
                    <strong class="errMsg">please fill in all fields</strong>
                    <script> document.getElementById('SignUpBtnWrpr').classList.add('active')
                    document.getElementById('loginBtnWrpr').classList.remove('active')
                    document.getElementById('loginErr').innerHTML = ""; </script> ` 
        res.render('index', {
            errMsg: errMsg,
            userName: '',
            files: ''
        });             
    }else{
        create.findOne({
            email: email
        }).then((user) => {
            if(user){
                var errMsg = `<style> .modal{opacity: 1; visibility: visible;}
                            .forms .formWrapper:nth-child(2){display: none;}
                            .forms .formWrapper:nth-child(3){display: flex;} </style>
                            <strong class="errMsg">This user already exists, log in or choose a different email</strong>
                            <script> document.getElementById('SignUpBtnWrpr').classList.add('active')
                            document.getElementById('loginBtnWrpr').classList.remove('active')
                            document.getElementById('loginErr').innerHTML = ""; </script> `

                gfs.files.find().toArray(function(err, files){
                    if(!files || files.length === 0){
                        res.render('index', {
                            errMsg: errMsg,
                            userName: '',
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
                            userName: '',
                            files: files
                        });
                    }
                })
            }else{
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(userCreate.password, salt, (err, hash) => {
                        if(err){
                            log.write('Failed attempt at hashing\n')
                            console.log(err);
                        }
                        
                        userCreate.password = hash
                        create.create(userCreate, function(err){
                            if(err){
                                log.write('Failed attempt at signing up \n')
                                console.log(err);
                            }
                            else{
                                log.write('New user successfully created\n')
                                res.redirect('/loginAfterSignup');
                            }
                        })

                    }))
//end of else
            }
        })
    }
})

/*
This function logs a user to the system
It checks if the email and password match to an exsisitng user
It spits out an error accordingly
*/

app.get('/successfullLogin', (req, res) =>{
    res.render('index', {errMsg: '', files: '', userName: req.user})
})

app.post('/login',  function(req, res, next){
    
    // res.render('index', {errMsg: '', files: '', userName: create.firstName})
        create.findOne({
            email: req.body.email,
        }).then((userLogin) => {
            if(!userLogin){
                var errMsg = `  <style> .modal{opacity: 1; visibility: visible;} </style>
                                <strong class="errMsg">Oops. This email is not found, please try again</strong>
                                <script> document.getElementById('signUpErr').innerHTML = ""; </script> `
                log.write('User not found at logging in\n')
                res.render('index', {errMsg: errMsg, files: '', userName: '' })
            }else{


passport.authenticate('local', function(err, user, info){
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {

            if (err) {
                log.write('Failed attempt at logging in\n')
                return next(err);
            }
            log.write('User successfully logged in\n')
            return res.redirect('/successfullLogin');
      });
        
    })(req, res, next);

                // create.findOne({
                //     password: req.body.password
                // }).then((pass) => {
                //     if(!pass){
                //         var errMsg = `  <style> .modal{ opacity: 1;visibility: visible;}</style>
                //                         <strong class="errMsg">Password incorrect, please try again</strong>
                //                         <script> document.getElementById('signUpErr').innerHTML = ""; </script> `
                //         res.redirect('/successfullLogin')
                //     }else{
                //     //res.render('index', {errMsg: '', files: '', userName: create.firstName})
                //     }
                // })
            }
    })
})

/*
This function renders the page to add a new recipe
*/
app.get('/AddNewRecipe', function(req, res){
    res.render('addRecipe', {files: '',  userName: '', submitSucessMsg: ''})
})

/*
This function renders the display page for all exsisiting recipes
*/
app.get('/recipiesDisplay', function(req, res){
    recipe.find({}, function(err, allRecipies){
        if(err){
            console.log(err);
        }else{
            res.render('recipiesDisplay', {
                recipe: allRecipies,
                files: '',
                userName: 'hello' 
            })
        }
    })
})

/*
This function takes the data that the user added to the add a new recipe page form and submits it to the database
this function creates a new recipie (CREATE)
*/
app.post('/newRecipeData', function(req, res) {
     var fullRecipe = {
        title: req.body.title,
        prpTime: req.body.prpTime,
        prpTimeSlct: req.body.select1,
        ckTime: req.body.ckTime,
        ckTimeSlct: req.body.select2,
        ttlTimeHrs: req.body.ttlTimeHrs,
        ttlTimeMin: req.body.ttlTimeMin,
        ttlTimeSlctHrs: 'Hours',
        ttlTimeSlctMin: 'Minutes',
        yields: req.body.yields,
        img: req.body.img,
        ingrdnts: req.body.ingrdnts,
        dirctns: req.body.dirctns
    }
    recipe.create(fullRecipe, function(err){
        if(err){
            log.write('Failed attempt at adding a new recipe\n')
            console.log(err);
        }else{
            log.write('New recipe successfully created\n')
            res.render('addRecipe', {submitSucessMsg: 'Recipe submitted Successfully', files: '', userName: '' }) 
        }
    })
})

/*
This function displays one recipe when clicked on*/
app.get('/recipe/:id', function(req, res) {
    recipe.findById(req.params.id, function(err, returningRec){
        if(err){
            console.log(err); 
        }else{
            res.render('viewRecipe', {
                recipe: returningRec,
                files: '',
                userName: ''
            })
        }
    })
})

/*
This function shows the edit recipe page wehn we want to edit a specific recipe  (EDIT)
*/
app.get('/edit/:id', function(req, res) {
    recipe.findById(req.params.id, function(err, returningRec){
        if(err){
            console.log(err); 
        }else{
            res.render('editRecipe', {
                recipe: returningRec,
                files: '',
                userName: ''
            })
        }
    })

})

/*
This function epdaes the recipe data to whatever we added in the edit page (UPDATE)
*/
app.put('/editRecipe/:id', function(req, res){
    var fullRecipe = {
        title: req.body.title,
        prpTime: req.body.prpTime,
        prpTimeSlct: req.body.select1,
        ckTime: req.body.ckTime,
        ckTimeSlct: req.body.select2,
        ttlTimeHrs: req.body.ttlTimeHrs,
        ttlTimeMin: req.body.ttlTimeMin,
        ttlTimeSlctHrs: 'Hours',
        ttlTimeSlctMin: 'Minutes',
        yields: req.body.yields,
        img: req.body.img,
        ingrdnts: req.body.ingrdnts,
        dirctns: req.body.dirctns
    }
    recipe.findByIdAndUpdate(req.params.id, fullRecipe, function(err){
        if(err){
            log.write('Failed attempt at updating a recipe\n')
            console.log(err);
        }else{
            log.write('Recipe successfully updated\n')
            res.redirect('/recipiesDisplay') 
        }
    })

})
/*Testing new delete on seperate page 
app.get('/testBook', function(req, res){
    recipe.find({}, function(err, allRecipies){
        if(err){
            console.log(err);
        }else{
            res.render('testBook', {
                recipe: allRecipies,
                files: '',
                userName: '' 
            })
            console.log({recipe: allRecipies});
        }
    })
})*/

/*
This function delets one recipe when user chooses to
*/
app.delete('/recipe/:id', function(req, res) {
    recipe.findByIdAndRemove(req.params.id, function(err){
        if(err){
            log.write('Failed attempt at deleting a recipe\n')
            res.send(err)
        }else{
            log.write('Recipe successfully deleted\n')
            res.redirect('/recipiesDisplay')
        }
    })
})

/*
This function will close the login modal window on clicking the close button
*/
app.get('/closeModal', function(req, res){
    res.redirect('/')
})

app.listen(3000)