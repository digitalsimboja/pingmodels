const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const publicVideoSchema = new Schema({

 
  videoUrl: String,
  videoTitle: String,
  videoDesc: String,
  videoControl: String,
  uploadedOn: { type: Date, default: Date.now },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'post'
  }],
});

const publicVideo = mongoose.model('publicVideo', publicVideoSchema);

module.exports = publicVideo;