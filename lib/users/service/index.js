const models = require("../../../models");
const { Op } = require("sequelize");
const authService = require("../../middleware/services/auth");
const { Sequelize } = require("../../../models");

const createUser = async ({ username, phoneNo, email, password }) => {
  try {
    const userRole = await models.Role.findOne({
      where: {
        name: "user".toLowerCase(),
      },
    });
    if (userRole) {
      const [user, userCreated] = await models.User.findOrCreate({
        where: {
          [Op.or]: [{ username }, { email }],
        },
        defaults: {
          username,
          phoneNo,
          email,
          password: authService.hashPassword(password),
          photo:
            "https://firebasestorage.googleapis.com/v0/b/global-menu-e4622.appspot.com/o/Profile%20Images%2Favatar.png?alt=media&token=76468282-64f5-40b4-90fd-1ca232dd0bfd",
          roleId: userRole.id,
        },
      });
      if (!userCreated) {
        return null;
      }
      // else {
      //   const [userAddress, createdAddress] = await models.Address.findOrCreate({
      //     where: {
      //       userId: user.id
      //     },
      //     defaults: {
      //       userId: user.id,
      //       detail:"Turkey"
      //     }
      //   })
      //   if (!createdAddress) return null;
      // }

      return user;
    } else return null;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

const signin = async ({ usernameOrEmail, password }) => {
  try {
    const user = await models.User.findOne({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { username: usernameOrEmail },
              { email: usernameOrEmail },
            ],
            deletedAt: null,
          },
        ],
      },
    });
    if (user) {
      if (authService.comparePasswords(password, user.password))
        return { user: user, token: authService.signUser(user) };
      else return null;
    }
    return null;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

const getUserInfo = async (req) => {
  try {
    const result = await models.User.findOne({
      where: {
        id: req?.user?.id,
      },
      include: [
        {
          model: models.Address,
          attributes: { exclude: ["deletedAt", "createdAt", "updatedAt"] },
        },
        {
          model: models.Role,
          attributes: ["id", "name"],
        },
      ],
    });
    return result;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

const updateUsername = async (currUser, newUsername) => {
  try {
    const newUser = await models.User.update(
      {
        username: newUsername,
      },
      {
        where: {
          id: currUser.id,
        },
      }
    );

    if (newUser) return newUser;
    else return false;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

const updateEmail = async (currUser, newEmail) => {
  try {
    const newUser = models.User.update(
      {
        email: newEmail,
      },
      {
        where: {
          id: currUser.id,
        },
      }
    );
    if (newUser) return newUser;
    else return false;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

const updatePhoneNo = async (currUser, newPhoneNo) => {
  try {
    const newUser = models.User.update(
      {
        phoneNo: newPhoneNo,
      },
      {
        where: {
          id: currUser.id,
        },
      }
    );
    if (newUser) return newUser;
    else return false;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

const updatePassword = async (currUser, newPassword) => {
  try {
    const result = await models.User.update(
      {
        password: authService.hashPassword(newPassword),
      },
      {
        where: {
          id: currUser.id,
        },
      }
    );
    return result;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

const updateProfilePic = async (userId, profilePic) => {
  try {
    const result = await models.User.update(
      {
        photo:profilePic,
      },
      {
        where: {
          userId,
        },
      }
    );
    return result;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

const deleteUser = async (currUser) => {
  try {
    const result = await models.User.update(
      {
        deletedAt: Sequelize.fn("now"),
      },
      {
        where: {
          id: currUser.id,
        },
      }
    );
    return result;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

const activatingDeletedUser = async (currUser) => {
  try {
    const result = await models.User.update(
      {
        deletedAt:null,
      },
      {
        where: {
          id: currUser.id,
        },
      }
    );
    return result;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

const logout = (req, res) => {

  res.clearCookie("jwt");
  return true;
};

module.exports = {
  createUser,
  signin,
  getUserInfo,
  updateUsername,
  updatePassword,
  updateEmail,
  updatePhoneNo,
  updateProfilePic,
  deleteUser,
  activatingDeletedUser,
  logout,
};
