const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  
  
  bankAccount: {type: Number},
  bankName: {type: String},
  bankAccountName: {type: String},
  Amount: {type: Number},
  dateCreated:{ type:String, required:true, default: Date()},
  updatedDate:Date,
  userId: {
      type: Schema.Types.ObjectId,
        ref: 'user'
  },
});

const Account = mongoose.model('account', AccountSchema);

module.exports = Account;