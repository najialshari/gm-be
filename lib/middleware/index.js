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
    if (!token) return responses.unauthenticated(res);
    const isVerified = authService.verifyUser(req, res, next, token);
    const isTableVerified = authService.verifyTable(req, res, next, token);
    if (!isVerified && !isTableVerified) return responses.unauthenticated(res);

    const isActive = await models.User.findOne({
      where: {
        id: req?.user?.id,
        deletedAt: null
      },
    });
    const isTableActive = await models.Table.findOne({
      where: {
        id: req?.table?.id,
        isAvailable: true
      },
    });
    if (!isActive && !isTableActive )
      return responses.failedWithMessage("Your account is no longer active", res);

    return next();
  } catch (err) {
    console.log("Error -->", err);
    responses.unauthenticated(res);
  }
};

const isAdmin = async function (req, res, next) {
  try {
    const user = await models.User.findByPk(req.user.id);
    const roleOfUser = await models.Role.findByPk(user.roleId);
    if (roleOfUser?.name === "admin") return next();
    return responses.failedWithMessage("Unauthorized, need admin access", res);
  }
   catch (err) {
    console.log("Error -->", err);
    responses.unauthenticated(res);
  }
};

const isGoldenCustomer = async function (req, res, next) {
  try {
    const user = await models.users.findByPk(req.user.id);
    const roleOfUser = await models.roles.findByPk(user.roleId);
    if (roleOfUser.role === "golden customer") return next();
    return responses.failedWithMessage(
      "Unauthorized, You  are not a Golden customer ",
      res
    );
  } catch (err) {
    console.log("Error -->", err);
    responses.unauthenticated(res);
  }
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isGoldenCustomer,
};
