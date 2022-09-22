var models = require('../../../../models')
var response = require('../../../helper/responses')


//Get all Meals.
const getMealTypes = async (req, res, next) => {
    try {
        const data = await models.MealType.findAll({});
        if (data.length > 0) return response.success('', data, res)
        else return response.successWithMessage('No meal types found!!!', res)
    } catch {
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Add new Meal.
const addMealTypes = async (req, res, next) => {
    try {
        const { name } = req.body
        if (name.trim().length != 0) {
            const [data, created] = await models.MealType.findOrCreate({
                where: {
                    name
                }
            });
            if (created) return response.success('New meal type created successfully.', data, res)
            else return response.successWithMessage('Meal Type already existed!!!', res)
        } else response.failedWithMessage('Meal type name can not be empty!!!', res)
    } catch (err) {
        console.log('ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
    }
}
module.exports = {
    getMealTypes,
    addMealTypes
} 