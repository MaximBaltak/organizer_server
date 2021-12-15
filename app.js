const fs =require('fs')
const express=require('express')
const app=express()
const port=process.env.PORT||3000
const cors=require('cors')
const {response} = require("express");


app.get('/', (req,res)=>{
    response.setHeader('Access-Control-Allow_Origin','https://online-organizer.herokuapp.com')
    res.send('<h1>Welcome to server of organizer:)</h1>')
})

app.listen(port,()=>{
    console.log('server start')
})