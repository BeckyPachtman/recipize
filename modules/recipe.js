var mongoose = require('mongoose')

const newRecipeSchema = new mongoose.Schema({
    title: String,
    prpTime: String,
    prpTimeSlct: String,
    ckTime: String,
    ckTimeSlct: String,
    ttlTimeHrs: String,
    ttlTimeMin: String,
    img: String,
    yields: String,
    ingrdnts: Array,
    dirctns: Array
})

module.exports = mongoose.model('Recipe', newRecipeSchema);
