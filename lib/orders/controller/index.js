
var response = require('../../helper/responses')
var { Op } = require('sequelize');
var models = require('../../../models')

const isUserDeleted = async (req, res, next) => {

    const deleted = await models.User.findOne({
        where: {
            id: req.params.id,
            deletedAt: {
                [Op.not]: null
            }
        }
    })
    if (deleted) return response.failedWithMessage("User not found!!!", res)
    else next()
}


module.exports = {
    isUserDeleted
}