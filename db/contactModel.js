const mongoose = require("mongoose");

const contactShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  sujet: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const Contacts = mongoose.model("Contacts", contactShema);

module.exports = Contacts;
