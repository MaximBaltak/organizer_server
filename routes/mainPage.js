const requestAuth = require('./../requests/RequestAuth')
const Router = require('express')
const {body} = require("express-validator");
const router = new Router()
router.post('/registration',
    body('username', 'логин не должен быть пустым и должен иметь латинские символы').notEmpty()
        .custom(value=>/[0a-z9]+/g.test(value)),
    body('password', 'пароль не должен быть меньше 8 символов и должны быть латинские символы и цифры').isLength({min: 8})
        .custom(value=>/[0a-z9]+/g.test(value)),
    body('password', 'пароль должен содержать один из этих знаков: + @ &')
        .custom(value=>/[+@&]/g.test(value)),
    requestAuth.signUp
)
router.post('/login',
    body('username', 'логин не должен быть пустым и должен иметь латинские символы').notEmpty()
        .custom(value=>/[0a-z9]+/g.test(value)),
    body('password', 'пароль не должен быть меньше 8 символов и должны быть латинские символы и цифры').isLength({min: 8})
        .custom(value=>/[0a-z9]+/g.test(value)),
    body('password', 'пароль должен содержать один из этих знаков: + @ &')
        .custom(value=>/[+@&]/g.test(value)),
    requestAuth.signIn
)
router.post('/restoration',requestAuth.restoration)
router.get('/reset/:token',requestAuth.reset)
router.put('/reset/login',
    body('username', 'логин не должен быть пустым и должен иметь латинские символы').notEmpty()
        .custom(value=>/[0a-z9]+/g.test(value)),
    requestAuth.newLogin)
router.put('/reset/password',
    body('password', 'пароль не должен быть меньше 8 символов и должны быть латинские символы и цифры').isLength({min: 8})
        .custom(value=>/[0a-z9]+/g.test(value)),
    body('password', 'пароль должен содержать один из этих знаков: + @ &')
        .custom(value=>/[+@&]/g.test(value)),
    requestAuth.newPassword)
module.exports = router