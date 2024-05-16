const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.model");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema");

// Joi Validation middleware(server side)
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  console.log(error);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

//Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("listing/home.ejs", { alllisting });
  })
);

//New Route
router.get("/listings/new", (req, res) => {
  res.render("listing/new.ejs");
});

//Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id).populate("reviews");
    // console.log(data.price.toLocaleString("en-IN"));
    res.render("listing/show.ejs", { data });
  })
);

//Create Route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send Valid Data");
    }
    // 1st option
    // let { title, description, image, price, location, country } = req.body;
    // let newList = new Listing({
    //   title: title,
    //   description: description,
    //   image: image,
    //   price: price,
    //   location: location,
    //   country: country,
    // });

    // 2nd option
    let newList = new Listing(req.body.listing);
    // console.log(newList);
    await newList.save();
    // .then((res) => {
    //   console.log(res);
    // });
    res.redirect("/listings");
  })
);

//Edit Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    res.render("listing/edit.ejs", { data });
  })
);

//Update Route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send Valid Data");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

module.exports = router;
