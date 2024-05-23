const mongoose = require("mongoose");
const Listing = require("../models/listing.model");
const initData = require("./data");

const MONGO_URL = "mongodb://127.0.0.1:27017/stayhub";

main()
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "664b8d5df277feaef528cea5",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data Saved");
};

initDB();
