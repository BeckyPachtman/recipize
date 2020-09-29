const bodyParser = require('body-parser'),
 mongoose = require('mongoose'),
 express = require('express'),
 methodOverride = require('method-override'),
 app = express()

mongoose.connect('mongodb://localhost/recipize', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const newRecipeSchema = new mongoose.Schema({
    title: String,
    prpTime: String,
    ckTime: String,
    ttlTime: String,
    img: String,
    yields: String,
    ingrdnts: Array,
    dirctns: Array
})

const recipe = mongoose.model('Recipe', newRecipeSchema)

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json()); 
app.use(methodOverride('_method'))

app.get('/', function(req, res){
    res.render('POC.ejs')
})

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

app.listen(3000)
