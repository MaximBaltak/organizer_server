const jwt = require("jsonwebtoken");
module.exports= (login, password, secretKey) => {
    const payload = {
        login,
        password
    }
    return jwt.sign(payload, secretKey)
}