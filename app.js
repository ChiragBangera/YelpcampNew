if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const path = require('path')
const methodoverride = require('method-override')
const mongoose = require('mongoose')
const engine = require('ejs-mate')
const campRoutes = require('./routes/camp')
const reviewRoutes = require('./routes/review')
const userRoutes = require('./routes/user')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const passportLocal = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize')
const MongoStore = require('connect-mongo')


const DB = process.env.DBKEY
mongoose.connect(DB,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>{
        console.log('Database Connected')
    })
    .catch((e)=>{
        console.log('MongoDB Not Connected')
    })




app.use(mongoSanitize())
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodoverride('_method'))
app.engine('ejs',engine)
app.use(express.static(path.join(__dirname,'public')))
// session Configuration of cookies

const secret = process.env.SECRETE || 'thisshouldbeabettersecret'

const sessionConfig = {
    store: MongoStore.create({
        mongoUrl:DB,
        touchAfter: 24 * 3600
    }),
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires:Date.now()+ 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}




app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})
app.use('/',userRoutes)
app.use('/campgrounds', campRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)



app.get('/',(req,res)=>{
    res.render('home')
})












app.use((err,req,res,next)=>{
    const {status=500,message="Something went wrong"} = err
    res.status(status).render('error', {status,message})
})


const port = process.env.PORT || 4000
app.listen(port,()=>{
    console.log(`Listening to ${port}`)
})
