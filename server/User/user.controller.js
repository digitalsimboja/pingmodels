const jwt = require('jsonwebtoken');
const db = require("../_helpers/db");
const secretAccessToken = process.env.ACCESSTOKENSECRET;
const secretRefreshToken = process.env.REFRESHTOKENSECRET
const User = require('./user.model');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const Account = require('../Account/account.model');


generateToken = user => {
    return jwt.sign({

        iss: "digitalsimboja",
        sub: user._id,
        username: user.username,
        role: user.role,
        iat: new Date().getTime(),
        expiresIn: '10m'
    }, secretAccessToken);

};

generateRefreshToken = user => {
    return jwt.sign({
        algorithm: 'RS256',
        iss: "digitalsimboja",
        sub: user._id,
        username: user.username,
        iat: new Date().getTime(),
        expiresIn: '7d'

    }, secretRefreshToken);
};

VerifyRefreshToken = async (refreshToken) => {

    //verify refresh token 
    payload = jwt.verify(refreshToken, secretRefreshToken, { algorithm: ['RS256'] });

    //check if refresh token is still in our database----------

    const user = await db.User.findOne({ "local.refreshToken": refreshToken });


    if (user == null) {
        throw Error("Invalid Token Access")
    } else {

        //return Validrefreshtokenuser;
        const accessToken = generateToken(user);

        const refreshToken = generateRefreshToken(user);

        //replace the old refresh token in the database with the newly created refresh token

        const userId = user._id;
        //store user refresh token
        const update = { 'local.refreshToken': refreshToken };
        const lastLogin = { 'lastLogin': new Date() };

        await User.findByIdAndUpdate(userId, lastLogin, { new: true });
        const result = await User.findByIdAndUpdate(userId, update, { new: true });


        return ({ accessToken, refreshToken });


    }

}

