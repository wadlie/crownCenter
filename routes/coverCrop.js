var coverCropController = require("../controllers/coverCropController")
var express = require('express');
var router  = express.Router();

const authMiddleware = require('../middlewares/auth');

/* /coverCrop/ */
router.get("/", authMiddleware.checkAuth, coverCropController.getCoverCrops)
router.get("/id/:id", authMiddleware.checkAuth, coverCropController.getCoverCrop)
router.post("/create", authMiddleware.checkAuth, coverCropController.addCoverCrop)


module.exports = router