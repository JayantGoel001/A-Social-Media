const passport = require('passport');
const mongoose = require('mongoose');
const timeAgo = require("time-ago");

const User = mongoose.model("User");
const Post = mongoose.model("Post");
const Comment = mongoose.model("Comment");
const Message = mongoose.model("Message");

const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

const addNameAndDateToPosts = (ar, user) => {
    for (let i = 0; i < ar.length; i++) {
        ar[i].name = user.name;
        ar[i].timeAgo = timeAgo.ago(ar[i].date);
        ar[i].ownerID = user._id;
        ar[i].profileImage = user.profileImage;
    }
}

const alertUser = (fromUser, toUser, type, postContent) => {
    return new Promise((resolve, reject) => {
        let alert = {
            alertType: type,
            fromID: fromUser._id,
            fromName: fromUser.name
        };
        if (postContent && postContent.length > 28) {
            postContent = postContent.substr(0, 28) + "...";
        }
        switch (type) {
            case "new_friend":
                alert.alertText = `${alert.fromName} has accepted your friend request.`;
                break
            case "liked_post":
                alert.alertText = `${alert.fromName} has liked your post, '${postContent}.'`;
                break
            case "commented_post":
                alert.alertText = `${alert.fromName} has commented on your post, '${postContent}.'`;
                break
            default:
                return reject("Wrong Case");
        }
        User.findByIdAndUpdate(toUser, {
            $inc: {
                latestNotifications: 1
            },
            $push: {
                notifications: {
                    $position: 0,
                    $each: [JSON.stringify(alert)],
                    $slice: 19
                }
            }
        }, { useFindAndModify: false, projection: "_id" }, (err) => {
            if (err) {
                return res.json({ error: err });
            }
            resolve();
        });
    });
}

const addCommentDetails = (posts) => {
    return new Promise((resolve) => {
        let promises = [];
        for (const post of posts) {
            for (const comment of post.comments) {
                let promise = new Promise((resolve, reject) => {
                    User.findById(comment.id, "name profileImage", (err, user) => {
                        if (err) {
                            reject("Something Went Wrong!");
                            return res.json({ error: err });
                        }
                        comment.name = user.name;
                        comment.profileImage = user.profileImage;
                        resolve(comment);
                    });
                });
                promises.push(promise);
            }
        }
        Promise.all(promises).then(() => {
            resolve(posts);
        });
    });
}

const registerUser = ({ body }, res) => {
    if (
        !body.firstName ||
        !body.lastName ||
        !body.email ||
        !body.password ||
        !body.confirmPassword
    ) {
        return res.send({ message: "All Fields Are Required" });
    }
    if (body.password !== body.confirmPassword) {
        return res.send({ message: "Password Does not match" });
    }

    const user = new User();

    user.name = body.firstName.trim() + " " + body.lastName.trim();
    user.email = body.email.trim();
    user.setPassword(body.password);

    user.save().then(r => {
        const token = r.getJWT();
        res.statusJson(201, { token: token });
    }).catch((err) => {
        err = err.toString();
        if (err && err.includes("duplicate key error") && err.includes("email")) {
            return res.json({ message: "Provided Email is already registered." });
        } else {
            return res.json({ message: "Something went wrong." });
        }
    });
}

const loginUser = (req, res) => {
    let body = req.body;
    if (!body.email || !body.password) {
        return res.statusJson(400, { message: "All Fields are Required." });
    }
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return res.statusJson(400, { message: err });
        }

        if (user) {
            const token = user.getJWT();
            res.statusJson(201, { token: token });
        } else {
            res.json(info);
        }
    })(req, res);
}

