var formBagController = require("../controllers/formbagController")
var express = require('express');
var router  = express.Router();

const authMiddleware = require('../middlewares/auth');

/* /coverCrop/ */
router.get("/", authMiddleware.checkAuth, formBagController.getFormBages)
router.get("/id/:id", authMiddleware.checkAuth, formBagController.getFormBag)
router.get("/farmcode/:farmcode", authMiddleware.checkAuth, formBagController.getFormBagsByFarmCode)
router.get("/barcode/:barcode", authMiddleware.checkAuth, formBagController.getFormBagByBarCode)
router.post("/create", authMiddleware.checkAuth, formBagController.addFormBag)
router.post("/update", authMiddleware.checkAuth, formBagController.updateFormBag)


module.exports = router