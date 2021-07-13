let express = require('express');
let router = express.Router();

const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

router.post("/register",function({body},res) {
    if (!Object.values(body).every((val) => val )) {
        return res.send({message:"All Fields Are Required"});
    }
    if (body.password!==body.confirmPassword) {
        return res.send({message:"Password Doesnot match"});
    }

    const user = new User();
    user.firstName = body.firstName.trim();
    user.lastName = body.lastName.trim();
    user.email = body.email.trim();
    user.setPassword(body.password);

    user.save().then(r =>{
        res.status(201).json({message: "New User", user: r});
    }).catch((err)=>{
        res.status(400).json({message: err});
    });
}) ;

router.post("/login",function(req,res) {
    let body = req.body;
    if (!body.email || !body.password) {
        return res.status(400).json({message:"All Fields are Required."});
    }
    passport.authenticate("local",(err,user,info)=>{
        if (err) {
            return res.status(400).json({message:err});
        }
        if (user) {
            res.status(201).json({message:"Logged In"});
        }  else {
            res.status(401).json(info);
        }
    })(req,res);
});

module.exports = router;