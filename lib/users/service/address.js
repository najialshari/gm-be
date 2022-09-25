var response = require('../../helper/responses')
var { Op } = require('sequelize');
var models = require('../../../models')

const getAddress = async (req, res, next) => {
    try {
        const address = await models.Address.findAll({
            attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
            where: {
                userId: req.params.id,
                deletedAt: null
            },
            include: {
                model: models.User,
                attributes: ['username']
            }
        })
        if (address.length > 0) {
            return response.success('', address, res)
        } else return response.successWithMessage('No addresses found!!!', res)

    } catch (err) {
        console.log("[users/service/address]ERROR--->", err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

const addAddress = async (req, res, next) => {
    try {
            const { detail, description } = req.body
            if (detail && detail.trim().length != 0) {
                const [data, created] = await models.Address.findOrCreate({
                    where: {
                        userId: req.params.id,
                        detail,
                    },
                    defaults: {
                        description,
                    }
                });
                if (created) return response.success('New Addess added to this user successfully.', data, res)
                else return response.successWithMessage('Address is already existed!!!', res)
            } else return response.failedWithMessage('Address can not be empty!!!', res)

    } catch (err) {
        console.log('[users/service/address]ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

//Delete Address.
const deleteAddress = async (req, res, next) => {
    try {
        const deleted = await models.Address.update(
            {
                deletedAt: new Date(),
            },
            {
                where: {
                    id: req.params.id,
                    deletedAt: null
                }
            });
        if (deleted[0] === 1) return response.success('Address deleted successfully.', deleted, res)
        else return response.successWithMessage('Address not existed!!!', res)

    } catch (err) {
        console.log('[users/service/address]ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

const updateAddress = async (req, res, next) => {
    try {
        const { id, detail, description } = req.body
        if (id && detail && detail.trim().length != 0) {
            const addressDuplicated = await models.Address.findOne({
                where: {
                    detail,
                    userId: parseInt(req.params.id), 
                    id: {
                        [Op.ne] : id
                    },
                    deletedAt: null
                }
            });
            if (!addressDuplicated) {
                const updated = await models.Address.update(
                    {
                        description,
                        detail
                    },
                    {
                        where: {
                            id: req.body.id,
                        }
                    });
                if (updated[0] === 1) return response.success('Address updated successfully.', updated, res)
                else return response.successWithMessage('Address not found or has been deleted!!!', res)
            }
            else return response.failedWithMessage('Address detail is duplicated!!!', res)
        } else response.failedWithMessage('Address id and detail can not be empty!!!', res)

    } catch (err) {
        console.log('[menu/categories/service]ERROR--->', err)
        return response.failedWithMessage('Server error!!!', res)
    }
}

module.exports = {
    getAddress,
    addAddress,
    deleteAddress,
    updateAddress,
}
