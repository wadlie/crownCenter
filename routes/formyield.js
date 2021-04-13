var formYieldController = require("../controllers/formyieldcontroller")
var express = require('express');
var router  = express.Router();

const authMiddleware = require('../middlewares/auth');

router.get("/", authMiddleware.checkAuth, formYieldController.getFormYields)
router.get("/id/:id", authMiddleware.checkAuth, formYieldController.getFormYield)
router.get("/farmcode/:farmcode", authMiddleware.checkAuth, formYieldController.getFormYieldByFarmCode)
router.get("/barcode/:barcode", authMiddleware.checkAuth, formYieldController.getFormYieldByBarCode)
router.post("/create", authMiddleware.checkAuth, formYieldController.addFormYield)

module.exports = router