require('rootpath')();
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('./_middleware/error-handler');
const http = require('http');
const socketio = require('socket.io');
const formatMessages = require('./Utils/messages')

const botName = 'Chatbot';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(helmet());
app.use(morgan("dev"));


//middlewares
app.use(bodyParser.json( { limit: "10000mb" } ));
app.use(bodyParser.urlencoded( { extended: true, limit: "10000mb", parameterLimit: 1000000 } ));
app.use(bodyParser.json());
app.use(cookieParser());
//CORS FOR DEV PURPOSE
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));
//app.use(function(req, res, next) {
  //  res.header("Access-Control-Allow-Origin", "*");
  //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,app_token,file");
  //  next();
 // });

//Declare the routes
const users = require('./User/user.route');
const tokens = require('./Token/token.route');
const accounts = require('./Account/account.route');
const photos = require('./Photo/photo.route');
const videos = require('./Video/video.route');
const profile = require('./Profile/profile.route');
const posts = require('./Post/post.route');

// view engine setup
app.use(express.static('public'));

//Run when client connects
io.on('connection', socket =>{
 
  socket.emit('message',formatMessages(botName, 'Welcome to chat room'));

  socket.broadcast.emit('message', formatMessages(botName, 'A user has joined the chat'));

  socket.on('disconnect', () =>{
    io.emit('message', formatMessages(botName, 'A user has left the chat'));

  })

  //Listen for chatMessage
  socket.on('chatMessage', (msg)=>{
   io.emit('message', formatMessages('USERNAME', msg));
  })

 

})



//app.use('/api', express.static(path.join(__dirname, '/public')))


//Routes
app.use('/api/users',users);
app.use('/api/tokens',tokens);
app.use('/api/accounts',accounts);
app.use('/api/photos', photos);
app.use('/api/videos', videos);
app.use('/api/profile', profile);
app.use('/api/posts', posts);


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
server.listen(port, () => {
    console.log('Server listening on port ' + port);
});
