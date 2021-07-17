const passport = require('passport');
const mongoose = require('mongoose');
const timeAgo = require("time-ago");

const User = mongoose.model("User");
const Post = mongoose.model("Post");
const Comment = mongoose.model("Comment");

const getRandom = (min,max)=>{
    return Math.floor(Math.random() * (max - min)) + min;
}

const addNameAndDateToPosts = (ar,user)=>{
    for (let i = 0; i < ar.length; i++) {
        ar[i].name = user.name;
        ar[i].timeAgo = timeAgo.ago(ar[i].date);
        ar[i].ownerID = user._id;
        ar[i].profileImage = user.profileImage;
    }
}

const containsDuplicate = (arr)=>{
    arr.sort();
    for (let i = 1; i < arr.length; i++) {
        if (arr[i]===arr[i-1]){
            return true;
        }
    }
    return false;
}

const addCommentDetails = (posts)=>{
    return new Promise((resolve)=>{
        let promises = [];
        for (const post of posts) {
            for (const comment of post.comments) {
                let promise = new Promise((resolve, reject)=>{
                    User.findById(comment.id,"name profileImage",(err,user)=>{
                        if(err){
                            reject("Something Went Wrong!");
                            return res.json({ error : err });
                        }
                        comment.name = user.name;
                        comment.profileImage = user.profileImage;
                        resolve(comment);
                    });
                });
                promises.push(promise);
            }
        }
        Promise.all(promises).then(()=>{
            resolve(posts);
        });
    });
}

const registerUser = ({body},res) =>{
    if (
        !body.firstName ||
        !body.lastName ||
        !body.email ||
        !body.password ||
        !body.confirmPassword
    ) {
        return res.send({message : "All Fields Are Required"});
    }
    if (body.password !== body.confirmPassword) {
        return res.send({message : "Password Does not match"});
    }

    const user = new User();

    user.name = body.firstName.trim() + " " + body.lastName.trim();
    user.email = body.email.trim();
    user.setPassword(body.password);

    user.save().then(r =>{
        const token = r.getJWT();
        res.statusJson(201,{ token : token });
    }).catch((err)=>{
        err = err.toString();
        if (err && err.includes("duplicate key error") && err.includes("email")){
            return res.json({ message : "Provided Email is already registered." });
        }else {
            return res.json({message: "Something went wrong."});
        }
    });
}

const loginUser = (req,res) =>{
    let body = req.body;
    if (!body.email || !body.password) {
        return res.statusJson(400,{message:"All Fields are Required."});
    }
    passport.authenticate("local",(err,user,info)=>{
        if (err) {
            return res.statusJson(400,{ message : err });
        }

        if (user) {
            const token = user.getJWT();
            res.statusJson(201,{ token : token });
        }  else {
            res.json(info);
        }
    })(req,res);
}

const generateFeed = ({payload},res)=>{

    const maxAmountOfPosts = 48;
    let posts = [];
    let myPosts = new Promise((resolve, reject)=>{
        User.findById(payload._id,null,{ lean : true },(err,user)=>{
            if(err){
                reject("Something Went Wrong");
                return res.json({ error : err });
            }
            if (user) {
                addNameAndDateToPosts(user.posts, user);
                posts.push(...user.posts);
                resolve(user.friends);
            }
        });
    });
    let myFriendPosts = myPosts.then((friends)=>{
        return new Promise((resolve, reject)=>{
            User.find({'_id' : { $in : friends }},null,{lean : true},(err,users)=>{
                if(err){
                    reject("Something Went Wrong");
                    return res.json({ error : err });
                }
                for (const user of users) {
                    addNameAndDateToPosts(user.posts,user);
                    posts.push(...user.posts);
                }
                resolve();
            });
        });
    });
    myFriendPosts.then(()=> {
        posts = posts.sort((a,b)=> (a.date > b.date ? -1 : 1));
        posts = posts.slice(0,maxAmountOfPosts);

        addCommentDetails(posts).then((updatedPosts)=>{
            res.statusJson(200, { posts: updatedPosts });
        });
    });
}

const createPost = ({ body,payload },res)=>{
    if (!body.content || !body.theme){
        return res.statusJson(400,{ message : "Insufficient Data" });
    }
    let userID = payload._id;
    const post = new Post();
    post.theme = body.theme;
    post.content = body.content;

    User.findById(userID,null,{},(err,user)=>{
        if(err){
            return res.json({ error : err });
        }
        user.posts.push(post);

        let latestPost = post.toObject();
        latestPost.name = payload.name;
        latestPost.ownerID = payload._id;
        latestPost.profileImage = user.profileImage;

        user.save().then(()=>{
            return res.statusJson(201, {message : "Successfully created the post.", post : latestPost});
        }).catch((err)=>{
            return res.send({error : err});
        })
    })

}

const likeUnlike = ({ payload, params },res)=>{
    User.findById(params.ownerID,(err,user)=>{
        if(err){
            return res.json({ error : err });
        }
        const post = user.posts.id(params.postID);
        if (post.likes.includes(payload._id)){
            post.likes.splice(post.likes.indexOf(payload._id),1);
        }else {
            post.likes.push(payload._id);
        }

        user.save().then((updateUser)=>{
            res.statusJson(201,{ message : "Liked or Unliked a post." ,user : updateUser});
        }).catch((err)=>{
            return res.json({ error : err });
        })
    })
}

