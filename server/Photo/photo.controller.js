const express = require('express');
const db = require("../_helpers/db");
const publicPhoto = require('./publicPhoto.model');
const privatePhoto = require('./privatePhoto.model');
const User = require('../User/user.model');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { type } = require('os');

function compare(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

module.exports = {

    getAllPhotos: async (req, res, next) => {
        const photos = await db.Photo.find({}).populate("userId");

        res.status(200).json(photos);

    },


    upload: async (req, res, next) => {

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
            req.body.imageUrl = 'http://localhost:3000/uploads/' + req.file.filename;

            //get the body
            const newPhoto = req.body;
            //get the user
            const userId = req.user._id;
            //assign new photo to the user
            newPhoto.userId = userId;
            // create the new photo
            if (newPhoto.imageControl == 'public') {
                const photo = await new publicPhoto(newPhoto);
                // save the new photo
                await photo.save();
                //get the user from db
                const user = await db.User.findById(userId);
                // save the new photo to user collections
                await user.user_publicPhotos.push(photo);
                await user.save();

                //respond to client
                res.status(200).json(photo);
            }
            if (newPhoto.imageControl == 'private') {
                const photo = await new privatePhoto(newPhoto);
                // save the new photo
                await photo.save();
                //get the user from db
                const user = await db.User.findById(userId);
                // save the new photo to user collections
                await user.user_privatePhotos.push(photo);
                await user.save();

                //respond to client

                res.status(200).json(photo);
            }

        }
    },

    getAllPublicPhotos: async (req, res, next) => {
        const reqUser = req.user._id;
          
        const publicPhotos = await db.publicPhoto.find({}).populate('userId');
        
        
        res.status(200).json(publicPhotos);

    },
    getAllPrivatePhotos: async (req, res, next) => {

        const privatePhotos = await db.privatePhoto.find({}).populate('userId');

        res.status(200).json(privatePhotos);

    },

    getAllUserPublicPhotos: async (req, res, next) => {

        const userId = req.user._id;
        const user = await User.findById(userId).populate('user_publicPhotos');

        const userPhotos = user.user_publicPhotos;

        res.status(200).json(userPhotos);


    },

    getAllUserPrivatePhotos: async (req, res, next) => {

        const userId = req.user._id;
        const user = await User.findById(userId).populate('user_privatePhotos');

        const userPhotos = user.user_privatePhotos;

        res.status(200).json(userPhotos);


    },

    //get any user phot by ID for editing purposes
    getPhotoById: async (req, res, next) => {

        try {

            const reqUser = req.user._id;
            const { photoId } = req.value.params;
            const photoPublic = await db.publicPhoto.findById(photoId);
            const photoPrivate = await db.privatePhoto.findById(photoId);
            if (publicPhoto && Object.is(reqUser, publicPhoto.userId)) {

                return res.status(200).json(photoPublic)
            } else if (publicPhoto && !Object.is(reqUser, publicPhoto.userId)) {

                return res.status(401).json({
                    message: 'Unauthorized user'
                })
            }
            else if (privatePhoto && Object.is(reqUser, privatePhoto.userId)) {

                return res.status(200).json(photoPrivate)
            } else if (privatePhoto && !Object.is(reqUser, privatePhoto.userId)) {

                return res.status(401).json({
                    message: 'Unauthorized user'
                })
            } else {
                console.log('photo does not exist')
            }
        } catch (error) {
            res.status(500).json({
                message: 'Error fetching this photo'
            })
        }

    },
    //View single photo

    viewPhoto: async (req, res, next) => {

        try {
            reqUser = req.user._id;
            const { photoId } = req.value.params;

            //check in public collections
            const photoPublic = await db.publicPhoto.findById(photoId);
            const photoPrivate = await db.privatePhoto.findById(photoId);

            if (photoPublic && Object.is(reqUser, publicPhoto.userId)) {

                return res.status(200).json(photoPublic);


            } else if (photoPublic && !Object.is(reqUser, publicPhoto.userId)) {

                return res.status(200).json(photoPublic);
            }
            else if (photoPrivate && Object.is(reqUser, privatePhoto.userId)) {

                return res.status(200).json(photoPrivate);
            } else if (photoPrivate && !Object.is(reqUser, privatePhoto.userId)) {

                return res.status(200).json(photoPrivate);
            } else {

                res.status(500).json({
                    message: 'Photo does not exist'
                })
            }

        } catch (error) {
            res.status(500).json({
                message: 'Error fetching this photo',
            })
        }

    },

    replacePhoto: async (req, res, next) => {
        try {
            const userId = req.user._id;
            const { photoId } = req.value.params;

            //search the public or private photo collection using the id
            const publicPhoto = await db.publicPhoto.findById(photoId);
            const privatePhoto = await db.privatePhoto.findById(photoId);
            //compare the userid in each collection to the requesting user id

            if (publicPhoto && isUserEqual(userId, publicPhoto.userId)) {
                if (req.fileValidationError) {
                    return res.send(req.fileValidationError);
                }
                else if (!req.file) {
                    return res.status(500).send({ message: 'Upload fail' });
                } else {
                    //unlink the existing file
                    //fs.unlink(path.join(__dirname, ))
                    //thereafter upload the new file
                    // if no Validation Error
                    const imagePath = publicPhoto.imageUrl;
                    //since i know the base name, delete in public/image and public/uploads
                    const imageName = path.basename(imagePath);

                    //check what is in image location

                    fs.unlink('../public/image/' + imageName, (err) => {
                        if (err) {
                            console.error(err)
                        }
                    })

                    fs.unlink('../public/uploads/' + imageName, (err) => {
                        if (err) {
                            console.error(err)
                        }
                    })


                    let width = 100;
                    let height = 100;
                    sharp(req.file.path).resize(width, height).toFile('public/uploads/' + req.file.filename)

                    //check if this works else move it to newPhot.image url = http url
                    req.body.imageUrl = 'http://localhost:3000/uploads/' + req.file.filename;
                    //get the body
                    const newPhoto = req.body;
                    //check if newPhoto.imageControl is public or private---TO DO
                    newPhoto.userId = userId;

                    if (newPhoto.imageControl == 'public') {
                        //before you do this, remove the existing file from the directory using fs.Unlinkc()                
                        const photo = await new publicPhoto(newPhoto);

                        await photo.save();
                        //get the user from db
                        const user = await db.User.findById(userId);
                        // save the new photo to user collections
                        await user.user_publicPhotos.push(photo);
                        await user.save();

                        //respond to client
                        return res.status(200).json(photo);

                    }
                    else if (newPhoto.imageControl == 'private') {
                        //before you do this, remove the existing file from the directory using fs.Unlinkc()                
                        const photo = await new privatePhoto(newPhoto);

                        await photo.save();
                        //get the user from db
                        const user = await db.User.findById(userId);
                        // save the new photo to user collections
                        await user.user_privatePhotos.push(photo);
                        await user.save()


                        //respond to client
                        return res.status(200).json(photo);
                    }
                    else {
                        return res.status(500).json({
                            message: "Failed to replace image"
                        });
                    }

                }


            } else if (privatePhoto && isUserEqual(userId, privatePhoto.userId)) {

                if (req.fileValidationError) {
                    return res.send(req.fileValidationError);
                }
                else if (!req.file) {
                    return res.status(500).send({ message: 'Upload fail' });
                } else {
                    //unlink the existing file
                    //fs.unlink(path.join(__dirname, ))
                    //thereafter upload the new file
                    // if no Validation Error
                    const imagePath = privatePhoto.imageUrl;
                    //since i know the base name, delete in public/image and public/uploads
                    const imageName = path.basename(imagePath);

                    //check what is in image location
                    console.log('Image location/', imageName);
                    fs.unlink('../public/image/' + imageName, (err) => {
                        if (err) {
                            console.error(err)
                        }
                    })

                    fs.unlink('../public/uploads/' + imageName, (err) => {
                        if (err) {
                            console.error(err)
                        }
                    })


                    let width = 100;
                    let height = 100;
                    sharp(req.file.path).resize(width, height).toFile('public/uploads/' + req.file.filename)

                    //check if this works else move it to newPhot.image url = http url
                    req.body.imageUrl = 'http://localhost:3000/uploads/' + req.file.filename;
                    //get the body
                    const newPhoto = req.body;
                    //check if newPhoto.imageControl is public or private---TO DO
                    newPhoto.userId = userId;

                    if (newPhoto.imageControl == 'public') {
                        //before you do this, remove the existing file from the directory using fs.Unlinkc()                
                        const photo = await new publicPhoto(newPhoto);

                        await photo.save();
                        //get the user from db
                        const user = await db.User.findById(userId);
                        // save the new photo to user collections
                        await user.user_publicPhotos.push(photo);
                        await user.save();

                        //respond to client
                        return res.status(200).json(photo);

                    }
                    else if (newPhoto.imageControl == 'private') {
                        //before you do this, remove the existing file from the directory using fs.Unlinkc()                
                        const photo = await new privatePhoto(newPhoto);

                        await photo.save();
                        //get the user from db
                        const user = await db.User.findById(userId);
                        // save the new photo to user collections
                        await user.user_privatePhotos.push(photo);
                        await user.save();

                        //respond to client
                        return res.status(200).json(photo);
                    }
                    else {
                        return res.status(500).json({
                            message: "Failed to replace image"
                        });
                    }

                }


            } else {

                return res.status(500).json({
                    message: 'Unauthorized user'

                });
            }



        } catch (error) {
            res.status(500).json({
                message: 'Error fetching this photo',
                error: error.error
            })
        }

    },

    updatePhoto: async (req, res, next) => {
        try{
            const reqUser = req.user._id;
            const { photoId } = req.value.params;
           

           //search the public or private photo collection using the id
            const photoPublic = await db.publicPhoto.findById(photoId);
            const photoPrivate = await db.privatePhoto.findById(photoId);

          
            if(photoPublic && compare(reqUser, photoPublic.userId)){
                const newPhoto = req.body;
                console.log('form data', newPhoto);
                const result = await db.publicPhoto.findByIdAndUpdate(photoId, newPhoto);
               return res.status(200).json({
                   message: 'Successfully updated'
               })
            }
            if(photoPrivate && compare(reqUser, photoPrivate.userId)) {
                const newPhoto = req.body;
                const result = await db.privatePhoto.findByIdAndUpdate(photoId, newPhoto);
                return res.status(200).json({
                    message: 'Successfully updated'
                })
            }
            if(photoPublic && compare(reqUser, photoPublic.userId) === false){
                return res.status(500).json({
                    message: 'You do not have access to edit this photo'
                })
            }
            if(photoPrivate && compare(reqUser, photoPrivate.userId) === false){
                return res.status(500).json({
                    message: 'You do not have access to edit this photo'
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

    deletePhoto: async (req, res, next) => {
        const reqUser = req.user._id;
        const { photoId } = req.value.params;

        //search the public or private photo collection using the id
        const photoPublic = await db.publicPhoto.findById(photoId);
        const photoPrivate = await db.privatePhoto.findById(photoId);
       
        if(photoPublic && compare(reqUser, photoPublic.userId)){
           
            //get the user Id
            const userId = photoPublic.userId;
            //get the user using the userId
            const user = await db.User.findById(userId);
            //remove the photo from the user's collctions
            await user.user_publicPhotos.pull(photoPublic);
            //save the user
            await user.save();
            await photoPublic.remove();
            res.status(200).json({ success: 'Successfully deleted' })
        }
        if(photoPrivate && compare(reqUser, photoPrivate.userId)) {
           
            //get the user Id
            const userId = photoPrivate.userId;
            //get the user using the userId
            const user = await db.User.findById(userId);
            //remove the photo from the user's collctions
            await user.user_privatePhotos.pull(photoPrivate);
            //save the user
            await user.save();
            await photoPrivate.remove();
            res.status(200).json({ success: 'Successfully deleted' })
        }

    }


}

