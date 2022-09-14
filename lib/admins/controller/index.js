const responses = require("../../helper/responses");
const service = require("../service");
const transformer = require("../../../transformers");
const models = require("../../../models");





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
      return responses.success(
        "Logged in successfully",
        { admin: transformer.userTransformer(result.admin), token: result.token },
        res
      );
    }
    return responses.unauthenticated(res);
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const result = await service.getUsers();
    if (result) {
      return responses.success("Users received successfully", result, res);
    }
    return responses.failedWithMessage("Failed to get users", res);
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
}

const getUsersDates = async (req, res, next) => {
  try {
    const result = await service.getUsersDates();
    if (result) {
      return responses.success("Information received successfully", result, res);
    }
    return responses.failedWithMessage("Failed to get information", res);
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
}

const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await service.getUser(id);
    if (result) {
      return responses.success("User received successfully", result, res);
    }
    return responses.failedWithMessage("Failed to get user", res);
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
}


const deleteUser = async (req, res, next) => {
  try {
    const user = await models.users.findByPk(req?.params?.id);
    if (!user) return responses.failedWithMessage("User does not exist", res)
    const result = await service.deleteUser(user);
    if (result)
      return responses.successWithMessage("User deleted successfully", res);
    return responses.failedWithMessage("Failed to delete user", res);
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
};


const toggleActivity = async (req, res, next) => {
  try {
    const user = await models.users.findByPk(req?.params?.id);
    if (!user) return responses.failedWithMessage("User does not exist", res)
    const { result, isActive } = await service.toggleActivity(user);
    if (result)
      return responses.success("Toggled user activity successfully", { isActive: !isActive }, res);
    return responses.failedWithMessage("Failed to toggle user activity", res);
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
}

const getAdmins = async (req, res, next) => {
  try {
    const result = await service.getAdmins();

    if (result) {
      return responses.success("Admins received successfully", result, res);
    }
    return responses.failedWithMessage("Failed to get admins", res);
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
}


module.exports = {
  getUsers,
  getUsersDates,
  getUser,
  signin,
  deleteUser,
  getAdmins,
  toggleActivity
};
