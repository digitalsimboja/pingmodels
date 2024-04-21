const jwt = require('jsonwebtoken');
const db = require("../_helpers/db");
const secretAccessToken = process.env.ACCESSTOKENSECRET;
const secretRefreshToken = process.env.REFRESHTOKENSECRET

const fs = require('fs');
const path = require('path');
const Account = require('./account.model');
const Subscription = require('./subscription.model');
const Membership = require('./membership.model');
const axios = require("axios");
const format = require('date-fns/format');
const addDays = require('date-fns/addDays');
const parseISO = require('date-fns/parseISO')
const differenceInDays = require('date-fns/differenceInDays');



module.exports = {

    checkExipration: async (req, res, next) => {

    },




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

    initiateMemberPayment: async (req, res, next) => {
        const userId = req.user._id;
        const params = req.params;
        const ref = params.ref;
        const amount = params.amount;
        const creditAmount = parseInt(amount);

        //create new token
        const newMembership = {};
        newMembership.userId = userId;
        newMembership.ref = ref;
        newMembership.amount = creditAmount;
        newMembership.transactionStatus = "pending";
        const newMember = await new Membership(newMembership);

        await newMember.save();

        res.status(200).json({
            message: "successful"
        });
    },

    initiateSubscribePayment: async (req, res, next) => {
        const userId = req.user._id;
        const params = req.params;
        const ref = params.ref;
        const amount = params.amount;
        const creditAmount = parseInt(amount);

        //create new token
        const newSubscription = {};
        newSubscription.userId = userId;
        newSubscription.ref = ref;
        newSubscription.amount = creditAmount;
        newSubscription.transactionStatus = "pending";
        newSubscription.active = false;

        const newSubscribe = await new Subscription(newSubscription);

        await newSubscribe.save();

        res.status(200).json({
            message: "successful"
        });
    },

    payMembership: async (req, res, next) => {
        const userId = req.user._id;
        const params = req.params;
        const transaction_id = params.transaction_id;
        const ref = params.ref;
        //get the token using myRef
        const initMembership = await db.Membership.findOne({ ref: ref });

        if (!initMembership || null) {
            return res.status(500).json({
                message: null
            })
        }
        if (initMembership.transactionStatus === "Approved") {
            return res.status(400).json({
                message: "Transaction already approved with Ref: " + transaction_id
            });

        } else {

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
                        user.member = true;

                        initMembership.transactionStatus = status;
                        initMembership.Transactions.push(transaction_data);
                        initMembership.updatedDate = new Date();
                        initMembership.updatedDate = format(initMembership.updatedDate, 'MMMM dd, yyyy')

                        await initMembership.save();

                        user.user_memberships.push(initMembership);

                        await user.save();
                        

                        return res.status(200).json({
                            message: "Congratulations! Membership fee paid with Ref: " + transaction_id
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

                            initMembership.transactionStatus = newStatus;
                            initMembership.amount = amount;
                            initMembership.updatedDate = new Date();
                            initMembership.updatedDate = format(initMembership.updatedDate, 'MMMM dd, yyyy')
                            initMembership.Transactions.push(newResponse.data);
                            await initMembership.save();
                            user.user_memberships.push(initMembership);
                            await user.save();
                            return res.status(400).json({
                                message: "Your transaction with Ref: " + transaction_id + " is still " + newStatus
                            })


                        } if (newStatus === "Approved") {
                            const user = await db.findById(userId);

                            user.member = true;

                            initMembership.transactionStatus = newStatus;
                            initMembership.Transactions.push(newResponse.data);
                            initMembership.updatedDate = new Date();
                            initMembership.updatedDate = format(initMembership.updatedDate, 'MMMM dd, yyyy')

                            await initMembership.save();

                            user.user_memberships.push(initMembership);

                            await user.save();


                            return res.status(200).json({
                                message: "Membership payment successfull with Ref: " + transaction_id + "updated"
                            });


                        }

                    }


                }

            } catch (error) {
                console.log(error)

            }

        }



    },

    paySubscription: async (req, res, next) => {
        const userId = req.user._id;
        const params = req.params;
        const transaction_id = params.transaction_id;
        const ref = params.ref;
        //get the token using myRef

        const initSubscription = await db.Subscription.findOne({ ref: ref })


        if (!initSubscription || null) {
            return res.status(500).json({
                message: null
            })
        }


        if (initSubscription.transactionStatus === "Approved") {


            return res.status(400).json({
                message: "Transaction already approved with Ref: " + transaction_id
            });

        } else {

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
                        user.subscribed = true;
                        //assign the dates
                        var subDate = new Date();
                        var subExpDate = addDays(subDate, 30);
                        
                       const  newSubDate = format(subDate, 'MMMM dd, yyyy');
                       const newSubExpDate = format(subExpDate, 'MMMM dd, yyyy');

                        
                       
                        user.subscribedDate = newSubDate;
                        user.subscribeExpiringDate = newSubExpDate;
                     
                        initSubscription.transactionStatus = status;
                        initSubscription.Transactions.push(transaction_data);
                        initSubscription.updatedDate = new Date();
                        initSubscription.updatedDate = format(initSubscription.updatedDate, 'MMMM dd, yyyy')
                        initSubscription.active = true;
                        initSubscription.expired = false;
                        initSubscription.expiresIn = user.subscribeExpiringDate;

                        await initSubscription.save();

                        user.user_subscriptions.push(initSubscription);

                        await user.save();
                      


                        return res.status(200).json({
                            message: "Congratulations! You have now subscribed with Ref: " + transaction_id
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

                            initSubscription.transactionStatus = newStatus;
                            initSubscription.amount = amount;
                            initSubscription.updatedDate = new Date();
                            initSubscription.updatedDate = format(initSubscription.updatedDate, 'MMMM dd, yyyy')

                            initSubscription.Transactions.push(newResponse.data);
                            initSubscription.active = false;

                            await initSubscription.save();
                            user.user_subscriptions.push(initSubscription);
                            await user.save();
                            return res.status(400).json({
                                message: "Your transaction with Ref: " + transaction_id + " is still " + newStatus
                            })


                        } if (newStatus === "Approved") {
                            const user = await db.findById(userId);

                            user.subscribed = true;
                            user.subscribedDate = new Date();

                            user.subscribeExpiringDate = addDays(user.subscribedDate, 30)
                            user.subscribedDate = format(user.subscribedDate, 'MMMM dd, yyyy');
                            user.subscribeExpiringDate = format(user.subscribeExpiringDate, 'MMMM dd, yyyy');

                            //user.subscribeExpiringDate = user.subscribedDate.setDate(user.subscribedDate.getDate() + 30);

                            initSubscription.transactionStatus = status;
                            initSubscription.Transactions.push(transaction_data);
                            initSubscription.updatedDate = new Date();
                            initSubscription.updatedDate = format(initSubscription.updatedDate, 'MMMM dd, yyyy');
                            initSubscription.active = true;
                            initSubscription.expired = false;
                            initSubscription.expiresIn = user.subscribeExpiringDate;

                            await initSubscription.save();

                            user.user_subscriptions.push(initSubscription);

                            await user.save();

                            return res.status(200).json({
                                message: "Subscription  payment successfull with Ref: " + transaction_id + "updated"
                            });


                        }

                    }


                }

            } catch (error) {
                console.log(error)

            }

        }



    },

}