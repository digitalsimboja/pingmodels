const jwt = require('jsonwebtoken');
const db = require("../_helpers/db");
const mongoose = require('mongoose');

const secretAccessToken = process.env.ACCESSTOKENSECRET;
const secretRefreshToken = process.env.REFRESHTOKENSECRET
const User = require('../User/user.model');
const TokenAccount = require('./token.model');
const Account = require('../Account/account.model');
const https = require('https');
const axios = require("axios");
const format = require('date-fns/format');


function compare(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

async function addToken(amount, ref, userId) {
    //Get user
    const user = await db.User.findById(userId);
    const transaction_data = ref;


    const addNewToken = {};
    //get the old token balance


    addNewToken.amount = amount;
    addNewToken.ref = transaction_data.transaction_id;
    addNewToken.transactionStatus = transaction_data.status;
    addNewToken.userId = userId;
    addNewToken.description = 'Token purchase of N' + addNewToken.amount;
    addNewToken.valueDate = new Date();
    addNewToken.valueDate = format(addNewToken.valueDate, 'MMMM dd, yyyy');
    const newToken = new TokenAccount(addNewToken);
    //get each field

    newToken.Transactions.push(transaction_data);
    //SAVE without incrementing the user balance if awaitingand return, otherwise if approved
    if (newToken.transactionStatus === 'Awaiting Confirmation') {

        await newToken.save();
        user.user_tokens.push(newToken);
        await user.save();

        return { 'action': 'successful' }
    }
    if (newToken.transactionStatus === "Approved") {
        const oldTokenBal = user.tokenBal;
        const newTokenBal = newToken.amount + oldTokenBal;

        //update the user token balance 
        user.tokenBal = newTokenBal;
        await newToken.save();

        user.user_tokens.push(newToken);
        await user.save();

        return { 'action': 'successful' }

    }



}


async function transfer(from, to, amount) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const options = { session, new: true };

        const A = await User.findByIdAndUpdate({ _id: from }, { $inc: { tokenBal: -amount } }, options);
        if (A.tokenBal < 0) {
            // If A would have negative balance, fail and abort the transaction
            // `session.abortTransaction()` will undo the above `findOneAndUpdate()`
            const newAmt = A.tokenBal + amount;
            throw new Error('Insufficient funds: ' + newAmt);
        }

        const B = await User.findByIdAndUpdate({ _id: to }, { $inc: { tokenBal: +(amount * 0.6) } }, options);
        await session.commitTransaction();
        session.endSession();

        return { 'Token transfer successful': 'completed', from: A.local.username, to: B.local.username };


    } catch (error) {
        // If an error occurred, abort the whole transaction and
        // undo any changes that might have happened
        await session.abortTransaction();
        session.endSession();
        throw error; // Rethrow so calling function sees error
    }


}



