const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");

const commentSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    }, content: {
        type: String,
        required: true
    }
});

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    theme: {
        type: String,
        default: "primary"
    },
    likes: {
        type: [String],
        default: []
    },
    comments: {
        type: [commentSchema],
        default: []
    }
});

const messageSchema = new mongoose.Schema({
    fromID: {
        type: String,
        required: true
    },
    content: [{
        messenger: String,
        message: String
    }]
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    friends: [String],
    friendRequests: [String],
    besties: [String],
    enemies: [String],
    posts: {
        type: [postSchema],
        default: []
    },
    messages: [messageSchema],
    notifications: [String],
    profileImage: {
        type: String,
        default: "default_avatar"
    },
    latestMessageNotifications: {
        type: [String],
        default: []
    },
    latestNotifications: {
        type: Number,
        default: 0
    },
    password: String,
    salt: String
});

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(64).toString('hex');
    this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
}

userSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return hash === this.password;
}

userSchema.methods.getJWT = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name
    }, process.env.JWT_TOKEN);
}

mongoose.model("Comment", commentSchema);
mongoose.model("Post", postSchema);
mongoose.model("Message", messageSchema);
mongoose.model("User", userSchema);
