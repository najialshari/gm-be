var models = require('../../../../models')
var response = require('../../../helper/responses')


//Get all Meals.
const getMeals = async (req, res, next) => {
    try {
        const data = await models.Meal.findAll({
            where: {
                isAvailable: true,
                deletedAt: null
            }
        });
        if (data.length > 0) return response.success('', data, res)
        else return response.successWithMessage('No meals found!!!', res)
    } catch {
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Add new Meal.
const addMeals = async (req, res, next) => {
    try {
        const { name } = req.body
        if (name.trim().length != 0) {
            const [data, created] = await models.Meal.findOrCreate({
                where: {
                    name
                }
            });
            if (created) return response.success('New meal created successfully.', data, res)
            else return response.successWithMessage('Meal already existed!!!', res)
        } else response.failedWithMessage('Meal name can not be empty!!!', res)
    } catch (err) {
        console.log('ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Add Meal to Category.
const addCategoryMeals = async (req, res, next) => {
    try {
        const [data, created] = await models.CategoryMeal.findOrCreate({
            where: {
                categoryId: req.body.categoryId,
                mealId: req.params.id,
                typeId: req.body.typeId,
            },
            defaults: {
                image: req.body.image,
                description: req.body.description,
                price: req.body.price,
            }
        });
        if (created) return response.success('New meal added to category successfully.', data, res)
        else return response.successWithMessage('Meal is already existed in this category!!!', res)
    } catch (err) {
        console.log('ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

module.exports = {
    getMeals,
    addMeals,
    addCategoryMeals
} 