const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');
const timeAgo = require('time-ago');

const addCommentDetails = function(posts) {
    return new Promise(function(resolve,reject){
        let promises = [];
        for(let post of posts){
            for(let comment of post.comments){
                let promise = new Promise(function(resolve,reject) {
                    User.findById(comment.commenter_id,"name profile_image",(err,user)=>{
                        comment.commenter_name = user.name;
                        comment.commenter_profile_image = user.profile_image;
                        resolve(comment);
                    });
                });
                promises.push(promise);
            }
        }
        Promise.all(promises).then((val)=>{
            resolve(posts);
        });
    });
}

const getRandom = function(min,max){
    return Math.floor(Math.random()*(max - min)) + min;
}

const containsDuplicate = function(array) {
    array.sort();
    for (var i = 0; i < array.length; i++) {
        if (array[i] == array[i+1]) {
            return true;
        }
    }
    return false;
}

const registerUser = function({body},res) {
    if (
        !body.first_name||
        !body.last_name||
        !body.email||
        !body.password||
        !body.password_confirm
    ) {
        return res.send({message:"All Fields Are Required"});
    }
    if (body.password!==body.password_confirm) {
        return res.send({message:"Password Doesnot match"});
    }

    const user = new User();

    user.name = body.first_name.trim() + " " + body.last_name.trim()
    user.email = body.email;
    user.setPassword(body.password);

    user.save((err,newUser)=>{
        if (err) {
            if (err.errmsg && err.errmsg.includes('duplicate key error') && err.errmsg.includes("email")) {
                return res.json({message:"The Provided email is already registered"});
            }
            console.log("==========");
            console.log(err);
            console.log("==========");
            return res.json({message:"Something went Wrong."});
        }
        else {
            const token = user.getJwt();
            res.status(201).json({token});
        }
    });
}

const loginUser = function(req,res) {
    var body = req.body;
    if (!body.email || !body.password) {
        return res.status(400).json({message:"All Fields are Required."});
    }
    passport.authenticate("local",(err,user,info)=>{
        if (err) {
            return res.status(404).json(err);
        }
        if (user) {
            const token = user.getJwt();
            res.status(201).json({token});
        }
        else {
            res.json(info);
        }
    })(req,res);
}

const addNameAndAgoToPost = function(array,user) {
    for(item of array){
        item.name = user.name;
        item.ago = timeAgo.ago(item.date);
        item.ownerProfileImage = user.profile_image;
        item.ownerid = user._id;
    }
}
const generateFeed = function({payload},res) {
    const posts = [];
    const maxAmountOfPosts = 48;

    let myPost = new Promise(function(resolve,reject) {
        User.findById(payload._id,"name posts profile_image friends",{lean:true},(err,user)=>{
            if(err){
                return res.json({error:err});
            }
            addNameAndAgoToPost(user.posts,user);
            posts.push(...user.posts);
            resolve(user.friends);
        });
    });

    let myFriendPost = myPost.then((friendArray)=>{
        return new Promise(function(resolve,reject) {
            User.find({'_id':{$in:friendArray}},
            "name posts profile_image",{lean:true},(err,users)=>{
                if(err){
                    return res.json({error:err});
                }
                for(user of users)
                {
                    addNameAndAgoToPost(user.posts,user);
                    posts.push(...user.posts);
                }
                resolve();
            });
        });
    });
    myFriendPost.then(()=>{
        posts.sort((a,b)=>(a.date>b.date)?-1:1);
        posts.slice(maxAmountOfPosts);

        addCommentDetails(posts).then((posts)=>{
            res.statusJson(200,{posts:posts.slice(0,maxAmountOfPosts)});
        });
    });
}

const getSearchResults = function({query,payload},res) {
    if (!query.query) {
        return res.json({err:"Missing A Query."});
    }
    User.find({ name: { $regex : query.query, $options: "i" }},"name profile_image friends friend_requests",(err,results)=>{
        if(err){ return res.json({err:err}); }

        results = results.slice(0,20);

        for (var i = 0; i < results.length; i++) {
            if (results[i]._id == payload._id) {
                results.splice(i,1);
                break;
            }
        }
        return res.status(200).json({message:"Getting Search Results",results:results});
    });
}

const makeFriendRequest = function({params},res) {
    User.findById(params.to,(err,user)=>{
        if (err) {
            return res.json({err:err});
        }
        if (containsDuplicate([params.from,...user.friend_requests])) {
            return res.json({message:"Friend Request is already sent."});
        }

        user.friend_requests.push(params.from);
        user.save((err,user)=>{
            if(err){
                return res.json({error:err});
            }
            return res.statusJson(201,{message:"Succesfully sent a Friend Request"});
        });
    });
}

