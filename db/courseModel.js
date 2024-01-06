const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
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
  level: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["video", "text", "audio"],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
