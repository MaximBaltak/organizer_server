const express=require('express')
const mongoose=require('mongoose')
const authRouter=require('./routes/mainPage')
const app=express()
const port=process.env.PORT||3000

app.use(express.json())
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    next()
})
app.use('/auth',authRouter)

app.get('/', (req,res)=>{
    res.send('<h1>Welcome to server of organizer:)</h1>')
})

const start=async ()=>{
    try {
        await mongoose.connect( "mongodb+srv://maxim:maksim+100500@cluster0.qfqme.mongodb.net/organizer?retryWrites=true&w=majority")
        app.listen(port,()=>{
            console.log('server start')
        })
    }catch (e){
        console.log('no connected',e)
    }
}
start()