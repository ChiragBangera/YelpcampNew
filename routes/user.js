const express = require('express')
const catchasync = require('../error/catchasync')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const { checkReturnTo } = require('../middleware/checklogin')
const {registerUserPage,userLogin,postUser,checkUserLogin, userLogout} = require('../controllers/user')



router.route('/register')
    .get(catchasync(registerUserPage))
    .post(catchasync(postUser))




router.route('/login')
    .get(userLogin)
    .post(checkReturnTo,
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        checkUserLogin)




router.get('/logout',userLogout)

module.exports = router