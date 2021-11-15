const catchAsync = require('../utils/catchAsync')
const controlreview = require('../controllers/reviews')
const express = require('express')
const router = express.Router({ mergeParams: true })
const {isLoggedIn , validateReview, isreviewAuthor} = require('../middleware')

router.post('/', isLoggedIn, validateReview , catchAsync(controlreview.createReview))

router.delete('/:reviewid',isLoggedIn, isreviewAuthor, catchAsync(controlreview.deleteReview))

module.exports = router