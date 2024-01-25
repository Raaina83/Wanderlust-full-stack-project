const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var findOrCreate = require('mongoose-findorcreate');

const userSchema = new Schema({
    email: {
        type: String,
        required:true,
    },
    googleId: {
        type: String,
    },
    username: {
        type: String,
        required: true,
    },
    image:{
        url: String,
        filename: String
    }
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);