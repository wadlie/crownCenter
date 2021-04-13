var farmFarmerController = require("../controllers/farmFarmerController")
var express = require('express');
var router  = express.Router();

var authMiddleware = require('../middlewares/auth')

router.get('/', authMiddleware.checkAuth, farmFarmerController.getFarmFarmers)
router.get('/ascend', authMiddleware.checkAuth, farmFarmerController.getFarmFarmersAscend)
router.get('/id/:id', authMiddleware.checkAuth, farmFarmerController.getFarmFarmerById)
router.get('/farmcode/:farmcode', authMiddleware.checkAuth, farmFarmerController.getFarmFarmerByFarmcode)


module.exports = router