const Goal = require('./../database/schemas/Goal')
const checkUser = require('./../middlewares/checkUser')

class RequestGoals {
    async getGoal(req, res) {
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
            const goals = await Goal.find({userId})
            if (goals.length > 0) {
                Array.from(goals).forEach(goal => {
                    goal._id.toString()
                })
            }
            return res.status(200).json({goals})
        } catch (e) {
            res.status(500).json({message: 'error of server'})
        }
    }

    async addGoal(req, res) {
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
            const goal = await new Goal({
                userId: req.body.userId,
                title: req.body.title,
                dateStart: req.body.dateStart,
                dateEnd: req.body.dateEnd,
                day: req.body.day,
                state: req.body.state,
                tasks: req.body.tasks,
                percent: req.body.percent,
                colorPercent: req.body.colorPercent,
                borderColor: req.body.borderColor,
            })
            await goal.save()
            return res.status(200).json({message: 'added goal'})
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: 'error of server'})
        }
    }

    async changedGoal(req, res) {
        const status = await checkUser(req.user)
        switch (status) {
            case 403:
                return res.status(status).json({message: 'the user is not logged in'})
            default:
                break
        }
        const goalId = req.query?.goalId
        const taskId = req.query?.taskId
        if (!goalId) {
            return res.status(400).json({message: 'no goal or goal id'})
        }
        if (!taskId) {
            return res.status(400).json({message: 'no goal or task id'})
        }
        if (!req.body) {
            return res.status(400).json({message: 'no data available'})
        }
        try {
            await Goal.updateOne({_id: goalId, tasks: {$elemMatch: {_id: taskId}}}, {
                $set: {
                    percent: req.body.percent,
                    colorPercent: req.body.colorPercent,
                    "state.color": req.body.state.color,
                    "state.text": req.body.state.text,
                    "tasks.$.check": req.body.task.check,
                    "tasks.$.showButton": req.body.task.showButton,
                    "tasks.$.borderColor": req.body.task.borderColor,
                }
            })
            return res.status(200).json({message: 'updated goal'})
        } catch (e) {
            return res.status(400).json({message: 'there is no goal with such id'})
        }
    }

    async deleteGoal(req, res) {
        const status = await checkUser(req.user)
        switch (status) {
            case 403:
                return res.status(status).json({message: 'the user is not logged in'})
            default:
                break
        }
        const {userId, goalId} = req.query
        if (!userId) {
            return res.status(400).json({message: 'no user id'})
        }
        if (!goalId) {
            try {
                await Goal.deleteMany({userId})
                return res.status(200).json({message: 'deleted all goals'})
            } catch (e) {
                console.log(e)
                return res.status(401).json({message: 'there is no goal with such userId'})
            }
        } else {
            try {
                await Goal.deleteOne({_id: goalId, userId})
                return res.status(200).json({message: 'deleted goal'})
            } catch (e) {
                console.log(e)
                return res.status(401).json({message: 'there is no task with such userId or goalId'})
            }
        }

    }
}

module.exports = new RequestGoals()