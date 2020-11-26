const { update } = require('./modules/userCreate');

const bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    create = require('./modules/userCreate'),
    crypto = require('crypto'),
    session = require('express-session'),
    Grid = require('gridfs-stream'), //GridFs Stream
    GridFsStorage = require('multer-gridfs-storage'), //GridFs
    express = require('express'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose'),
    MongoDBSession = require('connect-mongodb-session')(session),
    multer = require('multer'),
    path = require('path'),
    recipe = require('./modules/recipe'),
    {check, validationResult} = require('express-validator'),
    argon = require('argon2'),
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

/*
//get all photos
app.get('/photos', function(req, res){
    gfs.files.find().toArray(function(err, files){
        if(!files || files.length === 0){
            res.send('no photos found')
        }else{
            res.send(files)
        }
    })
})*/

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

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use(express.static('public'))
var urlencodedParser = app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json()); 
app.use(methodOverride('_method'))
app.use(cookieParser());

var store = new MongoDBSession({
    uri: mongoURI,
    collection: 'session'
})

app.use(session({
    secret: 'workhardandwritesoestupifnon-sensestuffhere',
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: true
    }
}));

app.get('/test', function(req, res){
    if (req.session.views) {
        req.session.views++
        res.setHeader('Content-Type', 'text/html')
        res.write('<p>views: ' + req.session.views + '</p>')
        res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
        res.end()
      } else {
        req.session.views = 1
        res.end('welcome to the session demo. refresh!')
      }
})
var isAuth = function(req, res, next){
    if(req.session.user && req.cookies.user_sid){
        next()
    }else{
        res.send('not logged in <a href="/login">login</a>')
    }
}



app.get('/', function(req, res){
      /*  gfs.files.findOne({filename: req.params.filename}, function(err, file){
        if(!file || file.length === 0){
            res.render('index', {
                errMsg: '',
                files: false
            })
        }else if(file.contentType === 'image/png' || file.contentType === 'image/jpeg'){
            var readStream = gfs.createReadStream(file.filename);
            readStream.pipe(res)
        }else{
            res.render('index', {
                errMsg: '',
                files: files
            });
        }
    })*/
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
                userName: 'j'
            });
        }
    })
})

app.get('/login', function(req, res){
    var errMsg = `  <style> .modal{opacity: 1; visibility: visible;} </style>`
    res.render('index', {errMsg: errMsg, files: '', userName: '' })
})

/*
This function adds a new user to the database.
Before it does so it checks if this user already exists.
*/
app.post('/createUser', PhotoUpload.single('attachProfilePhoto'), function(req, res){
    var userCreate = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    }

    create.findOne({
        email: req.body.email
    }).then((user) => {
        if(user){
            var errMsg = `  <style> .modal{opacity: 1; visibility: visible;}
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
            create.create(userCreate, function(err, user){
                if(err){
                    console.log(err);
                }
                req.session.user = user
                res.redirect('/');
            })
            
        }
    })
})

/*
This function logs a user to the system
It checks if the email and password match to an exsisitng user
It spits out an error accordingly
*/
app.post('/login', function(req, res, user){
    create.findOne({
        email: req.body.email,
    }).then((userLogin) => {
        if(!userLogin){
            var errMsg = `  <style> .modal{opacity: 1; visibility: visible;} </style>
                            <strong class="errMsg">Oops. This email is not found, please try again</strong>
                            <script> document.getElementById('signUpErr').innerHTML = ""; </script> `
            res.render('index', {errMsg: errMsg, files: '', userName: '' })
        }else{
            create.findOne({
                password: req.body.password
            }).then((pass) => {
                if(!pass){
                    var errMsg = `  <style> .modal{ opacity: 1;visibility: visible;}</style>
                                    <strong class="errMsg">Password incorrect, please try again</strong>
                                    <script> document.getElementById('signUpErr').innerHTML = ""; </script> `
                    res.render('index', {errMsg: errMsg, files: '', userName: '' })
                }else{
                    //var password = req.body.password
                    //argon2.generateSalt().then(salt => {
                    //    argon2.hash(password, salt).then(hash =>{
                    //        console.log('successfully created argon2 hash:', hash);
                    //    })
                    //})
                    req.session.user = user
                    res.redirect('/')
                }
            })
        }
    })
})

/*
This function renders the page to add a new recipe
*/
app.get('/AddNewRecipe', function(req, res){
    // if(req.session.user){
    //     
    // }else{
    //     res.redirect('/')
    // }
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
                userName: '' 
            })
        }
    })
})

/*
This function takes the data that the user added to the add a new recipe page form and submits it to the database
this function creates a new recipie (CREATE)
*/
app.post('/newRecipeData', function(req, res) {
     var fullRecipe = req.body.recipe
    //     title: req.body.title,
    //     prpTime: req.body.prpTime,
    //     prpTimeSlct: req.body.select1,
    //     ckTime: req.body.ckTime,
    //     ckTimeSlct: req.body.select2,
    //     ttlTimeHrs: req.body.ttlTimeHrs,
    //     ttlTimeMin: req.body.ttlTimeMin,
    //     ttlTimeSlctHrs: 'Hours',
    //     ttlTimeSlctMin: 'Minutes',
    //     yields: req.body.yields,
    //     img: req.body.img,
    //     ingrdnts: req.body.ingrdnts,
    //     dirctns: req.body.dirctns
    // }
    recipe.create(fullRecipe, function(err){
        if(err){
            console.log(err);
        }else{
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
            console.log(err);
        }else{
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
            res.send(err)
        }else{
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