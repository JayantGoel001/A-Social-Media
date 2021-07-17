const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment')

let maleNames = ["Liam", "Noah", "William", "James", "Oliver", "Benjamin", "Elijah", "Lucas", "Mason", "Logan", "Alexander", "Ethan", "Jacob", "Michael", "Daniel", "Henry", "Jackson", "Sebastian", "Aiden", "Matthew", "Samuel", "David", "Joseph", "Carter", "Owen", "Wyatt", "John", "Jack", "Luke", "Jayden", "Dylan", "Grayson", "Levi", "Isaac", "Gabriel", "Julian", "Mateo", "Anthony", "Jaxon", "Lincoln", "Joshua", "Christopher", "Andrew", "Theodore", "Caleb", "Ryan", "Asher", "Nathan", "Thomas", "Leo", "Isaiah", "Charles", "Josiah", "Hudson", "Christian", "Hunter", "Connor", "Eli", "Ezra", "Aaron", "Landon", "Adrian", "Jonathan", "Nolan", "Jeremiah", "Easton", "Elias", "Colton", "Cameron", "Carson", "Robert", "Angel", "Maverick", "Nicholas", "Dominic", "Jaxson", "Greyson", "Adam", "Ian", "Austin", "Santiago", "Jordan", "Cooper", "Brayden", "Roman", "Evan", "Ezekiel", "Xaviar", "Jose", "Jace", "Jameson", "Leonardo", "Axel", "Everett", "Kayden", "Miles", "Sawyer", "Jason"];
let femaleNames = ["Emma", "Olivia", "Ava", "Isabella", "Sophia", "Charlotte", "Mia", "Amelia", "Harper", "Evelyn", "Abigail", "Emily", "Elizabeth", "Mila", "Ella", "Avery", "Sofia", "Camila", "Aria", "Scarlett", "Victoria", "Madison", "Luna", "Grace", "Chloe", "Penelope", "Layla", "Riley", "Zoey", "Nora", "Lily", "Eleanor", "Hannah", "Lillian", "Addison", "Aubrey", "Ellie", "Stella", "Natalie", "Zoe", "Leah", "Hazel", "Violet", "Aurora", "Savannah", "Audrey", "Brooklyn", "Bella", "Claire", "Skylar", "Lucy", "Paisley", "Everly", "Anna", "Caroline", "Nova", "Genesis", "Emilia", "Kennedy", "Samantha", "Maya", "Willow", "Kinsley", "Naomi", "Aaliyah", "Elena", "Sarah", "Ariana", "Allison", "Gabriella", "Alice", "Madelyn", "Cora", "Ruby", "Eva", "Serenity", "Autumn", "Adeline", "Hailey", "Gianna", "Valentina", "Isla", "Eliana", "Quinn", "Nevaeh", "Ivy", "Sadie", "Piper", "Lydia", "Alexa", "Josephine", "Emery", "Julia", "Delilah", "Arianna", "Vivian", "Kaylee", "Sophie", "Brielle", "Madeline"];
let familyNames = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins", "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Rivera", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez", "James", "Watson", "Brooks", "Kelly", "Sanders", "Price", "Bennett", "Wood", "Barnes", "Ross", "Henderson", "Coleman", "Jenkins", "Perry", "Powell", "Long", "Patterson", "Hughes", "Flores", "Washington", "Butler", "Simmons", "Foster", "Gonzales", "Bryant", "Alexander", "Ussell", "Griffin", "Diaz", "Hayes"];

const getRandom = (min,max)=>{
    return Math.floor(Math.random() * (max - min)) + min;
}

const registerFakeUsers = (gender,email)=>{
    let firstName = "";
    if (gender === 'f'){
        firstName = femaleNames[getRandom(0,femaleNames.length-1)];
    }else {
        firstName = maleNames[getRandom(0,maleNames.length-1)];
    }
    let lastName = familyNames[getRandom(0,familyNames.length-1)];

    return new Promise((resolve,reject)=>{
        let user = new User();
        user.name = firstName + " " + lastName;
        user.email = email;
        user.profileImage = email;
        user.setPassword("f");

        user.save().then((users)=>{
            resolve(users);
        }).catch((err)=>{
            reject("Something went Wrong.");
            return res.json({ error : err });
        })
    })
}

const createFakeUsers = (req, res)=>{
    const create70Users = ()=>{
        let promises = [];
        const create35Users = (gender)=>{
            for (let i = 0; i < 35; i++) {
                let promise = new Promise((resolve) => {
                    registerFakeUsers(gender, `${gender}${i + 1}`).then((val) => {
                        resolve(val);
                    });
                });
                promises.push(promise);
            }
        }
        create35Users('m');
        create35Users('f');
        return new Promise((resolve)=>{
            Promise.all(promises).then((val)=>{
                resolve(val);
            });
        });
    }

    const deleteAllUsers = new Promise((resolve, reject)=>{
        User.deleteMany({},(err,info)=>{
            if(err){
                reject(err);
                return res.send({ error : err });
            }
            resolve(info);
        });
    });

    deleteAllUsers.then(()=>{
        create70Users().then(()=>{
            res.statusJson(201, {message : "Successfully Created Fake Users."});
        });
    })
}

module.exports = {
    createFakeUsers
}