const generateFeed = ({ payload }, res) => {

    let posts = [];
    let bestiePosts = [];

    let myPosts = new Promise((resolve, reject) => {
        User.findById(payload._id, "", { lean: true }, (err, user) => {
            if (err) {
                reject("Something Went Wrong");
                return res.statusJson(400, { error: err });
            }
            if (user) {
                addNameAndDateToPosts(user.posts, user);

                posts.push(...user.posts);
                user.friends = user.friends.filter((val) => {
                    return !user.besties.includes(val);
                });
                resolve(user);
            } else {
                reject("Something Went Wrong");
                return res.statusJson(404, { error: "User Doesn't exists" });
            }
        });
    });

    const getPostsFrom = (arr, maxAmountOfPosts, postsArray) => {
        return new Promise((resolve, reject) => {
            User.find({ "_id": { $in: arr } }, "posts name profileImage", { lean: true }, (err, users) => {
                if (err) {
                    reject(err);
                    return res.json({ error: err });
                }
                for (const user of users) {
                    addNameAndDateToPosts(user.posts, user);
                    postsArray.push(...user.posts);
                }
                postsArray.sort((a, b) => (a.date > b.date) ? -1 : 1);
                postsArray.splice(maxAmountOfPosts);

                addCommentDetails(postsArray).then(() => {
                    resolve();
                });
            });
        });
    }

    let myFriendPosts = myPosts.then(({ friends }) => {
        return getPostsFrom(friends, 48, posts);
    });
    let myBestiePosts = myPosts.then(({ besties }) => {
        return getPostsFrom(besties, 4, bestiePosts);
    });
    Promise.all([myFriendPosts, myBestiePosts]).then(() => {
        res.statusJson(200, { posts: posts, bestiePosts: bestiePosts });
    });
}

const createPost = ({ body, payload }, res) => {
    if (!body.content || !body.theme) {
        return res.statusJson(400, { message: "Insufficient Data" });
    }
    const post = new Post();
    post.theme = body.theme;
    post.content = body.content;

    User.findByIdAndUpdate(payload._id, { $push: { posts: post } }, { useFindAndModify: false, projection: "profileImage" }, (err, user) => {
        if (err) {
            return res.json({ error: err });
        }

        let latestPost = post.toObject();
        latestPost.name = payload.name;
        latestPost.ownerID = payload._id;
        latestPost.profileImage = user.profileImage;

        return res.statusJson(201, { message: "Successfully created the post.", post: latestPost });
    })

}

const likeUnlike = ({ payload, params }, res) => {
    User.findById(params.ownerID, "posts", (err, user) => {
        if (err) {
            return res.json({ error: err });
        }
        const post = user.posts.id(params.postID);

        let promise = new Promise((resolve, reject) => {
            let update = {};
            let likeToggle = { "posts.$.likes": payload._id };

            if (post.likes.includes(payload._id)) {
                update = { $pull: likeToggle };

                resolve(update);
            } else {
                update = { $push: likeToggle };

                if (params.ownerID.toString() !== payload._id.toString()) {
                    User.findById(payload._id, "name", (err, user) => {
                        if (err) {
                            reject(err);
                            return res.json({ error: err });
                        }
                        alertUser(user, params.ownerID, "liked_post", post.content).then(() => {
                            resolve(update);
                        });
                    })
                } else {
                    resolve(update);
                }
            }
        });

        promise.then((update) => {
            User.findOneAndUpdate({ _id: params.ownerID, "posts._id": params.postID }, update, { useFindAndModify: false, projection: "_id" }, (err) => {
                if (err) {
                    return res.json({ error: err });
                }
                res.statusJson(201, { message: "Liked or Unliked a post." });
            });
        });
    });
}

