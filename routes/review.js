const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware");
const reviewController = require("../controller/reviews.js");
//Reviews
//post Review route

router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReviews ));


//Delete review Route

router.delete("/:reviewId", isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReviews));


module.exports = router;

