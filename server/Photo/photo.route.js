const router = require('express-promise-router')();
const PhotosController = require('./photo.controller');
const { validateParam, validateBody, schemas } = require('../_middleware/routehelpers');
const db = require('../_helpers/db');
//const Photo = require('./publicPhoto.model');
const passport = require('passport');
const passportConfig = require('../passport');
const passportLogin = passport.authenticate('local', { session: false });
const passportJwt = passport.authenticate('jwt', { session: false });
const passportGoogle = passport.authenticate('googleToken', { session: false });
const passportFacebook = passport.authenticate('facebookToken', { session: false });
const multer = require('multer');
const imageFilter = require('./imageFilter');




// Save file to server storage
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  filename: (req, file, cb) => {

    var filetype = '';
    if (file.mimetype === 'image/gif') {
      filetype = 'gif';
    }
    if (file.mimetype === 'image/png') {
      filetype = 'png';
    }
    if (file.mimetype === 'image/jpeg') {
      filetype = 'jpg';
    }
    cb(null, 'image-' + Date.now() + '.' + filetype);
  }

});


var upload = multer({
  storage: storage, limits: {
    fileSize: 1024 * 1024 * 2
  }, fileFilter: imageFilter.imageFilter
});



router.route('/')
  .get(passportJwt, PhotosController.getAllPhotos);

router.route('/upload')
  .post(passportJwt, upload.single('file'), PhotosController.upload);
//show only public photos
router.route('/public')
  .get(passportJwt, PhotosController.getAllPublicPhotos);

//show only private photos
router.route('/private')
  .get(passportJwt, PhotosController.getAllPrivatePhotos);

//show only one user public photos
router.route('/user_public')
  .get(passportJwt, PhotosController.getAllUserPublicPhotos);

//show only private photos
router.route('/user_private')
  .get(passportJwt, PhotosController.getAllUserPrivatePhotos);

//get a single photo using the photo Id. The user can edit, view or remove this photo
router.route('/:photoId')
  .get(validateParam(schemas.IdSchema, 'photoId'), passportJwt, PhotosController.getPhotoById)
  .patch([validateParam(schemas.IdSchema, 'photoId'), validateBody(schemas.editPhotoSchema)],passportJwt, upload.any(), PhotosController.updatePhoto)
  .delete(validateParam(schemas.IdSchema, 'photoId'), passportJwt, PhotosController.deletePhoto)

router.route('/replacePhoto/:photoId')
  .post(validateParam(schemas.IdSchema, 'photoId'), upload.single('file'), passportJwt, PhotosController.replacePhoto)//No schema because this is removing and reuploading the file

  router.route('/viewphoto/:photoId')
  .get(validateParam(schemas.IdSchema, 'photoId'), passportJwt, PhotosController.viewPhoto);

module.exports = router;