const express = require('express');
const router = express.Router();
const middleware = require('./middleware/middleware');

const userCtrl = require('../controllers/users');

router.post("/register",userCtrl.registerUser);

router.post("/login",userCtrl.loginUser);

router.get('/generate-feed',middleware.authorize,userCtrl.generateFeed);

module.exports = router;
