const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {WorkoutPost} = require('./models');

router.get('/', (req, res) => {
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

router.post('/', jsonParser, (req,res) => {
    const requiredFields = ['Workout_Type', 'Length_of_Time'];
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
            Workout_Type: req.body.Workout_Type,
            Length_of_Time: req.body.Length_of_Time
        })
        .then(post => res.status(201).json(post.serialize()))
        .catch(err => {
            console.error(err)
            res.status(500).json({message: 'server error'})
        })
})

router.delete('/:id', (req,res) => {
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

router.put('/:id', jsonParser, (req,res) => {
    if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
            error: "Request path id and request body id values must match"
        })
    }

    const updated = {};
    const updateableFields = ['Workout_Type', 'Length_of_Time']
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