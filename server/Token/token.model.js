const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  
  ref: {type: String},
  amount: {type: Number},
  transactionStatus: {type: String},
  Transactions: [],
  dateCreated:{ type:String, required:true, default: Date()},
  updated:Date,
  userId: {
      type: Schema.Types.ObjectId,
        ref: 'user'
  },
});

const TokenAccount = mongoose.model('TokenAccount', TokenSchema);

module.exports = TokenAccount;