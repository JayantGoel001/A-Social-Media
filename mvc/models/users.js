const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:String,
    salt:String
});

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(64).toString('hex');
    this.password = crypto.pbkdf2Sync(password,this.salt,1000,64,'sha512').toString('hex');
}

userSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password,this.salt,1000,64,'sha512').toString('hex');
    return hash === this.password;
}

userSchema.methods.getJwt = function() {
    return jwt.sign({
        _id:this._id,
        email:this.email,
    },process.env.JWT_TOKEN);
}
mongoose.model("User",userSchema);
