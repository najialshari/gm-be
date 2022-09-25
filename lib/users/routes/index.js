const express = require("express");
const router = express.Router();
const userController = require("../controller");
const middleware = require("../../middleware");
const address = require('../service/address')
const multer = require("multer");
const { isUserDeleted, isAddressExisted } = require("../controller/address");
const upload = multer();

router.post("/signup", userController.signup); //signup
router.post("/signin", userController.signin); //signin
router.get("/addresses/:id", isUserDeleted, address.getAddress);
router.post("/addresses/:id", isUserDeleted ,address.addAddress);
router.delete("/addresses/:id", address.deleteAddress);
router.put("/addresses/:id", isUserDeleted, isAddressExisted,address.updateAddress);

router.patch(
  "/updatepassword",
  middleware.isAuthenticated,
  userController.updatePassword
); //updatepassword
router.patch(
  "/updateusername",
  middleware.isAuthenticated,
  userController.updateUsername
); 
//update username

router.get("/", middleware.isAuthenticated, userController.getUserInfo); //get user info
router.post("/logout", middleware.isAuthenticated, userController.logout); //logout
router.patch(
  "/updateprofilepic",
  middleware.isAuthenticated,
  upload.single("file"),
  userController.updateProfilePic
); 
// update photo

router.delete("/", middleware.isAuthenticated, userController.deleteUser); //delete user

module.exports = router;
