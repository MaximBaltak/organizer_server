const Router=require('express')
const {body} = require("express-validator");
const requestProfile=require('./../requests/requestProfile')
const authorization=require('./../middlewares/middlewareAutorezation')
const router=new Router()
router.get('/',authorization,requestProfile.getUser)
router.put('/password',
    body('password', 'пароль не должен быть меньше 4 символов').isLength({min: 4}),
    authorization,
    requestProfile.updatePassword
)
router.put('/login',
    body('username', 'логин не должен быть пустым').notEmpty(),
    authorization,
    requestProfile.updateLogin
    )
router.delete('/',authorization,requestProfile.deleteUser)
module.exports=router