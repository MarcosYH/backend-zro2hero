const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

const temoignageController = require("../controllers/temoignages")

router.use(cookieParser());

router.post("/", temoignageController.createTemoignage);
router.get("/", temoignageController.getAllTemoignages);
router.get("/:id", temoignageController.getOneTemoignage);
router.put("/:id", temoignageController.updateTemoignage);
router.delete("/:id", temoignageController.deleteTemoignage);


module.exports = router;