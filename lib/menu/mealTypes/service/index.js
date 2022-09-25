var models = require('../../../../models')
var response = require('../../../helper/responses')
var { Op } = require('sequelize')

//Get all Meals.
const getMealTypes = async (req, res, next) => {
    try {
        const data = await models.MealType.findAll({});

        if (data.length > 0) return response.success('[menu/mealtypes/service]', data, res)
        else return response.successWithMessage('No mealtypes found!!![menu/mealtypes/service]', res)

    } catch (err) {
        console.log("[menu/mealtypes/service]ERROR--->", err)
        return response.failedWithMessage('Server error!!![menu/mealtypes/service]', res)
    }
}

//Get One MealType.
const getMealType = async (req, res, next) => {
    try {
        const data = await models.MealType.findOne({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: {
                id: req.params.id,
            },
        });
        if (data) {
            return response.success('[menu/mealtypes/service]', data, res)
        } else return response.successWithMessage('MealType not found or has been deleted!!![menu/mealtypes/service]', res)

    } catch (err) {
        console.log("[menu/mealtypes/service]ERROR--->", err)
        return response.failedWithMessage('Server error!!![menu/mealtypes/service]', res)
    }
}

//Add new MealType.
const addMealType = async (req, res, next) => {
    try {
        const { name } = req.body
        if (name && name.trim().length != 0) {
            const [data, created] = await models.MealType.findOrCreate({
                where: {
                    name
                }
            });
            if (created) return response.success('New mealtype created successfully.[menu/mealtypes/service]', data, res)
            else return response.successWithMessage('MealType already existed!!![menu/mealtypes/service]', res)
        }
        else response.failedWithMessage('MealType name can not be empty!!![menu/mealtypes/service]', res)

    } catch (err) {
        console.log('[menu/mealtypes/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!![menu/mealtypes/service]', res)
    }
}

//Update MealType.
const updateMealType = async (req, res, next) => {
    try {
        const { name } = req.body
        if (name && name.trim().length != 0) {
            const nameDuplicated = await models.MealType.findOne({
                where: {
                    name,
                    id: { [Op.ne]: [parseInt(req.params.id)] }
                }
            });
            if (!nameDuplicated) {
                const updated = await models.MealType.update(
                    {
                        name,
                    },
                    {
                        where: {
                            id: req.params.id,
                        }
                    });
                if (updated[0] === 1) return response.success('MealType updated successfully.[menu/mealtypes/service]', updated, res)
                else return response.successWithMessage('MealType not existed!!![menu/mealtypes/service]', res)
            }
            else return response.failedWithMessage('MealType name is duplicated!!![menu/mealtypes/service]', res)
        } else response.failedWithMessage('MealType name can not be empty!!![menu/mealtypes/service]', res)

    } catch (err) {
        console.log('[menu/mealtypes/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!![menu/mealtypes/service]', res)
    }
}

module.exports = {
    getMealTypes,
    getMealType,
    addMealType,
    updateMealType,
} 