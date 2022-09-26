const express = require("express");
const router = express.Router();
const controller = require("../controller");
const middleware = require("../../middleware");

router.post("/", controller.setSubscriber);
router.get(
  "/activesubscribers", 
  // middleware.isAuthenticated,
  // middleware.isAdmin,
  controller.getActiveSubscribers
);
router.get(
  "/allsubscribers", 
  // middleware.isAuthenticated,
  // middleware.isAdmin,
  controller.getAllSubscribers
);
router.patch(
  "/:id",
  // middleware.isAuthenticated,
  // middleware.isAdmin,
  controller.deleteSubscriber
); // delete Subscriber

module.exports = router;
