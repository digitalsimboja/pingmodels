const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  
  ref: {type: String},
  description: {type: String},
  amount: {type: Number},
  tokenBal: {type: Number},
  name: {type: String},
  pendingTransactions: [],
  dateCreated:{ type:String, required:true, default: Date()},
  valueDate:Date,
  userId: {
      type: Schema.Types.ObjectId,
        ref: 'user'
  },
});

const TokenAccount = mongoose.model('TokenAccount', TokenSchema);

module.exports = TokenAccount;