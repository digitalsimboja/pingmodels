const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    avatar:  String ,
    followers: Number,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user' },
    location: String,
    bio: String,
    date: { type: Date, default: Date.now },
    
});

const Profile = mongoose.model('profile', ProfileSchema);

module.exports = Profile;