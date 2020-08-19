const express = require('express');
const router = express.Router();
const middleware = require('./middleware/middleware');

const userCtrl = require('../controllers/users');

router.post("/register",userCtrl.registerUser);

router.post("/login",userCtrl.loginUser);

router.get('/generate-feed',middleware.authorize,userCtrl.generateFeed);

router.get('/get-search-results',middleware.authorize,userCtrl.getSearchResults);
router.post(
    '/make-friend-request/:from/:to',middleware.authorize,userCtrl.makeFriendRequest);
router.get('/get-friend-requests',middleware.authorize,userCtrl.getFriendRequest);

router.get('/get-user-data/:userid',middleware.authorize,userCtrl.getUserData);

router.post('/resolve-friend-request/:from/:to',userCtrl.resolveFriendRequest);

router.delete('/all',userCtrl.deleteAllUsers);

module.exports = router;
