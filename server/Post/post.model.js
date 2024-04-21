const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  

  comment: {type: String},
  postedBy: {type: String},
  timeStamp: Date,
  dateCreated:{ type:String, required:true, default: Date()},
  updated: Date,
  userId: {
      type: Schema.Types.ObjectId,
        ref: 'user'
  },
});

const Post = mongoose.model('post', PostSchema);

module.exports = Post;