const catchAsync = require('../utils/catchAsync')
const controlcamp = require('../controllers/campgrounds')
const express = require('express')
const router = express.Router()
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(controlcamp.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(controlcamp.postNewCamp))

router.get('/new', isLoggedIn, controlcamp.renderNewForm)

router.route('/:id')
    .get(catchAsync(controlcamp.showPage))
    .put(isLoggedIn, isAuthor,  upload.array('image'), validateCampground, catchAsync(controlcamp.putEditCamp))
    .delete(isLoggedIn, isAuthor, catchAsync(controlcamp.deleteCamp))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(controlcamp.renderEditForm))

module.exports = router