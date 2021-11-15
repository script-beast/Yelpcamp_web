const User = require('../models/user')

module.exports.renderResigterUser = (req, res) => {
    res.render('users/register')
}

module.exports.postResigterUser = async (req, res) => {
    // res.send(req.body)
    try {
        const { email, username, password } = req.body
        const user = await new User({ email, username })
        const regisuser = await User.register(user, password)
        // console.log(regisuser)
        req.login(regisuser, err => {
            if (err) return next(err)
            req.flash('success', 'Welcome to Yelp Camp!!!!')
            res.redirect('/campgrounds')
        })
    }
    catch (e) {
        req.flash('error', e.message)
        res.redirect('register')
    }
}

module.exports.renderLoginUser = (req, res) => {
    res.render('users/login')
}

module.exports.postLoginUser = (req, res) => {
    // console.log(req.body)
    req.flash('success', 'Welcome Back')
    const redirectUrl = req.session.returnto || '/campgrounds'
    delete req.session.returnto
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logOut()
    req.flash('success', 'Logout')
    res.redirect('/campgrounds')
}