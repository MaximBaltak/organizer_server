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
            res.status(400).json({message: 'password not valid', errors})
        } else {
            const {username, password} = req.body
            username.trim()
            const hashPassword = bcrypt.hashSync(password, 4)
            const users = await User.find({username, hashPassword})
            if (users.length > 0) {
                res.status(400).json({message: 'the user already exists'})
            } else {
                try {
                    const user = await new User({
                        username,
                        password: hashPassword
                    })
                    await user.save()
                    const data = await User.find().sort({$natural: -1}).limit(1)
                    const token = generateToken(username, password, secretKey)
                    res.status(200).json({message: 'authorization is successful', token, id: data[0]._id.toString()})
                } catch (e) {
                    res.status(500).json({message: 'Error of server'})
                }
            }
        }
    }

    async signIn(req, res) {

    }
}

module.exports = new RequestAuth()