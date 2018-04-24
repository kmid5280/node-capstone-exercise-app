const mongoose = require('mongoose')
mongoose.Promise = global.Promise;

function StorageException(message) {
   this.message = message;
   this.name = "StorageException";
}



const workoutPostSchema = mongoose.Schema({
  workoutType: {type: String, required: true},
  lengthOfTime: {type: Number, required: true},
  details: {type: String, required: false},
  created: {type: Date, required: false},
  user: {type: mongoose.Schema.Types.ObjectId, req: 'User', required: true}
})

workoutPostSchema.methods.serialize = function() {
  return {
    id: this._id,
    workoutType: this.workoutType,
    lengthOfTime: this.lengthOfTime,
    details: this.details,
    created: this.created,
    user: this.user
  }
}

const WorkoutPost = mongoose.model('WorkoutPost', workoutPostSchema)

module.exports = {WorkoutPost}