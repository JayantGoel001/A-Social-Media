const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment')

let maleNames = ["Liam", "Noah", "William", "James", "Oliver", "Benjamin", "Elijah", "Lucas", "Mason", "Logan", "Alexander", "Ethan", "Jacob", "Michael", "Daniel", "Henry", "Jackson", "Sebastian", "Aiden", "Matthew", "Samuel", "David", "Joseph", "Carter", "Owen", "Wyatt", "John", "Jack", "Luke", "Jayden", "Dylan", "Grayson", "Levi", "Isaac", "Gabriel", "Julian", "Mateo", "Anthony", "Jaxon", "Lincoln", "Joshua", "Christopher", "Andrew", "Theodore", "Caleb", "Ryan", "Asher", "Nathan", "Thomas", "Leo", "Isaiah", "Charles", "Josiah", "Hudson", "Christian", "Hunter", "Connor", "Eli", "Ezra", "Aaron", "Landon", "Adrian", "Jonathan", "Nolan", "Jeremiah", "Easton", "Elias", "Colton", "Cameron", "Carson", "Robert", "Angel", "Maverick", "Nicholas", "Dominic", "Jaxson", "Greyson", "Adam", "Ian", "Austin", "Santiago", "Jordan", "Cooper", "Brayden", "Roman", "Evan", "Ezekiel", "Xaviar", "Jose", "Jace", "Jameson", "Leonardo", "Axel", "Everett", "Kayden", "Miles", "Sawyer", "Jason"];

let femaleNames = ["Emma", "Olivia", "Ava", "Isabella", "Sophia", "Charlotte", "Mia", "Amelia", "Harper", "Evelyn", "Abigail", "Emily", "Elizabeth", "Mila", "Ella", "Avery", "Sofia", "Camila", "Aria", "Scarlett", "Victoria", "Madison", "Luna", "Grace", "Chloe", "Penelope", "Layla", "Riley", "Zoey", "Nora", "Lily", "Eleanor", "Hannah", "Lillian", "Addison", "Aubrey", "Ellie", "Stella", "Natalie", "Zoe", "Leah", "Hazel", "Violet", "Aurora", "Savannah", "Audrey", "Brooklyn", "Bella", "Claire", "Skylar", "Lucy", "Paisley", "Everly", "Anna", "Caroline", "Nova", "Genesis", "Emilia", "Kennedy", "Samantha", "Maya", "Willow", "Kinsley", "Naomi", "Aaliyah", "Elena", "Sarah", "Ariana", "Allison", "Gabriella", "Alice", "Madelyn", "Cora", "Ruby", "Eva", "Serenity", "Autumn", "Adeline", "Hailey", "Gianna", "Valentina", "Isla", "Eliana", "Quinn", "Nevaeh", "Ivy", "Sadie", "Piper", "Lydia", "Alexa", "Josephine", "Emery", "Julia", "Delilah", "Arianna", "Vivian", "Kaylee", "Sophie", "Brielle", "Madeline"];

let familyNames = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins", "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Rivera", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez", "James", "Watson", "Brooks", "Kelly", "Sanders", "Price", "Bennett", "Wood", "Barnes", "Ross", "Henderson", "Coleman", "Jenkins", "Perry", "Powell", "Long", "Patterson", "Hughes", "Flores", "Washington", "Butler", "Simmons", "Foster", "Gonzales", "Bryant", "Alexander", "Ussell", "Griffin", "Diaz", "Hayes"];

