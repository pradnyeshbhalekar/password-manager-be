const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("mongoDB connected ");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
