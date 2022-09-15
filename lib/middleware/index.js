const authService = require("../middleware/services/auth");
const responses = require("../helper/responses");
const models = require("../../models");

const isAuthenticated = async function (req, res, next) {
  try {
    // take out the jwt we've set in the cookie set or from auth headers coming from client
    const token =
      req?.cookies?.jwt ||
      req?.headers?.authorization?.split(" ")[1] ||
      req?.headers?.Authorization?.split(" ")[1] ||
      null;
    if(!token) return responses.unauthenticated(res);
    const isInvalid = await models.invalidTokens.findOne({
      where: {
        tokens: token,
      },
    });
    if (isInvalid) return responses.failedWithMessage("Unauthenticated, token is invalid", res);
    // console.log("isInvalid", isInvalid);
    // console.log("token: ",token)
    const isVerified = await authService.verifyUser(req, res, next, token);
    if(!isVerified) return responses.unauthenticated(res);
    const isActive = await models.users.findByPk(req?.user?.id);
    if(!isActive) return responses.failedWithMessage("Your account is no longer active", res);
    // console.log("IN ISAUTHENTICATED: ",req.user)
    return next();
  } catch (err) {
    console.log("Error -->", err);
    responses.unauthenticated(res);
  }
};

const isAdmin = async function (req, res, next) {
  try { 
    const user = await models.users.findByPk(req.user.id) 
    const roleOfUser = await models.roles.findByPk(user.roleId) 
    if (roleOfUser?.role == "admin") return next()
    return responses.failedWithMessage("Unauthorized, need admin access",res)
  } catch (err) {
    console.log("Error -->", err);
    responses.unauthenticated(res);
  }
};

const isGoldenCustomer = async function (req, res, next) {
  try { 
    const user = await models.users.findByPk(req.user.id)
    const roleOfUser = await models.roles.findByPk(user.roleId) 
    if (roleOfUser.role == "superAdmin") return next()
    return responses.failedWithMessage("Unauthorized, need superadmin access", res)
  } catch (err) {
    console.log("Error -->", err);
    responses.unauthenticated(res);
  }
};


module.exports = {
  isAuthenticated,
  isAdmin,
  isGoldenCustomer
};
