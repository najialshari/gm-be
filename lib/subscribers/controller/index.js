const responses = require("../../helper/responses");
const service = require("../service");

const setSubscriber = async (req, res, next) => {
  try {
    const email = req?.body?.email;
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
      return responses.failedWithMessage("Please add a valid email", res);
    const result = await service.setSubscribe({ email });
    if (result)
      return responses.successWithMessage("Thank you for subscribing", res);
    return responses.failedWithMessage(
      "You are already subscribed to our newsletter",
      res
    );
  } catch (err) {
    console.log("ERROR ->: ", err);
    return responses.serverError(res);
  }
};

const getSubscribers = async(req, res, next) => {
  try {
    const Subscribers = await service.getSubscribers({});
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

module.exports = {
  getSubscribers,
  setSubscriber
};
