const express = require('express')
const router = express.Router()
const catchAsync = require('../error/catchasync')
const { validateCampground, isAuthenticated, isLoggedIn } = require('../middleware/checklogin')
const {campgroundsPage,newCampPage,showCampPage,postNewCamp,updateCamp,editCampPage,deleteCamp} = require('../controllers/camps')
const multer = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({storage})





// Campground page
router.route('/')
    .get(catchAsync(campgroundsPage))

    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(postNewCamp))



// new Camp
router.route('/newcamp')
    .get(isLoggedIn,
        newCampPage)


// campground show/post route
router.route('/:id')
    .get(catchAsync(showCampPage))

    .patch(isLoggedIn,
        isAuthenticated,
        upload.array('image'),
        validateCampground,
        catchAsync(updateCamp))

    .delete(isLoggedIn,
        isAuthenticated,
        catchAsync(deleteCamp))
    


// edit page route
router.route('/:id/editcamp')
    .get(isLoggedIn,
    isAuthenticated,
    catchAsync(editCampPage))



module.exports = router