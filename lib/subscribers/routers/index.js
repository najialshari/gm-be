const express = require("express");
const router = express.Router();
const controller = require("../controller")
const middleware = require("../../middleware");


router.post("/", controller.setSubscriber);
router.get("/", middleware.isAdmin , controller.getSubscribers)





module.exports = router