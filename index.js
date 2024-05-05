const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.model");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/windowbnb";

main()
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

// let place1 = new Listing({
//   title: "My New Banglo",
//   description: "By the Mountain",
//   price: 900,
//   location: "Maniyar, Ballia",
//   country: "India",
// });

// place1.save().then((res) => {
//   console.log(res);
// });

app.get("/", (req, res) => {
  res.send("Hello World");
});

//Index Route
app.get("/listings", async (req, res) => {
  const alllisting = await Listing.find({});
  res.render("listing/home.ejs", { alllisting });
});

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listing/new.ejs");
});

//Show Route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let data = await Listing.findById(id);
  // console.log(data.price.toLocaleString("en-IN"));
  res.render("listing/show.ejs", { data });
});

//Create Route
app.post("/listings", async (req, res) => {
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
  await newList.save().then((res) => {
    console.log(res);
  });
  res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let data = await Listing.findById(id);
  res.render("listing/edit.ejs", { data });
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

app.listen(3000, () => {
  console.log("Server is start");
});
