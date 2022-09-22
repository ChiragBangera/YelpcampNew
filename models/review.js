const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    review:String,
    rating:Number,
    reviewdate:Date,
    campground:{
        type:mongoose.Schema.Types.ObjectId, ref:'Campground'
    },
    author:{
        type:mongoose.Schema.Types.ObjectId, ref:'User'
    }
})


module.exports = mongoose.model('Review',reviewSchema)