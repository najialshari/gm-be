const models = require("../../../models");
const { Sequelize } = require("../../../models");



const setSubscribe = async ({ email }) => {
  try {
    const [subscribe, created] = await models.Subscriber.findOrCreate({
      where: {
        email ,
        deletedAt: null

      },
      defaults: {
        email
      },
    });
    if (created) return subscribe;
    return null;
  } catch (err) {
    console.log("ERROR-->: ", err);
    throw new Error(err);
  }
};  
const getAllSubscribers = async ({}) => {
  try {
    const result = await models.Subscriber.findAll({});
    if (Array.isArray(result) && result?.length > 0) return result;
    return null;
  } catch (err) {
    throw new Error(err)
  }
};
const getActiveSubscribers = async ({}) => {
  try {
    const result = await models.Subscriber.findAll({ where: {
      deletedAt: null
  }});
    if (Array.isArray(result) && result?.length > 0) return result;
    return null;
  } catch (err) {
    throw new Error(err)
  }
};
const deleteSubscriber = async (subscriber) => {
  try {
    const result = await models.Subscriber.update(
      {
        deletedAt: Sequelize.fn("now")
      },
      {
        where: {
          id: subscriber.id
        },
      }
    );
    return result;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};



module.exports = {
  setSubscribe,
  getAllSubscribers,
  getActiveSubscribers,
  deleteSubscriber
}
