var models = require("../../../models");
var response = require("../../helper/responses");
var { Op } = require("sequelize");
var userService = require("../../users/service");

//Get all Orders.
const getOrders = async (req, res, next) => {
  try {
    const data = await models.Order.findAll({
      attributes: { exclude: ["deletedAt", "createdAt", "updatedAt"] },
      where: {
        deletedAt: null,
      },
      include: [
        {
          model: models.Table,
          attributes: ["no"],
        },
        {
          model: models.User,
          attributes: ["username"],
        },
        {
          model: models.OrderDetail,
          attributes: { exclude: ["deletedAt", "createdAt", "updatedAt"] },
          include: [
            {
              model: models.CategoryMeal,
              attributes: ["mealId", "typeId"],
              include: [
                {
                  model: models.Meal,
                  attributes: ["id", "name"],
                },
                {
                  model: models.MealType,
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        },
      ],
    });
    if (data.length > 0) return response.success("", data, res);
    else return response.failedWithMessage("No orders found!!!", res);
  } catch (err) {
    console.log("[orders/service]ERROR--->", err);
    return response.failedWithMessage("Server error!!!", res);
  }
};

//Get One Order.
const getOrder = async (req, res, next) => {
  try {
    const data = await models.Order.findOne({
      attributes: { exclude: ["deletedAt", "createdAt", "updatedAt"] },
      where: {
        id: req.params.id,
        deletedAt: null,
      },
      include: [
        {
          model: models.Table,
          attributes: ["no"],
        },
        {
          model: models.OrderDetail,
          attributes: {
            exclude: ["deletedAt", "createdAt", "updatedAt", "orderId"],
          },
          where: {
            deletedAt: null,
          },
          include: [
            {
              model: models.CategoryMeal,
              attributes: ["id", "price"],
              include: [
                { model: models.Meal, attributes: ["id", "name"] },
                { model: models.MealType, attributes: ["id", "name"] },
              ],
            },
          ],
        },
        {
          model: models.User,
          attributes: ["id", "username"],
        },
        {
          model: models.Address,
          attributes: ["id", "detail"],
        },
      ],
    });
    if (data) {
      return response.success("", data, res);
    } else
      return response.successWithMessage(
        "Order not found or has been deleted!!!",
        res
      );
  } catch (err) {
    console.log("[orders/service]ERROR--->", err);
    return response.failedWithMessage("Server error!!!", res);
  }
};

//Add New Order.
const addOrder = async (req, res, next) => {
  try {
    const { no, userId, addressId, tableUUID, totalPrice, note } = req.body;
    if (!userId) {
      const hasGuest = await models.User.findOne({
        where: {
          username: "guest",
        },
      });
      if (!hasGuest) {
        const createGuest = await userService.createUser({
          username: "guest",
          email: "guest@test.com",
          password: "123456",
          roleName: "user",
        });
        if (createGuest) {
          const data = await models.Order.create({
            no,
            date: new Date(),
            note,
            userId: createGuest.id,
            totalPrice,
          });

          if (data) {
            const orderDetails = req.body.items.map((item) =>
              Object.assign(item, { orderId: data.id })
            );

            const newDetail = await models.OrderDetail.bulkCreate(orderDetails);
            if (newDetail)
              return response.success(
                "New TAKEAWAY order was created successfully.",
                newDetail,
                res
              );
          } else
            return response.failedWithMessage(
              "TAKEAWAY order can not be created!!!",
              res
            );
        }
        return response.failedWithMessage(
          "Could not create GUEST user!!!",
          res
        );
      } else {
        //hasGuest to use start
        const data = await models.Order.create({
          no,
          date: new Date(),
          note,
          userId: hasGuest.id,
          totalPrice,
        });

        if (data) {
          const orderDetails = req.body.items.map((item) =>
            Object.assign(item, { orderId: data.id })
          );

          const newDetail = await models.OrderDetail.bulkCreate(orderDetails);
          if (newDetail)
            return response.success(
              "New TAKEAWAY order was created successfully.",
              newDetail,
              res
            );
        } else
          return response.failedWithMessage(
            "TAKEAWAY order can not created!!!",
            res
          );
      }
      //hasGuest to use end
    } else {
      if (!tableUUID && !addressId)
        return response.failedWithMessage("Add valid address please.", res);
      if (tableUUID) {
        const tableObj = await models.Table.findOne({
          where: {
            uuid: tableUUID,
            deletedAt: null,
          },
        });
        if (tableObj) {
          const [data, created] = await models.Order.findOrCreate({
            where: {
              done: null,
              deletedAt: null,
              tableId: tableObj.id,
            },
            defaults: {
              no,
              date: new Date(),
              note,
              totalPrice,
            },
          });
          if (created) {
            const orderDetails = req.body.items.map((item) =>
              Object.assign(item, { orderId: data.id })
            );

            const newDetail = await models.OrderDetail.bulkCreate(orderDetails);
            if (newDetail)
              return response.success(
                "New local order was created successfully.",
                newDetail,
                res
              );
          } else
            return response.failedWithMessage(
              "Another ORDER currently uses this table. Close it first!!!",
              res
            );
        } else
          return response.failedWithMessage(
            "Table not existed or has been deleted!!!",
            res
          );
      }
      if (addressId) {
        const data = await models.Order.create({
          no,
          date: new Date(),
          note,
          userId,
          addressId,
          totalPrice,
        });

        if (data) {
          const orderDetails = req.body.items.map((item) =>
            Object.assign(item, { orderId: data.id })
          );

          const newDetail = await models.OrderDetail.bulkCreate(orderDetails);
          if (newDetail)
            return response.success(
              "New online order was created successfully.",
              newDetail,
              res
            );
        } else
          return response.failedWithMessage(
            "Online order can not created!!!",
            res
          );
      }
    }
  } catch (err) {
    console.log("[orders/service]ERROR--->", err);
    return response.failedWithMessage("Server error!!!", res);
  }
};

//Delete Order.
const deleteOrder = async (req, res, next) => {
  try {
    const deleted = await models.Order.update(
      {
        deletedAt: new Date(),
      },
      {
        where: {
          id: req.params.id,
          deletedAt: null,
        },
      }
    );
    if (deleted[0] === 1)
      return response.success("Order deleted successfully.", deleted, res);
    else return response.failedWithMessage("Order not existed!!!", res);
  } catch (err) {
    console.log("[orders/service]ERROR--->", err);
    return response.failedWithMessage("Server error!!!", res);
  }
};

//Update Order.
const updateOrder = async (req, res, next) => {
  try {
    const { note, done } = req.body;
    const updated = await models.Order.update(
      {
        note,
        done,
      },
      {
        where: {
          id: req.params.id,
          deletedAt: null,
          [Op.or]: [{ done: { [Op.ne]: done } }, { note: { [Op.ne]: note } }],
        },
      }
    );
    if (updated[0] === 1)
      return response.success("Order updated successfully.", updated, res);
    else return response.failedWithMessage("Order not updated!!!", res);
  } catch (err) {
    console.log("[orders/service]ERROR--->", err);
    return response.failedWithMessage("Server error!!!", res);
  }
};

//Close Order.
const closeOrder = async (req, res, next) => {
  try {
    const { no } = req.body;
    const updated = await models.Order.update(
      {
        done: true,
      },
      {
        where: {
          id: req.params.id,
          no,
        },
      }
    );
    if (updated[0] === 1)
      return response.success("Order closed successfully.", req.params.id, res);
    else return response.failedWithMessage("Order not updated!!!", res);
  } catch (err) {
    console.log("[orders/service]ERROR--->", err);
    return response.failedWithMessage("Server error!!!", res);
  }
};

//Add New Meals to Order Details.
const addToOrderDetails = async (req, res, next) => {
  try {
    const orderDetails = req.body.items.map((item) =>
      Object.assign(item, { orderId: req.body.orderId })
    );

    const newDetail = await models.OrderDetail.bulkCreate(orderDetails);

    if (newDetail)
      return response.success(
        "Order updated with new items successfully.",
        newDetail,
        res
      );
    else return response.failedWithMessage("Order can not updated!!!", res);
  } catch (err) {
    console.log("[orders/service]ERROR--->", err);
    return response.failedWithMessage("Server error!!!", res);
  }
};

//Update existing Meals in Order Details.
const updateOrderDetails = (req, res, next) => {
  try {
    const orderDetails = req.body.items.map(async (item) => {
      const updateDetail = await models.OrderDetail.update(
        {
          categoryMealsId: item.categoryMealsId,
          qty: item.qty,
          subTotal: item.subTotal,
          discount: item.discount,
          note: item.note,
          confirmed: item.confirmed,
          prepared: item.prepared,
          delivered: item.delivered,
          deletedAt: item.deletedAt,
        },
        {
          where: {
            orderId: item.orderId,
            id: item.id,
          },
        }
      );
      if (updateDetail[0] === 0)
        return response.failedWithMessage("Order can not updated!!!", res);
    });
    if (orderDetails.length === req.body.items.length)
      return response.success(
        "Order existing items updated successfully.",
        orderDetails,
        res
      );
    else return response.failedWithMessage("Order can not updated!!!", res);
  } catch (err) {
    console.log("[orders/service]ERROR--->", err);
    return response.failedWithMessage("Server error!!!", res);
  }
};

module.exports = {
  getOrders,
  getOrder,
  addOrder,
  deleteOrder,
  updateOrder,
  addToOrderDetails,
  updateOrderDetails,
  closeOrder,
};
