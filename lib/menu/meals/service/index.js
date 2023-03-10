var models = require('../../../../models')
var response = require('../../../helper/responses')
var { Op } = require('sequelize')

//Get all Meals.
const getMeals = async (req, res, next) => {
    try {
        const data = await models.Meal.findAll({});
        if (data.length > 0) return response.success('', data, res)
        else return response.failedWithMessage('No meals found!!!', res)

    } catch (err) {
        console.log("[menu/meals/service]ERROR--->", err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Get One Meal.
const getMeal = async (req, res, next) => {
    try {
        const data = await models.Meal.findOne({
            attributes: { exclude: [ 'createdAt', 'updatedAt'] },
            where: {
                id: req.params.id,
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
            return response.success('', data, res)
        } else return response.failedWithMessage('Meal not found or has been deleted!!!', res)

    } catch (err) {
        console.log("[menu/meals/service]ERROR--->", err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Add new Meal.
const addMeal = async (req, res, next) => {
    try {
        const { name, description, isAvailable } = req.body
        if (name && name.trim().length != 0) {
            const [data, created] = await models.Meal.findOrCreate({
                where: {
                    name
                },
                defaults: {
                    description,
                    isAvailable
                }
            });
            if (created) return response.success('New meal created successfully.', data, res)
            else return response.failedWithMessage('Meal already existed!!!', res)
        }
        else response.failedWithMessage('Meal name can not be empty!!!', res)

    } catch (err) {
        console.log('[menu/meals/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Delete Meal.
const deleteMeal = async (req, res, next) => {
    try {
        const deleted = await models.Meal.update(
            {
                isAvailable: false
            },
            {
                where: {
                    id: req.params.id,
                }
            });
        if (deleted[0] === 1) return response.success('Meal deleted successfully.', req.params.id, res)
        else return response.successWithMessage('Meal not existed!!!', res)

    } catch (err) {
        console.log('[menu/meals/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
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
                        }
                    });
                if (updated[0] === 1) return response.success('Meal updated successfully.', updated, res)
                else return response.failedWithMessage('Meal not existed!!!', res)
            }
            else return response.failedWithMessage('Meal name is duplicated!!!', res)
        } else response.failedWithMessage('Meal name can not be empty!!!', res)

    } catch (err) {
        console.log('[menu/meals/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Add Meal to Category.
const addCategoryMeal = async (req, res, next) => {
    try {
        let { description, categoryId, typeId, image, price, discount } = req.body
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
                price,
                discount
            }
        });
        if (created) return response.success('New meal added to this category successfully.', data, res)
        else return response.failedWithMessage('Meal is already existed in this category or It is independent!!!', res)

    } catch (err) {
        console.log('[menu/meals/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
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