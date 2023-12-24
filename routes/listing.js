const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing= require("../models/listing.js");
const {isLoggedIn,checkOwner,validateListing} =require("../middlewares.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage,cloudinary} = require("../cloudConfig.js");
const upload = multer({ storage });

router
    .route("/")
    .get( wrapAsync(listingController.index))
    .post(isLoggedIn, 
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.postNew));

    //New Route
router.get("/new",isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get( wrapAsync(listingController.show))
    .put( 
        isLoggedIn,
        checkOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.postUpdate))
    .delete(isLoggedIn, checkOwner,wrapAsync(listingController.delete));


//Update route(GET-form)
router.get("/:id/edit", isLoggedIn ,checkOwner,wrapAsync(listingController.renderUpdateForm));

router.get("/", (req,res)=>{
    res.redirect("/listings");
});


module.exports = router;