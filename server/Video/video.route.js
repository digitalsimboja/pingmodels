const router = require('express-promise-router')();
const VideosController = require('./video.controller');
const { validateParam, validateBody, schemas } = require('../_middleware/routehelpers');
const db = require('../_helpers/db');
const passport = require('passport');
const passportConfig = require('../passport');
const passportLogin = passport.authenticate('local', {session: false});
const passportJwt = passport.authenticate('jwt', { session: false });
const passportGoogle = passport.authenticate('googleToken',{session: false});
const passportFacebook = passport.authenticate('facebookToken', {session: false} );
const multer = require('multer');
const videoFilter = require('./videoFilter');


// Save file to server storage
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/videos');
    },
    filename: (req, file, cb) => {

       
      
      var filetype = '';
      if (file.mimetype === 'video/gif') {
        filetype = 'gif';
      }
      if (file.mimetype === 'video/mp4') {
        filetype = 'mp4';
      }
      if (file.mimetype === 'video/ogg') {
        filetype = 'ogg';
      }
      if (file.mimetype === 'video/wmv') {
        filetype = 'wmv';
      }
      if (file.mimetype === 'video/x-flv') {
        //filetype = mime.getExtension('video/flv');
        filetype = 'flv';
      }
      if (file.mimetype === 'video/avi') {
        filetype = 'avi';
      }
      if (file.mimetype === 'video/webm') {
        filetype = 'webm';
      }
      if (file.mimetype === 'video/mkv') {
        filetype = 'mkv';
      }
      if (file.mimetype === 'video/avchd') {
        filetype = 'avchd';
      }
      if (file.mimetype === 'video/mov') {
        filetype = 'mov';
      }
      cb(null, 'video-' + Date.now() + '.' + filetype);
    }
  
  });
  
  var upload = multer({ storage: storage, fileFilter: videoFilter.videoFilter });


  
//define how to show videos using the imageControl
//show only public videos
router.route('/')
.get(passportJwt,VideosController.getAllVideos);

router.route('/upload')
.post(passportJwt,upload.single('file'),VideosController.addNewVideo);

//show only public videos
router.route('/public')
.get(passportJwt,VideosController.getAllPublicVideos);

//show only private videos
router.route('/private')
.get(passportJwt,VideosController.getAllPrivateVideos);

//show only private photos
router.route('/user_public')
.get(passportJwt,VideosController.getAllUsersPublicVideos);

//show only private photos
router.route('/user_private')
.get(passportJwt,VideosController.getAllUsersPrivateVideos);

//get a single video using the video Id
router.route('/:videoId')
.get(validateParam(schemas.IdSchema, 'videoId'), passportJwt, VideosController.getVideoById)
.put([validateParam(schemas.IdSchema, 'videoId'), validateBody(schemas.putVideoSchema)],passportJwt, VideosController.replaceVideo )
.patch([validateParam(schemas.IdSchema, 'videoId'), validateBody(schemas.editVideoSchema)],passportJwt,upload.any(),  VideosController.updateVideo)
.delete(validateParam(schemas.IdSchema, 'videoId'),passportJwt, VideosController.deleteVideo)


module.exports = router;