const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASEPATH, { useNewUrlParser:true, useCreateIndex:true ,useUnifiedTopology:true, useFindAndModify: false})
.then( con=>{console.log(" Connection Successful! You are now connected to the database  ");})
.catch( err=>{console.error(" Failed To Connect to db " + err);}); 
mongoose.Promise = global.Promise;  


module.exports = {
    User: require('../User/user.model'),
    Account: require('../Account/account.model'),
    publicPhoto :require('../Photo/publicPhoto.model'),
    privatePhoto :require('../Photo/privatePhoto.model'),
    publicVideo: require('../Video/publicVdeo.model'),
    privateVideo :require('../Video/privateVideo.model'),
    Subscription: require('../Account/subscription.model'),
    Membership: require('../Account/membership.model'),
    TokenAccount: require('../Token/token.model'),
    isValidId
};

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

