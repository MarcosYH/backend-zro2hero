const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");


const parcoursController = require("../controllers/parcours")

router.use(cookieParser());

router.post("/create", parcoursController.createParcours);
router.get("/viewAllPath", parcoursController.getAllParcours);
router.get("/viewOnePath/:id", parcoursController.getOneParcours);
router.put("/updateOnePath/:id", parcoursController.updateParcours);
router.delete("/deleteOnePath/:id", parcoursController.deleteParcours);

module.exports = router;