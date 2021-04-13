var formBiomassController = require("../controllers/formbiomasscontroller")
var express = require('express');
var router  = express.Router();

const authMiddleware = require('../middlewares/auth');

/* /coverCrop/ */
router.get("/", authMiddleware.checkAuth, formBiomassController.getFormBiomasses)
router.get("/id/:id", authMiddleware.checkAuth, formBiomassController.getFormBiomass)
router.get("/farmcode/:farmcode", authMiddleware.checkAuth, formBiomassController.getFormBiomassByFarmCode)
router.get("/barcode/:barcode", authMiddleware.checkAuth, formBiomassController.getFormBiomassByBarCode)
router.post("/create", authMiddleware.checkAuth, formBiomassController.addFormBiomass)

module.exports = router