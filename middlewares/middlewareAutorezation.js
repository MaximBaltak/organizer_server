const jwt = require('jsonwebtoken')
const config = require('./../config.json')
module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next()
    }
    try {
        const token = req.headers?.authorization?.split(' ')[1]
        if (!token) {
            return res.status(403).json({message: 'the user is not logged in'})
        }
            jwt.verify(token, config.secretKey,(err,decode)=>{
                if(err){
                    return res.status(402).json({message: 'invalid token'})
                }
                req.user=decode
                next()
            })
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: 'error in server'})
    }
}