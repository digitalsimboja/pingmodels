const jwt = require('jsonwebtoken');
const db = require("../_helpers/db");
const mongoose = require('mongoose');
const User = require('../User/user.model');
const publicPhoto = require('../Photo/publicPhoto.model');
const privatePhoto = require('../Photo/privatePhoto.model');
const publicVideo = require('../Video/publicVdeo.model');
const privateVideo = require('../Video/privateVideo.model');
const secretAccessToken = process.env.ACCESSTOKENSECRET;
const secretRefreshToken = process.env.REFRESHTOKENSECRET;
const Sentiment = require('sentiment');
const Post = require('./post.model');
const Pusher = require('pusher');

const sentiment = new Sentiment();


function compare(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

module.exports = {

    getAllPost: async (req, res, next) => {
        const posts = await db.Post.find({});

        res.status(200).json(posts);
    },

    getUserComment: async (req, res, next) => {
        const {userId} =  req.value.params;
        const user = await db.User.findById(userId).populate("comments");
        const comments = user.comments;
       

        res.status(200).json(comments);
    },

    comment: async (req, res, next) => {
        const pusher = new Pusher({
            appId: "1099113",
            key: "be3b2836b1ef9d75e396",
            secret: "c3fbada4c7157afc212c",
            cluster: "mt1",
            useTLS: true
          });

         
          const reqUser = req.user._id;
          const { userId } = req.value.params;

          //find the user that comments
          const  userA = await db.User.findById(reqUser);
          const userB = await db.User.findById(userId);

          //create a post object
          const newComment = req.body;         
            newComment.userId = reqUser;
            newComment.timestamp = new Date();
            newComment.postedBy = userA.local.username;
            const newPost = new Post(newComment)
            userA.user_posts.push(newPost);
            userB.comments.push(newPost);

            await newPost.save();
            await userA.save();
            await userB.save();
     
        pusher.trigger("comments", "comment",newComment );
        res.status(200).json(newComment );
    },


    photoComment: async (req, res, next) => {

        const userId = req.user._id;

        //get the post the user is commenting on
        const { photoId } = req.value.params;

        //Get user
        const user = await db.User.findById(userId);

        //check if the user is subscribed and a registered member
        const userSub = user.subscribed;
        const userMember = user.member;
        //if not do not allow comment


        if (!userMember && !userSub) {

            return res.status(500).json({
                message: 'Sorry you can not post now. Become a member and subscribe'
            })

        }
        //get the user post 
        const newComment = req.body;

        //attach the userId to the person who posted

        newComment.userId = userId;
        newComment.timestamp = new Date();

        const newPost = new Post(newComment);
        //get each field



        //search the public or private photo collection using the id to store the comment against the photo
        const photoPublic = await db.publicPhoto.findById(photoId);
        if (photoPublic) {
            photoPublic.comments.push(newPost);
            await photoPublic.save();
        }

        const photoPrivate = await db.privatePhoto.findById(photoId);

        if (photoPrivate) {
            photoPrivate.comments.push(newPost);
            await photoPrivate.save()
        }

        user.user_posts.push(newPost);
        await user.save();

        const posted = await newPost.save();
        // const channel = 'comments_Photo_'+ photoId;

        pusher.trigger(chat, 'new_comment', newComment);
        res.status(200).json(newComment);


    },

    videoComment: async (req, res, next) => {

        const userId = req.user._id;

        //get the post the user is commenting on
        const { videoId } = req.value.params;

        //Get user
        const user = await db.User.findById(userId);




        //check if the user is subscribed and a registered member
        const userSub = user.subscribed;
        const userMember = user.member;

        //if not do not allow comment

        if (!userMember && !userSub) {

            return res.status(500).json({
                message: 'Sorry you can not post'
            })

        }
        //get the user post 

        var newComment = req.body;
        //attach the userId to the person who posted
        newComment.userId = userId;

        const newPost = new Post(newComment);
        //get each field


        //search the public or private photo collection using the id
        const publicVideo = await db.publicVideo.findById(videoId);
        if (publicVideo) {
            publicVideo.comments.push(newPost);
            await publicVideo.save();
        }

        const privateVideo = await db.privateVideo.findById(videoId);

        if (privateVideo) {

            privateVideo.comments.push(newPost);
            await privateVideo.save()
        }
        //add the comments appropriately

        user.user_posts.push(newPost);
        await user.save();

        const posted = await newPost.save();
        const channel = 'private-' + 'comments_Video_' + videoId;

        pusher.trigger(channel, 'new_comment', newComment);
        res.status(200).json({ created: true });


    },

    replyPost: async (req, res, next) => {

        const { postId } = req.value.params;
        const post = await db.Post.findById(postId);

        const reply = req.body;


        res.status(200).json(post);
    },


    getPost: async (req, res, next) => {

        const { postId } = req.value.params;
        const post = await db.Post.findById(postId);

        res.status(200).json(post);
    },


}