let fakePosts = {
    hardcodedPosts: ["Time flies like an arrow. Fruit flies like a banana.", "The reports of my death have been greatly exaggerated.", "I have an old VCR.  Does anyone want it?", "Happy ;D", "Sad :(", "Derps a lot, everyday.", "If debugging is the process of removing software bugs, then programming must be the process of putting them in.", "Deleted code is debugged code.", "Before you judge a man, walk a mile in his shoes. After that who cares?... He’s a mile away and you’ve got his shoes!", "People say nothing is impossible, but I do nothing every day.", "gg", "Scotland's national animal is the Unicorn.", "Nobody realizes that some people expend tremendous energy merely to be normal - Pretty much me.", "Eh.", "I have a big announcement everyone.  I'm going to bed.", "Practice Makes Permanent", "It's so cold outside...", "I need a vacation.", "Good morning :)", "Summer soon!", "Today is soo ughh", "Facebook just sounds like a drag, in my day seeing pictures of peoples vacations was considered a punishment - Betty White", "A bank is a place that will lend you money if you can prove that you don’t need it.", "Great :)", "I thought today was Friday :(", "Infinity doesn't exist. Change my mind.", "Free will doesn't exist. Change my mind.", "I just fed two birds with one scone.", "WOW", "P = NP", "E = MC^2", "Over the hills and far away.", "I like coffee.", "I'm a robot.", "Oops...", "BOOP", "What if the universe is a simulation?", "Winner winner chicken dinner.", "Today is the first day of the rest of your life.", "I'm flying today!", "I just found out that some infinites are bigger than other infinites.  Mind = Blown.", "Margaret Thatcher is 110% Sexy", "The chicken came before the egg.", "I'm tired.", "Just woke up :)", "Finally some good news.", "It's so simple.", "...My friend talks too much.", "Loving this Saturday.", "My favorite machine at the gym is the vending machine.", "Don’t worry about the world coming to an end today. It is already tomorrow in Australia.", "Hello, World", "I like turtles.", "0101101001010100101010", "North Korea and Cuba are the only places you can't buy Coca-Cola.", "High heels were invented by a woman who had been kissed on the forehead.", "That was fun!", "Ouch!!! I stepped on a lego shapped object. ", "Taumatawhakatangihangakoauauotamateaturipukakapikimaungahoronukupokaiwhenuakitanatahu is a place you can visit in New Zealand.", "There is no place like homework.", "Angular is pretty cool.", "The MEAN stack is awesome!", "<3"],
    loremIpsum: ["Early adopters business model canvas scrum project. Infographic infrastructure business-to-business term sheet burn rate return on investment. Holy grail non-disclosure agreement marketing. Pitch iPhone technology business-to-consumer freemium.", "Rockstar iteration business-to-consumer niche market first mover advantage MVP innovator incubator startup. Equity scrum project strategy. Disruptive deployment freemium infrastructure advisor.", "Freemium interaction design business-to-business innovator termsheet stock release holy grail. Android market innovator metrics business-to-consumer scrum project. Hackathon conversion assets research & development funding ownership agile development backing.", "Lean startup seed money iteration vesting period entrepreneur beta direct mailing crowdsource long tail assets release. Incubator value proposition leverage handshake bandwidth investo.", "Low hanging fruit partnership stock niche market early adopters iPad beta buzz market freemium prototype startup stealth. Influencer channels agile development alpha startup gamification hackathon crowdsource.", "Entrepreneur user experience burn rate mass market bootstrapping focus crowdfunding churn rate. Bandwidth buzz client creative A/B testing alpha android termsheet seed money long tail twitter scrum project infographic.", "MVP infographic first mover advantage growth hacking gamification traction early adopters focus. Business-to-consumer early adopters innovator social media conversion agile development vesting period technology partner network startup. Conversion launch party infographic.", "Holy grail lean startup seed round supply chain crowdfunding interaction design gen-z direct mailing business-to-business business plan prototype social proof user experience technology. Ownership hypotheses churn rate iPhone burn rate traction buyer customer first mover advantage.", "Hypotheses bootstrapping seed money focus facebook release. Analytics release investor advisor branding bandwidth seed round customer ramen gamification infrastructure rockstar innovator first mover advantage. Channels learning curve low hanging fruit. Supply chain accelerator buzz.", "Release customer client ownership seed money buyer. Mass market user experience product management alpha gamification equity angel investor partnership freemium pivot. Crowdsource direct mailing success angel investor. Freemium iteration investor supply chain.", "Locals people St. Petersburg yacht guest budget airplane national bus euro Hong Kong. Exchange rate China Moscow St. Petersburg ticket bus camper Budapest dollar apartment sleep France.", "Stress free dollar booking Instagram activities miles. Nighttrain hospitality train motel bus China. Passport gateway sleep flying overnight transit euro chartering translation car rental rural diary worldwide.", "Rome spa activities uncharted Brasil tent locals guest. Rural budget Berlin. International lonely planet dollar GEO sight seeing recommendations explore.", "Package itinerary territory Germany activities country worldwide. Sight seeing activities hiking Rome overnight housing Turkey discover flying on a shoestring Hong Kong outdoor. Boat uncharted animals active lifestyle. Currency wellness horse riding flexibility.", "Activities territory translation Holland stress free worldwide Germany stay hospitality. Tour operator explore Rome park China national bus travel Australia. Airplane group discount Moscow hotspots flexibility globe outdoor apartment unique experiences people stay hospitality.", "Expedia park frequent flyer housing maps flexibility group discount currency sight seeing outdoor. AirBnB international spa.", "Last minute couchsurfing group discount France hospitality freedom. GEO apartment diary international couchsurfing. Chartering territory Europe creditcard explore stress free kayak overnight apartment itinerary.", "Poland Pacific activities horse riding rural hotspots on a shoestring adventure travel luxury city trip insurance. Berlin foreign airBnB bus diary. Poland creditcard apartment euro cabin overnight. GEO overnight itinerary maps territory New York City Moscow Japan chartering stay. China sleep locals tent Berlin taxi.", "Poland recommendations Vienna Hong Kong relaxation hiking lonely planet dollar last minute translation cabin. Sleep euro exchange rate hitchhiking things to do. Money Amsterdam explore private jet.", "Travel hiking motel Instagram. Camper tent nighttrain freedom rural passport housing motel currency tour operator. Transit Paris package city trip foreign. Park Moscow unique experiences Poland frequent flyer Cuba last minute tourist attractions airmiles expedia Instagram GEO Holland sailing. Last minute St. Petersburg.", "Worldwide unique experiences exchange rate globe private jet Brasil people city trip itinerary diary hospitality. Instagram Rome Barcelona locals tour operator flying boat. Camper itinerary hotspots Tripit rural budget. Discount foreign money.", "Airmiles money hitchhiking China yacht Vienna travel Asia Turkey group discount active lifestyle wellness international GEO. Hiking Instagram couchsurfing miles yacht package housing St. Petersburg Brasil. Housing animals sight seeing Asia gateway sleep locals Hungary international Instagram.", "Brasil Poland flexibility insurance foreign diary Instagram South-America sleep hotel territory earth. Spa tent relaxation couchsurfing Asia motel car rental private jet cab earth taxi Australia cabin.", "Bus flight St. Petersburg currency cabin lodge last minute miles activities Amsterdam spa. Explore booking Turkey Asia couchsurfing hitchhiking. Active lifestyle diary housing hotel camper cabin. Earth tourist attractions hotel Japan discover France caravan Turkey taxi cab airmiles lonely planet. France translator train Pacific.", "Fresh conserve meals authentic restaurant scent local poultry food heating fork indie foods. Broil blender paprika lasagna sushi groceries romantic biological mustard a la carte. Fork Chinese food sauce local coffee ingredients dish food carrots chef heating.", "Romantic cafe bar artisan. Bon appetit pie chick peas appliances fruit seafood local apples funghi. Desert a la carte spice oranges beets lobster beverages seafood paprika pepper wholesome.", "Java authentic soda tasty sausage carrots ginger pasta heating farm. Lobster blender salt lunch drink chopsticks broth funghi Chinese food olive oil cupcake farm sushi.", "Recommendations taste cookie customer bacon dish heating starter eat better. Take away aroma sweet indie foods cream baking.", "Soda chopsticks cuisine blender sausage foodtruck groceries al dente. Fish organic spinach banquet ingredients. Wine fork restaurants local deep frying oranges. Biological conserve sausage cupcake food baking artisan ginger.", "Etiquette organic hummus recommendations. Cuisine sous-chef spice. Apples taste delicious wholesome tasty fish rice chef. Kitchen sour starter. Meat oranges fruit chick peas salami cafe carrots vegetables mustard restaurant indie foods vegetarian farm bacon. Cookie grape blend paprika. Cuisine organic olive oil broil relish beverages. Poultry delicious vegan customer java starter. Main course whipped cream eat better lasagna organic etiquette customer.", "Biological bacon lobster olive oil first class peas. Herbes custard farm breakfast dinner peas lobster steam chick peas first class fridge a la carte main course. Chef oranges desert beverages yummy luncheon restaurant.", "Pasta first class breakfast luncheon cafe eat better quinoa cuisine ingredients scent fork biological a la carte. Meals beets pots and pans a la carte bread bon appetit. Meat vegetables food desert sushi delicious sour foodtruck quinoa main course indian marinate scent.", "Luncheon Chinese food lobster. Steam chocolate eggs plate relish salt indie foods. Chinese food chick peas groceries. Liquor a la carte carbs custard blend Chinese food seafood.", "Al dente main course wholesome baking sushi sweet salt chef artisan caramelize liquor pizza sous-chef vegetarian. Pub scent banquet. Bacon pub pizza dish fork. Beer lovely dish oranges vegetables coffee relish aroma.", "Drink biological food mineral water take away fruit pie cream beverages aroma. Barbeque restaurant cupcake foodtruck breakfast protein paprika healthy. Cream grocery shopping fork beverages sustainable eat better biological coffee fruit.", "Cookie plate chef poultry. A la carte butter dish bacon lasagna appliances banquet. Chinese food artisan bon appetit butter.", "Eat better fruit spice sustainable chocolate. Protein wine liquor sweet breakfast poultry cook aroma local indie foods. Butter sauce carbs restaurants funghi Chinese food cafe caramelize chef lasagna healthy.", "Dish taste protein starter sauce grocery shopping lasagna mineral water broil conserve breakfast restaurant sausage pub. Pizza bacon delicious wholesome. Indian conserve bartender. Lasagna scent recommendations artisan tasty marinate eggs fish sustainable.", "Peas appliances savory oven broil tasty bon appetit breakfast flavor lasagna steam indie foods. Fruit liquor artisan oven vegan drink chocolate eat better sweet indie foods gastronome seafood al dente.", "Fish oranges main course taste delivery olive oil lunch caramelize apples dinner pots and pans pie Chinese food cheese. Spice conserve broil cuisine desert. Broil vegetarian oven banquet salt rice bon appetit dish.", "Salt savory desert plate scent organic barbeque. Salami barbeque baking. Funghi foodtruck sauce tea cupcake scent herbes luncheon pasta beverages whipped cream al dente. Eggs main course carbs beer tasty.", "Apples fish hummus starter bacon customer ginger savory peas. Delicious soda oranges aroma sausage starter sweet hummus lobster plate. Heating sous-chef butter starter ingredients restaurants pizza conserve mineral water scent baking a la carte. Sausage a la carte olive oil ingredients delicious oven carrots chick peas.", "Yummy deep frying pasta ginger biological quinoa relish cheese healthy luncheon sushi plate herbes restaurants. Rice gluten free aroma. Blender farm tea ginger. Banquet restaurants sweet. Indie foods local chopsticks heating hummus soda sous-chef.", "I love brownie donut I love sugar plum. Sweet lemon drops fruitcake marshmallow apple pie donut chocolate cake jelly beans.", "Pie dragée chocolate chocolate halvah gummi bears. Gummies ice cream candy canes I love I love carrot cake liquorice gummies.", "Ice cream danish ice cream brownie. Candy canes pie I love tart toffee carrot cake jujubes fruitcake sweet.", "Jelly-o cheesecake I love. I love fruitcake brownie caramels gingerbread cotton candy sweet. Chupa chups muffin cookie.", "Bear claw wafer cake. Pie oat cake icing cheesecake carrot cake powder fruitcake oat cake. Marzipan cake dragée I love candy canes. Oat cake marzipan ice cream sugar plum. Chocolate cake oat cake lemon drops caramels I love.", "Lollipop cupcake liquorice oat cake. Bear claw apple pie jelly. I love gingerbread soufflé tootsie roll jelly-o I love chupa chups.", "Gummi bears candy pie marzipan tiramisu caramels apple pie. Powder croissant chocolate jelly-o topping marzipan lemon drops sweet.", "Marshmallow macaroon topping cookie. Tart muffin ice cream cookie cake sugar plum tart sesame snaps chupa chups. Powder tiramisu gummies jujubes muffin ice cream chocolate liquorice fruitcake.", "Dragée pastry I love donut cookie gummi bears. Pastry cupcake jelly cake pie jelly-o ice cream.", "Cookie pie jelly beans marshmallow tootsie roll chocolate carrot cake. Danish I love soufflé. Brownie carrot cake jelly beans ice cream tiramisu caramels I love.", "Jelly macaroon icing I love chupa chups. I love jelly-o sweet roll I love. Lemon drops I love candy canes cheesecake soufflé cheesecake. Danish dessert sesame snaps. Cake dessert carrot cake.", "Cotton candy bonbon ice cream jelly beans tart candy canes. Liquorice carrot cake marshmallow tootsie roll donut chocolate chocolate tootsie roll pastry.", "Halvah candy canes lemon drops oat cake. Soufflé marshmallow dessert gummi bears chocolate cake caramels.", "Lollipop ice cream chocolate tiramisu. Biscuit jujubes jujubes tiramisu lemon drops jelly cotton candy brownie gummies. Jelly beans cupcake croissant icing bonbon gummi bears lemon drops.", "Cake I love tart brownie apple pie jelly pastry tootsie roll I love. Wafer dragée candy. Liquorice I love cake halvah tart toffee candy canes gingerbread. Marshmallow pudding topping apple pie sugar plum cake dessert marzipan.", "Trade manufacture showcase luxurious. Inspiration inexpensive wardrobe shade waistline bodice couture young jacket bold mode glitter quantity. Make up radical apparel minimalist retailer replicate.", "Sewing original tones. Conservative stylish one-of-a-kind artistic cut casual inspiration vintage mainstream shade showcase value. Proportion pattern jewelry apron creative celebrities casual imprint cut. Mode petticoat vintage.", "Hippie artificial xs trade runway contemporary. Shape bargain unique consumer expensive vintage posture garment tones swag contemporary motif bold jeans. Apparel showcase photography cheap one-of-a-kind radical pumps proportion buttons bold.", "Allure vintage beautiful luxurious color buttons clothing textile inexpensive original ready-made vogue artistic braiding.", "Jacket contemporary swim-wear xs extraordinary buttons industry radical combination model. Original swim-wear breathable motif artistic. Item cut imprint craftmanship tones modification original easy sari instagram. Young pret-a-porter glossy retailer independant minimalist pumps photography phenomenon shape allure edge.", "Sari cheap availability proportion vogue trade minimalist inexpensive taste. Fashion urban necessity attractive glossy tones.", "Stock commercial trade hippie jersey cheap instagram xs pattern quantity bows replicate casual textile. Availability popular bargain apparel stock clothes.", "Classic artistic prediction embroidery leotard apron phenomenon motif availability condition tones. Expensive ribbon old-fashioned. Look quantity pastel jersey sari wardrobe ready-made.", "Haute-couture sleeveless commercial bodice buttons collection contemporary one-of-a-kind conformity prediction breathable.", "Combination piece comfortable artistry catwalk conformity vintage apron apparel phenomenon. Innovation contemporary shawl artistry mannequin xl. Couture ensemble expensive trade trend quantity effect valuable apron item hand-made minimalist young innovation.", "Imagination celebrities halter expensive item outlet. Impeccable conservative skirt couture. Easy identity collection outlet adjustment comfortable brand classic Haute-couture jewelry.", "Wardrobe taste xs creative petticoat tones shade. Taste contemporary photography. Pattern ensemble runway quality catwalk comfortable motif purse casual one-of-a-kind trend couture mode modern. Ready-made braiding swag stock adjustment brand.", "Influence affection Haute-couture quality. Breathable celebrities cut price taste limited replicate catwalk model artistry look. Creative attractive vogue imprint popular sleeveless independent instagram hippie tones piece textile."]
}
let themes = ["primary", "success", "info", "warning", "danger", "purple", "pink", "orange"];

