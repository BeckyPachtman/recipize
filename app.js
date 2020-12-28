const bodyParser = require('body-parser'),
    bcrypt = require('bcryptjs'),
    create = require('./modules/userCreate'),
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

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false})) //changed from false to true to se if will make passport work, changed back to false according to Travery
app.use(bodyParser.json()); 
app.use(methodOverride('_method'))
app.use(session({
    secret: 'secretString',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2 // two weeks
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
                profile: ''
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


app.get('/', function(req, res){
    const {userId} = req.session;
    if(userId){
        create.findById(userId, (err, loggedUser) =>{
            const firstName  = loggedUser.firstName;
            const lastName  = loggedUser.lastName;

            const fNameInitial = firstName.charAt(0);
            const lNameInitial = lastName.charAt(0);

            const userName = fNameInitial + lNameInitial;
            res.render('index', {errMsg: '', userName, profile: profileMsg})
        })
    }else{
        var errMsg = 'You are not logged in'
            res.render('index', {
                errMsg: errMsg,
                userName: '',
                profile: ''
            });
    }
    
})

app.get('/login', redirectHome, function(req, res){
    var errMsg = `<style> .modal{opacity: 1; visibility: visible;} </style>`
    res.render('index', {errMsg: errMsg, files: '', userName: '', profile: profileMsg })
})


app.get('/loginAfterSignup', function(req, res){
    var errMsg = `<style> .modal{opacity: 1; visibility: visible;}
                    .errMsg{color: green; background: #1997002a;}
                    .forms .formWrapper:nth-child(3){  display: none; }</style>
                    <strong class="errMsg">Signup successfull, please log in</strong>
                    <script> document.getElementById('loginBtnWrpr').classList.add('active')
                    document.getElementById('SignUpBtnWrpr').classList.remove('active')
                    document.getElementById('signUpErr').innerHTML = ""; </script>`
    res.render('index', {errMsg: errMsg, userName: '', profile: ''})
})

/*
This function adds a new user to the database.
Before it does so it checks if this user already exists.
*/

app.post('/createUser', redirectHome, function(req, res){
    var userCreate = {firstName, lastName, email, password} = req.body

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
            profile: ''
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
                res.render('index', {
                    errMsg: errMsg,
                    userName: '',
                    profile: ''
                });
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

app.get('/successfullLogin', (req, res) =>{
    const {user} = res.locals
    res.render('index', {errMsg: '', userName: user.firstName, profile: profileMsg})
})

app.post('/login', redirectHome, function(req, res){
        create.findOne({
            email: req.body.email,
        }).then((userLogin) => {
            if(!userLogin){
                var errMsg = `  <style> .modal{opacity: 1; visibility: visible;} </style>
                                <strong class="errMsg">Oops. This email is not found, please try again</strong>
                                <script> document.getElementById('signUpErr').innerHTML = ""; </script> `
                
                res.render('index', {errMsg: errMsg, userName: '', profile: ''})
                log.write('User not found at logging in\n')
            }else{
                bcrypt.compare(req.body.password, userLogin.password, function(err, isMatch){
                    if(isMatch) {
                        req.session.userId = userLogin.id
                        res.render('index', {userName: userLogin.firstName, errMsg: '', profile: profileMsg})
                    }else{
                        var errMsg = `  <style> .modal{ opacity: 1;visibility: visible;}</style>
                                         <strong class="errMsg">Password incorrect, please try again</strong>
                                         <script> document.getElementById('signUpErr').innerHTML = ""; </script> `
                        
                        res.render('index', {errMsg: errMsg, userName: '', profile: ''})
                        
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
        res.render('addRecipe', {userName: loggedUser.firstName, submitSucessMsg: '', profile: profileMsg})
    })
})

/*
This function renders the display page for all exsisiting recipes
*/
app.get('/recipiesDisplay', redirectLogin, function(req, res){
    const {userId} = req.session;
    create.findById(userId, (err, loggedUser) =>{

        recipe.find({}, function(err, allRecipies){
            if(err){
                console.log(err);
            }else{
                res.render('recipiesDisplay', {
                    recipe: allRecipies,
                    userName: loggedUser.firstName,
                    profile: profileMsg
                })
            }
        })
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
            res.redirect('/recipiesDisplay') 
        }
    })
})

/*
This function displays one recipe when clicked on*/
app.get('/recipe/:id', function(req, res) {
    const {userId} = req.session;
    create.findById(userId, (err, loggedUser) =>{
        recipe.findById(req.params.id, function(err, returningRec){
            if(err){
                console.log(err); 
            }else{
                res.render('viewRecipe', {
                    recipe: returningRec,
                    userName: loggedUser.firstName,
                    profile: profileMsg
                })
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

        recipe.findById(req.params.id, function(err, returningRec){
            if(err){
                console.log(err); 
            }else{
                res.render('editRecipe', {
                    recipe: returningRec,
                    userName: loggedUser.firstName,
                    profile: profileMsg
                })
            }
        })
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

app.get('/logout', redirectLogin, (req, res) =>{
    req.session.destroy(err => {
        if(err){
            console.log(err);
        }else{
            res.clearCookie(cookieName)
            res.redirect('/')
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