const getUserData = function({params},res) {
    User.findById(params.userid,"-salt -password",{lean:true},(err,user)=>{
        if(err){
            return res.json({error:err});
        }

        function getRandomFriends(friendsList) {
            let copyOfFriendList = Array.from(friendsList);
            let randomIds = [];
            for(let i=0;i<6;i++){
                if (friendsList<=6) {
                    randomId = copyOfFriendList;
                    break;
                }
                else{
                    let randomIdIndex = getRandom(0,copyOfFriendList.length-1);
                    randomIds.push(copyOfFriendList[randomIdIndex]);
                    copyOfFriendList.splice(randomIdIndex,1);
                }
            }
            return new Promise(function(resolve,reject) {
                User.find({'_id':{$in:randomIds}},"name profile_image",(err,friends)=>{
                    if(err){
                        return res.json({error:err});
                    }
                    resolve(friends);
                })
            });
        }

        user.posts.sort((a,b)=>(a.date>b.date)? -1 : 1 );
        addNameAndAgoToPost(user.posts,user);

        let randomFriend = getRandomFriends(user.friends);
        let commentDetails = addCommentDetails(user.posts);

        Promise.all([randomFriend,commentDetails]).then((val)=>{
            user.random_friend = val[0];
            res.statusJson(200,{user:user});
        })
    });
}

const getFriendRequest = function({query},res) {
    let friendRequests = JSON.parse(query.friend_requests);

    User.find({ '_id': { $in:friendRequests } },'name profile_image',(err,users)=>{
        if(err){
            return res.json({error:err});
        }
        return res.statusJson(200,{message:"Getting Friend Request.",users:users});
    });
}

const resolveFriendRequest = function({query,params},res) {
    User.findById(params.to,(err,user)=>{
        if(err){
            return res.json({error:err});
        }

        for (var i = 0; i < user.friend_requests.length; i++) {
            if (user.friend_requests[i] == params.from) {
                user.friend_requests.splice(i,1);
                break;
            }
        }
        let promise = new Promise(function(resolve,reject) {
            if (query.resolution == "accept") {
                if (containsDuplicate([params.from,...user.friends])) {
                    return res.json({message:"Duplicate Error."});
                }
                user.friends.push(params.from);

                User.findById(params.from,(err,user)=>{
                    if(err){
                        return res.json({error:err});
                    }
                    if (containsDuplicate([params.to,...user.friends])) {
                        return res.json({message:"Duplicate Error."});
                    }
                    user.friends.push(params.to);
                    user.save((err,user)=>{
                        if(err){
                            return res.json({error:err});
                        }
                        resolve();
                    });
                });
            }else {
                resolve();
            }
        });

        promise.then(()=>{
            user.save((err,user)=>{
                if(err){
                    return res.json({error:err});
                }
                res.statusJson(201,{message:"Resolved Friend Request."});
            })
        })
    });
}

const createPost = function({body,payload},res) {

    if (!body.content || !body.theme) {
        return res.statusJson(400,{message:"Insufficient data sent with the request."});
    }

    let userId = payload._id;
    const post = new Post();

    post.theme = body.theme;
    post.content = body.content;

    User.findById(userId,(err,user)=>{
        if(err){
            return res.json({error:err});
        }
        let newPosts = post.toObject();
        newPosts.name = payload.name;
        newPosts.ownerid = payload._id;
        newPosts.ownerProfileImage = user.profile_image;
        user.posts.push(post);
        user.save((err)=>{
            if(err){
                return res.json({error:err});
            }
            return res.statusJson(201,{message:"Create Post",post:newPosts});
        });
    });

}

const likeUnlike = function({payload,params},res) {
    User.findById(params.ownerid,(err,user)=>{
        if(err){
            return res.json({error:err});
        }
        const posts = user.posts.id(params.postid);
        if (posts.likes.includes(payload._id)) {
            posts.likes.splice(posts.likes.indexOf(payload._id),1);
        }
        else {
            posts.likes.push(payload._id);
        }
        user.save((err,user)=>{
            if(err){
                return res.json({error:err});
            }
            res.statusJson(201,{message:"Like Or Unlike a post..."});
        })
    })
}

const postCommentOnPost = function({body,payload,params},res) {
    User.findById(params.ownerid,(err,user)=>{
        if(err){
            return res.json({error:err});
        }
        const post = user.posts.id(params.postid);
        let comment = new Comment();
        comment.commenter_id = payload._id;
        comment.commenter_content = body.content;

        post.comments.push(comment);

        user.save((err,user)=>{
            if(err){
                return res.json({error:err});
            }
            User.findById(payload._id,"name profile_image",(err,user)=>{
                if(err){
                    return res.json({error:err});
                }
                res.statusJson(201,{
                    message:"POST comment",
                    comment:comment,
                    commenter:user});
            });
        });
    });
}

const deleteAllUsers = function(req,res) {
    User.deleteMany({},(err,info)=>{
        if(err){
            return res.send({error:err});
        }
        return res.json({message:"Deleted All Users",info:info});
    });
}

const getAllUsers = function(req,res) {
    User.find((err,users)=>{
        if(err){
            return res.send({error:err});
        }
        return res.json({users:users});
    });
}

module.exports = {
    deleteAllUsers,
    getAllUsers,
    registerUser,
    loginUser,
    generateFeed,
    getSearchResults,
    makeFriendRequest,
    getUserData,
    getFriendRequest,
    resolveFriendRequest,
    createPost,
    likeUnlike,
    postCommentOnPost
}
