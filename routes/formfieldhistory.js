var formFieldHistoryController = require("../controllers/formfieldhistorycontroller")
var express = require('express');
var router  = express.Router();

const authMiddleware = require('../middlewares/auth');

/* /coverCrop/ */
router.get("/", authMiddleware.checkAuth, formFieldHistoryController.getFormFieldHistories)
router.get("/id/:id", authMiddleware.checkAuth, formFieldHistoryController.getFormFieldHistory)
router.post("/create", authMiddleware.checkAuth, formFieldHistoryController.addFormFieldHistory)
router.get("/farmcode/:farmcode", authMiddleware.checkAuth, formFieldHistoryController.getFormFieldByFarmCode)
router.get("/barcode/:barcode", authMiddleware.checkAuth, formFieldHistoryController.getFormFieldHistoryByBarCode)

module.exports = router