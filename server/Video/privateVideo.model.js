const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const privateVideoSchema = new Schema({

 
  videoUrl: String,
  videoTitle: String,
  videoDesc: String,
  videoControl: String,
  uploadedOn: { type: Date, default: Date.now },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
});

const privateVideo = mongoose.model('privateVideo', privateVideoSchema);

module.exports = privateVideo;