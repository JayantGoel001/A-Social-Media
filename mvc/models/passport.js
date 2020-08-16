const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model("User");

const strategy = new localStrategy({ usernameField:"email" },(username,password,done)=>{
    console.log("AUTH!!!!!!!!!!!!!!!!");
    User.findOne({email:username},(err,user)=>{
        if(err){
            return done(err);
        }
        if (!user) {
            return done(null,false,{message:"Incorrect Email."});
        }
        if (!user.validatePassword(password)) {
            return done(null,false,{message:"Incorrect Password"});
        }
        return done(null,user);
    });
});

passport.use(strategy);
