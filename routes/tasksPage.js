const Router = require('express')
const autorezation = require('./../middlewares/middlewareAutorezation')
const requestTasks = require('./../requests/requestTasks')
const router = new Router()
router.get('/', autorezation, requestTasks.getTasks)
router.post('/', autorezation, requestTasks.addTask)
router.post('/update', autorezation,requestTasks.changedTask)
router.get('/delete', autorezation,requestTasks.deleteTask)
module.exports = router