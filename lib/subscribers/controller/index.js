const {responses, isEmailValid } = require("../../helper");
const service = require("../service");
const models = require("../../../models")


const createSubscriber = async (req, res, next) => {
  try {
    const email = req?.body?.email.toLowerCase();
    if (!isEmailValid(email))
      return responses.failedWithMessage("Please add a valid email", res);
    const result = await service.createSubscriber({ email });
    if (result)
      return responses.successWithMessage("Thank you for subscribing", res);
    return responses.failedWithMessage("You are already subscribed to our newsletter", res);
  
  } catch (err) {
    console.log("ERROR ->: ", err);
    return responses.serverError(res);
  }
};

const getAllSubscribers = async(req, res, next) => {
  try {
    const Subscribers = await service.getAllSubscribers({});
    if (Subscribers?.length > 0)
      return responses.successWithMessage(
        "sucess get the Subscribers",
        res,
        Subscribers
      );
    return responses.failedWithMessage("no Subscribers found !", res);
  } catch (err) {
    console.log("ERORR-->", err);
    responses.serverError(res);
  }

};

const getActiveSubscribers = async(req, res, next) => {
  try {
    const Subscribers = await service.getActiveSubscribers({});
    if (Subscribers?.length > 0)
      return responses.successWithMessage(
        "sucess get the Subscribers",
        res,
        Subscribers
      );
    return responses.failedWithMessage("no Subscribers found !", res);
  } catch (err) {
    console.log("ERORR-->", err);
    responses.serverError(res);
  }

};


const deleteSubscriber = async (req, res, next) => {
  try {
    // const subscriber = await models.Subscriber.findByPk(req?.params?.id);

    const subscriber = await models.Subscriber.findOne({where:{
          id: req?.params?.id,
          deletedAt: null
        }});
    if (!subscriber) return responses.failedWithMessage("Subscriber does not exist", res)
    const result = await service.deleteSubscriber(subscriber);
    if (result)
      return responses.successWithMessage("Subscriber deleted successfully", res);
    return responses.failedWithMessage("Failed to delete the Subscriber", res);
  } catch (err) {
    console.log(err);
    return responses.serverError(res);
  }
};

module.exports = {
  createSubscriber,
  getActiveSubscribers,
  getAllSubscribers,
  deleteSubscriber
};
