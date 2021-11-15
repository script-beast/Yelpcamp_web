const Campground = require('../models/campground')
const Review = require('../models/reviews')

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    // console.log(req.body)
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Successfully posted review !i!i!i!i!i!i!i!i!i')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewid } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewid } })
    await Review.findByIdAndDelete(reviewid)
    req.flash('success', 'Successfully deleted review !i!i!i!i!i!i!i!i!i')
    res.redirect(`/campgrounds/${id}`)
}