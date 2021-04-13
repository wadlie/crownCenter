var formBulkDensityController = require("../controllers/formbulkdensitycontroller")
var express = require('express');
var router  = express.Router();

const authMiddleware = require('../middlewares/auth');

/* /coverCrop/ */
router.get("/", authMiddleware.checkAuth, formBulkDensityController.getFormBulkDensities)
router.get("/id/:id", authMiddleware.checkAuth, formBulkDensityController.getFormBulkDensity)
router.get("/farmcode/:farmcode", authMiddleware.checkAuth, formBulkDensityController.getFormBulkDensityByFarmCode)
router.get("/barcode/:barcode", authMiddleware.checkAuth, formBulkDensityController.getFormBulkDensityByBarCode)
router.post("/create", authMiddleware.checkAuth, formBulkDensityController.addFormBulkDensity)

module.exports = router