const Router=require('express')
const {body} = require("express-validator");
const requestProfile=require('./../requests/requestProfile')
const authorization=require('./../middlewares/middlewareAutorezation')
const router=new Router()
router.get('/',authorization,requestProfile.getUser)
router.put('/password',
    body('password', 'пароль не должен быть меньше 8 символов и должны быть латинские символы и цифры').isLength({min: 8})
        .custom(value=>/[0a-z9]+/g.test(value)),
    body('password', 'пароль должен содержать один из этих знаков: + @ &')
        .custom(value=>!/[+@&]/g.test(value)),
    authorization,
    requestProfile.updatePassword
)
router.put('/login',
    body('username', 'логин не должен быть пустым и должен иметь латинские символы').notEmpty()
        .custom(value=>/[0a-z9]+/g.test(value)),
    authorization,
    requestProfile.updateLogin
    )
router.delete('/',authorization,requestProfile.deleteUser)
module.exports=router