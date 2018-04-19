'user strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;
const {WorkoutPost} = require('../models');
const {app, runServer, closeServer} = require('../server')
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedWorkoutPostData() {
    console.info('seeding post data');
    const seedData = [];
    seedData.push(generateWorkoutPostData());
    return WorkoutPost.insertMany(seedData);
}

function generateWorkoutType() {
    const workoutType = ['Upper body/arms', 'Lower body/legs', 'Cardiovascular']
    return workoutType[Math.floor(Math.random() * workoutType.length)]
}

function generateLengthOfTime() {
    const lengthOfTime = [60, 30, 15]
    return lengthOfTime[Math.floor(Math.random() * lengthOfTime.length)]
}

function generatePostData() {
    return {
        workoutType = generateWorkoutType(),
        lengthOfTime = generateLengthOfTime(),
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
        const newWorkoutPost = generateWorkoutPostData();
        return chai.request(app)
            .post('/workouts')
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
          return chai.request(app).delete(`/workouts/${post.id}`);
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
