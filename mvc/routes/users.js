const express = require('express');
const router = express.Router();

const middleware = require("../routes/middleware/middleware");
const userCtrl = require("../controllers/users");

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

router.delete("/all",userCtrl.deleteAllUsers);
router.get("/all",userCtrl.getAllUsers);

module.exports = router;