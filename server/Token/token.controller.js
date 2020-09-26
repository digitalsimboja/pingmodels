const jwt = require('jsonwebtoken');
const db = require("../_helpers/db");
const secretAccessToken = process.env.ACCESSTOKENSECRET;
const secretRefreshToken = process.env.REFRESHTOKENSECRET
const User = require('../User/user.model');
const TokenAccount = require('./token.model');
const Account = require('../Account/account.model');




module.exports = {

getAllToken: async (req, res, next) => {
    const tokens = await db.TokenAccount.find({});
     
    res.status(200).json(tokens);
    },

getUserTokenBalance: async (req, res, next) => {
    const userId = req.user._id;
    const user = await db.TokenAccount.findById(userId).populate(' user_tokens');
    const userTokens = user.user_tokens;
    console.log('user tokens', user.user_tokens)
    res.status(200).json(userTokens);

    
},

addNewToken: async (req, res, next) => {
    const userId = req.user._id;
    
    //Get user
    const user = await db.User.findById(userId);

    const paymentRef = req.body.ref;
    if(!paymentRef){
        
        return  res.status(404).json({
             message: 'Token purchase failed'
         })

     }
    const subToken = req.body;
    
    subToken.userId = userId;
    const newToken = new TokenAccount(subToken);
    //get each field
    
    await newToken.save();

    user.user_tokens.push(newToken);
    user.save();
    console.log(newToken)
    res.status(200).json({
        message: 'Successfully purchased token'
    });

},

getToken: async (req, res, next) => {
    const { userId } = req.value.params;
    const user = await User.findById(userId).populate('user_tokenBal');
    
    res.status(200).json(user.user_tokenBal);
},
}