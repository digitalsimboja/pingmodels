const router = require('express-promise-router')();
const PostController = require('./post.controller');
const { validateParam, validateBody, schemas} = require('../_middleware/routehelpers');
const passport = require('passport');
const passportConfig = require('../passport');
const passportLogin = passport.authenticate('local', {session: false});
const passportJwt = passport.authenticate('jwt', { session: false });
const passportGoogle = passport.authenticate('googleToken',{session: false});
const passportFacebook = passport.authenticate('facebookToken', {session: false} );
const multer = require('multer');
const imageFilter = require('../Photo/imageFilter');

// Save file to server storage
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/images');
    },
    filename: (req, file, cb) => {
      
      var filetype = '';
     
      if (file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if (file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      cb(null, 'image-' + Date.now() + '.' + filetype);
    }
  
  });
  
  var upload = multer({ storage: storage,  limits: {
    fileSize: 1024 * 1024 * 2
  }, fileFilter: imageFilter.imageFilter });
  

router.route('/')
.get(passportJwt,PostController.getAllPost);


//add token balance 

router.route('/comment/:userId')
.post(validateParam(schemas.IdSchema, 'userId'), passportJwt,upload.any(), PostController.comment)
.get(validateParam(schemas.IdSchema, 'userId'), passportJwt,PostController.getUserComment);

router.route('/comment/photo/:photoId')
.post(validateParam(schemas.IdSchema, 'photoId'), passportJwt,upload.any(),PostController.photoComment);

router.route('/comment/video/:videoId')
.post(validateParam(schemas.IdSchema, 'videoId'), passportJwt,upload.any(),PostController.videoComment);

router.route('/:postId')
.get(validateParam(schemas.IdSchema, 'postId'),passportJwt,PostController.getPost)

router.route('/:postId/reply')
.get(validateParam(schemas.IdSchema, 'postId'),passportJwt,PostController.replyPost)



module.exports = router;