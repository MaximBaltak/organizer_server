const Router=require('express')
const authorization=require('./../middlewares/middlewareAutorezation')
const requestGoals=require('./../requests/requestGoals')
const router=new Router()
router.get('/',authorization,requestGoals.getGoal)
router.post('/',authorization,requestGoals.addGoal)
router.post('/update',authorization,requestGoals.changedGoal)
router.get('/delete',authorization,requestGoals.deleteGoal)
module.exports=router