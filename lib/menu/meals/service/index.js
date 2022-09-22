var models = require('../../../../models')
var response = require('../../../helper/responses')
var { Op } = require('sequelize')

//Get all Meals.
const getMeals = async (req, res, next) => {
    try {
        const data = await models.Meal.findAll({
            where: {
                deletedAt: null
            }
        });
        if (data.length > 0) return response.success('[menu/meals/service]', data, res)
        else return response.successWithMessage('No meals found!!![menu/meals/service]', res)

    } catch (err) {
        console.log("[menu/meals/service]ERROR--->", err)
        return response.failedWithMessage('Server error!!![menu/meals/service]', res)
    }
}

//Get One Meal.
const getMeal = async (req, res, next) => {
    try {
        const data = await models.Meal.findOne({
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
const addMeal = async (req, res, next) => {
    try {
        const { name } = req.body
        if (name && name.trim().length != 0) {
            const [data, created] = await models.Meal.findOrCreate({
                where: {
                    name
                },
                defaults: {
                    description: req.body.description,
                }
            });
            if (created) return response.success('New meal created successfully.[menu/meals/service]', data, res)
            else return response.successWithMessage('Meal already existed!!![menu/meals/service]', res)
        }
        else response.failedWithMessage('Meal name can not be empty!!![menu/meals/service]', res)

    } catch (err) {
        console.log('[menu/meals/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!![menu/meals/service]', res)
    }
}

//Delete Meal.
const deleteMeal = async (req, res, next) => {
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
const updateMeal = async (req, res, next) => {
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
const addCategoryMeal = async (req, res, next) => {
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

module.exports = {
    getMeals,
    getMeal,
    addMeal,
    deleteMeal,
    addCategoryMeal,
    updateMeal,
} 