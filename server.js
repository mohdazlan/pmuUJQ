if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: '.env' })
}
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const authorRouter = require('./routes/author')
const documentRouter = require('./routes/document')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', error => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/documents', documentRouter)

app.listen(process.env.PORT || 3000)