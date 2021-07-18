const mongoose = require('mongoose');
let uri = 'mongodb://localhost/A-Social-Media';

if (process.env.NODE_ENV === 'PRODUCTION') {
    uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.4dgb1.mongodb.net/A-Social-Media?retryWrites=true&w=majority`;
}

mongoose.connect(uri, { useNewUrlParser: true , useCreateIndex : true, useUnifiedTopology :true }).then(()=>{
        console.log("Mongoose Connected");
    }
).catch((err)=>{
    console.log(`Mongoose connection error: ${err}`);
});

const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close( () => {
        console.log(`Mongoose disconnected through ${msg}`);
        callback();
    });
};

process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});

process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown', () => {
        process.exit(0);
    });
});

require('./users');
require('./passport');
