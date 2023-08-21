const jwt = require("express-jwt");

let secret = process.env.JWT_TOKEN;

const authorize = jwt({
    secret: secret,
    userProperty: "payload",
    algorithms: ['HS256']
});


const apiGuard = (req, res, next) => {
    if (!req.get('host').includes("localhost")) {
        res.json({ error: "Can't Create Fake Users in production mode." })
    } else {
        next();
    }
}

module.exports = {
    authorize,
    apiGuard
}