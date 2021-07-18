const express = require('express');
const router = express.Router();

const middleware = require("../routes/middleware/middleware");

const userCtrl = require("../controllers/users");
const fakeCtrl = require("../controllers/fakeUsers");

router.post("/register",userCtrl.registerUser) ;
router.post("/login",userCtrl.loginUser);

router.get("/get-user-data/:userid",middleware.authorize,userCtrl.getUserData);

router.get("/generate-feed",middleware.authorize,userCtrl.generateFeed);

router.post("/create-post",middleware.authorize,userCtrl.createPost);
router.post("/like-unlike/:ownerID/:postID",middleware.authorize,userCtrl.likeUnlike);
router.post("/post-comment/:ownerID/:postID",middleware.authorize,userCtrl.postComment);

router.get("/search-results",middleware.authorize,userCtrl.getSearchResult);

router.post("/send-friend-request/:from/:to",middleware.authorize,userCtrl.sendFriendRequest);
router.get("/get-friend-requests",middleware.authorize,userCtrl.getFriendsRequests);
router.post("/resolve-friend-request/:from/:to",middleware.authorize,userCtrl.resolveFriendRequest);

router.post("/send-message/:to",middleware.authorize,userCtrl.sendMessage);
router.post("/reset-message-notifications",middleware.authorize,userCtrl.resetMessageNotifications);
router.post("/reset-alert-notifications",middleware.authorize,userCtrl.resetAlertNotifications);
router.post("/delete-messages/:id",middleware.authorize,userCtrl.deleteMessage);

router.post("/bestie-enemy-toggle/:id",middleware.authorize,userCtrl.bestieEnemyToggle);

router.post("/create-fake-users",middleware.apiGuard,fakeCtrl.createFakeUsers);

router.delete("/all",middleware.apiGuard,userCtrl.deleteAllUsers);
router.get("/all",middleware.apiGuard,userCtrl.getAllUsers);

module.exports = router;