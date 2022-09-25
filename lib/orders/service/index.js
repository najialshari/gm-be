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
        console.log("[menu/meals/service]ERROR--->", err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Get One Meal.
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
                    attributes: ['id', 'CategoryMealsId', 'qty']
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

//Add new Meal.
const addOrder = async (req, res, next) => {
    try {
        const { no, userId, addressId, tableId, note } = req.body
        if (!userId && !tableId)
            return response.failedWithMessage('Login your account or select your table', res)
        if (userId && !addressId)
            return response.failedWithMessage('Add valid address please.', res)
        if (tableId) {
            const [data, created] = await models.Order.findOrCreate({
                where: {
                    done: null,
                    tableId
                },
                defaults: {
                    no,
                    date: new Date(),
                    note,
                }
            });
            if (created) {
                const newDetail = await models.OrderDetail.create({
                    orderId: data.id,
                    tableId,
                })
                if (newDetail) return response.success('Local order created successfully.', data, res)
            }
            else return response.successWithMessage('Local order already open. Close it first!!!', res)
        }
        if (userId && addressId) {
            const data = await models.Order.create({
                no,
                date: new Date(),
                note,
                userId,
                addressId,
            });
            console.log(data)
            if (data) {
                const newDetail = await models.OrderDetail.create({
                    orderId: data.id,
                })
                if (newDetail) return response.success('New online order created successfully.', data, res)
            }
            else return response.successWithMessage('Online order can not created!!!', res)
        }
    } catch (err) {
        console.log('[menu/meals/service]ERROR--->', err)
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

//Update Meal.
const updateOrder = async (req, res, next) => {
    try {
        const { name, description, isAvailable } = req.body
        if (name && name.trim().length != 0) {
            const nameDuplicated = await models.Meal.findOne({
                where: {
                    name,
                    id: { [Op.ne]: [parseInt(req.params.id)] }
                }
            });
            if (!nameDuplicated) {
                const updated = await models.Meal.update(
                    {
                        name,
                        description,
                        isAvailable
                    },
                    {
                        where: {
                            id: req.params.id,
                            deletedAt: null
                        }
                    });
                if (updated[0] === 1) return response.success('Meal updated successfully.[menu/meals/service]', updated, res)
                else return response.successWithMessage('Meal not existed!!![menu/meals/service]', res)
            }
            else return response.failedWithMessage('Meal name is duplicated!!![menu/meals/service]', res)
        } else response.failedWithMessage('Meal name can not be empty!!![menu/meals/service]', res)

    } catch (err) {
        console.log('[menu/meals/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!![menu/meals/service]', res)
    }
}

//Add Meal to Category.
const addOrderDetails = async (req, res, next) => {
    try {
        let { description, categoryId, typeId, image, price } = req.body
        if (!categoryId) categoryId = null
        if (!typeId) typeId = null
        const [data, created] = await models.CategoryMeal.findOrCreate({
            where: {
                mealId: req.params.id,
                categoryId,
                typeId
            },
            defaults: {
                image,
                description,
                price
            }
        });
        if (created) return response.success('New meal added to this category successfully.[menu/meals/service]', data, res)
        else return response.successWithMessage('Meal is already existed in this category or It is independent!!![menu/meals/service]', res)

    } catch (err) {
        console.log('[menu/meals/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!![menu/meals/service]', res)
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
    addOrder,
    deleteOrder,
    addOrderDetails,
    updateOrder,
    getTables,
    addTable,
    deleteTable,
    updateTable,
} 