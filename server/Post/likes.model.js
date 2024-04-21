const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikesSchema = new Schema({
  
    like: {type: Boolean},
    dateCreated:{ type:String, required:true, default: Date()},
    updated: Date,
    postId: {
        type: Schema.Types.ObjectId,
          ref: 'post'
    },

    userId: {
        type: Schema.Types.ObjectId,
          ref: 'user'
    },
  });
  
  const Like = mongoose.model('like', LikesSchema);
  
  module.exports = Like;