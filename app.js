if (process.env.NODE_ENV !== "production")
    require('dotenv').config()


const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsMate)

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
);

const sessionconfig = {
    name: "SessionID",
    secret: 'PowerfulSecret', resave: false, saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 3600000,
        maxAge: 360000
    }
}

app.use(session(sessionconfig))
app.use(flash())
app.use(helmet({contentSecurityPolicy: false }));

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    // console.log(req.session)
    // console.log(req.query)
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

const campgroundsrout = require('./routes/campgrounds')
const reviewsrout = require('./routes/review')
const usersrout = require('./routes/user')

app.use('/', usersrout)
app.use('/campgrounds', campgroundsrout)
app.use('/campgrounds/:id/reviews', reviewsrout)

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
    // ,useFindAndModify: false
    // , strictPopulate: false
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('DataBase Connected')
})

app.get('/', (req, res) => {
    res.render("home")
})

app.all('*', (req, res, next) => {
    // res.send('404 Error !!!!!!!!!!!')
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    // res.send('Error Found')
    const { statusCode = 500 } = err
    if (!err.message)
        err.message = 'Something went wrong'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('listening')
})

