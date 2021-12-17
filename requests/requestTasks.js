const Task = require('./../database/schemas/Task')
class RequestTasks {
    async getTasks(req, res) {
        try {
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
            res.status(500).json({message: 'error in server'})
        }
    }

    async addTask(req, res) {
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
            return res.status(500).json({message: 'error in server'})
        }
    }
}

module.exports = new RequestTasks()