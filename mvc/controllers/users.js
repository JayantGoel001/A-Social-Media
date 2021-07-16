const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model("User");

const containsDuplicate = (arr)=>{
    arr.sort();
    for (let i = 1; i < arr.length; i++) {
        if (arr[i]===arr[i-1]){
            return true;
        }
    }
    return false;
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
        if (err && err.includes("duplicate key error")){
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

const generateFeed = (req,res)=>{
    res.statusJson(200,{ message : "Generating posts for a users feed." });
}

const getSearchResult = (req,res)=>{
    let query = req.query;
    let payload = req.payload;
    if (!query.query){
        return res.json({ error : "Missing a query." });
    }
    User.find({ name : { $regex : query.query , $options : "i"} },"name friends friendRequests",{},(err,results)=>{
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
    User.findById(req.params.userid,null,{},(err,user)=>{
        if(err){
            return res.json({ error : err });
        }
        res.statusJson(200,{ user : user });
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
    sendFriendRequest,
    getUserData,
    getFriendsRequests,
    resolveFriendRequest
}