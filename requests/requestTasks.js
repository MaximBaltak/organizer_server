const Task = require('./../database/schemas/Task')
const checkUser = require('./../middlewares/checkUser')

class RequestTasks {
    async getTasks(req, res) {
        try {
            const status = await checkUser(req.user)
            switch (status) {
                case 403:
                    return res.status(status).json({message: 'the user is not logged in'})
                default:
                    break
            }
            const userId = req.query?.userId
            if (!userId) {
                return res.status(400).json({message: 'no user id'})
            }
            const tasks = await Task.find({userId})
            if (tasks.length > 0) {
                Array.from(tasks).forEach(task => {
                    task._id.toString()
                })
            }
            return res.status(200).json({tasks: tasks})
        } catch (e) {
            res.status(500).json({message: 'error of server'})
        }
    }

    async addTask(req, res) {
        const status = await checkUser(req.user)
        switch (status) {
            case 403:
                return res.status(status).json({message: 'the user is not logged in'})
            default:
                break
        }
        if (!req.body) {
            return res.status(400).json({message: 'no data available'})
        }

        try {
            const task = await new Task({
                userId: req.body.userId,
                title: req.body.title,
                dateStart: req.body.dateStart,
                dateEnd: req.body.dateEnd,
                day: req.body.day,
                state: req.body.state,
                border: req.body.border,
                check: req.body.check,
            })
            await task.save()
            return res.status(200).json({message: 'added task'})
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: 'error of server'})
        }
    }

    async changedTask(req, res) {
        const status = await checkUser(req.user)
        switch (status) {
            case 403:
                return res.status(status).json({message: 'the user is not logged in'})
            default:
                break
        }
        const taskId = req.query?.taskId
        if (!taskId) {
            return res.status(400).json({message: 'no task id'})
        }
        if (!req.body) {
            return res.status(400).json({message: 'no data available'})
        }
        try {
            await Task.updateOne({_id: taskId}, {
                $set: {
                    check: req.body.check,
                    "state.color": req.body.color,
                    "state.text": req.body.text
                }
            })
            return res.status(200).json({message: 'updated task'})
        } catch (e) {
            return res.status(400).json({message: 'there is no task with such id'})
        }
    }

    async deleteTask(req, res) {
        const status = await checkUser(req.user)
        switch (status) {
            case 403:
                return res.status(status).json({message: 'the user is not logged in'})
            default:
                break
        }
        const {userId, taskId} = req.query
        if (!userId) {
            return res.status(400).json({message: 'no user id'})
        }
        if (!taskId) {
            try {
                await Task.deleteMany({userId})
                return res.status(200).json({message: 'deleted all tasks'})
            } catch (e) {
                console.log(e)
                return res.status(4000).json({message: 'there is no task with such userId',userId:req.query})
            }
        } else {
            try {
                await Task.deleteOne({_id: taskId, userId})
                return res.status(200).json({message: 'deleted task'})
            } catch (e) {
                console.log(e)
                return res.status(400).json({message: 'there is no task with such userId or taskId'})
            }
        }

    }
}

module.exports = new RequestTasks()