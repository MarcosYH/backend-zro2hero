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

exports.getAllCourses = async (request, response) => {
  try {
    const courses = await Course.find();
    response.status(200).json(courses);
  } catch (error) {
    response.status(500).json({ error: "Failed to get courses" });
  }
};

exports.getOneCourse = async (request, response) => {
  try {
    const courseId = request.params.id;
    const course = await Course.findById(courseId);
    if (!course) {
      response.status(404).json({ error: "Course not found" });
    } else {
      response.status(200).json(course);
    }
  } catch (error) {
    response.status(500).json({ error: "Failed to get course" });
  }
};

exports.getCourseCount = async (request, response) => {
  try {
    const courseCount = await Course.find().countDocuments();
    response.status(200).json({courseCount});
  } catch (error) {
    response.status(500).json({ error: "Failed to get course count" });
  }
};