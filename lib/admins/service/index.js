const models = require("../../../models");
const { Op } = require("sequelize");
const authService = require("../../middleware/services/auth");
const { Sequelize } = require("../../../models");

const signin = async ({ usernameOrEmail, password }) => {
  try {
    const admin = await models.users.findOne({
      where: {
        [Op.and]: [
          { [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }] },
          { deletedAt: null },
          { isActive: true },
          {  roleId: 1  }
        ]
      }
    });
    if (admin && authService.comparePasswords(password, admin.password))
      return { admin, token: authService.signUser(admin) };
    return null;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

const getUsers = async () => {
  try {
    const userRole = await models.roles.findOne({
      where: {
        role: "user"
      }
    });
    const users = await models.users.findAll({
      where: {
        deletedAt: null,
        roleId: userRole.id
      },
      attributes: ["id", "username", "email", "roleId", "isActive"],
      include: [{
        model: models.usersprofiles,
        foreignKey: "userId"
      }]
    })
    return users;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
}

const getUsersDates = async () => {
  try {
    const dates = await models.users.findAll({
      attributes: ["createdAt"]
    })
    return dates;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
}

const getUser = async (id) => {
  try {
    const users = await models.users.findOne({
      where: {
        id,
        deletedAt: null,
      },
      attributes: ["id", "username", "email", "roleId", "isActive"],
      include: [{
        model: models.usersprofiles,
        foreignKey: "userId"
      }]
    })
    return users;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
}


const deleteUser = async (user) => {
  try {
    const result = await models.users.update(
      {
        deletedAt: Sequelize.fn("now")
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    return result;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};


const getAdmins = async () => {
  try {
    const admins = await models.users.findAll({
      where: { roleId: 1 
      },
      attributes: ["id", "username", "email", "roleId", "isActive"],
      include: [{
        model: models.usersprofiles,
        foreignKey: "userId"
      }]
    })
    if (!admins) return null;
    return admins;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
}

const toggleActivity = async (user) => {
  try {
    console.log("before updating: ", user.isActive);
    const newUser = await models.users.update(
      {
        isActive: !user.isActive
      },
      {
        where: {
          id: user.id
        }
      }
    )
    return { result: newUser, isActive: user.isActive }
  } catch (e) {
    console.log(e);
    throw new Error(e)
  }
}


module.exports = {
  signin,
  getUsers,
  getUsersDates,
  getUser,
  deleteUser,
  getAdmins,
  toggleActivity
}