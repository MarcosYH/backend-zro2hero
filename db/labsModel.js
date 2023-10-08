const mongoose = require("mongoose");

const labsSchema = new mongoose.Schema({
  wording: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  technologie: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  auteur: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  services: {
    type: String,
    required: true,
  },
  type_access: {
    type: String,
    required: true,
  },
});

const Labs = mongoose.model("Labs", labsSchema);

module.exports = Labs;
