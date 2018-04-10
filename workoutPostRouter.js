const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {WorkoutPost} = require('./models');
const passport = require('passport')
const jwtAuth = passport.authenticate('jwt', {session: false})

router.get('/', jwtAuth, (req, res) => {
    WorkoutPost
        .find().exec()
        .then(post => {
            res.json(post)
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({message: "server error"})
        })
})

router.post('/', jwtAuth, jsonParser, (req,res) => {
    const requiredFields = ['workoutType', 'lengthOfTime'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message)
            return res.status(400).send(message)
        }
    }
    WorkoutPost
        .create({
            workoutType: req.body.workoutType,
            lengthOfTime: req.body.lengthOfTime,
            details: req.body.details,
            created: req.body.created || Date.now(),
            user: req.user.id
        })
        .then(post => res.status(201).json(post.serialize()))
        .catch(err => {
            console.error(err)
            res.status(500).json({message: 'server error'})
        })
})

router.delete('/:id', jwtAuth, (req,res) => {
    WorkoutPost
    .findByIdAndRemove(req.params.id)
    .then(() => {
        res.status(200).json({message: "success"})
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: "Deletion error"})
    })
})

router.put('/:id', jwtAuth, jsonParser, (req,res) => {
    console.log('params', req.params)
    console.log('request body', req.body)
    if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        return res.status(400).json({
            error: "Request path id and request body id values must match"
        })
    }

    const updated = {};
    const updateableFields = ['workoutType', 'lengthOfTime', 'details']
    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    })

    WorkoutPost
        .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
        .then(updatedPost => res.status(200).json(updatedPost))
        .catch(err => res.status(500).json({message: "Update error"}))
})

module.exports = router;