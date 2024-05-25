const Listing = require("../models/listing.model");

module.exports.indexroute = async (req, res) => {
  const alllisting = await Listing.find({});
  res.render("listing/home.ejs", { alllisting });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs");
};

module.exports.showlisting = async (req, res) => {
  let { id } = req.params;
  let data = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  // console.log(data);
  // console.log(data.price.toLocaleString("en-IN"));
  if (!data) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("listing/show.ejs", { data });
};

module.exports.createRoute = async (req, res) => {
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
  let url = req.file.path;
  let filename = req.file.filename;
  let newList = new Listing(req.body.listing);
  newList.owner = req.user._id;
  newList.image = { url, filename };
  // console.log(newList);
  await newList.save();
  req.flash("success", "New Listing Created");
  // .then((res) => {
  //   console.log(res);
  // });
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let data = await Listing.findById(id);
  if (!data) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("listing/edit.ejs", { data });
};

module.exports.updateListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send Valid Data");
  }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
