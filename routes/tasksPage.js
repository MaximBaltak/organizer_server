const Router = require('express')
const autorezation = require('./../middlewares/middlewareAutorezation')
const requestTasks = require('./../requests/requestTasks')
const router = new Router()
router.get('/', autorezation, requestTasks.getTasks)
router.post('/', autorezation, requestTasks.addTask)
router.post('/', autorezation)
router.get('/', autorezation)
module.exports = router