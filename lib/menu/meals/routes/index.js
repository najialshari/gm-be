const express = require('express');
const router = express.Router();
const models = require('../../../../models')

router.get('', async (req, res, next) =>{
const allCat = await models.Meal.findAll({})
if (allCat.length > 0) res.send(allCat)
else res.send('no meal found') 
})
module.exports = router