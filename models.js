const mongoose = require('mongoose')
mongoose.Promise = global.Promise;

// This module provides volatile storage, using a `BlogPost`
// model. We haven't learned about databases yet, so for now
// we're using in-memory storage. This means each time the app stops, our storage
// gets erased.

// Don't worry too much about how BlogPost is implemented.
// Our concern in this example is with how the API layer
// is implemented, and getting it to use an existing model.


function StorageException(message) {
   this.message = message;
   this.name = "StorageException";
}



const workoutPostSchema = mongoose.Schema({
  workoutType: {type: String, required: true},
  lengthOfTime: {type: Number, required: true},
  details: {type: String, required: false},
  created: {type: Date, required: false}
})

workoutPostSchema.methods.serialize = function() {
  return {
    id: this._id,
    workoutType: this.workoutType,
    lengthOfTime: this.lengthOfTime,
    details: this.details,
    created: this.created
  }
}

const WorkoutPost = mongoose.model('WorkoutPost', workoutPostSchema)

module.exports = {WorkoutPost}