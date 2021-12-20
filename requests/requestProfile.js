const User = require('./../database/schemas/User')
const Goal = require('./../database/schemas/Goal')
const Task = require('./../database/schemas/Task')
const bcrypt = require('bcrypt')
const generateToken = require('./../middlewares/generateToken')
const checkUser = require("./../middlewares/checkUser");
const {validationResult} = require("express-validator");

class RequestProfile {
    async getUser(req, res) {
        try {
            const status = await checkUser(req.user)
            switch (status) {
                case 403:
                    return res.status(status).json({message: 'the user is not logged in'})
                case 500:
                    return res.status(status).json({message: 'error of server'})
                default:
                    break
            }

            const user = await User.findOne({username: req.user.username})
            if (user) {
                console.log(83)
                return res.status(200).json({
                    username: req.user.username,
                    password: req.user.password
                })
            }

        } catch (e) {
            return res.status(500).json({message: 'error of server'})
        }
    }

    async updateLogin(req, res) {
        try {
            const status = await checkUser(req.user)
            switch (status) {
                case 403:
                    return res.status(status).json({message: 'the user is not logged in'})
                case 500:
                    return res.status(status).json({message: 'error of server'})
                default:
                    break
            }
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'data is not valid', errors: errors.errors})
            }
            const filterLogin = req.body.username.trim()
            await User.updateOne({username: req.user.username}, {$set: {username: filterLogin}})
            const user = await User.findOne({username: filterLogin})
            const token = generateToken(filterLogin, req.user.password, process.env.SECRET_KEY)
            return res.status(200).json({
                message: 'updated login',
                newToken: token,
                id: user._id
            })

        } catch (e) {
            return res.status(status).json({message: 'error of server'})
        }
    }

    async updatePassword(req, res) {
        try {
            const status = await checkUser(req.user)
            switch (status) {
                case 403:
                    return res.status(status).json({message: 'the user is not logged in'})
                case 500:
                    return res.status(status).json({message: 'error of server'})
                default:
                    break
            }
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'data is not valid', errors: errors.errors})
            }
            const filterPassword = req.body.password.trim()
            const hashPassword = bcrypt.hashSync(filterPassword, 4)
            await User.updateOne({username: req.user.username}, {$set: {password: hashPassword}})
            const user = await User.findOne({username: req.user.username, password: hashPassword})
            const token = generateToken(user.username, filterPassword, process.env.SECRET_KEY)
            return res.status(200).json({
                message: 'updated password',
                newToken: token,
                id: user._id
            })

        } catch (e) {
            return res.status(status).json({message: 'error of server'})
        }
    }

    async deleteUser(req, res) {
        try {
            const status = await checkUser(req.user)
            switch (status) {
                case 403:
                    return res.status(status).json({message: 'the user is not logged in'})
                case 500:
                    return res.status(status).json({message: 'error of server'})
                default:
                    break
            }
            const userId = req.query?.userId
            if (!userId) {
                return res.status(400).json({message: 'no user id'})
            }
            await Goal.deleteMany({userId})
            await Task.deleteMany({userId})
            await User.deleteOne({username: req.user.username})
            return res.status(200).json({message: 'deleted profile'})
        } catch (e) {
            return res.status(status).json({message: 'error of server'})
        }
    }
}

module.exports = new RequestProfile()

