const express = require('express')
const router = express.Router({ mergeParams: true })
const Campground = require('../models/campground')
const Review = require('../models/review')
const ExpressError = require('../error/errorhandlers')
const catchAsync = require('../error/catchasync')
const { validateReview, isLoggedIn, isRevAuthenticated } = require('../middleware/checklogin')
const {reviewPost,reviewDelete} = require('../controllers/review')
// review operations
router.post('/',
    isLoggedIn,
    validateReview,
    catchAsync(reviewPost)
)
router.delete('/:revid',
    isLoggedIn,
    isRevAuthenticated,
    catchAsync(reviewDelete)
)


module.exports = router