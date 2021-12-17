const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./routes/mainPage')
const config=require('./config.json')
const CORS=require('./middlewares/middlewareCORS')
const app = express()
const port = process.env.PORT || +config.port

app.use(express.json())
app.use(CORS)
app.use('/auth', authRouter)

app.get('/', (req, res) => {
    res.send('<h1>Welcome to server of organizer:)</h1>')
})

const start = async () => {
    try {
        await mongoose.connect(config.DatabaseUrl)
        app.listen(port, () => {
            console.log('server start')
        })
    } catch (e) {
        console.log('no connected', e)
    }
}

start()