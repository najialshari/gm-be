const { responses, isEmailValid } = require("../../helper");
const service = require("../service");
const transformer = require("../../../transformers");
const authService = require("../../middleware/services/auth");
const models = require("../../../models");
const firebase = require("../../firebase");
const { Op } = require("sequelize");

const signup = async (req, res) => {
  try {
    const {  phoneNo, password, passwordConfirmation } =
      req?.body;
    const username = req?.body?.username.toUpperCase();
    const email = req?.body?.email.toLowerCase();
    if (username?.length < 3)
      return responses.failedWithMessage("username is invalid", res);
    if (!username || !email || !password)
      return responses.failedWithMessage("Fill all required fields.", res);
    
    if (!isEmailValid(email))
      return responses.failedWithMessage("Please add a valid email", res);
      const isEmailUsed = await models.User.findOne({
        where: {
          email,
        },
      
      });
      if (isEmailUsed)
      return responses.failedWithMessage("Email  Already Used, Please add Another Email !", res);
      
    if (!phoneNo && phoneNo.length < 10)
      return responses.failedWithMessage("Please add a valid phone no", res);
    
    if (password?.length < 6)
      return responses.failedWithMessage("Please add a valid password", res);
    if (password != passwordConfirmation)
      return responses.failedWithMessage(
        "Your password and password confirmation do not match",
        res
      );
    const user = await service.createUser({
      username,
      email,
      password,
      phoneNo,
    });
    if (user) {
      return responses.successWithMessage("User created successfully", res);
    }
    return responses.failedWithMessage("User already exists.", res);
  } catch (err) {
    console.log(err);
    responses.serverError(res);
    return;
  }
};

const signin = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req?.body;
    if (!usernameOrEmail || !password)
      return responses.failedWithMessage(
        "Please fill in the required fields.",
        res
      );

    const result = await service.signin({ usernameOrEmail, password });
    if (result) {
      const currUser = await models.User.findOne({
        where: {
          id: result.user.id,
        },
        include: [{
          model: models.Role,
          attributes: ['name']
        }]
      });
      res.cookie("jwt", result.token);
      return responses.success(
        "Logged in successfully",
        { user: transformer.userTransformer(currUser), token: result.token },
        res
      );
    }
    return responses.failedWithMessage(
      "Wrong username or email or password",
      res
    );
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
};

