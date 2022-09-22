const Campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seedshelper')
const mongoose = require('mongoose')
const DB = "mongodb+srv://chiragbangera:chiragadarsh@cluster1.c3lu4j0.mongodb.net/yelpcamp?retryWrites=true&w=majority"
mongoose.connect(DB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Database Connected')
    })
    .catch((e) => {
        console.log('MongoDB Not Connected')
        console.log(e)
    })


const sample = arr => arr[Math.floor(Math.random() * arr.length)];


const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i <= 50; i++) {
        const rand1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 500 + 100)
        const camp = new Campground({
            location: `${cities[rand1000].city},${cities[rand1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            author:'62f93624abb9f371b98eed58',
            image: 'https://source.unsplash.com/collection/483251',
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus voluptatem rem necessitatibus nihil sequi nulla, adipisci hic. Commodi maiores, explicabo nesciunt voluptas earum, dolore excepturi suscipit dignissimos ea distinctio error?',
            price:price})
        await camp.save()
    }
}




seedDB().then(()=>{
    mongoose.connection.close()
    console.log('Database Connection Closed')
})