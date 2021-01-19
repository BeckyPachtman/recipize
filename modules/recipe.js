var mongoose = require('mongoose')

const newRecipeSchema = new mongoose.Schema({
    title: String,
    prpTimeHrs: String,
    prpTimeMin: String,
    ckTimeHrs: String,
    ckTimeMin: String,
    ttlTimeHrs: String,
    ttlTimeMin: String,
    img: String,
    yieldInput: String,
    yieldSelect: String,
    ingrdnts: Array,
    tips: Array,
    dirctns: Array,
    author: String
})

module.exports = mongoose.model('Recipe', newRecipeSchema);
