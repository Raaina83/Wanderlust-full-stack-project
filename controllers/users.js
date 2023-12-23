const User = require("../models/user.js");

module.exports.signupForm  = (req,res) =>{
    res.render("users/signup.ejs");
};

module.exports.postSignUp = async(req,res) =>{
    try{
    let {username,email,password} = req.body;
    let newUser = new User({email,username});
    const regUser = await User.register(newUser, password);
    console.log(regUser);
    req.login(regUser, (err) =>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listings");
    });
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    };
};

module.exports.loginForm  = (req,res) =>{
    res.render("users/login.ejs");
};

module.exports.postLogin = async(req,res) =>{
    req.flash("success", "Welcome to Wanderlust!!");
    let redirect = res.locals.redirectUrl || "/listings"; 
    res.redirect(redirect);
};

module.exports.logout = (req,res) =>{
    req.logOut((err) =>{
        if(err){
            next(err);
        } else{
            req.flash("success","you are now logged out");
            res.redirect("/listings");
        }
    });
};