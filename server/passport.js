const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const LocalStrategy = require('passport-local');
const { ExtractJwt } = require('passport-jwt');
const secret = process.env.ACCESSTOKENSECRET;
const config = require('./_helpers/config');
const User = require('./User/user.model');

const cookieExtractor = req =>{
    let token = null;
    if(req && req.cookies){
        console.log('req cookies:', req.cookies);
        token = req.cookies['access_token'];
    }
}

//jwt  strategy
passport.use( new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: secret,
}, async (payload, done) => {
    try {
        
        //find the user object model in the database in the specified token in the payload
        const user = await User.findById(payload.sub);
        //if user does not exist, handle it
        if (!user) {
            return done(null, false);
        }
        //else return the user
        done(null, user);

    } catch (error) {
        done(error, false);
    }

}));

//Google OAuth Strategy
passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: config.oauth.google.clientID,
    clientSecret: config.oauth.google.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
    try {
        //check whether this user exists in our database
        const existingUser = await User.findOne({ 'google.id': profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }
        const newUser = new User({
            method: 'google',
            google: {
                id: profile.id,
                email: profile.emails[0].value
            }
        });

        await newUser.save();
        done(null, newUser);

    } catch (error) {
        done(error, false, error.message);
    }

}

));

//Facebook OAuth
passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: config.oauth.facebook.clientID,
    clientSecret: config.oauth.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
    try {

        const existingUser = await User.findOne({ 'facebook.id': profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }

        const newUser = new User({
            method: 'facebook',
            facebook: {
                id: profile.id,
                email: profile.emails[0].value
            }
        });

        await newUser.save();
        done(null, newUser);
    } catch (error) {
        done(error, false, error.message);
    }
}
));

//Local strategy
passport.use('local', new LocalStrategy(
    //{usernameField: "Email"}, 
    async (username, password, done) => {
        try {
            //Find the user given the username

            const user = await User.findOne({ "local.username": username });
            //if no such user, handle it
            if (!user) {
                return done(null, false);
            }
            //check if the password matches or is correct for the user
            const passwordMatch = await user.isValidPassword(password);
            //if not, handle it

            if (!passwordMatch) {
                return done(null, false, { message: 'Incorrect password.' });

            }
            //if no error return the user
            return done(null, user);

        } catch (error) {
            done(error, false);
        }
    }
)

);