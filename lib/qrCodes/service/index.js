var models = require('../../../models')
var response = require('../../helper/responses')
var { Op } = require('sequelize')
var { v4: uuidv4 } = require('uuid');
var QRCode = require('qrcode')
var frontEndHomePage = 'http://localhost:3000/'  //Front End Home Page 


//Get all Tables.
const getTables = async (req, res, next) => {
    try {
        const data = await models.Table.findAll({
            attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
            where: {deletedAt: null}
        });

        if (data.length > 0) return response.success('', data, res)
        else return response.successWithMessage('No tables found!!!', res)

    } catch (err) {
        console.log("[orders/service]ERROR--->", err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Get Busy Tables.
const getBusyTables = async (req, res, next) => {
    try {
        const data = await models.Order.findAll({
            attributes: ['id', 'totalPrice', 'tableId'],
            where: {
                deletedAt: null,
                done: null
            }
        });
        if (data.length > 0) return response.success('', data, res)
        else return response.successWithMessage('No orders found!!!', res)

    } catch (err) {
        console.log("[orders/service]ERROR--->", err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Add new Table.
const addTable = async (req, res, next) => {
    try {
        const { no } = req.body
        if (no) {
            const found = await models.Table.findOne({
                where: {
                    no,
                    deletedAt: null
                }
            });
            if (!found) {
                const newUUID = uuidv4()
                const newQR = await QRCode.toDataURL(`${frontEndHomePage}${newUUID}`)
                const [newTable, created] = await models.Table.findOrCreate({
                    where: {
                        uuid: newUUID,
                        no: { [Op.ne]: no },
                    },
                    defaults: {
                        qrCode: newQR,
                        no
                    }
                })
                if (created) return response.success('New table created successfully.', newTable, res)
                else response.failedWithMessage('Table info duplicated. Try again for more security!!!', res)
            } else return response.failedWithMessage('Table already existed!!!', res)
        } else response.failedWithMessage('Table no can not be empty!!!', res)

    } catch (err) {
        console.log('[orders/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Delete Table
const deleteTable = async (req, res, next) => {
    try {
        const deleted = await models.Table.update(
            {
                deletedAt: new Date(),
            },
            {
                where: {
                    no: req.params.id,
                    deletedAt: null
                }
            });
        if (deleted[0] === 1) return response.success('Table deleted successfully.', deleted, res)
        else return response.successWithMessage('Table not existed!!!', res)

    } catch (err) {
        console.log('[orders/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
    }
}
//Update Table
const updateTable = async (req, res, next) => {
    try {
        const tableExisted = await models.Table.findOne({
            where: {
                deletedAt: null,
                no: req.params.id
            }
        })
        if (!tableExisted) return response.failedWithMessage("Table not found!!!", res)
        else {
            const newUUID = uuidv4()
            const newQR = await QRCode.toDataURL(`${frontEndHomePage}${newUUID}`)
            const updated = await models.Table.update(
                {
                    uuid: newUUID,
                    qrCode: newQR,
                },
                {
                    where: {
                        id: tableExisted.id
                    }
                });
            QRCode.toFile(`lib/qrCodes/qrTable${tableExisted.no}.png`,
                `http://10.11.12.104:3000/api/v1/menus/categorymeals/${newUUID}`, {},
                function (err) {
                    if (err) throw err
                    console.log('Qr done')
                }
            )

            if (updated[0] === 1) return response.success('Table updated successfully.', updated, res)
            else return response.failedWithMessage('Table not existed!!!', res)
        }
    } catch (err) {
        console.log('[orders/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

module.exports = {
getTables,
addTable,
getBusyTables,
deleteTable,
updateTable,
}