var models = require('../../../../models')
var response = require('../../../helper/responses')
var { Op } = require('sequelize')

//Get all Category Meals.
const getCategoryMeals = async (req, res, next) => {
    try {
        const data = await models.CategoryMeals.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
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
        if (data.length > 0) return response.success('', data, res)
        else return response.failedWithMessage('No category meals found!!!', res)

    } catch (err) {
        console.log("[menu/categorymeals/service]ERROR--->", err)
        return response.failedWithMessage('Server error!!!', res)
    }
}
//Get all Category Meals.
const getActiveCategoryMeals = async (req, res, next) => {
    try {
        const data = await models.CategoryMeals.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: {
                isAvailable: true
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
        if (data.length > 0) return response.success('', data, res)
        else return response.failedWithMessage('No category meals found!!!', res)

    } catch (err) {
        console.log("[menu/categorymeals/service]ERROR--->", err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Get One Category Meal.
const getCategoryMeal = async (req, res, next) => {
    try {
        const data = await models.CategoryMeal.findOne({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: {
                id: req.params.id,
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
            return response.success('', data, res)
        } else return response.failedWithMessage('Category meal not found or has been deleted!!!', res)

    } catch (err) {
        console.log("[menu/categorymeals/service]ERROR--->", err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Delete Category Meal.
const deleteCategoryMeal = async (req, res, next) => {
    try {
        const deleted = await models.CategoryMeal.update(
            {
                isAvailable: false
            },
            {
                where: {
                    id: req.params.id,
                }
            });
        if (deleted[0] === 1) return response.success('Category meal deleted successfully.', req.params.id, res)
        else return response.failedWithMessage('Category meal not existed!!!', res)

    } catch (err) {
        console.log('[menu/categorymeals/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Activate Category Meal
const activateCategoryMeal = async (req, res, next) => {
    try {
        const active = await models.CategoryMeal.update(
            {
                isAvailable: true
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        if (active[0] === 1)
            return response.success("Table activted successfully.", req.params.id, res);
        else return response.failedWithMessage("Table not existed!!!", res);
    } catch (err) {
        console.log("[qrCodes/service]ERROR--->", err);
        return response.failedWithMessage("Server error!!!", res);
    }
};

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
                }
            });
        if (updated[0] === 1) return response.success('Category meal updated successfully.', updated, res)
        else return response.failedWithMessage('Category meal not existed!!!', res)

    } catch (err) {
        console.log('[menu/categorymeals/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Add Meal to Category.
const addCategoryMeal = async (req, res, next) => {
    try {
        let { description, mealId, typeId, image, price, discount } = req.body
        if (!mealId) mealId = null
        if (!typeId) typeId = null
        if (!price) price = 0
        if (!discount) discount = 0
        const [data, created] = await models.CategoryMeal.findOrCreate({
            where: {
                categoryId: req.params.id,
                mealId,
                typeId
            },
            defaults: {
                image,
                description,
                price,
                discount
            }
        });
        if (created) return response.success('New category meal added to this category successfully.', data, res)
        else return response.failedWithMessage('Category meal is already existed in this category!!!', res)

    } catch (err) {
        console.log('[menu/categorymeals/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

module.exports = {
    getCategoryMeals,
    getActiveCategoryMeals,
    getCategoryMeal,
    addCategoryMeal,
    activateCategoryMeal,
    deleteCategoryMeal,
    updateCategoryMeal,
} 