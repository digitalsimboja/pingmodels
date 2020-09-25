const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MembershipSchema = new Schema({
  
  ref: {type: String},
  amount: {type: Number},
  dateCreated:{ type:String, required:true, default: Date()},
  updatedDate:Date,
  userId: {
      type: Schema.Types.ObjectId,
        ref: 'user'
  },
});

const Membership = mongoose.model('membership', MembershipSchema);

module.exports = Membership;