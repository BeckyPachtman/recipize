const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const express = require('express')
const app = express()

mongoose.connect('mongodb://localhost/recipize', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const newRecipeSchema = new mongoose.Schema({
    title: String,
    prpTime: String,
    ckTime: String,
    ttlTime: String,
    yields: String,
    ingrdnts: String,
    dirctns: String
})

const recipe = mongoose.model('Recipe', newRecipeSchema)

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json()); 

/*
app.get('/', function(req, res){
    res.render('POC.ejs')
})*/

app.get('/AddNewRecipe', function(req, res){
    res.render('POC.ejs')
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
    const title = req.body.title,
    prpTime = req.body.prpTime,
    ckTime = req.body.ckTime,
    ttlTime = req.body.ttlTime,
    yields = req.body.yields,
    ingrdnts = req.body.ingrdnts,
    dirctns = req.body.dirctns;

    var newRecipe = {title, prpTime, ckTime, ttlTime, yields, ingrdnts, dirctns};

    recipe.create(newRecipe, function(err){
        if(err){
            console.log(err);
        }else{
            /*res.json(newRecipe)
            console.log(newRecipe); */
            res.redirect('/recipiesDisplay') 
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

app.listen(3000)
