const router = require('express-promise-router')();
const AccountsController = require('./account.controller');
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
  


//Get user by Username
//COMPLETED
router.route('/addbank')
.post(passportJwt,upload.any(), AccountsController.addBank);

router.route('/subscribe')
.post(passportJwt,upload.any(), AccountsController.subscribe);

router.route('/membership')
.post(passportJwt,upload.any(), AccountsController.membership);

    
module.exports = router;

