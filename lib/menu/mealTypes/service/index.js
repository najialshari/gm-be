var models = require('../../../../models')
var response = require('../../../helper/responses')
var { Op } = require('sequelize')

//Get all Meals.
const getMealTypes = async (req, res, next) => {
    try {
        const data = await models.MealType.findAll({});

        if (data.length > 0) return response.success('', data, res)
        else return response.failedWithMessage('No meal-types found!!!', res)

    } catch (err) {
        console.log("[menu/mealtypes/service]ERROR--->", err)
        return response.failedWithMessage('Server error!!!', res)
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
            return response.success('', data, res)
        } else return response.failedWithMessage('MealType not found or has been deleted!!!', res)

    } catch (err) {
        console.log("[menu/mealtypes/service]ERROR--->", err)
        return response.failedWithMessage('Server error!!!', res)
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
            if (created) return response.success('New meal type created successfully.', data, res)
            else return response.failedWithMessage('Meal Type already existed!!!', res)
        }
        else response.failedWithMessage('Meal Type name can not be empty!!!', res)

    } catch (err) {
        console.log('[menu/mealtypes/service]ERROR--->', err)
        return response.failedWithMessage('Server errorm!!!', res)
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
                if (updated[0] === 1) return response.success('MealType updated successfully.', updated, res)
                else return response.failedWithMessage('MealType not existed!!!', res)
            }
            else return response.failedWithMessage('MealType name is duplicated!!!', res)
        } else response.failedWithMessage('MealType name can not be empty!!!', res)

    } catch (err) {
        console.log('[menu/mealtypes/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

module.exports = {
    getMealTypes,
    getMealType,
    addMealType,
    updateMealType,
} 