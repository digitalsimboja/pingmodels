const express = require('express');
const db = require("../_helpers/db");
const publicVideo = require('./publicVdeo.model');
const privateVideo = require('./privateVideo.model');
const User = require('../User/user.model');


function compare(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }



module.exports = {

    getAllVideos: async (req, res, next) => {
        const videos = await db.Video.find({}).populate("userId");
       
        res.status(200).json(videos);

    },

    addNewVideo: async (req, res, next) => {
        // check file for Validation Error
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.status(500).send({ message: 'Upload fail' });
        } else {
            // if no Validation Error
            // hbjs.spawn({ input: 'something.avi', output: 'something.m4v' })

            req.body.videoUrl = 'https://api.pingmodels.com/videos/' + req.file.filename;
           // req.body.imageUrl = 'http://localhost:3000/api/images/' + req.file.filename;

            
            //get the body
            const newVideo = req.body;
            //get the user
            const userId = req.user._id;
            //assign new Video to the user
            newVideo.userId = userId;
            if(newVideo.videoControl == 'public'){
                const Video = await new publicVideo(newVideo);
                    // save the new Video
                await Video.save();
                //get the user from db
                const user = await db.User.findById(userId);
                // save the new Video to user collections
                await user.user_publicVideos.push(Video);
                await user.save();
    
                res.status(200).json(Video);
                }
                if(newVideo.videoControl == 'private'){
                    const Video = await new privateVideo(newVideo);
                    // save the new Video
                await Video.save();
                //get the user from db
                const user = await db.User.findById(userId);
                // save the new Video to user collections
                await user.user_privateVideos.push(Video);
                await user.save();
    
               
                res.status(200).json(Video);
                }

        }
    },

    getAllPublicVideos: async (req, res, next) => {

        const publicVideos = await db.publicVideo.find({  }).populate("userId");

        res.status(200).json(publicVideos);

    },

    getAllPrivateVideos: async (req, res, next) => {

        const privateVideos = await db.privateVideo.find({  }).populate("userId");

        res.status(200).json(privateVideos);

    },

    getAllUsersPublicVideos: async (req, res, next) => {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('user_publicVideos');
        const userVideos = user.user_publicVideos;

        res.status(200).json(userVideos);

    },

    getAllUsersPrivateVideos: async (req, res, next) => {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('user_privateVideos');
        const userVideos = user.user_privateVideos;

        res.status(200).json(userVideos);

    },

    getVideoById: async (req, res, next) => {

        
        const reqUser = req.user._id;
        const { videoId } = req.value.params;
        const videoPublic = await db.publicVideo.findById(videoId);
        const videoPrivate = await db.privateVideo.findById(videoId);

        if(videoPrivate){
           
            var isUser = compare(reqUser,videoPrivate.userId);
            if(isUser){
               
                return res.status(200).json(videoPrivate);
            }
            else{
                return res.status(401).json({
                    message: 'You are not allowed to edit this photo'
                })
            }
            
        }
        if(videoPublic){
            
            var isUser = compare(reqUser,videoPublic.userId);

            if(isUser){
              
                return res.status(200).json(videoPublic);
            }else{
                return res.status(401).json({
                    message: 'You are not allowed to edit this photo'
                })
            }
        }
        else{
            return res.status(500).json({
                message: 'Video does not exist'
            })
        }

},

    replaceVideo: async (req, res, next) => {
        const { videoId } = req.value.params;
        const newVideo = req.value.body;
        const result = await Video.findByIdAndUpdate(videoId, newVideo);
        res.status(200).json({ success: true });
    },

    updateVideo: async (req, res, next) => {
        try{
            const reqUser = req.user._id;
            const { videoId } = req.value.params;
           
           //search the public or private photo collection using the id
            const videoPublic = await db.publicVideo.findById(videoId);
            const videoPrivate = await db.privateVideo.findById(videoId);

            if(videoPublic && compare(reqUser, videoPublic.userId)){
                var newVideo = req.body;
                var newTitle = newVideo.videoTitle;
                var newDesc = newVideo.videoDesc;
              
                if(newTitle== null || newTitle =='' ){
                    newTitle = videoPublic.videoTitle
                }
                if(newDesc== null || newDesc =='' ){
                    newDesc= videoPublic.videoDesc
                }
                videoPublic.videoTitle = newTitle;
                videoPublic.videoDesc = newDesc;

                await videoPublic.save();
                
               return res.status(200).json({
                   message: 'Successfully updated'
               })
            }
            if(videoPrivate && compare(reqUser, videoPrivate.userId)) {
                var newVideo = req.body;
                var newTitle = newVideo.videoTitle;
                var newDesc = newVideo.videoDesc;
                var newNGNCharge = newVideo.chargeNGN;
                var newUSDCharge = newVideo.chargeUSD;
                if(newTitle== null || newTitle =='' ){
                    newTitle = videoPrivate.videoTitle
                }
                if(newDesc== null || newDesc =='' ){
                    newDesc = videoPrivate.videoDesc
                }
                if(newNGNCharge== null || newNGNCharge =='' ){
                    newNGNCharge = videoPrivate.chargeNGN
                }
                if(newUSDCharge== null || newUSDCharge =='' ){
                    newUSDCharge = videoPrivate.chargeUSD
                }

                videoPrivate.videoTitle = newTitle;
                videoPrivate.videoDesc = newDesc;
                videoPrivate.chargeNGN = newNGNCharge;
                videoPrivate.chargeUSD = newUSDCharge

                await videoPrivate.save();
                
                return res.status(200).json({
                    message: 'Successfully updated'
                })
            }
            if(videoPublic && compare(reqUser, videoPublic.userId) === false){
                return res.status(500).json({
                    message: 'You do not have access to edit this video'
                })
            }
            if(videoPrivate && compare(reqUser, videoPrivate.userId) === false){
                return res.status(500).json({
                    message: 'You do not have access to edit this video'
                })
            }   
            
                     

        }
        catch (error) {
            res.status(500).json({
                message: 'Error fetching this photo',
                error: error.error
            })
        }


    },


    deleteVideo: async (req, res, next) => {
        const reqUser = req.user._id;
        const { videoId } = req.value.params;

        //search the public or private photo collection using the id
        const videoPublic = await db.publicVideo.findById(videoId);
        const videoPrivate = await db.privateVideo.findById(videoId);
       
        if (videoPublic && compare(reqUser, videoPublic.userId)) {
           
            //get the user Id
            const userId = videoPublic.userId;
            //get the user using the userId
            const user = await db.User.findById(userId);
            //remove the photo from the user's collctions
            await user.user_publicVideos.pull(videoPublic);
            //save the user
            await user.save();
            await videoPublic.remove();
            res.status(200).json({ success: 'Successfully deleted' })
        }
        if (videoPrivate && compare(reqUser, videoPrivate.userId)) {
           
            //get the user Id
            const userId = videoPrivate.userId;
            //get the user using the userId
            const user = await db.User.findById(userId);
            //remove the photo from the user's collctions
            await user.user_privateVideos.pull(videoPrivate);
            //save the user
            await user.save();
            await videoPrivate.remove();
            res.status(200).json({ success: 'Successfully deleted' })
        }

    }


}