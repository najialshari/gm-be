const express = require("express");
const router = express.Router();
const userController = require("../controller");
const middleware = require("../../middleware");
const multer = require("multer");
const upload = multer();

router.post("/signup", userController.signup); //signup
router.post("/signin", userController.signin); //signin
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
router.patch(
  "/updatemail",
  middleware.isAuthenticated,
  userController.updateEmail
); 
//update email
router.put(
  "/updateprofile",
  middleware.isAuthenticated,
  userController.updateProfile
); 
//update profile nickname/bio
router.get("/", middleware.isAuthenticated, userController.getUserInfo); //get user info
router.post("/logout", middleware.isAuthenticated, userController.logout); //logout
router.patch(
  "/updateprofilepic",
  middleware.isAuthenticated,
  upload.single("file"),
  userController.updateProfilePic
); 
//upload and update photo
router.patch(
  "/updatebgpic",
  middleware.isAuthenticated,
  upload.single("file"),
  userController.updateBgPic
); 
router.delete("/", middleware.isAuthenticated, userController.deleteUser); //delete user

module.exports = router;
