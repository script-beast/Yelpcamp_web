const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const { cloudinary } = require('../cloudinary')

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.postNewCamp = async (req, res, next) => {
    const geodata = await geocoder.forwardGeocode({
        query: req.body.campground.location ,
        limit: 1
    })
    .send()
    // if(!req.body.campground) throw new ExpressError('Invaild Campground Data', 400)
    const camp = new Campground(req.body.campground)
    camp.geometry = geodata.body.features[0].geometry
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    camp.author = req.user._id
    await camp.save()
    // console.log(camp)
    req.flash('success', 'Successfully made a new campground !i!i!i!i!i!i!i!i!i')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.showPage = async (req, res, next) => {
    const campgrounds = await Campground.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author')
    // console.log(campgrounds)
    if (!campgrounds) {
        req.flash("error", "Cannot find campground")
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campgrounds })
}

module.exports.renderEditForm = async (req, res, next) => {
    const campgrounds = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campgrounds })
}

module.exports.putEditCamp = async (req, res, next) => {
    const id = req.params.id
    // console.log(req.body.deleteImages)
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    camp.images.push(...imgs)
    if (req.body.deleteImages) {
        for (let fl of req.body.deleteImages)
            await cloudinary.uploader.destroy(fl)
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        // console.log(camp)
    }
    await camp.save()
    req.flash('success', 'Successfully updated campground !i!i!i!i!i!i!i!i!i')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.deleteCamp = async (req, res, next) => {
    const id = req.params.id
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground !i!i!i!i!i!i!i!i!i')
    res.redirect(`/campgrounds`)
}