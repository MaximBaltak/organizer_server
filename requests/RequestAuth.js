const User = require('./../database/schemas/User')
const {validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const generateToken=require('./../middlewares/generateToken')
require('dotenv').config()

class RequestAuth {
    async signUp(req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({message: 'Не валидные данные', errors:errors.errors})
        } else {
            const {username, password} = req.body
            let filterUsername = username.trim()
            let filterPassword = password.trim()
            const hashPassword = bcrypt.hashSync(filterPassword, 4)
            const user = await User.findOne({username: filterUsername})
            if (user) {
                return res.status(400).json({message: 'Такой пользователь уже существует'})
            } else {
                try {
                    const user = await new User({
                        username: filterUsername,
                        password: hashPassword,
                        created: new Date().getTime()
                    })
                    await user.save()
                    const data = await User.find().sort({$natural: -1}).limit(1)
                    const token = generateToken(filterUsername, filterPassword, process.env.SECRET_KEY)
                    return res.status(200).json({
                        message: 'authorization is successful',
                        token,
                        id: data[0]._id
                    })
                } catch (e) {
                    res.status(500).json({message: 'Ошибка сервера'})
                }
            }
        }
    }

    async signIn(req, res) {
        const errors = validationResult(req)
        console.log(req.body.username)
        if (!errors.isEmpty()) {
            res.status(400).json({message: 'Данные не валидные', errors:errors.errors})
        } else {
            const {username, password} = req.body
            let filterUsername = username.trim()
            let filterPassword = password.trim()
            try {
                const users = await User.find()
                let findUser
                Array.from(users).forEach(user => {
                    if (filterUsername === user.username) {
                        if (bcrypt.compareSync(filterPassword, user.password)) {
                            findUser = user
                        }
                    }
                })
                if (findUser) {
                    const token = generateToken(filterUsername, filterPassword, process.env.SECRET_KEY)
                    return res.status(200).json({
                        message: 'authorization is successful',
                        token,
                        id: findUser._id
                    })
                } else {
                    return res.status(400).json({message: 'Такого пользователя не существует'})
                }
            } catch (e) {
                res.status(500).json({message: 'Ошибка сервера'})
            }
        }
    }
}

module.exports = new RequestAuth()