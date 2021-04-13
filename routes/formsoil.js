var formSoilController = require("../controllers/formsoilcontroller")
var express = require('express');
var router  = express.Router();

const authMiddleware = require('../middlewares/auth');

router.get("/", authMiddleware.checkAuth, formSoilController.getFormSoils)
router.get("/id/:id", authMiddleware.checkAuth, formSoilController.getFormSoil)
router.get("/barcode/:barcode", authMiddleware.checkAuth, formSoilController.getFormSoilByBarCode)
router.put("/update/:barcode", authMiddleware.checkAuth, formSoilController.updateFormSoil)
router.post("/create", authMiddleware.checkAuth, formSoilController.addFormSoil)

module.exports = router