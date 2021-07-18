const passport = require('passport');
const mongoose = require('mongoose');
const timeAgo = require("time-ago");

const User = mongoose.model("User");
const Post = mongoose.model("Post");
const Comment = mongoose.model("Comment");
const Message = mongoose.model("Message");

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

const alertUser = (fromUser,toUser,type,postContent)=>{
    return new Promise((resolve,reject) => {
        let alert = {
            alertType: type,
            fromID : fromUser._id,
            fromName : fromUser.name
        };
        if (postContent && postContent.length>28){
            postContent = postContent.substr(0,28)+"...";
        }
        switch (type) {
            case "new_friend":
                alert.alertText = `${alert.fromName} has accepted your friend request.`;
                break
            case "liked_post":
                alert.alertText = `${alert.fromName} has liked your post, '${postContent}.'`;
                break
            case "commented_post":
                alert.alertText = `${alert.fromName} has commented on your post, '${postContent}.'`;
                break
            default:
                return reject("Wrong Case");
        }
        User.findById(toUser,(err,user)=>{
            if(err){
                return res.json({ error : err });
            }
            user.latestNotifications++;
            user.notifications.push(JSON.stringify(alert));
            user.save().then(()=>{
                resolve();
            }).catch((err)=>{
                return res.json({ error : err });
            })

        });
    });
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

    let posts = [];
    let bestiePosts = [];

    let myPosts = new Promise((resolve, reject)=>{
        User.findById(payload._id,"",{ lean : true },(err,user)=>{
            if(err){
                reject("Something Went Wrong");
                return res.json({ error : err });
            }
            if (user) {
                addNameAndDateToPosts(user.posts, user);
                posts.push(...user.posts);
                user.friends = user.friends.filter((val)=>{
                    return !user.besties.includes(val);
                });
                resolve(user);
            }
        });
    });

    function getPostsFrom(arr,maxAmountOfPosts,postsArray) {
        return new Promise((resolve, reject) => {
            User.find({"_id": { $in : arr }},"",{lean: true},(err,users)=>{
                if(err){
                    reject(err);
                    return res.json({ error : err });
                }
                for (const user of users) {
                    addNameAndDateToPosts(user.posts,user);
                    postsArray.push(...user.posts);
                }
                postsArray.sort((a,b)=> (a.date > b.date)?-1 : 1);
                postsArray.splice(maxAmountOfPosts);

                addCommentDetails(postsArray).then(()=>{
                    resolve();
                });
            });
        });
    }

    let myFriendPosts = myPosts.then(({friends})=>{
        return getPostsFrom(friends,48,posts);
    });
    let myBestiePosts = myPosts.then(({besties})=>{
        return getPostsFrom(besties,4,bestiePosts);
    });
    Promise.all([myFriendPosts,myBestiePosts]).then(()=>{
        res.statusJson(200, { posts: posts,bestiePosts : bestiePosts });
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

        let promise = new Promise((resolve, reject) => {
            if (post.likes.includes(payload._id)){
                post.likes.splice(post.likes.indexOf(payload._id),1);
                resolve();
            }else {
                post.likes.push(payload._id);
                if (params.ownerID.toString() !== payload._id.toString()){
                    User.findById(payload._id,(err,user)=>{
                        if(err){
                            reject(err);
                            return res.json({ error : err });
                        }
                        alertUser(user,params.ownerID,"liked_post",post.content).then(()=>{
                            resolve();
                        });
                    })
                }else {
                    resolve();
                }
            }
        });

        promise.then(()=>{
            user.save().then((updateUser)=>{
                res.statusJson(201,{ message : "Liked or Unliked a post." ,user : updateUser});
            }).catch((err)=>{
                return res.json({ error : err });
            });
        });
    });
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
                let promise = new Promise((resolve, reject) => {
                    if (payload._id.toString() !== params.ownerID.toString()) {
                        alertUser(commenter, params.ownerID, "commented_post", post.content).then(() => {
                            resolve();
                        });
                    }else {
                        resolve();
                    }
                });
                promise.then(()=>{
                    res.statusJson(201,{ message : "Posted Comment",comment : comment, commenterName : commenter.name, commenterImage : commenter.profileImage });
                });
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

        function addMessengerDetails(messages) {
            return new Promise((resolve) => {
                if (!messages.length){
                    resolve(messages);
                }
                let usersArray = [];
                for (const message of messages) {
                    usersArray.push(message.fromID);
                }

                User.find({'_id': { $in : usersArray }},"name profileImage",{},(err,users)=>{
                    if(err){
                        return res.json({ error : err });
                    }
                    for (let message of messages) {
                        for (let i = 0; i < users.length; i++) {

                            if (message.fromID.toString() === users[i]._id.toString()){
                                message.messengerName = users[i].name;
                                message.messengerProfileImage = users[i].profileImage;
                                users.splice(i,1);
                                break;
                            }
                        }
                    }
                    resolve(messages);
                })
            });
        }

        user.posts.sort((a,b)=> (a.date > b.date ? -1 : 1));
        addNameAndDateToPosts(user.posts,user);

        let randomFriends = getRandomFriends(user.friends);
        let commentDetails = addCommentDetails(user.posts);
        let messageDetails = addMessengerDetails(user.messages);
        let besties = new Promise((resolve, reject)=>{
            User.find({ '_id': { $in : user.besties }},"name profileImage",(err,users)=>{
                if(err){
                    return res.json({ error : err });
                }
                user.besties = users;
                resolve();
            });
        });
        let enemies = new Promise((resolve, reject)=>{
            User.find({ '_id': { $in : user.enemies }},"name profileImage",(err,users)=>{
                if(err){
                    return res.json({ error : err });
                }
                user.enemies = users;
                resolve();
            });
        });

        let waitFor = [randomFriends,commentDetails,messageDetails,besties,enemies];
        Promise.all(waitFor).then((val)=>{
            user.randomFriends = val[0];
            user.messages = val[2];
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
                alertUser(user,params.from,"new_friend").then(()=>{
                    res.statusJson(201,{ message : "Resolved Friend Request" });
                })
            })
        });
    });
}

