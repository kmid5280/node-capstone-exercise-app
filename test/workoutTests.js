'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;
const {User} = require('../users/models')
const {WorkoutPost} = require('../models');
const {app, runServer, closeServer} = require('../server')
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedUserData() {
    const data = generateUser();
    return User.create(data)
}

function seedWorkoutPostData(user) {
    console.info('seeding post data');
    const seedData = [];
    seedData.push(generateWorkoutPostData(user));
    return WorkoutPost.insertMany(seedData);
}

function generateUserName() {
    const username = ['user654321', 'testuser12', 'usertest23']
    return username[Math.floor(Math.random() * username.length)]
}

function generatePassword() {
    const password = ['user654321', 'testuser12', 'usertest23']
    return 'password12';
    //return password[Math.floor(Math.random() * password.length)]
}

function generateWorkoutType() {
    const workoutType = ['Upper body/arms', 'Lower body/legs', 'Cardiovascular']
    return workoutType[Math.floor(Math.random() * workoutType.length)]
}

function generateLengthOfTime() {
    const lengthOfTime = [60, 30, 15]
    return lengthOfTime[Math.floor(Math.random() * lengthOfTime.length)]
}

function generateWorkoutPostData(user) {
    return {
        user: user._id,        
        workoutType: generateWorkoutType(),
        lengthOfTime: generateLengthOfTime()
    }
}

function generateUser() {
    return {
        username: generateUserName(),
        password: generatePassword()
    }
}

function tearDownDb() {
    console.warn('deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Workout post module', function() {
    let user;
    let token;

    before(function() {
        console.log(TEST_DATABASE_URL)
        return runServer(TEST_DATABASE_URL);
    })

    beforeEach(function() {
        return seedUserData()
        .then(_user => {
            user = _user;
            return seedWorkoutPostData(user)
        })
        .then(function() {
            return chai.request(app)
            .post('/auth/login')
            .send({username: user.username, password: 'password12'})
            .then(function(res) {
                token = res.authToken;
                return;
            })
        })
        
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
            .get('/workouts')
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
            .get('/workouts')
            .set('Authorization', 'Bearer ' + token)
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                res.body.forEach(function(post) {
                    expect(post).to.be.a('object');
                    expect(post).to.include.keys(
                        'workoutType', 'lengthOfTime');
                })
                resWorkoutPost = res.body[0];
                return WorkoutPost.findById(res.WorkoutPost._id)
            })
            .then(function(post) {
                expect(resWorkoutPost._id).to.equal(post.id);
                expect(resWorkoutPost.workoutType).to.equal(post.workoutType);
                expect(resWorkoutPost.lengthOfTime).to.equal(post.lengthOfTime)
            })
    })

    it('should add a new post', function() {
        const newWorkoutPost = generateWorkoutPostData(user);
        return chai.request(app)
            .post('/workouts')
            .set('Authorization', 'Bearer ' + token)
            .send(newWorkoutPost)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys(
                    'workoutType', 'lengthOfTime');
                expect(res.body.workoutType).to.equal(newWorkoutPost.workoutType);
                expect(res.body.lengthOfTime).to.equal(newWorkoutPost.lengthOfTime)
                return WorkoutPost.findById(res.body.id)  
                
            })
            .then(function(post) {
                expect(post.workoutType).to.equal(newWorkoutPost.workoutType)
                expect(post.lengthOfTime).to.equal(newWorkoutPost.lengthOfTime)
            })
    })
    it('should update fields you send over', function() {
        const updateData = {
            workoutType: 'new updated workout type',
            lengthOfTime: 'new updated length of time'
        }
        return WorkoutPost
            .findOne()
            .then(function(post) {
                updateData.id = post.id;
                return chai.request(app)
                    .put(`/workouts/${post.id}`)
                    .set('Authorization', 'Bearer ' + token)
                    .send(updateData)
            })
            .then(function(res) {
                expect(res).to.have.status(200);
                return WorkoutPost.findById(updateData.id)
            })
            .then(function(post) {
                expect(post.workoutType).to.equal(updateData.workoutType);
                expect(post.lengthOfTime).to.equal(updateData.lengthOfTime)
            })
    })
    it('should delete posts you send over', function() {
    let post;

      return WorkoutPost
        .findOne()
        .then(_post => {
          post = _post;
          return chai.request(app).delete(`/workouts/${post.id}`)
          .set('Authorization', 'Bearer ' + token);
        })
        .then(res => {
          res.should.have.status(204);
          return BlogPost.findById(post.id);
        })
        .then(_post => {
          should.not.exist(_post);
        });
    });
});
