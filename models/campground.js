const mongoose = require('mongoose')





const imageSchema = new mongoose.Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = {toJSON:{virtuals:true}}

const CampgroundSchema = new mongoose.Schema({
    title: String,
    longitude:Number,
    latitude:Number,
    images: [imageSchema],
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
},opts)



CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`
});


module.exports = mongoose.model('Campground', CampgroundSchema)
