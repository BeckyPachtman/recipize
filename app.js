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
 //functionFromScript = require('./public/scriptForApp')

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
    res.render('index', {errMsg: ''} );
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
            var errMsg  = `
                        <style> .modal{opacity: 1;visibility: visible;}
                        .forms .formWrapper:nth-child(2){
                            display: none;
                        }
                        .forms .formWrapper:nth-child(3){
                            display: flex;
                        }
                        /*.loginButton{
                            background-color: #e0e0e0;
                        }*/
                        
                        </style>
                        <strong class="errMsg">This user already exists, log in or choose a different email</strong>
                        <script>
                        
                            var so = document.getElementById('SignUpBtnWrpr')
                            so.classList.add('active')

                            var so = document.getElementById('loginBtnWrpr')
                            so.classList.remove('active')

                            document.getElementById('loginErr').innerHTML = "";
                           
                           
                            /*document.querySelector('#login').style.display = 'none';
                            document.querySelector('.signUpFormWrapper').style.display = 'flex';

                           functionFromScript()

                            var signUpBtnwrapr = document.getElementById('SignUpBtnWrpr')
                            signUpBtnwrapr.classlist.add('active')
                            console.log(signUpBtnwrapr)
                            
                            
                            var tt = document.getElementById('loginErr')
                            tt.innerHTML = "";
                            this.tt.classList.remove('active')
                            console.log(so)*/


                        </script>
                    `
            res.render('index', {errMsg: errMsg})
        }else{
            create.create(userCreate, function(err){
                if(err){
                    console.log(err);
                }else{
                }
            })
            res.redirect('/')
        }
    })
})

app.get('/closeModal', function(req, res){
    res.redirect('/')
})
app.post('/login', function(req, res){

    create.findOne({
        email: req.body.email,
    }).then((userLogin) => {
        if(!userLogin){
            var errMsg = `
                        <style> .modal{opacity: 1;visibility: visible;}</style>
                        <strong class="errMsg">Oops. This email is not found, please try again</strong>
                        <script>

                            document.getElementById('signUpErr').innerHTML = "";

                        </script>
                    `
            res.render('index', {errMsg: errMsg})
        }
        else{
            create.findOne({
                password: req.body.password
            }).then((pass) => {
                if(!pass){
                    var output = `
                        <style> .modal{ opacity: 1;visibility: visible;}</style>
                        <strong class="errMsg">Password incorrect, please try again</strong>
                        <script> document.getElementById('signUpErr').innerHTML = ""; </script>
                    `
                    res.render('index', {output})
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
