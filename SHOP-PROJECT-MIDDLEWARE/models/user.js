const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String,
  nickname: String,
  password: String,
});

// userId라는 가상값 
UserSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});
UserSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("User", UserSchema);