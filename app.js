const bodyParser = require('body-parser'),
    bcrypt = require('bcryptjs'),
    create = require('./modules/userCreate'),
    errMsg = require('./modules/errMsgs'),
    express = require('express'),
    fs = require('fs'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose'),
    recipe = require('./modules/recipe'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    app = express();

mongoose.connect('mongodb://localhost/recipize', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const cookieName = 'AuthenticationApp';
const log = fs.createWriteStream('log.txt', {flags: 'a'});
const profileMsg = `<style> #userLoggedIn{display: flex;}</style>`
const profileHidden = `<style> #userLoggedIn{display: none;}</style>`
const errLoginReAttempt = errMsg.loginReAttempt;
const removeLoginBttn = errMsg.removeLoginBttn
const loginAfterSignupMsg = errMsg.loginAfterSignup;
const errFieldEmpty = errMsg.fieldEmpty;
const errUserExists = errMsg.userExists;
const errUserNotFound = errMsg.userNotFound;
const errPassword = errMsg.password;
const errRecFieldEmpty = errMsg.recFieldEmpty;
const errNotRecAuthor = errMsg.notRecAuthor;

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(methodOverride('_method'))
app.use(session({
    secret: 'secretString',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 //one week
    },
    name: cookieName
}))

/*this function redirect a user to the login page
if they try to accessa page they have ot be logged in to access*/
const redirectLogin = (req, res, next) => {
    if(!req.session.userId){
    var errMsg = ` <style> .modal{opacity: 1; visibility: visible;} </style>
    <strong class="errMsg">Log in to be able to access this feature</strong>
    <script> document.getElementById('signUpErr').innerHTML = ""; </script>`
            res.render('index', {
                errMsg: errMsg,
                userName: '',
                profile: profileHidden
            });
    } else{
        next()
    }
}

/*This function rediercts the uer to hte home page ig the try to access
 the login page while they are already logged in */
const redirectHome = (req, res, next) => {
    if(req.session.userId){
        res.redirect('/')
    }else{
        next()
    }
}  
function createUserName (loggedUser) {
        const firstName  = loggedUser.firstName;
        const lastName  = loggedUser.lastName;
        const fNameInitial = firstName.charAt(0);
        const lNameInitial = lastName.charAt(0);
        return(fNameInitial + lNameInitial);
}

module.exports = createUserName;

app.get('/',  function(req, res){
    const {userId} = req.session;
    if(userId){    
        create.findById(userId, (err, loggedUser) =>{
            const userName =  createUserName(loggedUser);
            res.render('index', {errMsg: removeLoginBttn, userName: userName, profile: profileMsg});
        });
    }else{
        var errMsg = 'You are not logged in'
            res.render('index', {errMsg: errMsg, userName: '', profile: profileHidden});
    }
})

app.get('/login', function(req, res){
    if(req.session.userId){
        var errMsg = `<style> .modal{opacity: 1; visibility: visible;} </style>`
        res.render('index', {errMsg: errLoginReAttempt + errMsg, files: '', userName: '', profile: profileMsg })
    }else{
        var errMsg = `<style> .modal{opacity: 1; visibility: visible;} </style>`
        res.render('index', {errMsg: errMsg, files: '', userName: '', profile: profileMsg })
    }

})

app.get('/loginAfterSignup', function(req, res){
    res.render('index', {errMsg: loginAfterSignupMsg, userName: '', profile: ''})
})
/*
This function adds a new user to the database.
Before it does so it checks if this user already exists.
*/

app.post('/createUser', redirectHome, function(req, res){
    var userCreate = {firstName, lastName, email, password} = req.body
    if(!firstName || !lastName || !email || !password){
        res.render('index', {
            errMsg: errFieldEmpty, userName: '', profile: ''});             
    }else{
        create.findOne({email: email}).then((user) => {
            if(user){
                res.render('index', {errMsg: errUserExists, userName: '', profile: ''});
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
                                req.session.userId = userCreate.id
                                log.write('New user successfully created\n')
                                res.redirect('/loginAfterSignup');
                            }
                        })
                }))
            }
        })
    }
})
/*
This function logs a user to the system
It checks if the email and password match to an exsisitng user
It spits out an error accordingly
*/

app.post('/login', redirectHome, function(req, res){
    create.findOne({
        email: req.body.email,
    }).then((userLogin) => {
        if(!userLogin){                
            res.render('index', {errMsg: errUserNotFound, userName: '', profile: ''})
            log.write('User not found at logging in\n')
        }else{
            bcrypt.compare(req.body.password, userLogin.password, function(err, isMatch){
                if(isMatch) {
                    req.session.userId = userLogin.id
                        res.render('index', {userName: userLogin.firstName.charAt(0)+userLogin.lastName.charAt(0), errMsg: removeLoginBttn, profile: profileMsg})
                }else{
                    res.render('index', {errMsg: errPassword, userName: '', profile: ''})
                }
            });
        }
    })
})

