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

const isAddressExisted = async (req, res, next) => {

    const addressExisted = await models.Address.findOne({
        where: {
            deletedAt: null,
            userId: parseInt(req.params.id),
            id: req.body.id
        }
    })
    if (!addressExisted) return response.failedWithMessage("Address not found!!!", res)
    else next()
};

module.exports = {
    isUserDeleted,
    isAddressExisted
}