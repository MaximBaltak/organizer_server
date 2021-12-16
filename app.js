const express=require('express')
const app=express()
const port=process.env.PORT||3000

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    next()
})

app.get('/', (req,res)=>{
    res.send('<h1>Welcome to server of organizer:)</h1>')
})

app.listen(port,()=>{
    console.log('server start')
})