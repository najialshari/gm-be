var models = require('../../../../models')
var response = require('../../../helper/responses')
var { Op } = require('sequelize')

//Get all Category Meals.
const getCategoryMeals = async (req, res, next) => {
    try {
        const data = await models.CategoryMeal.findAll({
            attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
            where: {
                deletedAt: null
            },
            include: [
                {
                    model: models.Category,
                    attributes: ['id', 'name'],
                },
                {
                    model: models.Meal,
                    attributes: ['id', 'name']
                },
                {
                    model: models.MealType,
                    attributes: ['id', 'name']
                }
            ]
        });
        if (data.length > 0) return response.success('[menu/categorymeals/service]', data, res)
        else return response.successWithMessage('No category meals found!!![menu/categorymeals/service]', res)

    } catch (err) {
        console.log("[menu/categorymeals/service]ERROR--->", err)
        return response.failedWithMessage('Server error!!![menu/categorymeals/service]', res)
    }
}

//Get One Category Meal.
const getCategoryMeal = async (req, res, next) => {
    try {
        const data = await models.CategoryMeal.findOne({
            attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
            where: {
                id: req.params.id,
                deletedAt: null
            },
            include: [
                {
                    model: models.Category,
                    attributes: ['id', 'name'],
                },
                {
                    model: models.Meal,
                    attributes: ['id', 'name']
                },
                {
                    model: models.MealType,
                    attributes: ['id', 'name']
                }
            ]
        });
        if (data) {
            return response.success('[menu/categorymeals/service]', data, res)
        } else return response.successWithMessage('Category meal not found or has been deleted!!![menu/categorymeals/service]', res)

    } catch (err) {
        console.log("[menu/categorymeals/service]ERROR--->", err)
        return response.failedWithMessage('Server error!!![menu/categorymeals/service]', res)
    }
}

//Delete Category Meal.
const deleteCategoryMeal = async (req, res, next) => {
    try {
        const deleted = await models.CategoryMeal.update(
            {
                deletedAt: new Date(),
            },
            {
                where: {
                    id: req.params.id,
                    deletedAt: null
                }
            });
        if (deleted[0] === 1) return response.success('Category meal deleted successfully.[menu/categorymeals/service]', deleted, res)
        else return response.successWithMessage('Category meal not existed!!![menu/categorymeals/service]', res)

    } catch (err) {
        console.log('[menu/categorymeals/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!![menu/categorymeals/service]', res)
    }
}

//Update Category Meal.
const updateCategoryMeal = async (req, res, next) => {
    try {
        const { image, description, price, discount, isAvailable } = req.body
        const updated = await models.CategoryMeal.update(
            {
                image,
                description,
                price,
                discount,
                isAvailable
            },
            {
                where: {
                    id: req.params.id,
                    deletedAt: null
                }
            });
        if (updated[0] === 1) return response.success('Category meal updated successfully.[menu/categorymeals/service]', updated, res)
        else return response.successWithMessage('Category meal not existed!!![menu/categorymeals/service]', res)

    } catch (err) {
        console.log('[menu/categorymeals/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!![menu/categorymeals/service]', res)
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
                price,
                discount
            }
        });
        if (created) return response.success('New category meal added to this category successfully.[menu/categorymeals/service]', data, res)
        else return response.successWithMessage('Category meal is already existed in this category or It is independent!!![menu/categorymeals/service]', res)

    } catch (err) {
        console.log('[menu/categorymeals/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!![menu/categorymeals/service]', res)
    }
}

module.exports = {
    getCategoryMeals,
    getCategoryMeal,
    addCategoryMeal,
    deleteCategoryMeal,
    updateCategoryMeal,
} 