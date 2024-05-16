const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");

const listings = require("./routes/listing");
const reviews = require("./routes/review");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/stayhub";

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

app.use("/listings", listings);
app.use("/listings/:id/review", reviews);

// Errors handling middlewares

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(3000, () => {
  console.log("Server is start");
});
