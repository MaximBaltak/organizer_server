const Router = require('express')
const authorization = require('./../middlewares/middlewareAutorezation')
const requestTasks = require('./../requests/requestTasks')
const router = new Router()
router.get('/', authorization, requestTasks.getTasks)
router.post('/', authorization, requestTasks.addTask)
router.post('/update', authorization,requestTasks.changedTask)
router.get('/delete', authorization,requestTasks.deleteTask)
module.exports = router