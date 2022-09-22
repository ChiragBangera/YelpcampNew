const {campSchema,reviewSchema} = require('../schemas')
const ExpressError = require('../error/errorhandlers')
const Campground = require('../models/campground')
const Review = require('../models/review')


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error','Please Login :)')
        return res.redirect('/login')
    }
    next()
}



module.exports.validateCampground = (req,res,next)=>{
    const {error} = campSchema.validate(req.body)
    if(error){
        // const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(400,error)
    }else{
        next()
    }
}


module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(400,msg)
    }else{
        next()
    }
}


module.exports.checkReturnTo = (req, res, next)=>{
    if (req.session.returnTo) {
      res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthenticated = async(req,res,next)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    if(!camp.author.equals(req.user._id)){
        req.flash('error', 'You are not Authorized for this action')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isRevAuthenticated = async(req,res,next)=>{
    const {revid} = req.params;
    const rev = await Review.findById(revid);
    if(!rev.author.equals(req.user._id)){
        req.flash('error', 'You are not Authorized for this action')
        return res.redirect(`/campgrounds/${req.params.id}`)
    }
    next()
}

