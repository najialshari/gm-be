var models = require('../../../models')
var response = require('../../helper/responses')
var { Op } = require('sequelize')

//Get all Orders.
const getOrders = async (req, res, next) => {
    try {
        const data = await models.Order.findAll({
            where: {
                deletedAt: null
            }
        });
        if (data.length > 0) return response.success('', data, res)
        else return response.successWithMessage('No orders found!!!', res)

    } catch (err) {
        console.log("[orders/service]ERROR--->", err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Get One Order.
const getOrder = async (req, res, next) => {
    try {
        const data = await models.Order.findOne({
            attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
            where: {
                id: req.params.id,
                deletedAt: null
            },
            include: [
                {
                    model: models.OrderDetail,
                    attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt', 'orderId'] },
                },
                {
                    model: models.User,
                    attributes: ['id', 'username'],
                },
                {
                    model: models.Address,
                    attributes: ['id', 'detail']
                }
            ]
        });
        if (data) {
            return response.success('', data, res)
        } else return response.successWithMessage('Order not found or has been deleted!!!', res)

    } catch (err) {
        console.log("[orders/service]ERROR--->", err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Add New Order.
const addOrder = async (req, res, next) => {
    try {
        const { no, userId, addressId, tableId, totalPrice, note } = req.body
        if (!userId && !tableId)
            return response.failedWithMessage('Login your account or select your table', res)
        if (userId && !addressId)
            return response.failedWithMessage('Add valid address please.', res)
        if (tableId) {
            const [data, created] = await models.Order.findOrCreate({
                where: {
                    done: null,
                    deletedAt: null,
                    tableId
                },
                defaults: {
                    no,
                    date: new Date(),
                    note,
                    totalPrice
                }
            });
            if (created) {
                const bulkArray = req.body.items.map((item) => Object.assign(item, { orderId: data.id }))

                const newDetail = await models.OrderDetail.bulkCreate(bulkArray)
                if (newDetail) return response.success('Local order created successfully.', data, res)
            }
            else return response.successWithMessage('Local order currently open with this table. Close it first!!!', res)
        }
        if (userId && addressId) {
            const data = await models.Order.create({
                no,
                date: new Date(),
                note,
                userId,
                addressId,
                totalPrice,
            });

            if (data) {
                const bulkArray = req.body.items.map((item) => Object.assign(item, { orderId: data.id }))

                const newDetail = await models.OrderDetail.bulkCreate(bulkArray)
                if (newDetail) return response.success('New online order created successfully.', data, res)
            }
            else return response.successWithMessage('Online order can not created!!!', res)
        }
    } catch (err) {
        console.log('[orders/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

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
                    deletedAt: null
                }
            });
        if (deleted[0] === 1) return response.success('Order deleted successfully.', deleted, res)
        else return response.successWithMessage('Order not existed!!!', res)

    } catch (err) {
        console.log('[orders/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Update Order.
const updateOrder = async (req, res, next) => {
    try {
        const { note, done } = req.body
        const updated = await models.Order.update(
            {
                note,
                done
            },
            {
                where: {
                    id: req.params.id,
                    deletedAt: null,
                    [Op.or]: [
                        { done: { [Op.ne]: done } },
                        { note: { [Op.ne]: note } }
                    ]
                }
            });
        if (updated[0] === 1) return response.success('Order updated successfully.', updated, res)
        else return response.failedWithMessage('Order not updated!!!', res)
        // }
        // else return response.failedWithMessage('Meal name is duplicated!!![menu/meals/service]', res)
        // } else response.failedWithMessage('Meal name can not be empty!!![menu/meals/service]', res)

    } catch (err) {
        console.log('[orders/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Get all Tables.
const getTables = async (req, res, next) => {
    try {
        const data = await models.Table.findAll({
            attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
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
            attributes: ['id', 'totalPrice', 'tableId'] ,
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
        const { no, uuid, qrCode } = req.body
        if (uuid && qrCode && no) {
            const [data, created] = await models.Table.findOrCreate({
                where: {
                    [Op.or]: [{ uuid }, { qrCode }, { no }]
                },
                defaults: {
                    no,
                    uuid,
                    qrCode,
                }
            });
            if (created) return response.success('New table created successfully.', data, res)
            else return response.successWithMessage('Table already existed!!!', res)
        }
        else response.failedWithMessage('Table no, uuid or qrCode can not be empty!!!', res)

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
                    id: req.params.id,
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
        const { no, uuid, qrCode } = req.body
        const updated = await models.Table.update(
            {
                no, uuid, qrCode
            },
            {
                where: {
                    id: req.params.id,
                }
            });
        if (updated[0] === 1) return response.success('Table updated successfully.', updated, res)
        else return response.successWithMessage('Table not existed!!!', res)

    } catch (err) {
        console.log('[orders/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
    }
}


module.exports = {
    getOrders,
    getOrder,
    getBusyTables,
    addOrder,
    deleteOrder,
    updateOrder,
    getTables,
    addTable,
    deleteTable,
    updateTable,
} 