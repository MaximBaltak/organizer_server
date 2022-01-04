const User = require('./../database/schemas/User')
const {validationResult} = require('express-validator')
const nodemailer=require('nodemailer')
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
    async restoration(req,res){
        if(!req.body?.email||!req.body?.type){
            return res.status(400).json({message:'Не валидные данные'})
        }
        try {
            // const user=await User.findOne({email:req.body.email})
            // if(!user){
            //     return res.status(500).json({message:'Пользователя с такой почтой не существует'})
            // }
            const token=generateToken('hh',123,process.env.SECRET_KEY)
            const transport=nodemailer.createTransport({
                host:'smtp.mail.ru',
                port:465,
                secure:true,
                auth:{
                    user:'maksim.baltak1998@mail.ru',
                    pass:'fxWVTdMTU5wG1qaVsuh8'
                }
            })
            try {
                const link=`https://jolly-bohr-e2b570.netlify.app/${token}?type=${req.body.type}`
               const data=`<div>
                            <p style='text-align: center;color: chocolate'>Для сброса пароля или логина перейдите по ссылке,<br>
                            письмо пришло вам по ошибке то ни чего не делайте</p>
                            <a style="color: brown" href=${link}>Перейдите для востановления пароля</a>
                            </div>`
                await transport.sendMail({
                    from:'maksim.baltak1998@mail.ru',
                    to:req.body.email,
                    subject: req.type==='login'?'Восстановление логина':'восстановление пароля ',
                    html:data
                })
                return res.status(200).json({message:'Письмо отправлено'})
            }catch (e){
                console.log(e)
                return res.status(500).json({message:'Письмо не отправлено'})
            }
        }catch (e){
            return res.status(500).json({message:'error is server'})
        }

    }
}

module.exports = new RequestAuth()