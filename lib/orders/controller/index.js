
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

const isTableExisted = async (req, res, next) => {

    const tableExisted = await models.Table.findOne({
        where: {
            deletedAt: null,
            id: req.params.id
        }
    })
    if (!tableExisted) return response.failedWithMessage("Table not found!!!", res)
    else {
        const { no, uuid, qrCode } = req.body
        if (uuid && qrCode && no) {
            const otherTableExisted = await models.Table.findOne({
                where: {
                     deletedAt: null ,
                    
                        id: {
                            [Op.ne]: req.params.id
                        }
                    ,
                    [Op.or]: [{no}, {uuid}, {qrCode}]
                }
            })
            if (!otherTableExisted) next()
            else return response.successWithMessage('Table already existed!!!', res)
        } else response.failedWithMessage('Table no, uuid or qrCode can not be empty!!!', res)
    }
};

module.exports = {
    isTableExisted
}