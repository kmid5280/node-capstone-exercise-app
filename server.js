require('dotenv').config();
const express = require('express');
const morgan = require('morgan')
const workoutPostRouter = require('./workoutPostRouter');
const app = express();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {PORT, DATABASE_URL} = require('./config');
const {WorkoutPost} = require('./models')
const passport = require('passport')


const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth')

mongoose.Promise = global.Promise;

app.use(morgan('common'));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
    if (req.method === 'OPTIONS') {
        return res.send(204)
    }
    next();
})

passport.use(localStrategy);
passport.use(jwtStrategy)
const jwtAuth = passport.authenticate('jwt', {session: false})

app.use(express.static('public'))
app.use('/workouts', workoutPostRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('*', function (req, res) {
    res.status(404).json({message: 'not found'})
})

let server;

function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                console.log(`Your app is listening on port ${port}`)
                resolve();
            })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                })
        })
    })
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            })
        })
    })
}

if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err))
}

module.exports = {app, runServer, closeServer};