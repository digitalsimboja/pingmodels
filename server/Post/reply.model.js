const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  
    reply: {type: String},
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
  
  const Reply = mongoose.model('reply', ReplySchema);
  
  module.exports = Reply;