const postComment = ({ body, params, payload }, res) => {
    let comment = new Comment();

    comment.id = payload._id;
    comment.content = body.content;

    User.findOneAndUpdate({ _id: params.ownerID, "posts._id": params.postID }, { $push: { "posts.$.comments": comment } }, { useFindAndModify: false, projection: "posts" }, (err, user) => {
        if (err) {
            return res.json({ error: err });
        }
        let post = user.posts.id(params.postID);
        User.findById(payload._id, "name profileImage", {}, (err, commenter) => {
            if (err) {
                return res.json({ error: err });
            }
            let promise = new Promise((resolve) => {
                if (payload._id.toString() !== params.ownerID.toString()) {
                    alertUser(commenter, params.ownerID, "commented_post", post.content).then(() => {
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
            promise.then(() => {
                res.statusJson(201, { message: "Posted Comment", comment: comment, commenterName: commenter.name, commenterImage: commenter.profileImage });
            });
        });

    })
}

const getSearchResult = (req, res) => {
    let query = req.query;
    let payload = req.payload;

    if (!query.query) {
        return res.json({ error: "Missing a query." });
    }
    User.find({ name: { $regex: query.query, $options: "i" }, _id: { $ne: payload._id } }, null, { limit: 20 }, (err, results) => {
        if (err) {
            return res.json({ error: err });
        }
        return res.statusJson(200, { message: "Getting Search results", results: results });
    });
}

const deleteAllUsers = (req, res) => {
    User.deleteMany({}, (err, info) => {
        if (err) {
            return res.send({ error: err });
        }
        return res.json({ message: info });
    });
}

const getAllUsers = (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            return res.send({ error: err });
        }
        return res.json({ users: users });
    });
}

const sendFriendRequest = (req, res) => {
    let params = req.params;
    User.findOneAndUpdate({ _id: params.to, friendRequests: { $nin: params.from } }, { $push: { friendRequests: params.from } }, { useFindAndModify: false, projection: "_id" }, (err, user) => {
        if (err) {
            return res.json({ error: err });
        }
        if (!user) {
            return res.json({ message: "Friend Request is already sent." });
        }
        return res.statusJson(201, { message: "Successfully sent a Friend request." });
    });
}

const getUserData = (req, res) => {
    User.findById(req.params.userid, "-salt -password", { lean: true }, (err, user) => {
        if (err) {
            return res.statusJson(400, { error: err });
        }
        if (!user) {
            return res.statusJson(404, { error: "User does not exists." });
        }

        const getRandomFriends = (friendsList) => {
            let friends = Array.from(friendsList);

            let randomID = [];
            if (friendsList.length <= 6) {
                randomID = friends;
            } else {
                for (let i = 0; i < 6; i++) {
                    let index = getRandom(0, friends.length - 1);
                    randomID.push(friends[index]);
                    friends.splice(index, 1);
                }
            }
            return new Promise((resolve, reject) => {
                User.find({ '_id': { $in: randomID } }, null, (err, friends) => {
                    if (err) {
                        reject(err);
                        return res.json({ error: err });
                    }
                    resolve(friends);
                });
            });
        }

        const addMessengerDetails = (messages) => {
            return new Promise((resolve) => {
                if (!messages.length) {
                    resolve(messages);
                }
                let usersArray = [];
                for (const message of messages) {
                    usersArray.push(message.fromID);
                }

                User.find({ '_id': { $in: usersArray } }, "name profileImage", {}, (err, users) => {
                    if (err) {
                        return res.json({ error: err });
                    }
                    for (let message of messages) {
                        for (let i = 0; i < users.length; i++) {

                            if (message.fromID.toString() === users[i]._id.toString()) {
                                message.messengerName = users[i].name;
                                message.messengerProfileImage = users[i].profileImage;
                                users.splice(i, 1);
                                break;
                            }
                        }
                    }
                    resolve(messages);
                })
            });
        }

        user.posts.sort((a, b) => a.date > b.date ? -1 : 1);
        addNameAndDateToPosts(user.posts, user);

        let randomFriends = getRandomFriends(user.friends);
        let commentDetails = addCommentDetails(user.posts);
        let messageDetails = addMessengerDetails(user.messages);

        let besties = new Promise((resolve) => {
            User.find({ '_id': { $in: user.besties } }, "name profileImage", (err, users) => {
                if (err) {
                    return res.json({ error: err });
                }
                user.besties = users;
                resolve();
            });
        });
        let enemies = new Promise((resolve) => {
            User.find({ '_id': { $in: user.enemies } }, "name profileImage", (err, users) => {
                if (err) {
                    return res.json({ error: err });
                }
                user.enemies = users;
                resolve();
            });
        });

        let waitFor = [randomFriends, commentDetails, messageDetails, besties, enemies];
        Promise.all(waitFor).then((val) => {
            user.randomFriends = val[0];
            user.messages = val[2];
            res.statusJson(200, { user: user });
        });
    });
}

const getFriendsRequests = (req, res) => {
    let friendRequests = JSON.parse(req.query.friend_requests);
    User.find({ '_id': { $in: friendRequests } }, "name profileImage", (err, users) => {
        if (err) {
            return res.json({ error: err });
        }
        res.statusJson(200, { data: users });
    })
}

const resolveFriendRequest = ({ query, params }, res) => {
    const from = params.from;
    const to = params.to;

    const resolution = query.resolution;

    const updateFromQuery = { $pull: { friendRequests: from } };

    if (resolution === "accept") {
        updateFromQuery.$push = { friends: from };
    }

    User.findOneAndUpdate({ _id: to, friendRequests: { $in: from }, friends: { $nin: from } }, updateFromQuery, { useFindAndModify: false, projection: "name" }, (err, user) => {
        if (err) {
            return res.json({ error: err });
        }
        if (!user) {
            return res.json({ error: `No Friend Request from ${from} or Already a friend with ${from}` });
        }

        if (resolution === "accept") {
            User.findOneAndUpdate({ _id: from, friends: { $nin: to } }, { $push: { friends: to } }, { useFindAndModify: false }, (err, fromUser) => {
                if (err) {
                    return res.json({ error: err });
                }
                if (!fromUser) {
                    return res.json({ error: `Already a friend with ${from}` });
                }
                alertUser(user, params.from, "new_friend")
                    .then(() => res.statusJson(201, { message: "Resolved Friend Request" }));
            })
        }
    });
}

const sendMessage = ({ body, params, payload }, res) => {

    let message = {
        messenger: payload._id,
        message: body.content
    }

    const sendMessageTo = (to, from, notify = false) => {
        return new Promise((resolve, reject) => {
            const updateQuery = { $push: { "messages.$.content": message } };

            if (notify) {
                console.log(from, to);
                updateQuery.$addToSet = { latestMessageNotifications: from }
            }

            User.findOneAndUpdate({ _id: to, "messages.fromID": from }, updateQuery, { useFindAndModify: false, projection: "_id" }, (err, user) => {
                if (err) {
                    reject(err);
                    return res.json({ error: err });
                }
                if (!user) {
                    let newMessage = new Message();
                    newMessage.fromID = from;
                    newMessage.content = [message];

                    updateQuery.$push = { messages: newMessage };

                    User.findByIdAndUpdate(to, updateQuery, { useFindAndModify: false, projection: "_id" }, (err) => {
                        if (err) {
                            reject(err);
                            return res.json({ error: err });
                        }
                        resolve();
                    })
                }
                resolve();
            })
        });
    }

    let sendMessageToRecipient = sendMessageTo(params.to, payload._id, true);
    let sendMessageToAuthor = sendMessageTo(payload._id, params.to);

    Promise.all([sendMessageToRecipient, sendMessageToAuthor])
        .then(() => res.statusJson(201, { message: "Sent Message" }));
}

const resetMessageNotifications = ({ payload }, res) => {
    User.findByIdAndUpdate(payload._id, { latestMessageNotifications: [] }, { useFindAndModify: false, projection: "_id" }, (err) => {
        if (err) {
            return res.json({ error: err });
        }
        return res.statusJson(201, { message: "Reset message notifications." });
    })
}

const deleteMessage = ({ payload, params }, res) => {
    User.findByIdAndUpdate(payload._id, { $pull: { messages: { _id: params.id } } }, { useFindAndModify: false, projection: "_id" }, (err) => {
        if (err) {
            return res.json({ error: err });
        }
        return res.statusJson(201, { message: "Deleted Successfully" });
    })
}

const bestieEnemyToggle = ({ payload, params, query }, res) => {

    const toggle = query.toggle;
    if (toggle !== "besties" && toggle !== "enemies") {
        return res.json({ message: "Incorrect query Supplied." })
    }
    const friendID = params.id;
    User.findById(payload._id, `friends ${toggle}`, (err, user) => {
        if (err) {
            return res.json({ error: err });
        }
        if (!user.friends.includes(friendID)) {
            return res.json({ message: "You are not friend with this user." });
        }
        if (toggle === "besties" && user.besties && user.besties.length >= 2 && !user.besties.includes(friendID)) {
            return res.json({ message: "You have the maximum amount of besties." });
        }

        const toggleQuery = toggle === "besties" ? { besties: friendID } : { enemies: friendID };
        const update = user[toggle].includes(friendID) ? { $pull: toggleQuery } : { $push: toggleQuery };

        User.findByIdAndUpdate(payload._id, update, { useFindAndModify: false, projection: "_id" }, (err) => {
            if (err) {
                return res.send({ error: err });
            }
            return res.statusJson(201, { message: "Success" });
        });
    });
}

const resetAlertNotifications = ({ payload }, res) => {
    User.findByIdAndUpdate(payload._id, { latestNotifications: 0 }, { useFindAndModify: false, projection: "_id" }, (err) => {
        if (err) {
            return res.json({ error: err });
        }
        return res.statusJson(201, { message: "Success" });
    })
}

module.exports = {
    registerUser,
    loginUser,
    generateFeed,
    getSearchResult,
    deleteAllUsers,
    getAllUsers,
    sendFriendRequest,
    getUserData,
    getFriendsRequests,
    resolveFriendRequest,
    createPost,
    likeUnlike,
    postComment,
    sendMessage,
    resetMessageNotifications,
    deleteMessage,
    bestieEnemyToggle,
    resetAlertNotifications
}