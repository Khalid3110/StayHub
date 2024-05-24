const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.model");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schema");
const Review = require("../models/review.model");
const { isLoggedIn, isReviewAuthor } = require("../middleware");

const reviewController = require("../controllers/review.controller");

// Joi Validation middleware(server side)
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  console.log(error);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

//Reviews
//Post Review Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
