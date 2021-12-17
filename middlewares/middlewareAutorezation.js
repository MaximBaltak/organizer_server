const jwt = require('jsonwebtoken')
const config = require('./../config.json')
module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next()
    }
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(403).json({message: 'the user is not logged in'})
        }
        req.user = jwt.verify(token, config.secretKey)
        next()
    } catch (e) {
        console.log(e)
        return res.status(403).json({message: 'the user is not logged in'})
    }
}