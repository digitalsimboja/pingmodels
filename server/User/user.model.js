const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    method: {
        type: String,
        name: ['local', 'google', 'facebook']
    },
    local: {
        username: { type: String, lowercase: true },
        password: { type: String },
        email: { type: String, lowercase: true },
        refreshToken: { type: String },
        role: { type: String },
        phoneNumber: { type: Number },
        firstName: { type: String },
        lastName: { type: String },
        acceptTerms: Boolean,

    },
    google: {
        id: { type: String },
        email: { type: String, lowercase: true }

    },
    facebook: {
        id: { type: String },
        email: { type: String, lowercase: true }

    },

    dateCreated: { type: String, required: true, default: Date() },
    subscribedDate: Date,
    subscribeExpiringDate: Date,
    updatedDate: Date,
    lastLogin: { type: String },
    resetToken: { Token: String, Expires: Date },
    passwordReset: Date,
    bio: { type: String },
    avatar: { type: Schema.Types.Mixed, required: false },
    coverImage: { type: Schema.Types.Mixed, required: false },
    following: Boolean,
    subscribed: Boolean,
    member: Boolean,
    tokenBal: { type: Number },

    user_publicPhotos: [{
        type: Schema.Types.ObjectId,
        ref: 'publicPhoto'
    }],

    user_privatePhotos: [{
        type: Schema.Types.ObjectId,
        ref: 'privatePhoto'
    }],

    user_publicVideos: [{
        type: Schema.Types.ObjectId,
        ref: 'publicVideo'
    }],

    user_privateVideos: [{
        type: Schema.Types.ObjectId,
        ref: 'privateVideo'
    }],

    user_subscriptions: [{
        type: Schema.Types.ObjectId,
        ref: 'subscription'
    }],

    user_memberships: [{
        type: Schema.Types.ObjectId,
        ref: 'membership'
    }],

    following: [
        {type: Schema.Types.ObjectId}

    ],

    followers: [
        {type: Schema.Types.ObjectId}

    ],
    user_posts: [{
        type: Schema.Types.ObjectId,
        ref: 'post'
    }],
    
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'post'
      }],

    user_accounts: [{
        type: Schema.Types.ObjectId,
        ref: 'account'
    }],

    user_tokens: [{
        type: Schema.Types.ObjectId,
        ref: 'TokenAccount'
    }],

});


UserSchema.pre('save', async function (next) {

    if (this.method !== 'local') {
        next();
    }
    if (!this.isModified('local.password')) {
        return next();
    }


    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.local.password, salt);
        this.local.password = passwordHash;

        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.isValidPassword = async function (newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.local.password);
    } catch (error) {
        throw new Error(error);
    }
}

const User = mongoose.model("user", UserSchema);

module.exports = User;