const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

const registerFakeUsers = (gender, email) => {
    let firstName = "";
    if (gender === 'f') {
        firstName = femaleNames[getRandom(0, femaleNames.length - 1)];
    } else {
        firstName = maleNames[getRandom(0, maleNames.length - 1)];
    }
    let lastName = familyNames[getRandom(0, familyNames.length - 1)];

    return new Promise((resolve, reject) => {
        let user = new User();
        user.name = firstName + " " + lastName;
        user.email = email;
        user.profileImage = email;
        user.setPassword("f");

        createFakePosts(user, getRandom(8, 16));

        user.save().then((users) => {
            resolve(users);
        }).catch((err) => {
            reject("Something went Wrong.");
            return res.json({ error: err });
        })
    })
}

const makeFriends = (users) => {
    return new Promise((resolve) => {
        const loopThroughUsers = (users) => {
            const addEachOther = (user1, user2) => {
                const addFriend = (user1, user2) => {
                    return new Promise((resolve, reject) => {
                        User.findByIdAndUpdate(user1, {
                            $push: {
                                friends: user2
                            }
                        }, { useFindAndModify: false }, (err) => {
                            if (err) {
                                reject(err);
                                return res.json({ error: err });
                            }
                            resolve();
                        });
                    });
                }

                return new Promise((resolve) => {
                    let promise1 = addFriend(user1, user2);
                    let promise2 = addFriend(user2, user1);

                    Promise.all([promise1, promise2]).then(() => {
                        resolve("Resolved");
                    });
                });
            }
            return new Promise((resolve) => {
                if (users.length === 0) {
                    resolve();
                }
                let recursivePromises = loopThroughUsers(users.slice(1));
                let promises = [];
                for (let i = 1; i < users.length; i++) {
                    if (getRandom(0, 100) > 50) {
                        let promise = addEachOther(users[0]._id, users[i]._id);
                        promises.push(promise);
                    }
                }
                Promise.all([recursivePromises, ...promises]).then((val) => {
                    resolve(val);
                }).catch((err) => {
                    console.log(err);
                });
            });
        }

        loopThroughUsers(users).then(() => {
            resolve("Resolved");
        });
    });
}

