const Campground = require('../models/campground')
const Review = require('../models/review')


module.exports.reviewPost = async (req, res) => {
    const now = new Date()
    const camp = await Campground.findById(req.params.id)
    const review = new Review(req.body)
    review.campground = camp
    review.author = req.user._id
    review.reviewdate = now
    await review.save()
    req.flash('success', 'Successfully Created Review')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.reviewDelete = async (req, res) => {
    const { revid, id } = req.params
    await Review.findByIdAndDelete(revid)
    req.flash('error', 'Successfully Deleted Review')
    res.redirect(`/campgrounds/${id}`)
}