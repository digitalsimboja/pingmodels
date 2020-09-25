const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const privatePhotoSchema = new Schema({

  
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

const privatePhoto = mongoose.model('privatePhoto', privatePhotoSchema);

module.exports = privatePhoto;