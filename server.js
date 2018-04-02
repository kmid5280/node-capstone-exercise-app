const express = require('express');
const morgan = require('morgan')
const workoutPostRouter = require('./workoutPostRouter');
const app = express();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {PORT, DATABASE_URL} = require('./config');
const {WorkoutPost} = require('./models')

app.use(morgan('common'));
app.use(express.static('public'))
app.use('/workouts', workoutPostRouter)
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

module.exports = {app. runServer, closeServer};