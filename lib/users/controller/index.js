const { responses, isEmailValid } = require("../../helper");
const service = require("../service");
const transformer = require("../../../transformers");
const authService = require("../../middleware/services/auth");
const models = require("../../../models");
const firebase = require("../../firebase");
const { Op } = require("sequelize");

const signup = async (req, res) => {
  try {
    const { phoneNo, password, passwordConfirmation, roleName } = req?.body;
    // const username = req?.body?.username.toUpperCase();
    const username = req?.body?.username;
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
      return responses.failedWithMessage(
        "Email  Already Used, Please add Another Email !",
        res
      );

    if (phoneNo?.length < 10)
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
      roleName,
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
        include: [
          {
            model: models.Role,
            attributes: ["name"],
          },
        ],
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
    // const { password } = req?.body;
    const newUsername = req?.body?.newUsername;
    // if (!authService.comparePasswords(password, currUser.password))
    //   return responses.failedWithMessage(
    //     "Password you entered is incorrect",
    //     res
    //   );
    if (currUser?.username == newUsername) return { status: "unchanged" };

    if (newUsername?.length < 3)
      return responses.failedWithMessage("Username minimum lenght is 3", res);

    // if (newUsername == currUser?.username)
    //   return responses.failedWithMessage(
    //     "Your new Username cannot be the same as your old Username!",
    //     res
    //   );
    const isNewUsernameAlreadyExists = await models.User.findOne({
      where: { username: newUsername },
    });
    if (isNewUsernameAlreadyExists)
      return responses.failedWithMessage(
        "This Username is existed! Please use another one",
        res
      );

    const result = await service.updateUsername(currUser, newUsername);
    if (result) {
      // const data = await service.getUserInfo(currUser?.id);
      // return responses.success(
      //   "Username was changed successfully",
      //   transformer.userTransformer(data),
      //   res
      // );
      return { status: "updated" };
    }
    return responses.failedWithMessage(
      "Unable to update Username!. Contact your adminstrator",
      res
    );
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
};

const updateEmail = async (req, res) => {
  try {
    const currUser = await models.User.findByPk(req?.user?.id);
    if (!currUser) return responses.unauthenticated(res);
    // const { password } = req?.body;
    const newEmail = req?.body?.newEmail.toLowerCase();
    if (newEmail == currUser?.email) return { status: "unchanged" };
    // return responses.failedWithMessage(
    //   "The new Email cannot be the same as your old Email!",
    //   res
    // );

    if (!isEmailValid(newEmail))
      return responses.failedWithMessage(" Please enter a valid Email!", res);

    const isNewEmailAlreadyExists = await models.User.findOne({
      where: { email: newEmail },
    });
    if (isNewEmailAlreadyExists)
      return responses.failedWithMessage(
        "This Email is existed! Please use another one",
        res
      );
    // if (!authService.comparePasswords(password, currUser.password))
    //   return responses.failedWithMessage(
    //     "Password you entered is incorrect",
    //     res
    //   );
    const result = await service.updateEmail(currUser, newEmail);
    if (result) {
      // return responses.successWithMessage(
      //   "Email was changed successfully",
      //   res,
      //   {
      //     email: newEmail,
      //   }
      // );
      return { status: "updated" };
    }
    return responses.failedWithMessage(
      "Unable to update Email!. Contact your adminstrator",
      res
    );
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
};

const updatePhoneNo = async (req, res) => {
  try {
    const currUser = await models.User.findByPk(req?.user?.id);
    if (!currUser) return responses.unauthenticated(res);

    const newPhoneNo = req?.body?.newPhoneNo;
    console.log(newPhoneNo, "mmmm", currUser.phoneNo);
    if (newPhoneNo == currUser?.phoneNo) return { status: "unchanged" };

    // if (!authService.comparePasswords(password, currUser.password))
    //   return responses.failedWithMessage(
    //     "Password you entered is incorrect",
    //     res
    //   );
    if (newPhoneNo?.length < 10)
      return responses.failedWithMessage(
        "Please add a valid Phone No (10).",
        res
      );
    // return responses.failedWithMessage(
    //   "The new Phone Number cannot be the same as your old one!",
    //   res
    // );

    const result = await service.updatePhoneNo(currUser, newPhoneNo);
    if (result) {
      // return responses.successWithMessage(
      //   "Phone No was changed successfully",
      //   res,
      //   { phoneNo: newPhoneNo }
      // );
      return { status: "updated" };
    }
    return responses.failedWithMessage(
      "Unable to update Phone No!. Contact your adminstrator",
      res
    );
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
};

const updateUserInfo = async (req, res) => {
  // console.log([
  //   req.user.id,
  //   req.body.newEmail,
  //   req.body.newUsername,
  //   req.body.newPhoneNo,
  // ]);
  try {
    const currUser = await models.User.findByPk(req?.user?.id);

    if (!currUser) return responses.unauthenticated(res);

    const { newUsername, newEmail, newPhoneNo } = req?.body;

    if (
      currUser?.username == newUsername &&
      currUser?.email == newEmail.toLowerCase() &&
      currUser?.phoneNo == newPhoneNo
    )
      return responses.failedWithMessage("No changes to save", res);

    //username check
    if (newUsername?.length < 3)
      return responses.failedWithMessage(
        "Username should be 3 characters at least!",
        res
      );

    const isNewUsernameAlreadyExists = await models.User.findOne({
      where: { username: newUsername, id: { [Op.ne]: [currUser?.id] } },
    });
    if (isNewUsernameAlreadyExists)
      return responses.failedWithMessage(
        "This username is existed! Please use another one.",
        res
      );

    // email check
    if (!isEmailValid(newEmail))
      return responses.failedWithMessage("Please enter a valid Email!", res);

    const isNewEmailAlreadyExists = await models.User.findOne({
      where: { email: newEmail, id: { [Op.ne]: [currUser?.id] } },
    });
    if (isNewEmailAlreadyExists)
      return responses.failedWithMessage(
        "This email is existed! Please use another one.",
        res
      );

    //phone no check
    if (newPhoneNo?.length < 10)
      return responses.failedWithMessage(
        "Please add a valid Phone No (10).",
        res
      );

    //update username, email, phone no
    const result = await service.updateUserInfo(
      currUser,
      newUsername,
      newEmail,
      newPhoneNo
    );
    if (result) {
      return responses.successWithMessage(
        "Changes were saved successfully",
        res,
        {
          username: newUsername,
          email: newEmail,
          phoneNo: newPhoneNo,
        }
      );
    }
    return responses.failedWithMessage(
      "Unable to update changes!. Contact your administrator",
      res
    );

    // const currUser = await models.User.findByPk(req?.user?.id);
    // responses.successWithMessage("Changes were saved", res, {
    //   username: currUser.username,
    //   phoneNo: currUser.phoneNo,
    //   email: currUser.email,
    // });
    // console.log(currUser.username,"000",
    //   currUser.phoneNo,"0000",
    //   currUser.email)
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
    return responses.failedWithMessage(
      "Something went wrong! Please try again"
    );
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
      return responses.failedWithMessage("File has not been uploaded !", res);

    const userId = req?.user?.id;
    const fileInfo = file?.originalname?.toLowerCase().split(".");
    const uniqueFileName = `restaurant/userPics/${
      fileInfo[0]
    }_${new Date().valueOf()}.${fileInfo[fileInfo?.length - 1]}`;

    const imageRef = firebase.ref(firebase.storage, uniqueFileName);
    const metaType = { contentType: file?.mimetype, name: file?.originalname };

    if (!fileTypes.includes(fileInfo[fileInfo?.length - 1]))
      return responses.failedWithMessage(
        `Please upload file with those types: ${fileTypes} `,
        res
      );

    const uploadPic = await firebase.uploadBytes(
      imageRef,
      file?.buffer,
      metaType
    );
    if (!uploadPic)
      return responses.failedWithMessage(
        "Failed to upload pic to firebase store",
        res
      );

    const publicUrl = await firebase.getDownloadURL(uploadPic.ref);
    if (!publicUrl)
      return responses.failedWithMessage("Failed to get pic URL!", res);

    const result = await service.updateProfilePic(userId, publicUrl);
    if (!result)
      return responses.failedWithMessage("Failed to change profile pic", res);
    return responses.successWithMessage(
      `Profile picture changed successfully`,
      res,
      { urlImage: publicUrl }
    );
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
};

const deleteUser = async (req, res) => {
  try {
    const isUser = await models.User.findOne({
      where: {
        [Op.and]: [{ id: req?.params?.id }, { id: { [Op.ne]: req.user.id } }],
      },
    });
    if (!isUser) return responses.failedWithMessage("User not found", res);
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
      return responses.failedWithMessage("User already deleted", res);
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
        [Op.and]: [{ id: req?.params?.id }, { id: { [Op.ne]: req.user.id } }],
      },
    });
    if (!isUser)
      return responses.failedWithMessage("User Does not Exists", res);
    const currUser = await models.User.findOne({
      where: {
        [Op.and]: [
          { id: req?.params?.id },
          { deletedAt: { [Op.ne]: null } },
          { id: { [Op.ne]: req.user.id } },
        ],
      },
    });
    if (!currUser)
      return responses.failedWithMessage("User already Active", res);
    const result = await service.activatingDeletedUser(currUser);
    if (result)
      return responses.successWithMessage("User Activated successfully", res);
    return responses.failedWithMessage("Failed to Activating user", res);
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
};

const resetPass = async (req, res) => {
  const email = req?.body?.email;
  if (!email)
    return responses.failedWithMessage("Please add required Email first!", res);
  const isEmail = isEmailValid(email);
  if (!isEmail)
    return responses.failedWithMessage(
      "Email not Valid. Use valid Email!",
      res
    );
  if (email && isEmail) {
    const isExistUser = await models.User.findOne({ email });
    if (!isExistUser)
      return responses.failedWithMessage(
        "Email not found. Use your original Email!",
        res
      );
    const newPassword = await service.resetPassword(isExistUser);
    if (!newPassword)
      return responses.failedWithMessage(
        "Could not reset password. Please try again.",
        res
      );
    else
      return responses.successWithMessage(
        "Congratulation. New password is 123456",
        res
      );
  }
  return responses.failedWithMessage(
    "Something went wrong. Please try again or contact the Admin.",
    res
  );
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
  activatingDeletedUser,
  resetPass,
  updateUserInfo,
};