/*
This function renders the page to add a new recipe
*/
app.get('/AddNewRecipe', redirectLogin, function(req, res){
    const {userId} = req.session;
    create.findById(userId, (err, loggedUser) =>{
        const userName =  createUserName(loggedUser);
        res.render('addRecipe', {userName: userName, submitSucessMsg: '', profile: profileMsg, msg: ''})
    });
})

/*
This function renders the display page for all exsisiting recipes
*/
app.get('/recipiesDisplay', redirectLogin, function(req, res){
    const {userId} = req.session;
    create.findById(userId, (err, loggedUser) =>{
    const userName =  createUserName(loggedUser);
        recipe.find({}, function(err, allRecipies){
            if(err){
                console.log(err);
            }else{
                res.render('recipiesDisplay', {recipe: allRecipies, userName: userName, profile: profileMsg, msg: ''})
            }
        })
    })
})
/*
This function takes the data that the user added to the add a new recipe page form and submits it to the database
this function creates a new recipie (CREATE)
*/

app.post('/newRecipeData', function(req, res) {
    const {userId} = req.session;
    create.findById(userId, (err, loggedUser) =>{
        var fullRecipe = {
        title: req.body.title,                           prpTimeHrs: req.body.prpTimeHrs+' '+'Hours',
        prpTimeMin: req.body.prpTimeMin+' '+'Minutes',   ckTimeHrs: req.body.ckTimeHrs+' '+'Hours',
        ckTimeMin: req.body.ckTimeMin+' '+'Minutes',     ttlTimeHrs: req.body.ttlTimeHrs+' '+'Hours',
        ttlTimeMin: req.body.ttlTimeMin+' '+'Minutes',   yieldInput: req.body.yieldInput,
        yieldSelect: req.body.yieldSelect,               tips: req.body.tips,
        img: req.body.img,                               ingrdnts: req.body.ingrdnts,
        dirctns: req.body.dirctns,                       author: loggedUser.firstName + ' ' + loggedUser.lastName
        }
        if(!fullRecipe.ingrdnts || !fullRecipe.dirctns){
            res.render('addRecipe', {msg: errRecFieldEmpty, userName: '', profile: profileMsg});        
        }else{
            recipe.create(fullRecipe, function(err){
                if(err){
                    log.write('Failed attempt at adding a new recipe\n')
                    console.log(err);
                }else{
                    log.write('New recipe successfully created\n')
                    res.redirect('/recipiesDisplay') 
                }
            })
        }
    })
})

/*
This function displays one recipe when clicked on*/
app.get('/recipe/:id', function(req, res) {
    const {userId} = req.session;
    create.findById(userId, (err, loggedUser) =>{
        const userName =  createUserName(loggedUser);
        recipe.findById(req.params.id, function(err, returningRec){
            if(err){
                console.log(err); 
            }else{
                res.render('viewRecipe', {recipe: returningRec, userName: userName, profile: profileMsg})
            }
        })
    })  
})

/*
This function shows the edit recipe page wehn we want to edit a specific recipe  (EDIT)
*/
app.get('/edit/:id', function(req, res) {
    const {userId} = req.session;
    create.findById(userId, (err, loggedUser) =>{
        const userName =  createUserName(loggedUser);
        recipe.findById(req.params.id, function(err, returningRec){
            if(err){
                console.log(err); 
            }else{
                //if(loggedUser.firstName + ' ' + loggedUser.lastName != returningRec.author){
                    if(err){
                        console.log(err);
                    //}//else{
                        //res.redirect('/notAuthor')
                    //}
                }else {
                    res.render('editRecipe', {recipe: returningRec, userName: userName, profile: profileMsg})
                }
            }
        })
    }) 
})

app.get('/notAuthor', function(req, res){
    const {userId} = req.session;
    create.findById(userId, (err, loggedUser) =>{
    const userName =  createUserName(loggedUser);
        recipe.find({}, function(err, allRecipies){
            if(err){
                console.log(err);
            }else{
                res.render('recipiesDisplay', {recipe: allRecipies, userName: userName, profile: profileMsg, msg: errNotRecAuthor})
            }
        })
    })
})
/*
This function updates the recipe data to whatever we added in the edit page (UPDATE)
*/
app.put('/editRecipe/:id', function(req, res){
    var fullRecipe = {
        title: req.body.title,              prpTimeHrs: req.body.prpTimeHrs,
        prpTimeMin: req.body.prpTimeMin,    ckTimeHrs: req.body.ckTimeHrs,
        ckTimeMin: req.body.ckTimeMin,      ttlTimeHrs: req.body.ttlTimeHrs,
        ttlTimeMin: req.body.ttlTimeMin,    yieldInput: req.body.yieldInput,
        yieldSelect: req.body.yieldSelect,  tips: req.body.tips,
        img: req.body.img,                  ingrdnts: req.body.ingrdnts,
        dirctns: req.body.dirctns,
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
This function kills the session and cookie therefore loggin the user out */
app.get('/logout', redirectLogin, (req, res) =>{
    req.session.destroy(err => {
        if(err){
            console.log(err);
        }else{
            res.clearCookie(cookieName)
            res.render('index', {errMsg: '', userName: '', profile: profileHidden})
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