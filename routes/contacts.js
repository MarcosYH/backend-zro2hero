const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

const contactController = require("../controllers/contacts")

router.use(cookieParser());

router.post("/", contactController.createContact);
router.get("/", contactController.getAllContacts);
router.get("/:id", contactController.getOneContact);
router.put("/:id", contactController.updateContact);
router.delete("/:id", contactController.deleteContact);

module.exports = router;