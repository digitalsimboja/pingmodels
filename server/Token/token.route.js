const router = require('express-promise-router')();
const TokenController = require('./token.controller');
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
.get(passportJwt,TokenController.getAllToken);

//get user token balance 
router.route('/GetTokenBalance')
    .get(passportJwt, TokenController.getUserTokenBalance);

//add token balance 
router.route('/buytoken')
    .post(passportJwt,upload.any(),TokenController.addNewToken);


//get a single photo using the photo Id
router.route('/:tokenId')
.get(TokenController.getToken)

module.exports = router;