var soilStepController = require("../controllers/soilstepcontroller")
var express = require('express');
var router  = express.Router();

const authMiddleware = require('../middlewares/auth');

/* /coverCrop/ */
router.get("/", authMiddleware.checkAuth, soilStepController.getSoilSteps)
router.get("/id/:id", authMiddleware.checkAuth, soilStepController.getSoilStep)
router.post("/create", authMiddleware.checkAuth, soilStepController.addSoilStep)
router.put('/update/:barcode', authMiddleware.checkAuth, soilStepController.updateSoilStep)

module.exports = router