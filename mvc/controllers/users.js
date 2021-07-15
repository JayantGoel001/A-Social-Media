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

const sendFriendRequest = (req,res)=>{
    let params = req.params;
    User.findById(params.to,(err,user)=>{
        if(err){
            return res.json({ error : err });
        }
        if (containsDuplicate([params.to,...user.friendRequests])){
            return res.json({ message : "Friend Request is already sent." })
        }else {
            user.friendRequests.push(params.from);
            user.save().then(()=>{
                return res.statusJson(201,{ message : "Successfully sent a Friend request." });
            }).catch( err => {
                return res.json({ error:err });
            })
        }
    })

}

module.exports = {
    registerUser,
    loginUser,
    generateFeed,
    getSearchResult,
    deleteAllUsers,
    sendFriendRequest
}