if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express=require("express");
const app=express();
const mongoose= require("mongoose");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate"); 
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("./models/user.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const users = require("./routes/user.js");
const { func } = require('joi');

// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbURL = process.env.ATLAS_URL;

main().then(() =>{
    console.log("connected to DB");
})
.catch(err =>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbURL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60,
});

store.on("error", () =>{
    console.log("EROOR in MONGO SESSION STORE", err);
}); 

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
}, async(accessToken,refreshToken, profile, done) => {
    const newUser = {
        email: profile.emails[0].value,
        username: profile.name.givenName,
        googleId: profile.id,
    }

    try{
        let user = await User.findOne({googleId: profile.id});
        console.log(user);

        if(user){
            done(null, user);
        } else{
            user = await User.create(newUser);
            done(null, user);
        }
    } catch(err){
        console.log(err);
    }
}))

// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });
// passport.deserializeUser(function(id, done) {
//     User.findById(id, function(err, user) {
//         done(err, user);
//     });
// });

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

app.use((req,res,next) =>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});


app.use("/listings",listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", users);

// app.all("*", (req,res,next) =>{
//     next(new ExpressError(404,"Page Not Found!"));
// });

app.use((err,req,res,next) =>{
    let {statusCode=500, message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs", { message });
});

// app.get("/demouser", async(req,res) =>{
//     let fakeUser = new User({
//         email: "raaina@gmail.com",
//         username: "ruhi",
//     });

//     let newUser= await User.register(fakeUser, "raaina83");
//     // console.log(newUser);
//     res.send(newUser);
// });

app.listen(8080, () =>{
    console.log("app is listening");
});