const updateUsername = async (req, res) => {
  try {
    const currUser = await models.User.findByPk(req?.user?.id);
    if (!currUser) return responses.unauthenticated(res);
    const {  password } = req?.body;
    const newUsername = req?.body?.newUsername.toUpperCase();
    if (!authService.comparePasswords(password, currUser.password))
      return responses.failedWithMessage(
        "Password you entered is incorrect",
        res
      );
    if (newUsername?.length < 3)
      return responses.failedWithMessage("username is invalid", res);

      if (newUsername== currUser?.newUsername)
      return responses.failedWithMessage(
        "Your new newUsername cannot be the same as your old Username!",
        res
      );
      const isNewUsernameAlreadyExists = await models.User.findOne({where:{username:newUsername}});
      if (isNewUsernameAlreadyExists)
      return responses.failedWithMessage(
        "This newUsername Already Exists! please add another One",
        res
      );

    const result = await service.updateUsername(currUser, newUsername);
    if (result) {
      const data = await service.getUserInfo(req);
      return responses.success(
        "Username changed successfully",
        transformer.userTransformer(data),
        res
      );
    }
    return responses.failedWithMessage("Failed to change username, Username maybe used!", res);
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
};

const updateEmail = async (req, res) => {
  try {
    const currUser = await models.User.findByPk(req?.user?.id);
    if (!currUser) return responses.unauthenticated(res);
    const { password } = req?.body;
    const newEmail = req?.body?.newEmail.toLowerCase();

    if (!isEmailValid(newEmail))
      return responses.failedWithMessage(
        " Please Enter Valid Email",
        res
      );
      if (newEmail== currUser?.email)
      return responses.failedWithMessage(
        "Your new Email cannot be the same as your old Email!",
        res
      );
      const isNewEmailAlreadyExists = await models.User.findOne({where:{email:newEmail}});
      if (isNewEmailAlreadyExists)
      return responses.failedWithMessage(
        "This Email Already Exists! please add another One",
        res
      );
    if (!authService.comparePasswords(password, currUser.password))
      return responses.failedWithMessage(
        "Password you entered is incorrect",
        res
      );

    const result = await service.updateEmail(currUser, newEmail);
    if (result)
      return responses.successWithMessage("Email changed successfully", res);
    return responses.failedWithMessage("Failed to change email", res);
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
};

const updatePhoneNo = async (req, res) => {
  try {
    const currUser = await models.User.findByPk(req?.user?.id);
    if (!currUser) return responses.unauthenticated(res);
    const { newPhoneNo, password } = req?.body;

    if (!authService.comparePasswords(password, currUser.password))
      return responses.failedWithMessage(
        "Password you entered is incorrect",
        res
      );
      if (!newPhoneNo && newPhoneNo.length < 10)
      return responses.failedWithMessage("Please add a valid phone no", res);
      if (newPhoneNo== currUser?.phoneNo)
      return responses.failedWithMessage(
        "Your new new Phone Number cannot be the same as your old One!",
        res
      );
      

    const result = await service.updatePhoneNo(currUser, newPhoneNo);
    if (result)
      return responses.successWithMessage("Phone no changed successfully", res);
    return responses.failedWithMessage("Failed to change phone no", res);
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
};

const updatePassword = async (req, res) => {
  try {
    const currUser = await models.User.findByPk(req?.user?.id);
    if (!currUser) return responses.unauthenticated(res);
    const { currPassword, newPassword, newPasswordConfirmation } = req?.body;
    if (!currPassword || !newPassword || !newPasswordConfirmation) {
      return responses.failedWithMessage(
        "Please fill in all required fields.",
        res
      );
    }

    if (newPassword != newPasswordConfirmation)
      return responses.failedWithMessage("Passwords do not match.", res);
    if (!authService.comparePasswords(currPassword, currUser?.password))
      return responses.failedWithMessage(
        "Password you entered is incorrect",
        res
      );
    if (authService.comparePasswords(newPassword, currUser?.password))
      return responses.failedWithMessage(
        "Your new password cannot be the same as your old password",
        res
      );
    const result = await service.updatePassword(currUser, newPassword);
    if (result)
      return responses.successWithMessage("Password changed successfully", res);
    return responses.failedWithMessage("Failed to change password", res);
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
};

const logout = async (req, res) => {
  const result = service.logout(req, res);
  if (!result)
    return responses.failedWithMessage("Some Thing Went Wrong! Please TRy Again");
  return responses.successWithMessage("Logged out successfully.", res);
};

const getUserInfo = async (req, res) => {
  try {
    const currUser = await service.getUserInfo(req);
    const transformedUser = transformer.userTransformer(currUser);
    if (currUser) return responses.success("User found", transformedUser, res);
    return responses.unauthenticated(res);
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
};

const updateProfilePic = async (req, res) => {
  try {
    const fileTypes = ["png", "jpg", "jpeg", "gif", "JPG", "svg"];
    const file = req?.file;
    if (!file)
      return responses.failedWithMessage("file has not been uploaded !", res);
    const userId = req?.user?.id;
    const fileInfo = file?.originalname?.toLowerCase().split(".");
    const uniqueFileName = `/images/${fileInfo[0]}%%${new Date().valueOf()}.${
      fileInfo[fileInfo?.length - 1]
    }`;
    const imageRef = firebase.ref(firebase.storage, uniqueFileName);
    const metaType = { contentType: file?.mimetype, name: file?.originalname };
    if (!fileTypes.includes(fileInfo[fileInfo?.length - 1]))
      return responses.failedWithMessage(
        `please upload file with those types: ${fileTypes} `,
        res
      );    
    console.log("here afte", imageRef)    
    await firebase.uploadBytes(imageRef, file?.buffer, metaType)  
      .then(async () => {
        const publicUrl = await firebase.getDownloadURL(imageRef);
        console.log("here after Download the file from firebase")  
        const result = await service.updateProfilePic(userId, publicUrl);
        if (!result)
          return responses.failedWithMessage(
            "Failed to change profile pic",
            res
          );
        return responses.successWithMessage(
          `Profile picture changed successfully`,
          res,
          { urlImage: publicUrl }
        );
      })
      .catch((e) => {
        console.error(e);
        return responses.failedWithMessage(e.message, res);
      });
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
};

const deleteUser = async (req, res) => {
  try {
    const isUser = await models.User.findOne({
      where: {
        [Op.and]: [
          { id: req?.params?.id },
          { id: { [Op.ne]: req.user.id } },
        ],
      },
    });
    if (!isUser)
      return responses.failedWithMessage(
        "User not found",
        res
      );
    const currUser = await models.User.findOne({
      where: {
        [Op.and]: [
          { id: req?.params?.id },
          { deletedAt: null },
          { id: { [Op.ne]: req.user.id } },
        ],
      },
    });
    if (!currUser)
      return responses.failedWithMessage(
        "User already deleted",
        res
      );
    const result = await service.deleteUser(currUser);
    if (result)
      return responses.successWithMessage("User deleted successfully", res);
    return responses.failedWithMessage("Failed to delete user", res);
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
};

const activatingDeletedUser = async (req, res) => {
  try {
    const isUser = await models.User.findOne({
      where: {
        [Op.and]: [
          { id: req?.params?.id },
          { id: { [Op.ne]: req.user.id } },
        ],
      },
    });
    if (!isUser)
      return responses.failedWithMessage(
        "User Does not Exists",
        res
      );
    const currUser = await models.User.findOne({
      where: {
        [Op.and]: [
          { id: req?.params?.id },
          { deletedAt:{ [Op.ne]: null }},
          { id: { [Op.ne]: req.user.id } },
        ],
      },
    });
    if (!currUser)
      return responses.failedWithMessage(
        "User already Active",
        res
      );
    const result = await service.activatingDeletedUser(currUser);
    if (result)
      return responses.successWithMessage("User Activated successfully", res);
    return responses.failedWithMessage("Failed to Activating user", res);
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
};

module.exports = {
  signup,
  signin,
  updateUsername,
  updateEmail,
  updatePassword,
  updatePhoneNo,
  logout,
  getUserInfo,
  updateProfilePic,
  deleteUser,
  activatingDeletedUser
};
