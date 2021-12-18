const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./routes/mainPage')
const tasksRouter = require('./routes/tasksPage')
const CORS=require('./middlewares/middlewareCORS')
require('dotenv').config()
const app = express()
const port = process.env.PORT || process.env.LOCAL_PORT

app.use(express.json())
app.use(CORS)
app.use('/auth', authRouter)
app.use('/tasks', tasksRouter)

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