const express = require('express')
const cors = require('cors')
const passport = require('passport')
require('dotenv').config()
const path = require('path')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const projectRoutes = require('./routes/project')
const bookFileRoutes = require('./routes/bookFile')
const orderFileRoutes = require('./routes/orderFile')
const FormsRoutes = require('./routes/forms')
const paymentRoutes = require('./routes/payment')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())

// ✅ Serve uploaded files statically
app.use(
   '/quoteImagesAndFiles',
   express.static(path.join(__dirname, 'quoteImagesAndFiles')),
)
app.use(
   '/orderDataFiles',
   express.static(path.join(__dirname, 'orderDataFiles')),
)

app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/project', projectRoutes)
app.use('/book_file', bookFileRoutes)
app.use('/order_file', orderFileRoutes)
app.use('/forms', FormsRoutes)
app.use('/payment', paymentRoutes)

app.listen(process.env.PORT, () => {
   console.log(`Server running on port ${process.env.PORT}`)
})
