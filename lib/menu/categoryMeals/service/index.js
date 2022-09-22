var models = require('../../../../models')
var response = require('../../../helper/responses')


//Get all Categories.
const getCategoryMeals = async (req, res, next) => {
    try {
        const data = await models.CategoryMeal.findAll({
            where: {
                isAvailable: true,
                deletedAt: null
            }
        });
        if (data.length > 0) return response.success('', data, res)
        else return response.successWithMessage('No categories found!!!', res)
    } catch {
        return response.failedWithMessage('Server error!!!', res)
    }
}


module.exports = {
    getCategoryMeals
} 