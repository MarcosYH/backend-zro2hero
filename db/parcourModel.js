const mongoose = require("mongoose");

const parcoursSchema = new mongoose.Schema({
  wording: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  categorie: {
    type: String,
    required: true,
  },
});

const Parcours = mongoose.model("Parcours", parcoursSchema);

module.exports = Parcours;
