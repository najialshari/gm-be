const express = require("express");
const router = express.Router();
const adminController = require("../controller");
const userController = require("../../users/controller");
const middleware = require("../../middleware");

router.post("/signin", adminController.signin); // sign in      
router.get(
  "/users",
  middleware.isAuthenticated,
  middleware.isAdmin,
  adminController.getUsers
); // get all users
router.get(
  "/users/dates",
  middleware.isAuthenticated,
  middleware.isAdmin,
  adminController.getUsersDates
); // get all users dates
router.get(
  "/users/:id",
  middleware.isAuthenticated,
  middleware.isAdmin,
  adminController.getUser
); // get user

router.delete(
  "/users/:id",
  middleware.isAuthenticated,
  middleware.isAdmin,
  adminController.deleteUser
); // delete user
router.patch(
  "/activity/:id",
  middleware.isAuthenticated,
  middleware.isAdmin,
  adminController.toggleActivity
); // change to or from active


router.get(
  "/",
  middleware.isAuthenticated,
  middleware.isAdmin,
  adminController.getAdmins
); // get all admins
router.post("/logout", middleware.isAuthenticated, userController.logout); // logout

module.exports = router;
