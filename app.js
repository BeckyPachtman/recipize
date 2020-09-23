const express = require('express')
const app = express()

app.set('view engine', 'html')
app.get('/', function(req, res){
    //res.sendFile('HTML files/index.html')
})

app.listen(3000)