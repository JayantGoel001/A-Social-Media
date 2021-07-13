const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model("User");

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
    user.firstName = body.firstName.trim();
    user.lastName = body.lastName.trim();
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
            return res.statusJson(400, {message: "Something went wrong."});
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
            res.statusJson(401,info);
        }
    })(req,res);
}

module.exports = {
    registerUser,
    loginUser
}