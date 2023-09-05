const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model("User");

const strategy = new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
    User.findOne({ email: username }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: "We couldn't find any account with these credentials." });
        }
        if (!user.validatePassword(password)) {
            return done(null, false, { message: "Incorrect Password" });
        }
        return done(null, user);
    });
});

passport.use(strategy);