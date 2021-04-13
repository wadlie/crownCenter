var formSubmissionController = require("../controllers/formsubmissioncontroller")
var express = require('express');
var router  = express.Router();

const authMiddleware = require('../middlewares/auth');

router.get("/", authMiddleware.checkAuth, formSubmissionController.getFormSubmissions)
router.get("/id/:id", authMiddleware.checkAuth, formSubmissionController.getFormSubmission)
router.get("/farmcode/:farmcode", authMiddleware.checkAuth, formSubmissionController.getFormSubmissionByFarmCode)
router.post("/create", authMiddleware.checkAuth, formSubmissionController.addFormSubmission)
router.put("/:formType/update/:barcode", authMiddleware.checkAuth, formSubmissionController.updateFormSubmissionWithBarCode)
module.exports = router