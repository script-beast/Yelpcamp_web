const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground')
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const reviews = require('./models/reviews')

module.exports.isLoggedIn = (req, res, next) => {
    // console.log('User =', req.user)
    if (!req.isAuthenticated()) {
        req.session.returnto = req.originalUrl
        req.flash('error', 'You are not logined in')
        return res.redirect('/login')
    }
    next()
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(' , ')
        throw new ExpressError(msg, 400)
    }
    // console.log(result.error.details[0].message)
    else {
        next()
    }
}

module.exports.isAuthor = async (req,res, next) => {
    const id = req.params.id
    const campgrounds = await Campground.findById(id)
    if( !campgrounds.author.equals(req.user._id))
    {
        req.flash('error',"You don't have permission" )
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isreviewAuthor = async (req,res, next) => {
    const { id, reviewid } = req.params
    const revie = await reviews.findById(reviewid)
    if( !revie.author.equals(req.user._id))
    {
        req.flash('error',"You don't have permission" )
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(' , ')
        throw new ExpressError(msg, 400)
    }
    // console.log(result.error.details[0].message)
    else {
        next()
    }
}