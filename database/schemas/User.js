const {Schema, model} = require('mongoose')
const User = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        unique: true,
        required: true,
    },
    created:{
        type:Date,
        required:true
    }
})
module.exports = model('User', User)