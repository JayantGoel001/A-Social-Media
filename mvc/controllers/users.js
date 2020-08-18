const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

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

const generateFeed = function(req,res) {
    res.status(200).json({message:"Generating posts for a users feed."});
}

const getSearchResults = function({query},res) {
    return res.json({message:"Getting Search Results",query:query.query});
}

const deleteAllUsers = function(req,res) {
    User.deleteMany({},(err,info)=>{
        if(err){
            return res.send({error:err});
        }
        return res.json({message:"Deleted All Users",info:info});
    });
}

module.exports = {
    deleteAllUsers,
    registerUser,
    loginUser,
    generateFeed,
    getSearchResults
}
