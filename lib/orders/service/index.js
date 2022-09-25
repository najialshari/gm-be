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
            include: {
                model: models.CategoryMeal,
                attributes: ['id', 'image', 'description', 'price', 'discount', 'isAvailable'],
                include: [{
                    model: models.Category,
                    attributes: ['id', 'name'],
                },
                {
                    model: models.MealType,
                    attributes: ['id', 'name']
                }]
            }
        });
        if (data) {
            return response.success('[menu/meals/service]', data, res)
        } else return response.successWithMessage('Meal not found or has been deleted!!![menu/meals/service]', res)

    } catch (err) {
        console.log("[menu/meals/service]ERROR--->", err)
        return response.failedWithMessage('Server error!!![menu/meals/service]', res)
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

//Delete Meal.
const deleteOrder = async (req, res, next) => {
    try {
        const deleted = await models.Meal.update(
            {
                deletedAt: new Date(),
            },
            {
                where: {
                    id: req.params.id,
                    deletedAt: null
                }
            });
        if (deleted[0] === 1) return response.success('Meal deleted successfully.[menu/meals/service]', deleted, res)
        else return response.successWithMessage('Meal not existed!!![menu/meals/service]', res)

    } catch (err) {
        console.log('[menu/meals/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!![menu/meals/service]', res)
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
        const data = await models.Table.findAll({});

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
                    [Op.or]: [{uuid},{qrCode},{no}]
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
        console.log('[menu/mealtypes/service]ERROR--->', err)
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
    addTable
} 