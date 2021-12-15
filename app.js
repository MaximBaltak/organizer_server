const fs =require('fs')
const express=require('express')
const app=express()
const port=process.env.PORT||3000
const cors=require('cors')
const optionsCORS={
    origin:'https://online-organizer.herokuapp.com'

}
app.use(cors(optionsCORS))
app.get('/', (req,res)=>{
    res.send('<h1>Welcome to server of organizer:)</h1>')
})

app.listen(port,()=>{
    console.log('server start')
})