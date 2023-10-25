const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  role:{
    type: String,
    required: true,
    unique: false,
  },
  name: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: [true, "Email Exist"],
  },
  password: {
    type: String,
    required: [false, "Not neccessary because googlelogin don't use"],
    unique: false,
  },
  cpassword: {
    type: String,
    required: [false, "Not neccessary because googlelogin don't use"],
    unique: false,
  },
  tel: {
    type: String,
    required: true,
    unique: false,
  },
  resetToken: {
    type: String,
    default: null,
  },
  resetTokenExpiration: {
    type: Date,
    default: null,
  },
  googleID: {
    type: String,
    default: null,
  },
  token: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
