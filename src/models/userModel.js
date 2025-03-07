const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, required: true },
    username: String,
    email: { type: String, unique: true, required: true },
    profilePic: String,
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema)
module.exports = UserModel
