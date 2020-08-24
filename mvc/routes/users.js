const express = require('express');
const router = express.Router();
const middleware = require('./middleware/middleware');

const userCtrl = require('../controllers/users');
const fakeUserCtrl = require('../controllers/fake-users');

router.post("/register",userCtrl.registerUser);
router.post("/login",userCtrl.loginUser);


router.get('/generate-feed',middleware.authorize,userCtrl.generateFeed);
router.get('/get-user-data/:userid',middleware.authorize,userCtrl.getUserData);
router.get('/get-search-results',middleware.authorize,
            userCtrl.getSearchResults);


router.get('/get-friend-requests',middleware.authorize,
            userCtrl.getFriendRequest);
router.post('/make-friend-request/:from/:to',middleware.authorize,
            userCtrl.makeFriendRequest);
router.post('/resolve-friend-request/:from/:to',middleware.authorize,
            userCtrl.resolveFriendRequest);


router.post('/create-post',middleware.authorize,userCtrl.createPost);
router.post('/like-Unlike/:ownerid/:postid',middleware.authorize,
            userCtrl.likeUnlike);
router.post('/post-comment/:ownerid/:postid',middleware.authorize,
            userCtrl.postCommentOnPost);


router.post('/send-message/:to',middleware.authorize,userCtrl.sendMessage);
router.post('/reset-message-notifications',middleware.authorize,
            userCtrl.resetMessageNotification);
router.post('/delete-message/:messageid',middleware.authorize,
            userCtrl.deleteMessage);

router.post('/bestie-enemy-toggle/:userid',middleware.authorize,
            userCtrl.bestieEnemyToggle);

router.delete('/all',userCtrl.deleteAllUsers);
router.get('/all',userCtrl.getAllUsers);

router.post("/create-fake-users",fakeUserCtrl.createFakeUsers);


module.exports = router;
