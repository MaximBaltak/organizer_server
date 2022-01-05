const User = require('./../database/schemas/User')
const {validationResult} = require('express-validator')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const generateToken = require('./../middlewares/generateToken')
const checkUser = require("./../middlewares/checkUser");
let {userName} = require('./../dataUser')
const {json} = require("express");
require('dotenv').config()

class RequestAuth {

    async signUp(req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({message: 'Не валидные данные', errors: errors.errors})
        } else {
            const {username, password, email} = req.body
            let filterUsername = username.trim()
            let filterPassword = password.trim()
            let filterEmail = email.trim()
            const hashPassword = bcrypt.hashSync(filterPassword, 4)
            const user = await User.findOne({$or: [{username: filterUsername}, {email: filterEmail}]})
            if (user) {
                return res.status(400).json({message: 'Такой пользователь уже существует'})
            } else {
                try {
                    const user = await new User({
                        username: filterUsername,
                        password: hashPassword,
                        email: filterEmail,
                        confirmEmail: false,
                        created: new Date().getTime()
                    })
                    await user.save()
                    const data = await User.find().sort({$natural: -1}).limit(1)
                    const token = generateToken(filterUsername, filterPassword, process.env.SECRET_KEY)
                    return res.status(200).json({
                        message: 'authorization is successful',
                        token,
                        id: data[0]._id,
                        confirmEmail: data[0].confirmEmail
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
            res.status(400).json({message: 'Данные не валидные', errors: errors.errors})
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
                        id: findUser._id,
                        confirmEmail: findUser.confirmEmail
                    })
                } else {
                    return res.status(400).json({message: 'Такого пользователя не существует'})
                }
            } catch (e) {
                res.status(500).json({message: 'Ошибка сервера'})
            }
        }
    }

    async restoration(req, res) {
        if (!req.body?.email || !req.body?.type) {
            return res.status(400).json({message: 'Не валидные данные'})
        }
        let filterEmail = req.body.email.trim()
        try {
            const user = await User.findOne({email: filterEmail})
            if (!user) {
                return res.status(500).json({message: 'Пользователя с такой почтой не существует'})
            }
            const token = generateToken('hh', 123, process.env.SECRET_KEY)
            const transport = nodemailer.createTransport({
                host: 'smtp.mail.ru',
                port: 465,
                secure: true,
                auth: {
                    user: 'maksim.baltak1998@mail.ru',
                    pass: 'fxWVTdMTU5wG1qaVsuh8'
                }
            })
            try {
                const link = `https://jolly-bohr-e2b570.netlify.app/reset/${token}?type=${req.body.type}`
                const data = `<div>
                            <p style='color: black'>Для сброса пароля или логина перейдите по ссылке,<br>
                            письмо пришло вам по ошибке то ни чего не делайте</p>
                            <a style="color: brown" href=${link}>Перейдите для востановления ${req.type === 'login' ? 'пароля' : 'логина'}</a>
                            </div>`
                await transport.sendMail({
                    from: 'maksim.baltak1998@mail.ru',
                    to: filterEmail,
                    subject: req.type === 'login' ? 'Восстановление логина' : 'восстановление пароля ',
                    html: data
                })
                userName = filterEmail
                return res.status(200).json({message: 'Письмо отправлено'})
            } catch (e) {
                userName = null
                return res.status(500).json({message: 'Письмо не отправлено'})
            }
        } catch (e) {
            userName = null
            return res.status(500).json({message: 'error is server'})
        }

    }

    async reset(req, res) {
        if (!req.params.token || !req.query.type) {
            return res.status(400).json({message: 'Нет данных', confirm: false})
        }
        try {
            await jwt.verify(req.params.token, process.env.SECRET_KEY)
            userName = null
            return res.status(200).json({message: 'Пользователь подтверждён', confirm: true, type: req.query.type})
        } catch (e) {
            return res.status(403).json({message: 'токен не действителен', confirm: false})
        }

    }

    async newPassword(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'data is not valid', errors: errors.errors})
            }
            const filterPassword = req.body.password.trim()
            const hashPassword = bcrypt.hashSync(filterPassword, 4)
            const user = await User.findOne({email: userName})
            if (!user) {
                return res.status(400).json({message: 'Нет такого пользователя'})
            }
            console.log(userName)
            const userChek = await User.updateOne({email: userName}, {$set: {password: hashPassword}})
            if (userChek.modifiedCount > 0) {
                return res.status(200).json({
                    message: 'updated password',
                })
            }
            return res.status(500).json({
                message: 'Не удалось обновить пароль',
            })
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: 'error of server'})
        }
    }

    async newLogin(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'data is not valid', errors: errors.errors})
            }
            const filterLogin = req.body.username.trim()
            const chekUser = await User.findOne({username: filterLogin})
            if (chekUser) {
                return res.status(400).json({message: 'Пользователь с таким логином уже есть'})
            }
            console.log(userName)
            const user = await User.updateOne({email: userName}, {$set: {username: filterLogin}})
            if (user.modifiedCount > 0) {
                return res.status(200).json({
                    message: 'updated login',
                })
            }
            return res.status(500).json({
                message: 'Не удалось обновить логин',
            })
        } catch (e) {
            return res.status(500).json({message: 'error of server'})
        }
    }
}


module.exports = new RequestAuth()