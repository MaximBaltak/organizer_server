const Router=require('express')
const authorization=require('./../middlewares/middlewareAutorezation')
const requestGoals=require('./../requests/requestGoals')
const router=new Router()
router.get('/',authorization,requestGoals.getGoal)
router.post('/',authorization,requestGoals.addGoal)
router.put('/update',authorization,requestGoals.changedGoal)
router.delete('/delete',authorization,requestGoals.deleteGoal)
module.exports=router