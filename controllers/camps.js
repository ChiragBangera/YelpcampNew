const Campground = require('../models/campground')
const Review = require('../models/review')
const {cloudinary} = require('../cloudinary/index')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const  geoCoder = mbxGeocoding({accessToken:mapBoxToken})




module.exports.campgroundsPage = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}


module.exports.newCampPage = (req, res) => {
    res.render('campgrounds/new');
}


module.exports.showCampPage = async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id).populate('author')
    if (!camp) {
        req.flash('error', 'Camp Not Found')
        return res.redirect('/campgrounds')
    }
    const reviews = await Review.find({ campground: id }).populate('author')
    if(reviews[0]){
        const date = Date(reviews[0].reviewdate).split(" ").splice(1,3).join("-")
        return res.render('campgrounds/show', { camp, reviews, date })
    }
    res.render('campgrounds/show', { camp, reviews})
    
}


module.exports.postNewCamp = async (req, res) => {
    const newCamp = new Campground(req.body)
    const data = [req.body.longitude,req.body.latitude]
    const prop = {"type":"Point","coordinates":data}
    newCamp.geometry = prop
    newCamp.images = req.files.map(f=>({url:f.path,filename:f.filename}))
    newCamp.author = req.user._id
    await newCamp.save()
    req.flash('success', 'Successfully Created a Camp')
    res.redirect(`/campgrounds/${newCamp._id}`)
}


module.exports.updateCamp = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, req.body)
    const data = [req.body.longitude,req.body.latitude]
    const prop = {"type":"Point","coordinates":data}
    camp.geometry = prop
    const images = req.files.map(f=>({url:f.path,filename:f.filename}))
    camp.images.push(...images)
    await camp.save()
    if(req.body.deleteImages){
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await camp.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    req.flash('success', 'Camp Successfully Updated!!!')
    res.redirect(`/campgrounds/${id}`)
}


module.exports.editCampPage = async (req, res) => {
    const { id } = req.params;
    const findCamp = await Campground.findById(id)
    if (!findCamp) {
        req.flash('error', 'Camp Not Found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/editcamp', { findCamp })
}



module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    await Review.deleteMany({ campground: id })
    const camp = await Campground.findById(id)
    await cloudinary.uploader.destroy(camp.images[0].filename)
    await Campground.findByIdAndDelete(id)
    req.flash('error', 'Successfully Deleted Camp')
    res.redirect('/campgrounds')
}