const postComment = ({body,params,payload},res)=>{
    User.findById(params.ownerID,(err,user)=>{
        if(err){
            return res.json({ error : err });
        }
        let post = user.posts.id(params.postID);

        let comment = new Comment();
        comment.id = payload._id;
        comment.content = body.content;

        post.comments.push(comment);

        user.save().then(()=>{
            User.findById(payload._id,"name profileImage",{},(err,commenter)=>{
                if(err){
                    return res.json({ error : err });
                }
                res.statusJson(201,{ message : "Posted Comment",comment : comment, commenterName : commenter.name, commenterImage : commenter.profileImage });
            });
        }).catch((err)=>{
            return res.json({ error : err });
        })

    })
}

const getSearchResult = (req,res)=>{
    let query = req.query;
    let payload = req.payload;
    if (!query.query){
        return res.json({ error : "Missing a query." });
    }
    User.find({ name : { $regex : query.query , $options : "i"} },null,{},(err,results)=>{
        if (err){
            return res.json({ error :err });
        }
        results = results.slice(0,20);
        for (let i = 0; i < results.length; i++) {
            if (results[i]._id.toString() === payload._id){
                results.splice(i,1);
                break;
            }
        }
        return res.statusJson(200,{ message : "Getting Search results", results : results });
    });
}

const deleteAllUsers = (req,res)=>{
    User.deleteMany({},(err,info)=>{
        if(err){
            return res.send({ error : err });
        }
        return res.json({ message : info });
    });
}

const getAllUsers = (req,res)=>{
    User.find({},(err,users)=>{
        if(err){
            return res.send({ error : err });
        }
        return res.json({ users : users });
    });
}

const sendFriendRequest = (req,res)=>{
    let params = req.params;
    User.findById(params.to,(err,user)=>{
        if(err){
            return res.json({ error : err });
        }
        if (containsDuplicate([params.from,...user.friendRequests])){
            return res.json({ message : "Friend Request is already sent." })
        }else {
            user.friendRequests.push(params.from);
            user.save().then(()=>{
                return res.statusJson(201,{ message : "Successfully sent a Friend request." });
            }).catch( err => {
                return res.json({ error:err });
            })
        }
    });
}

const getUserData = (req,res)=>{
    User.findById(req.params.userid, "-salt -password",{lean:true},(err,user)=>{
        if(err){
            return res.json({ error : err });
        }

        const getRandomFriends = (friendsList)=>{
            let friends = Array.from(friendsList);

            let randomID = [];
            if (friendsList.length<=6){
                randomID = friends;
            }else {
                for (let i = 0; i < 6; i++) {
                    let index = getRandom(0,friends.length-1);
                    randomID.push(friends[index]);
                    friends.splice(index,1);
                }
            }
            return new Promise((resolve, reject)=>{
                User.find({'_id' : { $in : randomID }},null,(err,friends)=>{
                    if(err){
                        reject(err);
                        return res.json({ error : err });
                    }
                    resolve(friends);
                });
            });
        }

        user.posts.sort((a,b)=> (a.date > b.date ? -1 : 1));
        addNameAndDateToPosts(user.posts,user);

        let randomFriends = getRandomFriends(user.friends);
        let commentDetails = addCommentDetails(user.posts);

        Promise.all([randomFriends,commentDetails]).then((val)=>{
            user.randomFriends = val[0];
            res.statusJson(200,{ user : user });
        });
    });
}

const getFriendsRequests = (req,res)=>{
    let friendRequests = JSON.parse(req.query.friend_requests);
    User.find({'_id' : { $in: friendRequests }},"name profileImage",(err,users)=>{
        if(err){
            return res.json({ error : err });
        }
        res.statusJson(200,{data : users});
    })
}

const resolveFriendRequest = ({query,params},res)=>{
    let from = params.from;
    let to = params.to;

    let resolution = query.resolution;

    User.findById(to,(err,user)=>{
        if(err){
            return res.json({ error : err });
        }
        for (let i = 0; i < user.friendRequests.length; i++) {
            if (user.friendRequests[i]===from){
                user.friendRequests.splice(i,1);
                break;
            }
        }
        let promise = new Promise((resolve, _)=>{
            if (resolution === "accept"){
                if (!containsDuplicate([from,...user.friendRequests])){
                    user.friends.push(from);

                    User.findById(from,(err,fromUser)=>{
                        if(err){
                            return res.json({ error : err });
                        }
                        if (containsDuplicate([to,...fromUser.friendRequests])){
                            return res.json({ message : "Duplicate Error." });
                        }else {
                            fromUser.friends.push(to);
                            fromUser.save((err,_)=>{
                                if(err){
                                    return res.json({ error : err });
                                }
                                resolve();
                            })
                        }
                    })
                }else {
                    return res.json({ message : "Duplicate Error." });
                }
            }else {
                resolve();
            }
        });

        promise.then(()=>{
            user.save((err,_)=>{
                if(err){
                    return res.json({ error : err });
                }
                res.statusJson(201,{ message : "Resolved Friend Request" });
            })
        });
    });
}



module.exports = {
    registerUser,
    loginUser,
    generateFeed,
    getSearchResult,
    deleteAllUsers,
    getAllUsers,
    sendFriendRequest,
    getUserData,
    getFriendsRequests,
    resolveFriendRequest,
    createPost,
    likeUnlike,
    postComment
}