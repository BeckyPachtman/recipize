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
const errLoginReAttempt = errMsg.reattempLogin;
const errloginForAccess = errMsg.loginForAccess
const removeLoginBttn = errMsg.removeLoginBttn;
const switchCloseBttn = errMsg.switchCloseBttn
const loginAfterSignupMsg = errMsg.loginAfterSignup;
const errFieldEmpty = errMsg.fieldEmpty;
const errUserExists = errMsg.userExists;
const errUserNotFound = errMsg.userNotFound;
const errPassword = errMsg.password;
const errRecFieldEmpty = errMsg.recFieldEmpty;
const errRecAuthorEdit = errMsg.recAuthorEdit;
const errRecAuthorDelete = errMsg.recAuthorDelete;

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
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    name: cookieName
}))

/*  this function redirects a user to the login page
    if they try to access a page they have to be logged in to be able to  access
*/

const redirectLogin = (req, res, next) => {
    if(!req.session.userId){
        res.render('index', {
            errMsg: errloginForAccess,
            userName: '',
            profile: profileHidden
        });
    }else{
        next()
    }
}

/*
    This function creates the user nickame to be displayed
    whenever a user is logged in, it is then exported for testing purposes
*/
function createUserName (loggedUser) {
    const firstName  = loggedUser.firstName;
    const lastName  = loggedUser.lastName;
    const fNameInitial = firstName.charAt(0);
    const lNameInitial = lastName.charAt(0);
    return(fNameInitial + lNameInitial);
}
module.exports = createUserName;

/*
    This function is a route function which directs the user to the home page
    whenever entering the app or clicking the home link from the navbar
*/
app.get('/',  function(req, res){
    const {userId} = req.session;
    if(userId){ 
        create.findById(userId, (err, loggedUser) =>{
            const userName = createUserName(loggedUser);
            res.render('index', {errMsg: removeLoginBttn, userName: userName, profile: profileMsg});
        });
    }else{
        res.render('index', {errMsg: '', userName: '', profile: profileHidden});
    }
})

/*
    This function is a route function which directs the user to the login window
    whenever a user clicks on login either from the home page
    call to action button or from the login/signup link on the navbar
*/

app.get('/login', function(req, res){
    const {userId} = req.session;
    if(userId){ 
        create.findById(userId, (err, loggedUser) =>{
            const userName =  createUserName(loggedUser);
            res.render('index', {errMsg: errLoginReAttempt, userName: userName, profile: profileMsg});
        });
    }else{
        res.render('index', {errMsg: switchCloseBttn, userName: '', profile: profileHidden })
    }
})

/*
    This function is a route function which directs the user to the login window
    after successfully signing up
*/
app.get('/loginAfterSignup', function(req, res){
    res.render('index', {errMsg: loginAfterSignupMsg, userName: '', profile: ''})
})

/*
    This function adds a new user to the database.
    Before it does so it checks if this user already exists and if
    the information has been added propery, ex. proper email format.
*/

app.post('/createUser', function(req, res){
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
                    })
                )
            }
        })
    }
})


/*
    This function logs a user in to the system
    It checks if the email and password match to an exsisitng user
    and spits out an error accordingly
*/

