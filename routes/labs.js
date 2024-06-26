const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

const labsController = require("../controllers/Labs")

router.use(cookieParser());

router.post('/createLab', labsController.createLab);
router.get('/viewAllLab', labsController.getAllLabs);
router.get('/viewOneLab/:id', labsController.getOneLab);
router.delete('/deleteOneLab/:id', labsController.deleteLab);

router.get('/count', labsController.getLabsCount);

module.exports = router;