require('rootpath')();
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');


const app = express();
app.use(helmet());
app.use(morgan("dev"));


//middlewares
app.use(bodyParser.json( { limit: "10000mb" } ));
app.use(bodyParser.urlencoded( { extended: true, limit: "10000mb", parameterLimit: 1000000 } ));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

//Declare the routes
const users = require('./User/user.route');
const tokens = require('./Token/token.route');
const accounts = require('./Account/account.route');
const photos = require('./Photo/photo.route');
const videos = require('./Video/video.route');
const profile = require('./Profile/profile.route');

// view engine setup
app.use(express.static('public'))
//app.use('/api', express.static(path.join(__dirname, '/public')))
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'pug');

//Routes
app.use('/api/users',users);
app.use('/api/tokens',tokens);
app.use('/api/accounts',accounts);
app.use('/api/photos', photos);
app.use('/api/videos', videos);
app.use('/api/profile', profile);


// global error handler
app.use(errorHandler);
/////////////page Not Found ---------------
app.get('*', function(req, res){ res.status(404).json("404 Page Not found ")});
app.post('*', function(req, res){ res.status(404).json("404 Page Not found ")});
app.put('*', function(req, res){ res.status(404).json("404 Page Not found ")});
app.delete('*', function(req, res){ res.status(404).json("404 Page  Not found ")});
app.patch('*', function(req, res){ res.status(404).json("404 Page  Not found ")});



// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3000;
app.listen(port, () => {
    console.log('Server listening on port ' + port);
});
