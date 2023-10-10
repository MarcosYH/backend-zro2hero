const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

const multer = require("../middlewares/multer-config")

const parcoursController = require("../controllers/parcours")

router.use(cookieParser());

router.post("/create", multer, parcoursController.createParcours);
router.get("/viewAllPath", parcoursController.getAllParcours);
router.get("/viewOnePath/:id", parcoursController.getOneParcours);

module.exports = router;