module.exports = {

    getAllToken: async (req, res, next) => {
        const tokens = await db.TokenAccount.find({});
     

        res.status(200).json(tokens);
    },

    initiateTokenOrder: async (req, res, next) => {
        try{
            const userId = req.user._id;
        const params = req.params;
        const ref = params.ref;
        const amount = params.amount;
        const creditAmount = parseInt(amount);

        //create new token
        const newToken = {};
        newToken.userId = userId;
        newToken.ref = ref;
        newToken.amount = creditAmount;
        newToken.transactionStatus = "pending";
        const addToken = await new TokenAccount(newToken);

        await addToken.save();

    

        res.status(200).json({
            message: "successful"
        });

        }catch(error){
            console.log(error)
        }
        
    },

    validateTransaction: async (req, res, next) => {
        const userId = req.user._id;
        const params = req.params;
        const transaction_id = params.transaction_id;
        const ref = params.ref;
        //get the token using myRef
        const initToken = await db.TokenAccount.findOne({ ref: ref });
        if(initToken.transactionStatus === "Approved"){
            return res.status(400).json({
                message: "Transaction already approved with Ref: "+ transaction_id
            });

        }else{
            
        //use trxid to query voguepay
        const url = "https://voguepay.com/?v_transaction_id=" + transaction_id + "&type=json";
        try {
            const response = await axios.get(url);
            const transaction_data = response.data;
            const total = transaction_data.total;
            const amount = parseInt(total);
            //check if merchant_ref == ref
            const vpRef = transaction_data.merchant_ref;
            if (ref !== vpRef) {
                return res.status(400).json({
                    message: false
                });
            }

            if (ref === vpRef) {
                
                //check the transaction status
                const status = transaction_data.status;
                //if transaction is approved, increment the user token balance and change the token status to approved
                if (status === "Approved") {
                    const user = await db.User.findById(userId);
                    const oldTokenBal = user.tokenBal;
                    
                    const newTokenBal = oldTokenBal + amount;
                    user.tokenBal = newTokenBal;

                    initToken.transactionStatus = status;
                    initToken.Transactions.push(transaction_data);

                    await initToken.save();

                    user.user_tokens.push(initToken);

                    await user.save();

                    return res.status(200).json({
                        message: "Token purchased with Ref: " + transaction_id
                    });



                }
                if (status === "Awaiting Confirmation") {
                    //requery voguepay
                    const newResponse = await axios.get(url);
                    const newStatus = newResponse.data.status;
                    //thiis is not correct
                    if (newStatus === "Awaiting Confirmation") {
                        //do not update the user account
                        const user = await db.User.findById(userId);

                        initToken.transactionStatus = newStatus;
                        initToken.amount= amount;
                        initToken.Transactions.push(newResponse.data);
                        await initToken.save();
                        user.user_tokens.push(initToken);
                        await user.save();
                        return res.status(400).json({
                            message: "Your transaction with Ref: " + transaction_id + " is still " + newStatus
                        })


                    } if (newStatus === "Approved") {
                        const user = await db.findById(userId);
                        const oldTokenBal = user.tokenBal;
                        const newTokenBal = oldTokenBal + amount;
                        user.tokenBal = newTokenBal;

                        initToken.transactionStatus = newStatus;
                        initToken.Transactions.push(newResponse.data);
                        initToken.updated = new Date();
                        initToken.updated = format(initToken.updated,'MMMM dd, yyyy' )

                        await initToken.save();

                        user.user_tokens.push(initToken);

                        await user.save();

                        return res.status(200).json({
                            message: "Token purchased with Ref: " + transaction_id + "updated"
                        });


                    }

                }


            }

        } catch (error) {
            console.log(error)

        }

        }

        

    },

    transactionNotify: async (req, res, next) => {
        const transaction_id = req.body;
        var options = {
            hostn: 'voguepay.com',
            path: '/?v_transaction_id=' + transaction_id + '&type=json',
            method: 'GET'
        };

        const v_req = https.request(options, response => {
            console.log(`statusCode: ${response.statusCode}`)
            console.log('response from voguepay', response)

            response.on('data', d => {
                //update user wallet here if status is aproved
                //process.stdout.write(d)
                console.log('response from voguepay', d)
            })
        })

        v_req.on('error', error => {
            console.error(error)
        })

        v_req.end()

        console.log('i entered here', transaction_id)
    },


    getToken: async (req, res, next) => {
        const { userId } = req.value.params;
        const user = await User.findById(userId).populate('user_tokenBal');

        res.status(200).json(user.user_tokenBal);
    },


    payWithNaira: async (req, res, next) => {
        const { photoId } = req.value.params;
        const photo = await db.privatePhoto.findById(photoId);
        if (!photo) {
            return res.status(500).json({
                message: 'Photo does not exist'
            });
        }

        const owner = photo.userId;

        const reqUser = req.user._id;

        amount = photo.chargeNGN;
        const trxnDate = new Date();
        trxnDate = format(trxnDate, 'MMMM dd, yyyy');

        const desc = 'Token exchange of  N'+ amount + ' with ' + owner;
        const newTrnx = {
            'amount': amount,
            'description': desc,
            'from': reqUser,
            'to': owner,
            'date': trxnDate
        }

        if (compare(reqUser, owner) !== false) {

            return res.status(500).json({
                message: false
            });
        }

        const commission = amount;
        const result = await transfer(reqUser, owner, commission);
        if (result) {
            const newToken = new TokenAccount();
            newToken.Transactions.push(newTrnx);
            await newToken.save();

            res.status(200).json({
                success: true
            })

        }


    },

    payWithUSD: async (req, res, next) => {
        const { photoId } = req.value.params;
        const photo = await db.privatePhoto.findById(photoId);
        if (!photo) {
            return res.status(500).json({
                message: 'Photo does not exist'
            });
        }

        const owner = photo.userId;

        const reqUser = req.user._id;

        amount = photo.chargeUSD;
        const trxnDate = new Date();
        trxnDate = format(trxnDate, 'MMMM dd, yyyy');

        const desc = 'Token exchange of ' + amount + ' with ' + owner;
        const newTrnx = {
            'amount': amount,
            'description': desc,
            'from': reqUser,
            'to': owner,
            'date': trxnDate
        }

        if (compare(reqUser, owner) !== false) {

            return res.status(500).json({
                message: 'false'
            });
        }
        const commission = amount * 400;

        const result = await transfer(reqUser, owner, commission);
        if (result) {
            const newToken = new TokenAccount();
            newToken.Transactions.push(newTrnx);

            await newToken.save();


            res.status(200).json({
                success: true
            })

        }


    },

    payVideoWithNaira: async (req, res, next) => {
        const { videoId } = req.value.params;
        const video = await db.privateVideo.findById(videoId);
        if (!video) {
            return res.status(500).json({
                message: 'Video does not exist'
            });
        }

        const owner = video.userId;

        const reqUser = req.user._id;

        amount = video.chargeNGN;
        const trxnDate = new Date();
        trxnDate = format(trxnDate, 'MMMM dd, yyyy');

        const desc = 'Token exchange of ' + amount + ' with ' + owner;
        const newTrnx = {
            'amount': amount,
            'description': desc,
            'from': reqUser,
            'to': owner,
            'date': trxnDate
        }

        if (compare(reqUser, owner) !== false) {

            return res.status(500).json({
                message: 'false'
            });
        }

        const commission = amount;

        const result = await transfer(reqUser, owner, commission);

        if (result) {
            const newToken = new TokenAccount();
            newToken.Transactions.push(newTrnx);
            await newToken.save();

            res.status(200).json({
                success: true
            })

        }


    },

    payVideoWithUSD: async (req, res, next) => {
        const { videoId } = req.value.params;
        const video = await db.privateVideo.findById(videoId);
        if (!video) {
            return res.status(500).json({
                message: 'Video does not exist'
            });
        }

        const owner = video.userId;

        const reqUser = req.user._id;

        amount = video.chargeUSD;
        const trxnDate = new Date();
        trxnDate = format(trxnDate, 'MMMM dd, yyyy');

        const desc = 'Token exchange of ' + amount + ' with ' + owner;
        const newTrnx = {
            'amount': amount,
            'description': desc,
            'from': reqUser,
            'to': owner,
            'date': trxnDate
        }

        if (compare(reqUser, owner) !== false) {

            return res.status(500).json({
                message: 'false'
            });
        }

        const commission = amount * 400;
        const result = await transfer(reqUser, owner, commission);

        if (result) {
            const newToken = new TokenAccount();
            newToken.Transactions.push(newTrnx);

            await newToken.save();

            res.status(200).json({
                success: true
            })

        }

    },

}

