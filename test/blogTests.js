'user strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;
const {WorkoutPost} = require('../models');
const {app, runServer, closeServer} = require('../server')
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedBlogPostData() {
    console.info('seeding post data');
    const seedData = [];
    seedData.push(generateWorkoutPostData());
    return WorkoutPost.insertMany(seedData);
}

function generateWorkoutType() {
    const workoutType = ['Bicycling', 'Weights, Upper Body', 'Weights, Legs']
    return workoutType[Math.floor(Math.random() * workoutType.length)]
}

function generateLengthOfTime() {
    const lengthOfTime = ['30 minutes', '15 minutes', '0 minutes']
    return lengthOfTime[Math.floor(Math.random() * lengthOfTime.length)]
}

function generatePostData() {
    return {
        Workout_Type = generateWorkoutType(),
        Length_of_Time = generateLengthOfTime()
    }
}

function tearDownDb() {
    console.warn('deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Workout post module', function() {
    before(function() {
        console.log(TEST_DATABASE_URL)
        return runServer(TEST_DATABASE_URL);
    })

    beforeEach(function() {
        return seedBlogPostData();
    })

    afterEach(function() {
        return tearDownDb();
    })

    after(function() {
        return closeServer();
    })
    it('should return all workout posts', function() {
        let res;
        return chai.request(app)
            .get('/workout-posts')
            .then(function(_res){
                res = _res;
                expect(res).to.have.status(200);
                expect(res.body).to.have.lengthOf.at.least(1);
                return WorkoutPost.count()
            })
            .then(function(count) {
                expect(res.body).to.have.lengthOf(count);
            })
    })

    it('should return workout posts with right fields', function() {
        let resWorkoutPost;
        return chai.request(app)
            .get('/workoutposts')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                res.body.forEach(function(post) {
                    expect(post).to.be.a('object');
                    expect(post).to.include.keys(
                        'Workout_Type', 'Length_of_Time');
                })
                resWorkoutPost = res.body[0];
                return WorkoutPost.findById(resWorkoutPost._id)
            })
            .then(function(post) {
                expect(resWorkoutPost._id).to.equal(post.id);
                expect(resWorkoutPost.Workout_Type).to.equal(post.Workout_Type);
                expect(resWorkoutPost.lengthOfTime).to.equal(post.lengthOfTime)
            })
    })

    it('should add a new post', function() {
        const newWorkoutPost = generateWorkoutPostData();
        return chai.request(app)
            .post('/workoutposts')
            .send(newWorkoutPost)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys(
                    'Workout_Type', 'Length_of_Time');
                expect(res.body.Workout_Type).to.equal(newWorkoutPost.Workout_Type);
                expect(res.body.Length_of_Time).to.equal(newWorkoutPost.lengthOfTime)
                return WorkoutPost.findById(res.body.id)  
                
            })
            .then(function(post) {
                expect(post.Workout_Type).to.equal(newWorkoutPost.Workout_Type)
                expect(post.Length_of_Time).to.equal(newWorkoutPost.lengthOfTime)
            })
    })
    it('should update fields you send over', function() {
        const updateData = {
            Workout_Type: 'new updated workout type',
            Length_of_Time: 'new updated length of time'
        }
        return WorkoutPost
            .findOne()
            .then(function(post) {
                updateData.id = post.id;
                return chai.request(app)
                    .put(`/workoutposts/${post.id}`)
                    .send(updateData)
            })
            .then(function(res) {
                expect(res).to.have.status(200);
                return WorkoutPost.findById(updateData.id)
            })
            .then(function(post) {
                expect(post.Workout_Type).to.equal(updateData.Workout_Type);
                expect(post.lengthOfTime).to.equal(updateData.lengthOfTime)
            })
    })
    //need to add delete test
})