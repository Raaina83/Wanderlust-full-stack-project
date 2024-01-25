const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middlewares.js");
const userController = require("../controllers/users.js");
const { func } = require("joi");


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

router.get("/auth/google", passport.authenticate("google", {scope: ["profile", "email"]}));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  userController.googleLogin
)

router.get('/profile',userController.profile);

router.get("/", (req,res)=>{
    res.redirect("/listings");
});

module.exports = router;