const createFakeUsers = (req, res) => {
    const create70Users = () => {
        let promises = [];
        const create35Users = (gender) => {
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

        return new Promise((resolve) => {
            Promise.all(promises).then((val) => {
                resolve(val);
            });
        });
    }

    const deleteAllUsers = new Promise((resolve, reject) => {
        User.deleteMany({}, (err, info) => {
            if (err) {
                reject(err);
                return res.send({ error: err });
            }
            resolve(info);
        });
    });

    deleteAllUsers.then(() => {
        create70Users().then((users) => {
            makeFriends(users).then(() => {
                res.statusJson(201, { message: "Successfully Created Fake Users." });
            })
        });
    })
}

const createFakePosts = (user, amountOfPosts) => {
    const generateContent = () => {
        let index;
        let content;
        if (getRandom(0, 100) > 50) {
            index = getRandom(0, fakePosts.hardcodedPosts.length - 1);
            content = fakePosts.hardcodedPosts[index];
        } else {
            index = getRandom(0, fakePosts.loremIpsum.length - 1);
            content = fakePosts.loremIpsum[index];
        }
        return content;
    }
    const minutesAgo = (n) => {
        let date = new Date();
        date.setMinutes(date.getMinutes() - n);
        return date;
    }

    for (let i = 0; i < amountOfPosts; i++) {
        let post = new Post();

        post.date = minutesAgo(getRandom(1, 2500));
        post.content = generateContent();
        post.theme = themes[getRandom(0, themes.length - 1)];

        user.posts.push(post);
    }
}

module.exports = {
    createFakeUsers
}


