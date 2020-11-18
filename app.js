const { argon2 } = require('argon2');

const bodyParser = require('body-parser'),
 create = require('./modules/userCreate'),
 crypto = require('crypto'),
 Grid = require('gridfs-stream'), //GridFs Stream
 GridFsStorage = require('multer-gridfs-storage'), //GridFs
 express = require('express'),
 methodOverride = require('method-override'),
 mongoose = require('mongoose'),
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
                userName: ''
            });
        }
    })
})

app.post('/createUser', PhotoUpload.single('attachProfilePhoto'), function(req, res){
    var userCreate = {
        createUserFName: req.body.createUserFName,
        createUserLName: req.body.createUserLName,
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
            create.create(userCreate, function(err){
                if(err){
                    console.log(err);
                }
            })
            res.redirect('/');
        }
    })
})

app.post('/login', function(req, res){


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
                    //

                    var password = req.body.password
                    argon2.generateSalt().then(salt => {
                        argon2.hash(password, salt).then(hash =>{
                            console.log('successfully created argon2 hash:', hash);
                        })
                    })
                    res.render('index', {errMsg: '', files: '', userName: '' })
                }
            })
        }
    })
})

app.get('/AddNewRecipe', function(req, res){
    res.render('addRecipe', {files: '',  userName: '', submitSucessMsg: ''})
})

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

app.post('/newRecipeData', function(req, res) {
    var fullRecipe = {
        title: req.body.title,
        prpTime: req.body.prpTime,
        prpTimeSlct: req.body.select1,
        ckTime: req.body.ckTime,
        ckTimeSlct: req.body.select2,
        ttlTimeHrs: req.body.ttlTimeHrs,
        ttlTimeMin: req.body.ttlTimeMin,
        ttlTimeSlctHrs: req.body.ttlTimeSlctHrs,
        ttlTimeSlctMin: req.body.ttlTimeSlctMin,
        yields: req.body.yields,
        img: req.body.img,
        ingrdnts: req.body.ingrdnts,
        dirctns: req.body.dirctns
    }
    recipe.create(fullRecipe, function(err){
        if(err){
            console.log(err);
        }else{
            res.render('addRecipe', {submitSucessMsg: 'Recipe submitted Successfully', files: '', userName: '' }) 
        }
    })
})

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


app.delete('/recipe/:id', function(req, res) {
    recipe.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.send(err)
        }else{
            res.redirect('/recipiesDisplay')
            //res.redirect(req.originalUrl)

        }
    })
})

app.get('/closeModal', function(req, res){
    res.redirect('/')
})


app.listen(3000)