app.post('/login', function(req, res){
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
    This function is a route function which directs to the
    proper page for a user to be able to add a new recipe
*/
app.get('/AddNewRecipe', redirectLogin, function(req, res){
    const {userId} = req.session;
    create.findById(userId, (err, loggedUser) =>{
        const userName =  createUserName(loggedUser);
        res.render('addRecipe', {userName: userName, submitSucessMsg: '', profile: profileMsg, msg: ''})
    });
})


/*
    This function is a route function which directs to the
    gallery page to display all existing recipes 
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
    This function takes the data that the user submites through the 'Add a new recipe page' form and submits it to the database
    a new recipe is created and displayed in the galler of all recipes.
*/
app.post('/newRecipeData', function(req, res) {
    const {userId} = req.session;
    create.findById(userId, (err, loggedUser) =>{
        var fullRecipe = {
        title: req.body.title,             prpTimeHrs: req.body.prpTimeHrs,
        prpTimeMin: req.body.prpTimeMin,   ckTimeHrs: req.body.ckTimeHrs,
        ckTimeMin: req.body.ckTimeMin,     ttlTimeHrs: req.body.ttlTimeHrs,
        ttlTimeMin: req.body.ttlTimeMin,   yieldInput: req.body.yieldInput,
        yieldSelect: req.body.yieldSelect, tips: req.body.tips,
        img: req.body.img,                 ingrdnts: req.body.ingrdnts,
        dirctns: req.body.dirctns,         author: loggedUser.firstName + ' ' + loggedUser.lastName
        }
        if(!fullRecipe.title || !fullRecipe.ingrdnts || !fullRecipe.dirctns){
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
    This function is a route function which directs a user to the 'Displays one recipe page'
    when a recipe is clicked on in the gallery
*/
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
    This function is a route function which directs a user to 'Edit recipe page'
    when the edit recipe button is clicked.The system will first check if the author
    of the recipe is also the user who is requesting to edit and will block any other user other than the author to make any changes
*/
app.get('/edit/:id', function(req, res) {
    const {userId} = req.session;
    create.findById(userId, (err, loggedUser) =>{
        const userName =  createUserName(loggedUser);
        recipe.findById(req.params.id, function(err, returningRec){
            if(err){
                console.log(err); 
            }else{
                if(loggedUser.firstName + ' ' + loggedUser.lastName != returningRec.author){
                    if(err){
                        console.log(err);
                    }else{                        
                        recipe.find({}, function(err, allRecipies){ 
                            res.render('recipiesDisplay', {recipe: allRecipies, userName: userName, profile: profileMsg, msg: errRecAuthorEdit})
                        })
                    }
                }else {
                    res.render('editRecipe', {recipe: returningRec, userName: userName, profile: profileMsg})
                }
            }
        })
    }) 
})


/*
    This function displays an error to a user who tries to edit
    or delete a ercipe that is not there's
*/
// app.get('/notAuthor', function(req, res){
//     const {userId} = req.session;
//     create.findById(userId, (err, loggedUser) =>{
//     const userName =  createUserName(loggedUser);
//         recipe.find({}, function(err, allRecipies){
//             if(err){
//                 console.log(err);
//             }else{
//                 res.render('recipiesDisplay', {recipe: allRecipies, userName: userName, profile: profileMsg, msg: errRecAuthorEdit})
//             }
//         })
//     })
// })


/*
    This function is a route function which directs a user to the 'Update recipe page',
    lets the user make the appropiate changes and updates the date in the database
    displaying the updated version in the gallery of recipes
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
    This function delets a specific recipe when delete recipe button is clicked and confirmed.
    The system will first check if the author of the recipe is also the user who is requesting
    to delete and will block any other user other than the author to delete this recipe
*/

app.delete('/recipe/:id', function(req, res) {
    const {userId} = req.session;
    create.findById(userId, (err, loggedUser) =>{     
        const userName =  createUserName(loggedUser);   
        recipe.findById(req.params.id, function(err, recipeToDelete){
            if(loggedUser.firstName + ' ' + loggedUser.lastName == recipeToDelete.author){
                    if(err){
                    log.write('Failed attempt at deleting a recipe\n')
                    res.send(err)
                }else{
                    recipe.findByIdAndRemove(req.params.id, () =>{
                        log.write('Recipe successfully deleted\n')
                        res.redirect('/recipiesDisplay')
                    })
                }
            }else{
                recipe.find({}, function(err, allRecipies){ 
                    res.render('recipiesDisplay', {recipe: allRecipies, userName: userName, profile: profileMsg, msg: errRecAuthorDelete})
                })
            }
       })
    })
})


/*
    This function is called when a user clicks on the logout optionit will
    kill the current session and cookie and the user will be logged out
*/
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
    const {userId} = req.session;
    if(userId){
        create.findById(userId, (err, loggedUser) =>{
            const userName =  createUserName(loggedUser);
            res.render('index', {errMsg: removeLoginBttn, userName: userName, profile: profileMsg});
        });
    }else{
        res.render('index', {errMsg: '', userName: '', profile: profileHidden});   
    }
})

app.listen(3000)