const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const publicPhotoSchema = new Schema({

  
  imageUrl: String,
  imageTitle: String,
  imageDesc: String,
  imageControl: String,
  uploadedOn: { type: Date, default: Date.now },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
});

const publicPhoto = mongoose.model('publicPhoto', publicPhotoSchema);

module.exports = publicPhoto;