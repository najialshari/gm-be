var models = require("../../../models");
var responses = require("../../helper/responses");
var { Op } = require("sequelize");
var { v4: uuidv4 } = require("uuid");
var QRCode = require("qrcode");
const authService = require("../../middleware/services/auth");
var frontEndHomePage = "https://global-menu-fe.herokuapp.com/table/"; //Front End Home Page


//Get all Tables.
const getTables = async (req, res, next) => {
  try {
    const data = await models.Table.findAll({
      attributes: { exclude: ["deletedAt", "createdAt", "updatedAt"] },
    });

    if (data.length > 0) return responses.success("", data, res);
    else return responses.failedWithMessage("No tables found!!!", res);
  } catch (err) {
    console.log("[qrCodes/service]ERROR--->", err);
    return responses.failedWithMessage("Server error!!!", res);
  }
};

const scaneTable = async (req, res, next) => {
  try {
    const uuid = req?.params?.id;
    console.log("UUID",uuid)
    const tableData = await models.Table.findOne({
      attributes: { exclude: [ "createdAt", "u  pdatedAt"] },
      where: {
        uuid,
        isAvailable:true
      },
    });
    if (tableData) {
      const token = await authService.signTable(tableData);
      if (token) {
        res.cookie("jwt", token);
        return responses.success(
          "QR Code Scaned  successfully",
          { table: tableData, token },
          res
        );
      }
      return responses.failedWithMessage(
        "Something went wronge with Table Token ",
        res
      );
    }
    return responses.failedWithMessage("Incorrecrt QR code ", res);
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

//Get Busy Tables.
const getBusyTables = async (req, res, next) => {
  try {
    const data = await models.Order.findAll({
      attributes: ["id", "totalPrice", "tableId"],
      where: {
        done: null,
      },
    });
    if (data.length > 0) return responses.success("", data, res);
    else return responses.failedWithMessage("No orders found!!!", res);
  } catch (err) {
    console.log("[orders/service]ERROR--->", err);
    return responses.failedWithMessage("Server error!!!", res);
  }
};

//Add new Table.
const addTable = async (req, res, next) => {
  try {
    const { no } = req?.body;
    if (no) {
      const found = await models.Table.findOne({
        where: {
          no,
        },
      });
      if (!found) {
        const newUUID = uuidv4();
        const newQR = await QRCode.toDataURL(`${frontEndHomePage}${newUUID}`);
        const [newTable, created] = await models.Table.findOrCreate({
          where: {
            uuid: newUUID,
            no: { [Op.ne]: no },
          },
          defaults: {
            qrCode: newQR,
            uuid: newUUID,
            no,
          },
        });
        if (created){
          console.log("Qr created servise")
          QRCode.toFile(
            `lib/qrCodes/qrTable${newTable.no}.png`,
            `${frontEndHomePage}${newUUID}`,
            {},
            console.log("Qr done"),
            function (err) {
              if (err) throw err;
              console.log("Qr code creating err");
            }
          );
          return responses.success(
            "New table created successfully.",
            newTable,
            res
          );
         
        }
        else
          responses.failedWithMessage(
            "Table info duplicated. Try again for more security!!!",
            res
          );
      } else
        return responses.failedWithMessage("Table already existed!!!", res);
    } else responses.failedWithMessage("Table no can not be empty!!!", res);
  } catch (err) {
    console.log("[orders/service]ERROR--->", err);
    return responses.failedWithMessage("Server error!!!", res);
  }
};

//Delete Table
const deleteTable = async (req, res, next) => {
  try {
    const deleted = await models.Table.update(
      {
        // deletedAt: new Date(),
        isAvailable: false
      },
      {
        where: {
          no: req.params.id,
        },
      }
    );
    if (deleted[0] === 1)
      return responses.success("Table deleted successfully.", req.params.id, res);
    else return responses.failedWithMessage("Table not existed!!!", res);
  } catch (err) {
    console.log("[qrCodes/service]ERROR--->", err);
    return responses.failedWithMessage("Server error!!!", res);
  }
};
//Activate Table
const activateTable = async (req, res, next) => {
  try {
    const active = await models.Table.update(
      {
        isAvailable: true
      },
      {
        where: {
          no: req.params.id,
        },
      }
    );
    if (active[0] === 1)
      return responses.success("Table activted successfully.", req.params.id, res);
    else return responses.failedWithMessage("Table not existed!!!", res);
  } catch (err) {
    console.log("[qrCodes/service]ERROR--->", err);
    return responses.failedWithMessage("Server error!!!", res);
  }
};
//Update Table
const updateTable = async (req, res, next) => {
  try {
    const tableExisted = await models.Table.findOne({
      where: {
        no: req.params.id,
      },
    });
    if (!tableExisted)
      return responses.failedWithMessage("Table not found!!!", res);
    else {
      const newUUID = uuidv4();
      const newQR = await QRCode.toDataURL(`${frontEndHomePage}${newUUID}`);
      const updated = await models.Table.update(
        {
          uuid: newUUID,
          qrCode: newQR,
        },
        {
          where: {
            id: tableExisted.id,
          },
        }
      );
      QRCode.toFile(
        `lib/qrCodes/qrTable${tableExisted.no}.png`,
        `${frontEndHomePage}${newUUID}`,
        {},
        console.log("Qr done"),
        function (err) {
          if (err) throw err;
          console.log("Qr code creating err");
        }
      );

      if (updated[0] === 1)
        return responses.success("Table updated successfully.", req.params.id, res);
      else return responses.failedWithMessage("Table not existed!!!", res);
    }
  } catch (err) {
    console.log("[qrCodes/service]ERROR--->", err);
    return responses.failedWithMessage("Server error!!!", res);
  }
};

module.exports = {
  scaneTable,
  getTables,
  addTable,
  getBusyTables,
  deleteTable,
  updateTable,
  activateTable,
};
