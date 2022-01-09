const nodemailer = require('nodemailer')
const User = require('./../database/schemas/User')
const Task = require('./../database/schemas/Task')
const Goal = require('./../database/schemas/Goal')
const transport = nodemailer.createTransport({
    host: process.env.HOST_SMTP,
    port: process.env.PORT_SMTP,
    secure: process.env.SECURE_SMTP,
    auth: {
        user: process.env.LOGIN_SMTP,
        pass: process.env.PASSWORD_SMTP
    }
})
const link = process.env.LINK_APP
const timer = (task) => {
    if (task.day === null) {
        return null
    }
    let date1 = new Date(task.dateStart).getTime()
    let date2 = new Date(task.dateEnd).getTime()
    let t = date2 - date1
    let day = Math.floor(t / (1000 * 60 * 60 * 24))
    if (day >= 2) {
        return null
    } else {
        return day
    }

}
const send = async (massages) => {

    for (let [key, value] of massages) {
        let title = 'Требуют внимание'
        let countGoals = 0
        let countTasks = 0
        let goalsOverdue = 0
        let tasksOverdue = 0
        let goalsNotOverdue = 0
        let tasksNotOverdue = 0
        if (value?.tasks?.length > 0) {
            title += value?.tasks?.length === 1 ? ` ${value.tasks.length} задача,` : value.tasks.length > 1 && value.tasks.length < 5 ? ` ${value.tasks.length} задачи,` : ` ${value.tasks.length} задач,`
            countTasks = value.tasks.length
            value.tasks.forEach(task => {
                if (task.day < 0) {
                    tasksOverdue++
                } else {
                    tasksNotOverdue++
                }
            })
        }
        if (value?.goals?.length > 0) {
            title += value?.goals?.length === 1 ? ` ${value.goals.length} цель,` : value.goals.length > 1 && value.goals.length < 5 ? ` ${value.goals.length} цели,` : ` ${value.goals.length} целей,`
            countGoals = value.goals.length
            value.goals.forEach(goal => {
                if (goal.day < 0) {
                    goalsOverdue++
                } else {
                    goalsNotOverdue++
                }
            })
        }
        let textTask = ''
        let textGoals = ''
        if (countTasks) {
            textTask = `<p>У вас просрочено: ${tasksOverdue} задач, истекает время у ${tasksNotOverdue} задач</p>`
        }
        if (countGoals) {
            textGoals = `<p>У вас просрочено: ${goalsOverdue} целей, истекает время у ${goalsNotOverdue} целей</p>`
        }

        await transport.sendMail({
            from: 'maksim.baltak1998@mail.ru',
            to: key,
            subject: title,
            html: `${textTask} ${textGoals} <a href=${link}>Перейти на сайт</a>`
        })
    }
}
const sending = async () => {
    console.log('start sending...')
    let messages = new Map()
    try {
        const tasks = await Task.find()
        const goals = await Goal.find()
        for (let task of tasks) {
            const day = timer(task)
            if (day === null) {
                continue
            }
            const user = await User.findOne({_id: task.userId})
            if (!user?.confirmEmail || !user) {
                continue
            }
            if (messages.size === 0) {
                messages.set(user.email, {tasks: [{day}]})
            } else {
                messages.forEach((value, key) => {
                    if (key === user.email) {
                        if (value.tasks) {
                            value.tasks.push({day})
                        } else {
                            value.tasks = [{day}]
                        }
                    } else {
                        messages.set(user.email, {...value, tasks: [{day}]})
                    }
                })
            }

        }
        for (let goal of goals) {
            const day = timer(goal)
            if (day === null) {
                continue
            }
            const user = await User.findOne({_id: goal.userId})
            if (!user?.confirmEmail || !user) {
                continue
            }
            if (messages.size === 0) {
                messages.set(user.email, {goals: [{day}]})
            } else {
                messages.forEach((value, key) => {
                    if (key === user.email) {
                        if (value?.goals) {
                            value.goals.push({day})
                        } else {
                            value.goals = [{day}]
                        }
                    } else {
                        messages.set(user.email, {...value, goals: [{day}]})
                    }
                })
            }
        }
        await send(messages)
        console.log('end')
    } catch (e) {
        console.log(e)
    }
}
module.exports = sending
