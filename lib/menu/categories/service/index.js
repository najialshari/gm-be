var models = require('../../../../models')
var response = require('../../../helper/responses')


//Get all Categories.
const getCategories = async (req, res, next) => {
    try {
        const data = await models.Category.findAll({
            where: {
                isAvailable: true,
                deletedAt: null
            },
            include: [{model: models.CategoryMeal}]
        });
        if (data.length > 0) return response.success('', data, res)
        else return response.successWithMessage('No categories found!!!', res)
    } catch (err){
        console.log("ERROR--->",err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Add new Category.
const addCategories = async (req, res, next) => {
    try {
        const { name } = req.body
        if (name.trim().length != 0) {
            const [data, created] = await models.Category.findOrCreate({
                where: {
                    name
                },
                defaults: {
                    description: req.body.description,
                }
            });
            if (created) return response.success('New category created successfully.', data, res)
            else return response.successWithMessage('Category already existed!!!', res)
        } else response.failedWithMessage('Category name can not be empty!!!', res)
    } catch (err) {
        console.log('ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
    }
}
module.exports = {
    getCategories,
    addCategories
} 