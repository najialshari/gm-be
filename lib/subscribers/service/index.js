const models = require("../../../models");


const setSubscribe = async ({ email }) => {
  try {
    const [subscribe, created] = await models.subscribe.findOrCreate({
      where: {
        email ,
      },
      defaults: {
        email,
      },
    });
    if (created) return subscribe;
    return null;
  } catch (err) {
    console.log("ERROR-->: ", err);
    throw new Error(err);
  }
};
const getSubscribers = async ({}) => {
  try {
    const result = await models.Subscribe.findAll({});
    if (Array.isArray(result) && result?.length > 0) return result;
    return null;
  } catch (err) {
    throw new Error(err)
  }
};



module.exports = {
  setSubscribe,
  getSubscribers
}
