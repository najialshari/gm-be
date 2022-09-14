const responses = require("../../helper/responses");
const service = require("../service");
const transformer = require("../../../transformers");
const authService = require("../../middleware/services/auth");
const models = require("../../../models");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const firebase = require("../../firebase/config")
const { getStorage } = require("firebase/storage");
const storage = getStorage(firebase)

const signup = async (req, res) => {
  try {
    const { username, email, password, passwordConfirmation } = req?.body;
    if (!username || !email || !password)
      return responses.failedWithMessage("Fill all required fields.", res);
    if (username?.length < 3)
      return responses.failedWithMessage("username is invalid", res);
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
      return responses.failedWithMessage("Please add a valid email", res);
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
      const currUser = await models.users.findOne({
        where: {
          id: result.user.id
        },
        include: [{
          model: models.usersprofiles,
          foreignKey: 'userId'
        }]
      });
      return responses.success(
        "Logged in successfully",
        { user: transformer.userTransformer(currUser), token: result.token },
        res
      );
    }
    return responses.failedWithMessage("Wrong username or email or password", res);
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
};

const updateUsername = async (req, res) => {
  try {
    const currUser = await models.users.findByPk(req?.user?.id);
    if (!currUser) return responses.unauthenticated(res);
    const { newUsername, password } = req?.body;
    if (!authService.comparePasswords(password, currUser.password))
      return responses.failedWithMessage(
        "Password you entered is incorrect",
        res
      );
    const result = await service.updateUsername(currUser, newUsername);
    if (result) {
      const data = await service.getUserInfo(req);
      return responses.success("Username changed successfully", transformer.userTransformer(data) ,res);
    }
    return responses.failedWithMessage("Failed to change username", res);
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
};

const updateEmail = async (req, res) => {
  try {
    const currUser = await models.users.findByPk(req?.user?.id);
    if (!currUser) return responses.unauthenticated(res);
    const { newEmail, password } = req?.body;
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

const updateProfile = async (req, res) => {
  try {
    const currUser = await models.usersprofiles.findOne({
      where: {
        userId: req?.user?.id,
      },
    });
     if (!currUser) return responses.unauthenticated(res);
    const { bio, nickname } = req?.body;
    if (!bio) bio = currUser.bio;
    if (!nickname) nickname = currUser.nickname;
    const result = await service.updateProfile(currUser.userId, nickname, bio);
    console.log(result)
    if (result[0]){
      const newUserInfo = await service.getUserInfo(req)
      return responses.success("Profile updated successfully", transformer.userTransformer(newUserInfo),res);
    }
    return responses.failedWithMessage("Failed to update profile", res);
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
};

const updatePassword = async (req, res) => {
  try {
    const currUser = await models.users.findByPk(req?.user?.id);
    if (!currUser) return responses.unauthenticated(res);
    const { currPassword, newPassword, newPasswordConfirmation } = req?.body;
    if(!currPassword || !newPassword|| !newPasswordConfirmation) {
      return responses.failedWithMessage("please do not make the fields empty", res)
    }
    console.log(req?.body)
    if (newPassword != newPasswordConfirmation)
      return responses.failedWithMessage("Passwords do not match.", res);
    if (!authService.comparePasswords(currPassword, currUser?.password))
      return responses.failedWithMessage(
        "Password you entered is incorrect",
        res
      );
    if (authService.comparePasswords(newPassword, currUser.password))
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
  const token = req.user.token;
  const result = service.logout({ token });
  if (!result)
    return responses.failedWithMessage("Invalidating token has failed");
  return responses.successWithMessage("Logged out", res);
};

const getUserInfo = async (req, res) => {
  try {
    const currUser = await service.getUserInfo(req);
    const transformedUser = transformer.userTransformer(currUser)
    if (currUser) return responses.success("User found", transformedUser, res);
    return responses.unauthenticated(res);
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
};

const updateProfilePic = async (req, res) => {
  try {
    const fileTypes = ["png", "jpg", "jpeg", "gif"]
    const file = req?.file;
    if(!file)
      return responses.failedWithMessage("file has not been uploaded !", res);
    const userId = req?.user?.id;
    const uniqueFileName = `images/${
      file?.originalname?.split(".")[0]
    }%%${new Date().valueOf()}.${file?.originalname?.split(".")[1]}`;
    const imageRef = ref(storage, uniqueFileName);
    const metaType = { contentType: file?.mimetype, name: file?.originalname };
    if(!fileTypes.includes(file?.originalname?.split(".")[1]))
      return responses.failedWithMessage(`please upload file with those types: ${fileTypes} `,res);
      
    await uploadBytes(imageRef, file?.buffer, metaType).then(async () => {
      const publicUrl = await getDownloadURL(imageRef);
      const result = await service.addImageToProfilePic(userId, publicUrl);
      if (!result) return responses.failedWithMessage("Failed to change profile pic", res);
      return responses.successWithMessage(`Profile picture changed successfully`, res, { urlImage: publicUrl});
    }).catch((e) => {
      console.error(e);
      return response.failedWithMessage(e.message, res);
    })
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
};

const updateBgPic = async (req, res) => {
  try {
    const fileTypes = ["png", "jpg", "jpeg", "gif"]
    const file = req?.file;
    if(!file)
      return responses.failedWithMessage("file has not been uploaded !", res);
    const userId = req?.user?.id;
    const uniqueFileName = `images/${
      file?.originalname?.split(".")[0]
    }%%${new Date().valueOf()}.${file?.originalname?.split(".")[1]}`;
    const imageRef = ref(storage, uniqueFileName);
    const metaType = { contentType: file?.mimetype, name: file?.originalname };
    if(!fileTypes.includes(file?.originalname?.split(".")[1]))
      return responses.failedWithMessage(`please upload file with those types: ${fileTypes} `,res);
      
    await uploadBytes(imageRef, file?.buffer, metaType).then(async () => {
      const publicUrl = await getDownloadURL(imageRef);
      const result = await service.addImageToBG(userId, publicUrl);
      if (!result) return responses.failedWithMessage("Failed to change profile pic", res);
      return responses.successWithMessage(`Profile picture changed successfully`, res, { urlImage: publicUrl});
    }).catch((e) => {
      console.error(e);
      return response.failedWithMessage(e.message, res);
    })
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
};

const deleteUser = async (req, res) => {
  try {
    const currUser = await models.users.findByPk(req?.user?.id);
    if (!currUser) return responses.unauthenticated(res);
    const result = await service.deleteUser(currUser);
    if (result)
      return responses.successWithMessage("User deleted successfully", res);
    return responses.failedWithMessage("Failed to delete user", res);
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
  updateProfile,
  updatePassword,
  logout,
  getUserInfo,
  updateProfilePic,
  updateBgPic,
  deleteUser,
};
