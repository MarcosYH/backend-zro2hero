const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

const temoignageController = require("../controllers/temoignages")

router.use(cookieParser());

router.post("/create", temoignageController.createTemoignage);

module.exports = router;