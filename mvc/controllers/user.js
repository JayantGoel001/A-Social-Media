const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');


const registerUser = function({body},res) {
    if (!Object.values(body).every((val) => val )) {
        return res.send({message:"All Fields Are Required"});
    }
    if (body.password!==body.password_confirm) {
        return res.send({message:"Password Doesnot match"});
    }

    const user = new User();
    user.firstname = body.first_name.trim();
    user.lastname = body.last_name.trim();
    user.email = body.email;
    user.setPassword(body.password);

    user.save((err,newUser)=>{
        if (err) {
            res.status(400).json({ message:err });
        }
        else {
            res.status(201).json({ message:"New User",user:newUser });
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
            return res.status(400).json({message:err});
        }
        if (user) {
            res.status(201).json({message:"Logged In"});
        }
        else {
            res.status(401).json(info);
        }
    })(req,res);
}

module.exports = {
    registerUser,
    loginUser
}