const sendMessage = ({body,params,payload},res)=>{

    let from = payload._id;
    let to = params.to;

    let fromPromise = new Promise((resolve, reject)=>{
        User.findById(from,"messages",(err,user)=>{
            if(err){
                reject(err);
                return res.json({ error : err });
            }
            from = user;
            resolve(user);
        })
    })
    let toPromise = new Promise((resolve, reject)=>{
        User.findById(to,"messages latestMessageNotifications",(err,user)=>{
            if(err){
                reject(err);
                return res.json({ error : err });
            }
            to = user;
            resolve(user);
        });
    });

    let sendMessagePromise = Promise.all([fromPromise,toPromise]).then(()=>{

        function hasMessageFrom(messages,id) {
            for(let message of messages){
                if(message.fromID.toString() === id.toString()){
                    return message;
                }
            }
        }

        function sendMessageTo(to,from, notify = false){
            return new Promise((resolve, reject)=>{
                if (notify && !to.latestMessageNotifications.includes(from._id)){
                    to.latestMessageNotifications.push(from._id);
                }
                let foundMessage = hasMessageFrom(to.messages,from._id)
                if (foundMessage){
                    foundMessage.content.push(message);
                    to.save().then((user)=>{
                        resolve(user);
                    }).catch((err)=>{
                        reject(err);
                        return res.json({error : err});
                    })
                }else {
                    let newMessage = new Message();
                    newMessage.fromID = from._id;
                    newMessage.content = [message];

                    to.messages.push(newMessage);
                    to.save().then((user)=>{
                        resolve(user);
                    }).catch((err)=>{
                        reject(err);
                        return res.json({error : err});
                    });
                }
            });
        }

        let message = {
            messenger : from._id,
            message : body.content
        }

        let sendMessageToRecipient = sendMessageTo(to,from,true);
        let sendMessageToAuthor = sendMessageTo(from,to);

        return new Promise((resolve) => {
            Promise.all([sendMessageToRecipient,sendMessageToAuthor]).then(()=>{
                resolve();
            });
        });
    });
    sendMessagePromise.then(()=>{
        res.statusJson(201,{ message : "Sent Message" });
    });
}

const resetMessageNotifications = ({payload}, res)=>{
    User.findById(payload._id,(err,user)=>{
        if(err){
            return res.json({ error : err });
        }
        user.latestMessageNotifications = [];
        user.save().then(()=>{
            res.statusJson(201,{ message: "Reset message notifications." })
        }).catch((err)=>{
            res.send({ error : err });
        })
    })
}

const deleteMessage  = ({payload,params},res)=>{
    User.findById(payload._id,(err,user)=>{
        if(err){
            return res.json({ error : err });
        }
        const message = user.messages.id(params.id).remove();

        user.save().then(()=>{
            res.statusJson(201,{ message : "Deleted Successfully" });
        }).catch((err)=>{
            return res.send({ error :err });
        })
    })
}

const bestieEnemyToggle = ({payload,params,query},res)=>{

    let toggle = query.toggle;
    if (toggle !== "besties" && toggle!== "enemies"){
        return res.json({ message: "Incorrect query Supplied." })
    }
    let friendID = params.id;
    User.findById(payload._id,(err,user)=>{
        if(err){
            return res.json({ error : err });
        }
        if (!user.friends.includes(friendID)){
            return res.json({ message : "You are not friend with this user." });
        }

        let ar = user[toggle];

        if (ar.includes(friendID)){
            ar.splice(ar.indexOf(friendID),1);
        }else {
            if (toggle === "besties" && user.besties && user.besties.length>=2){
                return res.json({ message : "You have the maximum amount of besties." });
            }
            ar.push(friendID);
        }
        user.save().then(()=>{
            return res.statusJson(201,{message : "Success"});
        }).catch((err)=>{
            return res.send({ error : err });
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
    postComment,
    sendMessage,
    resetMessageNotifications,
    deleteMessage,
    bestieEnemyToggle
}