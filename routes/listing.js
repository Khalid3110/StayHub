const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.model");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const multer = require("multer");
const { storage } = require("../cloudCofig");
const upload = multer({ storage });

const { isLoggedIn, isOwner, validateListing } = require("../middleware");

const listingController = require("../controllers/listing.controller");

router
  .route("/")
  .get(wrapAsync(listingController.indexroute))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createRoute)
  );

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showlisting))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// //Index Route
// router.get("/", wrapAsync(listingController.indexroute));

// //Show Route
// router.get("/:id", wrapAsync(listingController.showlisting));

// //Create Route
// router.post(
//   "/",
//   isLoggedIn,
//   validateListing,
//   wrapAsync(listingController.createRoute)
// );

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

// //Update Route
// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(listingController.updateListing)
// );

// //Delete Route
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.destroyListing)
// );

module.exports = router;
