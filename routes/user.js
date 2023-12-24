const express = require("express");
const { route } = require("./listing");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middlewares.js");
const userController = require("../controllers/users.js");
const review = require("../models/review");

router
    .route("/signup")
    .get( userController.signupForm)
    .post( wrapAsync(userController.postSignUp));

router  
    .route("/login")
    .get( userController.loginForm)
    .post(
    saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect: "/login",
    failureFlash: true,
    }), 
    userController.postLogin);

router.get("/logout",userController.logout);

router.get("/", (req,res)=>{
    res.redirect("/listings");
});

module.exports = router;