const models = require("../../../models");
const { Op } = require("sequelize");
const authService = require("../../middleware/services/auth");
const { Sequelize } = require("../../../models");

const createUser = async ({ username, phoneNo, email, password }) => {
  try {
    const userRole = await models.Role.findOne(
      {
        where: {
          name: 'user'.toLowerCase()
        }
      })
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
          roleId: userRole.id
        },
      });
      if (!userCreated) {
        return null;
      }
      else {
        const [userAddress, createdAddress] = await models.Address.findOrCreate({
          where: {
            userId: user.id
          },
          defaults: {
            userId: user.id
          }
        })
        if (!createdAddress) return null;
      }

      return user;
    } else return null
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

const signin = async ({ usernameOrEmail, password }) => {
  try {
    const user = await models.User.findOne({
      where: {
        [Op.and]: [{
          [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
          deletedAt: null,
          // isActive: true
        }]
      }
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
    const result = await models.users.findOne({
      where: {
        id: req?.user?.id
      },
      include: [{
        model: models.usersprofiles,
        foreignKey: 'userId'
      }]
    });
    return result;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }

}

const updateUsername = async (currUser, newUsername) => {
  try {
    const newUser = models.User.update(
      {
        username: newUsername,
      },
      {
        where: {
          id: currUser.id,
        },
      }
    );
    console.log(newUser)
    if (newUser) return newUser;
    else return false;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
}


const updatePassword = async (currUser, newPassword) => {
  try {
    const result = await models.users.update(
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

const addImageToProfilePic = async (userId, profilePic) => {
  try {
    const result = await models.usersprofiles.update(
      {
        profilePic
      },
      {
        where: {
          userId
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
    const result = await models.users.update(
      {
        deletedAt: Sequelize.fn("now")
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

const logout = async ({ token }) => {
  [result, created] = await models.invalidTokens.findOrCreate({
    where: {
      tokens: token
    }, defaults: {
      tokens: token
    }
  })
  if (!created) return false;
  return result;
}

module.exports = {
  createUser,
  signin,
  getUserInfo,
  updateUsername,
  updatePassword,
  addImageToProfilePic,
  deleteUser,
  logout
};
