const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const Course = require("../db/courseModel");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const dotenv = require("dotenv");

dotenv.config();
app.use(cookieParser());

//function not completely
exports.createCourse = async (request, response) => {
  try {
    const {
      title,
      description,
      duration,
      level,
      type,
      category,
      active,
      time,
    } = request.body;

    // Create a new course using the Course model
    const newCourse = new Course({
      title,
      description,
      duration,
      level,
      type,
      category,
      active,
      time,
    });

    // Save the new course to the database
    const savedCourse = await newCourse.save();

    response.status(201).json(savedCourse);
  } catch (error) {
    response.status(500).json({ error: "Failed to create course" });
  }
};
