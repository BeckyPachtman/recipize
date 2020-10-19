var mongoose = require('mongoose')

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

module.exports = mongoose.model('Recipe', newRecipeSchema);
