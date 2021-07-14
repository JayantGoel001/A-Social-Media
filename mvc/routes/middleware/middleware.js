const jwt = require("express-jwt");

let secret = process.env.JWT_TOKEN;
if ( process.env.NODE_ENV === "PRODUCTION" ){
    secret = process.env.JWT_TOKEN;
}

const authorize = jwt({
    secret : secret,
    userProperty : "payload",
    algorithms: ['HS256']
});

module.exports = {
    authorize
}