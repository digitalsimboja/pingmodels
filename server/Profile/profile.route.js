const router = require('express-promise-router')();
const ProfileController = require('./profile.comtroller');
const { validateParam, validateBody, schemas } = require('../_middleware/routehelpers');
const db = require('../_helpers/db');
const Profile = require('./profile.model');
const passport = require('passport');
const passportConfig = require('../passport');
const passportLogin = passport.authenticate('local', {session: false});
const passportJwt = passport.authenticate('jwt', { session: false });
const passportGoogle = passport.authenticate('googleToken',{session: false});
const passportFacebook = passport.authenticate('facebookToken', {session: false} );
const multer = require('multer');
const imageFilter = require('./imageFilter');




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
.get(passportJwt,ProfileController.getUserProfile)
//.post(passportJwt,upload.single('file'), ProfileController.addNewPhoto)
.patch(validateBody(schemas.editProfileSchema), ProfileController.editProfile)


/*
//get a single photo using the photo Id
router.route('/:photoId')
.get(validateParam(schemas.IdSchema, 'photoId'),ProfileController.getPhoto)
.put([validateParam(schemas.IdSchema, 'photoId'), validateBody(schemas.putPhotoSchema)],ProfileController.replacePhoto )
.patch([validateParam(schemas.IdSchema, 'photoId'), validateBody(schemas.editPhotoSchema)], ProfileController.editPhoto)
.delete(validateParam(schemas.IdSchema, 'photoId'),ProfileController.deletePhoto)
*/

module.exports = router;