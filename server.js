require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const bodyparser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const path = require('path')
const {notify,result} = require('./server/middlewares/popups')
const app = express()

PORT = process.env.PORT || 8080
const SECRET = process.env.SECRET

const connectDB = require('./server/connections/connectDB')
connectDB().then(()=>{
    app.listen(PORT,async()=>{
            console.log(`|             🚀 Application is @ http://127.0.0.1:${PORT} .....     |`)
            console.log(`-------------------------------------------------------------------`)
    })
}).catch( error => {
    console.log(error)
})

app.set('view engine','ejs')
app.use(morgan('tiny'))
app.use(express.static('assets'))
app.use(express.json())
app.use(cookieParser())
app.use(bodyparser.urlencoded({extended:true}))
app.use(session({secret:SECRET,resave:false,saveUninitialized:true,cookie:{httpOnly:true}}))
app.use(notify)
app.use(result)

app.use('/css',express.static(path.join(__dirname,'node_modules','bootstrap','dist','css')))
app.use('/css',express.static(path.join(__dirname,'node_modules','animate.css')))
app.use('/js',express.static(path.join(__dirname,'node_modules','bootstrap','dist','js')))
app.use('/js',express.static(path.join(__dirname,'node_modules','jquery','dist')))
app.use('/',require('./server/routers/router'))

