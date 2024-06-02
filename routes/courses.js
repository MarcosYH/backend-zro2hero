const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");


const courseController = require("../controllers/courses")

router.use(cookieParser());

router.post("/create", courseController.createCourse);

router.get("/count", courseController.getCourseCount);

module.exports = router;