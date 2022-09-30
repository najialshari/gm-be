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
router.post("/logout", userController.logout); //logout
router.get("/", middleware.isAuthenticated, userController.getUserInfo); //get user info

router.get("/addresses/:id",  middleware.isAuthenticated, isUserDeleted, address.getAddress);
router.post("/addresses/:id", middleware.isAuthenticated, isUserDeleted ,address.addAddress);
router.delete("/addresses/:id",  middleware.isAuthenticated, address.deleteAddress);
router.put("/addresses/:id",  middleware.isAuthenticated, isUserDeleted, isAddressExisted,address.updateAddress);

router.patch("/updatepassword", middleware.isAuthenticated, userController.updatePassword); //update userPassword
router.patch("/updateusername", middleware.isAuthenticated, userController.updateUsername);//update userName
router.patch("/updateemail", middleware.isAuthenticated, userController.updateEmail);//update userEmail
router.patch("/updatephoneno", middleware.isAuthenticated, userController.updatePhoneNo);//update userPhoneNo

router.patch("/updateprofilepic", middleware.isAuthenticated, upload.single("file"), userController.updateProfilePic);// update photo
router.delete("/:id", middleware.isAuthenticated, middleware.isAdmin , userController.deleteUser); //delete user
router.patch("/:id", middleware.isAuthenticated, middleware.isAdmin , userController.activatingDeletedUser); //delete user

module.exports = router;
