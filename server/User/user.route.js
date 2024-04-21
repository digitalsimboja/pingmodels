const router = require('express-promise-router')();
const UsersController = require('./user.controller');
const { validateParam, validateBody, schemas } = require('../_middleware/routehelpers');
const passport = require('passport');
const passportConfig = require('../passport');
const passportLogin = passport.authenticate('local', { session: false });
const passportJwt = passport.authenticate('jwt', { session: false });
const passportGoogle = passport.authenticate('googleToken', { session: false });
const passportFacebook = passport.authenticate('facebookToken', { session: false });
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

var upload = multer({
  storage: storage, limits: {
    fileSize: 1024 * 1024 * 2
  }, fileFilter: imageFilter.imageFilter
});



//COMPLETED
router.route('/')
  .get(passportJwt, UsersController.getUsers);

router.route('/register')
  .post(validateBody(schemas.userSchema), UsersController.CreateUser);

router.route('/login')
  .post(validateBody(schemas.authSchema), passportLogin, UsersController.localAuth);

router.route('/logout')
  .delete(UsersController.logout);


router.route("/Refresh_Token")
  .post(UsersController.Refresh_Token);


router.route('/oauth/google')
  .post(passportGoogle, UsersController.googleOAuth);

router.route('/oauth/facebook')
  .post(passportFacebook, UsersController.facebookOAuth);
/* GET users listing. Allow for only admin, so create admin Passport login authentication */


//Get user by Username
//COMPLETED
router.route('/profile')
  .get(passportJwt, UsersController.getUserProfile)
  .patch(passportJwt, upload.single('file'), UsersController.updateProfilePicture);

router.route('/addCoverPhoto')
  .patch(passportJwt, upload.single('file'), UsersController.addCoverPhoto);

router.route('/getUserTokenBalance')
  .get(passportJwt, UsersController.getUserTokenBalance);

router.route('/updateProfile')
  .patch(passportJwt, upload.any(), UsersController.updateProfile);

router.route('/finduser/:username')
.get(validateParam(schemas.userNameSchema, 'username'),passportJwt, UsersController.getUserByUsername);


router.route('/:userId/public/photos')
  .get(validateParam(schemas.IdSchema, 'userId'), passportJwt, UsersController.getUserPublicPhotosById)

router.route('/:userId/public/videos')
  .get(validateParam(schemas.IdSchema, 'userId'), passportJwt, UsersController.getUserPublicVideosById)

router.route('/:userId/private/photos')
  .get(validateParam(schemas.IdSchema, 'userId'), passportJwt, UsersController.getUserPrivatePhotosById)

router.route('/:userId/private/videos')
  .get(validateParam(schemas.IdSchema, 'userId'), passportJwt, UsersController.getUserPrivateVideosById)

router.route('/:userId/getFollowStatus')
  .get(validateParam(schemas.IdSchema, 'userId'), passportJwt, UsersController.getFollowStatus);

router.route('/:userId/follow')
  .post(validateParam(schemas.IdSchema, 'userId'), passportJwt, UsersController.follow);

router.route('/:userId/unfollow')
  .delete(validateParam(schemas.IdSchema, 'userId'), passportJwt, UsersController.unfollow)

//get user by Id, replace user details, edit user details, delete user//Admin can do all these. Users can only do for their own account
router.route('/:userId')
  .get(validateParam(schemas.IdSchema, 'userId'), passportJwt, UsersController.getUserById)
  .put([validateParam(schemas.IdSchema, 'userId'), validateBody(schemas.replaceUserSchema)], passportJwt, UsersController.replaceUser)
  


module.exports = router;

