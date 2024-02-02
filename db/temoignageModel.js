const mongoose = require("mongoose");

const temoignageShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const Temoignages = mongoose.model("Temoignages", temoignageShema);

module.exports = Temoignages;
