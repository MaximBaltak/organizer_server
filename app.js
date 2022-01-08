const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./routes/mainPage')
const tasksRouter = require('./routes/tasksPage')
const goalsRouter = require('./routes/goalsPage')
const profileRouter=require('./routes/profilePage')
const confirmRouter=require('./routes/confirmPage')
const CORS=require('./middlewares/middlewareCORS')
const sending=require('./operationsServer/sendingMessages')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())
app.use(CORS)
app.use('/auth', authRouter)
app.use('/tasks', tasksRouter)
app.use('/goals', goalsRouter)
app.use('/profile', profileRouter)
app.use('/confirm', confirmRouter)
setInterval(()=>sending(),1000*60*60*24)


app.get('/', (req, res) => {
    res.send('<h1>Welcome to server of organizer:)</h1>')
})
const start = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT)
        app.listen(port, () => {
            console.log('server start')
        })
    } catch (e) {
        console.log('no connected', e)
    }
}

start()