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


exports.createCourse = async (request, response) => {
  const {
    title,
    image,
    level,
    type,
    category,
    active,
    description,
    time,
  } = request.body;
  try {
    const courseImages = await cloudinary.uploader.upload(image, {
      folder: "parcours",
    });
    const newCourse = new Course({
      title,
      image: {
        public_id: courseImages.public_id,
        url: courseImages.secure_url,
      },
      level,
      type,
      category,
      active,
      description,
      time,
    });

    const savedCourse = await newCourse.save();

    response.status(201).json({
        message: "Cours créé avec succès",
        Course: savedCourse,
    });
  } catch (error) {
    response.status(500).json({ error: "Failed to create course" });
  }
};
