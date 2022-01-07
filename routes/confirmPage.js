const Router=require('express')
const authorization=require('./../middlewares/middlewareAutorezation')
const requestConfirm=require('./../requests/requestConfirm')
const router=new Router()
 router.get('/send',authorization,requestConfirm.sendEmailConfirm)
 router.get('/check',requestConfirm.checkUser)

module.exports=router