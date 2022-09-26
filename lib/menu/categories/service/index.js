var models = require('../../../../models')
var response = require('../../../helper/responses')
var { Op } = require('sequelize');

//Get all Categories.
const getCategories = async (req, res, next) => {
    try {
        const data = await models.Category.findAll({
            attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
            where: {
                deletedAt: null
            },
            include: {
                model: models.CategoryMeal,
                attributes: ['id', 'image', 'description', 'price', 'discount', 'isAvailable'],
                include: [{
                    model: models.Meal,
                    attributes: ['id', 'name'],
                },
                {
                    model: models.MealType,
                    attributes: ['id', 'name']
                }]
            }
        });
        if (data.length > 0) {
            return response.success('', data, res)
        } else return response.successWithMessage('No categories found!!!', res)

    } catch (err) {
        console.log("ERROR--->", err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Get One Category.
const getCategory = async (req, res, next) => {
    try {
        const data = await models.Category.findOne({
            attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
            where: {
                id: req.params.id,
                deletedAt: null
            },
            include: {
                model: models.CategoryMeal,
                attributes: ['id', 'image', 'description', 'price', 'discount', 'isAvailable'],
                include: [{
                    model: models.Meal,
                    attributes: ['name'],
                },
                {
                    model: models.MealType,
                    attributes: ['name']
                }]
            }
        });
        if (data) {
            return response.success('', data, res)
        } else return response.successWithMessage('Category not found or has been deleted!!!', res)

    } catch (err) {
        console.log("[menu/categories/service]ERROR--->", err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Add new Category.
const addCategory = async (req, res, next) => {
    try {
        const { name } = req.body
        if (name && name.trim().length != 0) {
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
        console.log('[menu/categories/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Delete Category.
const deleteCategory = async (req, res, next) => {
    try {
        const deleted = await models.Category.update(
            {
                deletedAt: new Date(),
            },
            {
                where: {
                    id: req.params.id,
                    deletedAt: null
                }
            });
        if (deleted[0] === 1) return response.success('Category deleted successfully.', deleted, res)
        else return response.successWithMessage('Category not existed!!!', res)

    } catch (err) {
        console.log('[menu/categories/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Update Category.
const updateCategory = async (req, res, next) => {
    try {
        const { name, description, isAvailable } = req.body
        if (name && name.trim().length != 0) {
            const nameDuplicated = await models.Category.findOne({
                where: {
                    name,
                    id: { [Op.ne]: [parseInt(req.params.id)] },
                }
            });
            if (!nameDuplicated) {
                const updated = await models.Category.update(
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
                if (updated[0] === 1) return response.success('Category updated successfully.', updated, res)
                else return response.successWithMessage('Category not found or has been deleted!!!', res)
            }
            else return response.failedWithMessage('Category name is duplicated!!!', res)
        } else response.failedWithMessage('Category name can not be empty!!!', res)

    } catch (err) {
        console.log('[menu/categories/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

module.exports = {
    getCategories,
    getCategory,
    addCategory,
    deleteCategory,
    updateCategory,
} 