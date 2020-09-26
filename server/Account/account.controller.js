const jwt = require('jsonwebtoken');
const db = require("../_helpers/db");
const secretAccessToken = process.env.ACCESSTOKENSECRET;
const secretRefreshToken = process.env.REFRESHTOKENSECRET
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const Account = require('./account.model');
const Subscription = require('./subscription.model');
const Membership = require('./membership.model');


module.exports = {

    addBank: async (req, res, next) => {
        const newAccount = req.body;
        const userId = req.user._id;

        newAccount.userId = userId;

        const addBank = await new Account(newAccount);

        await addBank.save();
        const user = await db.User.findById(userId);

        await user.user_accounts.push(addBank);
        await user.save();

        res.status(200).json({
            message: 'Bank account successfully'
        })



    },

    subscribe: async (req, res, next) => {
        const userId = req.user._id;
        const user = await db.User.findById(userId);
        
       // const subscribed = user.subscribed;
              
        const paymentRef = req.body.ref;
        
        if(!paymentRef){
         
           return  res.status(404).json({
                message: 'Subscription failed'
            })

        }
        const newSub = req.body;
        newSub.userId = userId;
        
        const subAgain = await new Subscription(newSub);
        
        await subAgain.save();
        //set user subscription state to true
        user.subscribed = true;
        //push the subscription to sub list
        await user.user_subscriptions.push(subAgain);

        await user.save();

        res.status(200).json({
            message: 'Successfully subscribed'
        })
        

    },

    membership: async (req, res, next) => {
        const userId = req.user._id;
        const user = await db.User.findById(userId);
           
        const paymentRef = req.body.ref;
        
        if(!paymentRef){
        
           return  res.status(404).json({
                message: 'Membership payment failed'
            })

        }
        const newMember = req.body;
        newMember.userId = userId;
        
        const subMember = await new Membership(newMember);
        
        await subMember.save();
        //set user subscription state to true
        user.member = true;
        //push the subscription to sub list
        await user.user_memberships.push(subMember);

        await user.save();

        res.status(200).json({
            message: 'Successfully subscribed as a member'
        })
        

    },

}