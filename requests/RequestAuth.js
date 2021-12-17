const User = require('./../database/schemas/User')
const {validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {secretKey} = require('./../config.json')

const generateToken = (login, password, secretKey) => {
    const payload = {
        login,
        password
    }
    return jwt.sign(payload, secretKey)
}

class RequestAuth {
    async signUp(req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({message: 'data is not valid', errors:errors.errors})
        } else {
            const {username, password} = req.body
            let filterUsername = username.trim()
            let filterPassword = password.trim()
            const hashPassword = bcrypt.hashSync(filterPassword, 4)
            const user = await User.findOne({username: filterUsername})
            if (user) {
                if (bcrypt.compareSync(filterPassword, user.password)) {
                    return res.status(400).json({message: 'the user already exists'})
                }
                return res.status(400).json({message: 'the user already exists'})
            } else {
                try {
                    const user = await new User({
                        username: filterUsername,
                        password: hashPassword
                    })
                    await user.save()
                    const data = await User.find().sort({$natural: -1}).limit(1)
                    const token = generateToken(filterUsername, filterPassword, secretKey)
                    return res.status(200).json({
                        message: 'authorization is successful',
                        token,
                        id: data[0]._id.toString()
                    })
                } catch (e) {
                    res.status(500).json({message: 'Error of server'})
                }
            }
        }
    }

    async signIn(req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({message: ' data is not valid ', errors:errors.errors})
        } else {
            const {username, password} = req.body
            let filterUsername = username.trim()
            let filterPassword = password.trim()
            try {
                const users = await User.find()
                let findUserID = ''
                Array.from(users).forEach(user => {
                    if (filterUsername === user.username) {
                        if (bcrypt.compareSync(filterPassword, user.password)) {
                            findUserID = user._id.toString()
                        }
                    }
                })
                if (findUserID) {
                    const token = generateToken(filterUsername, filterPassword, secretKey)
                    return res.status(200).json({
                        message: 'authorization is successful',
                        token,
                        id: findUserID
                    })
                } else {
                    return res.status(400).json({message: 'user not found'})
                }
            } catch (e) {
                res.status(500).json({message: 'error of server'})
            }
        }
    }
}

module.exports = new RequestAuth()