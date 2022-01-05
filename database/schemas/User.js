const {Schema, model} = require('mongoose')
const User = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    confirmEmail:{
        type:Boolean,
        required:true
    },
    created:{
        type:Date,
        required:true
    }
})
module.exports = model('User', User)