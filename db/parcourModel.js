const mongoose = require("mongoose");

const parcoursSchema = new mongoose.Schema({
  wording: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  categorie: {
    type: String,
    required: true
  }
});

const Parcours = mongoose.model("Parcours", parcoursSchema);

module.exports = Parcours;
