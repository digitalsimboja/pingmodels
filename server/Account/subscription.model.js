const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
  
  ref: {type: String},
  amount: {type: Number},
  dateCreated:{ type:String, required:true, default: Date()},
  updatedDate:Date,
  userId: {
      type: Schema.Types.ObjectId,
        ref: 'user'
  },
});

const Subscription = mongoose.model('subscription', SubscriptionSchema);

module.exports = Subscription;