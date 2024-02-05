const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

const subscribeNewsletterController = require("../controllers/subscribeNewsletter")

router.use(cookieParser());

router.post("/", subscribeNewsletterController.SubscribeNewsletter);
router.get("/", subscribeNewsletterController.getAllSubscribers);
router.get("/:id", subscribeNewsletterController.getOneSubscriber);
router.delete("/:id", subscribeNewsletterController.deleteSubscriber);

module.exports = router;