const mongoose = require('mongoose')
const cities = require('./cities')
const Campground = require('../models/campground')
const { places, descriptors } = require('./seedHelpers')

// console.log(mapBoxToken)

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('DataBase Connected')
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 20; i++) {
    const price = Math.floor(Math.random() * 20)
    const random1000 = Math.floor(Math.random() * 1000)
    const location = cities[random1000].city + "," + cities[random1000].state
    const geometry = { type: 'Point', coordinates: [cities[random1000].longitude, cities[random1000].latitude] }
    const camp = new Campground({
      author: '61518902b9f69d6fc1392f14',
      location,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry,
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat quaerat quisquam recusandae eaque, debitis non eligendi odit ad? Corporis omnis suscipit veniam quasi nesciunt laudantium at minima. Fuga, distinctio eius.',
      price,
      images: [
        {
          url: 'https://res.cloudinary.com/niklaus143/image/upload/v1635275258/YelpCamp/xhyuwzjwrbr9c07carag.jpg',
          filename: 'YelpCamp/xhyuwzjwrbr9c07carag'
        },
        {
          url: 'https://res.cloudinary.com/niklaus143/image/upload/v1635275258/YelpCamp/haspfmxpvi9tpznj5lxb.jpg',
          filename: 'YelpCamp/haspfmxpvi9tpznj5lxb'
        },
        {
          url: 'https://res.cloudinary.com/niklaus143/image/upload/v1635275258/YelpCamp/blqupeprdhrdrorh9ovp.jpg',
          filename: 'YelpCamp/blqupeprdhrdrorh9ovp'
        }
      ]
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
