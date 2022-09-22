const User = require('../models/user')


module.exports.registerUserPage = async (req, res) => {
    res.render('users/register')
}


module.exports.postUser = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, (err) => {
            if (err) return next(err)
            req.flash('success', 'Welcome to Campgrounds')
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}


module.exports.userLogin = (req, res) => {
    res.render('users/login')
}


module.exports.checkUserLogin = (req, res) => {
    req.flash('success', 'Welcome back!!!')
    const redirecturl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirecturl)
}


module.exports.userLogout = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
    });
}