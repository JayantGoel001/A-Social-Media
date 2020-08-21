const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Post = mongoose.model('Post');
const timeAgo = require('time-ago');

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

const generateFeed = function({payload},res) {
    const posts = [];
    const maxAmountOfPosts = 48;
    function addNameAndAgoToPost(array,name) {
        for(item of array){
            item.name = name;
            item.ago = timeAgo.ago(item.date);
        }
    }

    let myPost = new Promise(function(resolve,reject) {
        User.findById(payload._id,"name posts friends",{lean:true},(err,user)=>{
            if(err){
                return res.json({error:err});
            }
            addNameAndAgoToPost(user.posts,user.name);
            posts.push(...user.posts);
            resolve(user.friends);
        });
    });

    let myFriendPost = myPost.then((friendArray)=>{
        return new Promise(function(resolve,reject) {
            User.find({'_id':{$in:friendArray}},
            "name posts",{lean:true},(err,users)=>{
                if(err){
                    return res.json({error:err});
                }
                for(user of users)
                {
                    addNameAndAgoToPost(user.posts,user.name);
                    posts.push(...user.posts);
                }
                resolve();
            });
        });
    });
    myFriendPost.then(()=>{
        posts.sort((a,b)=>(a.date>b.date)?-1:1);
        posts.slice(maxAmountOfPosts);

        res.statusJson(200,{posts:posts});
    });
}

const getSearchResults = function({query,payload},res) {
    if (!query.query) {
        return res.json({err:"Missing A Query."});
    }
    User.find({ name: { $regex : query.query, $options: "i" }},"name friends friend_requests",(err,results)=>{
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
    User.findById(params.userid,(err,user)=>{
        if(err){
            return res.json({error:err});
        }
        res.statusJson(200,{user:user});
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
        user.posts.push(post);
        user.save((err)=>{
            if(err){
                return res.json({error:err});
            }
            return res.statusJson(201,{message:"Create Post",post:newPosts});
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
    createPost
}
