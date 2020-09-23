const express = require('express')
const app = express()

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use(express.static('public'))

app.get('/', function(req, res){
    res.render('POC.ejs')
})

app.listen(3000)
