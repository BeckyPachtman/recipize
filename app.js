const bodyParser = require('body-parser'),
 mongoose = require('mongoose'),
 express = require('express'),
 methodOverride = require('method-override'),
 recipe = require('./modules/recipe'),
 create = require('./modules/userCreate'),
 //login = require('./modules/userLogin'),
 {check, validationResult} = require('express-validator'),
 //argon2 = require('argon2'),
 app = express()

mongoose.connect('mongodb://localhost/recipize', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use(express.static('public'))
var urlencodedParser = app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json()); 
app.use(methodOverride('_method'))

app.get('/', function(req, res){
    res.render('index', {msg: ' '})
})

app.get('/AddNewRecipe', function(req, res){
    res.render('addRecipe')
})

app.get('/openModal', function(erq, res){
    res.render('htmlModal', {msg: ' '})
})

app.get('/recipiesDisplay', function(req, res){
    recipe.find({}, function(err, allRecipies){
        if(err){
            console.log(err);
        }else{
            res.render('recipiesDisplay', {recipe:allRecipies})
        }
    })
})

app.post('/newRecipeData', (req, res) => {
    var fullRecipe = {
        title: req.body.title,
        prpTime: req.body.prpTime,
        ckTime: req.body.ckTime,
        ttlTime: req.body.ttlTime,
        yields: req.body.yields,
        img: req.body.img,
        ingrdnts: req.body.ingrdnts,
        dirctns: req.body.dirctns
    }
    recipe.create(fullRecipe, function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/recipiesDisplay') 
        }
    })
})

app.post('/createUser', function(req, res){
    var userCreate = {
        createUserFName:req.body.createUserFName,
        createUserLName:req.body.createUserLName,
        email: req.body.email,
        password: req.body.password
    }

    create.findOne({
        email: req.body.email
    }).then((user) => {
        if(user){
            res.render('index', {msg: 'A user with this email already exists'})
        }else{
            create.create(userCreate, function(err){
                if(err){
                    console.log(err);
                }else{
                }
            })
            res.redirect('/AddNewRecipe')
        }
    })
})


app.post('/login', function(req, res){

    create.findOne({
        email: req.body.email,
    }).then((userLogin) => {
        if(!userLogin){
            res.render('index', {msg: 'User not found'})
            //res.status(400).send('User not found')
            //res.msg = "Current password does not match";
            
            //res.send(req.body)
            //return false
            create.findById(req.params.id, function(err, ret){
                if(err){
                    console.log(err);
                    
                }else{
                    console.log(ret);
                    
                }
            })
            
        }
        else{
            create.findOne({
                password: req.body.password
            }).then((pass) => {
                if(!pass){
                    res.render('index', {msg: 'Wrong password'})
                }
                else{
                    res.redirect('/recipiesDisplay')
                }
            })
        }
    })
})


app.get('/recipe/:id', (req, res) =>{
    recipe.findById(req.params.id, function(err, returningRec){
        if(err){
            console.log(err); 
        }else{
            res.render('viewRecipe', {recipe: returningRec})
        }
    })
})

app.delete('/recipe/:id', (req, res) =>{
    recipe.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.send(err)
        }else{
            res.redirect('/recipiesDisplay')
        }
    })
})


/*
async function starts(){
    let hash;
    let userPassword = 'bracha PachtmanIsTringStuffHErr';
    try{
        hash = await argon2.hash(userPassword)
        console.log(hash);
        
    }catch (err) {
        console.log(err); 
    }
    try{
        if(await argon2.verify(hash, 'hfiuhgiuhf')){
            console.log('matched');
        }else{
            console.log('not a match');
        }
    }catch(err) {
        console.log(err)
    }
}
starts()*/


app.listen(3000)