module.exports = {

    CreateUser: async (req, res, next) => {
        const {
            username,
            firstName,
            lastName,
            password,
            confirmPassword,
            email,
            phoneNumber,
            acceptTerms
        } = req.value.body;


        //check few credentials of the user to see if they already exist on the database
        const foundUserEmail = await db.User.findOne({ "local.email": email });
        const foundUserName = await db.User.findOne({ "local.username": username });
        const foundUserPhone = await db.User.findOne({ "local.phoneNumber": phoneNumber });

        if (foundUserEmail != null) {
            return res.status(400).json('Email already exists')
        }
        if (foundUserName != null) {
            return res.status(400).json('Username already exists')
        }
        if (foundUserPhone != null) {
            return res.status(400).json('Phone number already exists')
        }

        const newUser = new User({
            method: 'local',
            local: {
                username: username,
                firstName: firstName,
                lastName: lastName,
                password: password,
                confirmPassword: confirmPassword,
                email: email,
                phoneNumber: phoneNumber,
                acceptTerms: acceptTerms,

            }

        });

        //give the user a token
        const accessToken = generateToken(newUser);
        const refreshToken = generateRefreshToken(newUser)

        ////assign initial amount of money made and token  and role to user here
        newUser.local.role = 'User';
        newUser.local.refreshToken = refreshToken;
        newUser.avatar = 'https://randomuser.me/api/portraits/women/68.jpg';
        newUser.bio = 'I am a super elegant model. I am available ';
        newUser.subscribed = false;
        newUser.member = false;

        //proceed to save the new instatiated user
        await newUser.save();

        //respond with the token

        res.status(200).json({ 'accessToken': accessToken, 'refreshToken': refreshToken });



    },
    //do user login logic here by generating a new token using the token created during signup
    //check if the user has existing token when he submits his username and password  
    localAuth: async (req, res, next) => {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const accessToken = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        //store user refresh token
        const update = { 'local.refreshToken': refreshToken };
        const lastLogin = { 'lastLogin': new Date() };

        const username = user.local.username;
        await User.findByIdAndUpdate(userId, lastLogin, { new: true });
        await User.findByIdAndUpdate(userId, update, { new: true });

        res.status(200).json({ 'accessToken': accessToken, 'refreshToken': refreshToken, "username": username });


    },

    logout: async (req, res, next) => {
        res.status(200).json({ message: true })
    },

    Refresh_Token: async (req, res, next) => {

        if (req.body.refreshToken !== null) {
            token = req.body.refreshToken
        } else {
            res.status(400).json(" Refresh Token is Empty ");
        }

        await VerifyRefreshToken(token)
            .then(Response => {
                /// res.cookie('refreshtoken', Response.RefreshToken, { httpOnly: true, path: '/`refresh_token`' });
                res.status(200).json(Response)
            })
            .catch(err => next(err))



    },


    googleOAuth: async (req, res, next) => {

        const token = generateToken(req.user)
        res.status(200).json(token)
    },

    facebookOAuth: async (req, res, next) => {

        const token = generateToken(req.user)
        res.status(200).json(token)
    },

    getUsers: async (req, res, next) => {
        const users = await db.User.find({});

        res.status(200).json(users);

    },



    getUserProfile: async (req, res, next) => {

        const userId = req.user._id;

        const user = await db.User.findById(userId);
        if (!user) {
            return res.status(400).json('user does not exist');
        }
        res.status(200).json(user);
    

    },

    getUserById: async (req, res, next) => {
        const { userId } = req.value.params;
        const user = await db.User.findById(userId);

        if (!user) {
            return res.status(400).json('User does not exist, confirm the user Id')
        }
        console.log('user', user)

        res.status(200).json(user);

    },

    replaceUser: async (req, res, next) => {
        const { userId } = req.value.params;
        const newUser = req.value.body;
        //check if the user requesting id matches the id on the database

        const result = await db.User.findByIdAndUpdate(userId, newUser);
        res.status(200).json({ success: true });

    },

    updateProfilePicture: async (req, res, next) => {
        // check file for Validation Error

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {

            return res.status(500).send({ message: 'Upload fail' });
        } else {
            // if no Validation Error

            let width = 100;
            let height = 100;
            sharp(req.file.path).resize(width, height).toFile('public/uploads/' + req.file.filename)
            const userAavatar = 'http://localhost:3000/uploads/' + req.file.filename;
            //get the body

            //get the user
            const userId = req.user._id;

            const user = await db.User.findById(userId);

            if (!user) {
                return res.status(402).json('user not found');
            }
            user.avatar = userAavatar;
            await user.save();

            res.status(200).json({ message: 'Successfully updated' });


        }


    },
    updateProfile: async (req, res, next) => {
        var userData = req.body;
        var userId = req.user._id;

        
        var newEmail = userData.email;
        var newBio = userData.bio;
        var newPhone = userData.phoneNumber;

        var user = await db.User.findById(userId);
       var userPhone = user.local.phoneNumber
        var userEmail = user.local.email
        //check few credentials of the user to see if they already exist on the database
        var foundUserEmail = await db.User.findOne({ "local.email": newEmail });
        var foundUserPhone = await db.User.findOne({ "local.phoneNumber": newPhone });

       
        if (foundUserEmail !=null && userEmail !== foundUserEmail.local.email) {
            return res.status(400).json('Email already exists')
        }
       
        if (foundUserPhone !=null &&  userPhone !== foundUserPhone.local.phoneNumber) {
            return res.status(400).json('Phone number already exists')
        }
        if(newEmail == '' || newEmail == null){
            newEmail = userEmail ;
        }
        if(newPhone == ''|| newPhone == null ){
            newPhone  =  userPhone ;
        }

        if(newBio == '' || newBio == null ){
            newBio = user.bio ;
        }
        user.local.email = newEmail;
        user.local.phoneNumber = newPhone;
        user.bio = newBio;
        
        await user.save();
        console.log('User data', user)

        res.status(200).json({
            message: 'Updated successfully'
        })

    },

   

    deleteUser: async (req, res, next) => {

        const { userId } = req.value.params;
        const result = await User.findOneAndDelete(userId)
        res.status(200).json({ success: true })

    },

    getUserPublicPhotosById: async (req, res, next) => {

        const { userId } = req.value.params;
        const result = await User.findById(userId).populate('user_publicPhotos');
        console.log('result', result.user_publicPhotos)
        res.status(200).json(result.user_publicPhotos);

    },

    getUserPrivatePhotosById: async (req, res, next) => {

        const { userId } = req.value.params;
        const result = await User.findById(userId).populate('user_privatePhotos');
        console.log('result', result.user_privatePhotos)
        res.status(200).json(result.user_privatePhotos);

    },

    getUserPublicVideosById: async (req, res, next) => {

        const { userId } = req.value.params;
        const result = await User.findById(userId).populate('user_publicVideos');
        console.log('result', result.user_publicVideos)
        res.status(200).json(result.user_publicVideos);

    },

    getUserPrivateVideosById: async (req, res, next) => {

        const { userId } = req.value.params;
        const result = await User.findById(userId).populate('user_privateVideos');
        console.log('result', result.user_privateVideos)
        res.status(200).json(result.user_privateVideos);

    },


}