const jwt = require('express-jwt');

const authorize = jwt({
    secret:process.env.JWT_TOKEN,
    userProperty:'payload',
    algorithms: ['HS256'] 
});

module.exports = {
    authorize
}
