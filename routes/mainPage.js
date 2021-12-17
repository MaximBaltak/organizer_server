const requestAuth = require('./../requests/RequestAuth')
const Router = require('express')
const {body} = require("express-validator");
const router = new Router()

router.post('/registration',
    body('username', 'логин не должен быть пустым').notEmpty(),
    body('password', 'пароль не должен быть меньше 4 символов').isLength({min: 4}),
    requestAuth.signUp
)
router.post('/login',
    body('username', 'логин не должен быть пустым').notEmpty(),
    body('password', 'пароль не должен быть меньше 4 символов').isLength({min: 4}),
    requestAuth.signIn
)
module.exports = router