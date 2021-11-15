const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const controluser = require('../controllers/users')

router.route('/register')
    .get(controluser.renderResigterUser)
    .post(catchAsync(controluser.postResigterUser))

router.route('/login')
    .get(controluser.renderLoginUser)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), controluser.postLoginUser)

router.get('/logout', controluser.logout)

module.exports = router