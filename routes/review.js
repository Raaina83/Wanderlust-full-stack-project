const express = require("express");
const router = express.Router({mergeParams: true});
const Review= require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing= require("../models/listing.js");
const {validateReview} = require("../middlewares.js");
const {isLoggedIn,checkAuthor} =require("../middlewares.js");
const reviewController = require("../controllers/reviews.js");

//Review POST Route
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.postReview));

//Review DELETE route
router.delete("/:reviewId", isLoggedIn,checkAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;
